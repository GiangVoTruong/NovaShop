package com.backend.features.auth.dto;

import java.util.List;

import com.backend.common.enums.UserRole;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthLoginResponseDto {

    private String accessToken;
    private String tokenType;
    private Long expiresIn;
    private String refreshToken;

    /** Role — dùng để routing: admin portal hay customer shop. */
    private UserRole role;

    /** ADMIN = trang admin, CUSTOMER = trang khách hàng. */
    private String portalType;

    /** Quyền chi tiết — chỉ có khi portalType = ADMIN. */
    private List<String> permissions;
}
