package com.backend.config;

import java.util.List;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import com.backend.security.JwtService;
import com.backend.security.JwtUserPrincipal;

import lombok.RequiredArgsConstructor;

/**
 * Cấu hình WebSocket (STOMP) cho NovaShop.
 *
 * Luồng checkout → notification realtime: OrderService.checkout() →
 * NotificationService.create() → messagingTemplate.convertAndSendToUser(userId,
 * "/queue/notifications", dto) → FE đang subscribe /user/queue/notifications sẽ
 * nhận ngay
 */
@Configuration
// Bật chế độ message broker (server có thể push message tới FE, không chỉ FE gọi API)
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final JwtService jwtService;
    private final JwtHandshakeHandler jwtHandshakeHandler;

    /**
     * Cấu hình "bưu điện nội bộ" — quy định server gửi tin qua đường dẫn
     * (destination) nào.
     *
     * Ví dụ backend gửi: convertAndSendToUser("abc-123",
     * "/queue/notifications", data) FE subscribe: /user/queue/notifications
     * Spring tự map thành hộp thư riêng của user abc-123.
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // enableSimpleBroker: bật broker in-memory trong JVM (đủ cho dev / 1 server).
        // Tham số "/websocket" = chỉ destination bắt đầu bằng /websocket mới được broker chuyển tiếp.
        //   - /queue/notifications  → OK
        //   - /topic/broadcast      → KHÔNG bật (chưa khai báo /topic)
        registry.enableSimpleBroker("/queue");

        // setUserDestinationPrefix: thêm tiền tố /user cho message gửi riêng từng người.
        // Kết hợp convertAndSendToUser(userId, "/queue/notifications", ...) tạo đường dẫn:
        //   /user/{userId}/queue/notifications
        // → User A không đọc được thông báo của User B.
        registry.setUserDestinationPrefix("/user");
    }

    /**
     * Mở "cổng vào" để FE cắm dây WebSocket — tương tự @RequestMapping nhưng
     * cho WS.
     *
     * FE connect: ws://localhost:8080/ws (kèm JWT ở bước CONNECT) Sau khi
     * connect xong mới subscribe /user/queue/notifications.
     */
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // addEndpoint: URL handshake — bước đầu tiên FE mở kết nối realtime.
        registry.addEndpoint("/ws")
                .setHandshakeHandler(jwtHandshakeHandler)
                // setAllowedOriginPatterns: domain FE được phép kết nối (giống CORS của REST).
                // localhost:* = dev; onrender.com = production trên Render.
                .setAllowedOriginPatterns(
                        "http://localhost:*",
                        "https://novashop-frontend.onrender.com",
                        "https://*.onrender.com")
                // withSockJS: fallback khi trình duyệt/mạng/proxy chặn WebSocket thuần.
                // SockJS thử WS trước, không được thì dùng long-polling.
                .withSockJS();
    }

    /**
     * Gắn interceptor cho mọi message FE gửi lên server (CONNECT, SUBSCRIBE,
     * ...). Dùng để đọc JWT lúc CONNECT — biết session WS thuộc user nào.
     */
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(jwtConnectInterceptor());
    }

    /**
     * Interceptor chạy trước khi server xử lý frame STOMP từ FE. Chỉ xử lý lệnh
     * CONNECT (lúc FE vừa mở dây); các lệnh khác bỏ qua.
     */
    private ChannelInterceptor jwtConnectInterceptor() {
        return new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

                // Không phải frame STOMP hoặc không phải CONNECT → không cần xác thực ở đây
                if (accessor == null || !StompCommand.CONNECT.equals(accessor.getCommand())) {
                    return message;
                }

                // FE gửi JWT qua header Authorization (giống REST) hoặc header tên "token"
                String token = extractToken(accessor.getFirstNativeHeader("Authorization"));
                if (token == null) {
                    token = accessor.getFirstNativeHeader("token");
                }

                // Token thiếu hoặc hết hạn → vẫn cho connect nhưng không gắn user
                // (convertAndSendToUser sẽ không tìm được session đích)
                if (token == null || !jwtService.isTokenValid(token)) {
                    return message;
                }

                // Token hợp lệ → gắn principal vào session WS
                // convertAndSendToUser dùng userId từ JwtUserPrincipal.getName()
                JwtUserPrincipal principal = jwtService.extractPrincipal(token);
                accessor.setUser(new UsernamePasswordAuthenticationToken(
                        principal,
                        null,
                        List.of(new SimpleGrantedAuthority("ROLE_" + principal.role().name()))));
                return message;
            }
        };
    }

    /**
     * Tách "Bearer eyJ..." → lấy phần token thuần.
     */
    private String extractToken(String authorizationHeader) {
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            return authorizationHeader.substring(7);
        }
        return null;
    }
}
