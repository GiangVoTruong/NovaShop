package com.backend.entity;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.backend.enums.OrderStatus;
import com.backend.enums.PaymentMethodType;
import com.backend.enums.PaymentStatusType;
import com.github.f4b6a3.uuid.UuidCreator;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShopOrder {

    @Id
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    @Builder.Default
    private UUID id = UuidCreator.getTimeOrderedEpoch();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "address_id")
    private Address shippingAddress;

    @Column(name = "shipping_full_name", length = 100)
    private String shippingFullName;

    @Column(name = "shipping_phone", length = 20)
    private String shippingPhone;

    @Column(name = "shipping_province", length = 100)
    private String shippingProvince;

    @Column(name = "shipping_district", length = 100)
    private String shippingDistrict;

    @Column(name = "shipping_ward", length = 100)
    private String shippingWard;

    @Column(name = "shipping_detail", length = 255)
    private String shippingDetail;

    @Column(length = 500)
    private String note;

    @Column(name = "total_amount", precision = 15, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "final_amount", precision = 15, scale = 2)
    private BigDecimal finalAmount;

    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "status", columnDefinition = "order_status")
    @Builder.Default
    private OrderStatus status = OrderStatus.PENDING;

    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "payment_method", columnDefinition = "payment_method_type")
    private PaymentMethodType paymentMethod;

    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "payment_status", columnDefinition = "payment_status_type")
    @Builder.Default
    private PaymentStatusType paymentStatus = PaymentStatusType.UNPAID;

    @Column(name = "created_at")
    @Builder.Default
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(name = "updated_at")
    @Builder.Default
    private OffsetDateTime updatedAt = OffsetDateTime.now();
}
