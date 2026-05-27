package com.backend.enums;

public enum UserRole {
    ADMIN,
    SELLER,
    CUSTOMER;

    /** Role dùng cho routing đăng nhập — admin portal vs customer shop. */
    public boolean isAdminPortal() {
        return this == ADMIN || this == SELLER;
    }
}
