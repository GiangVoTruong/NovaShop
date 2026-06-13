#!/usr/bin/env python3
"""Migrate com.backend from layer-based to feature-based package structure."""

from __future__ import annotations

import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
JAVA_ROOT = ROOT / "src" / "main" / "java" / "com" / "backend"
TEST_ROOT = ROOT / "src" / "test" / "java" / "com" / "backend"

# --- Feature assignments ---

CONTROLLER_FEATURE = {
    "AdminAnalyticsController": "analytics",
    "AdminCouponController": "coupon",
    "AdminInventoryController": "inventory",
    "AdminOrderController": "order",
    "AdminReviewController": "review",
    "AdminSearchController": "search",
    "AdminSettingsController": "settings",
    "AuthController": "auth",
    "CartController": "cart",
    "CategoryController": "product",
    "CouponController": "coupon",
    "HealthController": "health",
    "NotificationController": "notification",
    "NotificationPreferenceController": "notification",
    "OrderController": "order",
    "PaymentController": "payment",
    "PermissionController": "permission",
    "ProductController": "product",
    "ReviewController": "review",
    "SellerApplicationController": "seller",
    "SellerOrderController": "order",
    "SellerProductController": "product",
    "SettingsController": "settings",
    "StripePaymentController": "payment",
    "UploadController": "upload",
    "UserAddressController": "user",
    "UserController": "user",
    "WishlistController": "wishlist",
}

SERVICE_FEATURE = {
    "AddressService": "user",
    "AdminSearchService": "search",
    "AnalyticsService": "analytics",
    "AuthService": "auth",
    "CartService": "cart",
    "CategoryService": "product",
    "CouponService": "coupon",
    "EmailVerificationService": "auth",
    "GoogleTokenVerifierService": "auth",
    "InventoryService": "inventory",
    "NotificationPreferenceService": "notification",
    "NotificationResponseBuilder": "notification",
    "NotificationService": "notification",
    "OrderService": "order",
    "PasswordResetService": "auth",
    "PaymentService": "payment",
    "PermissionService": "permission",
    "ProductService": "product",
    "ReviewService": "review",
    "SellerApplicationService": "seller",
    "ShopSettingsService": "settings",
    "StripeService": "payment",
    "UploadService": "upload",
    "UserService": "user",
    "VnpayService": "payment",
    "WishlistService": "wishlist",
}

REPOSITORY_FEATURE = {
    "AddressRepository": "user",
    "CartItemRepository": "cart",
    "CartRepository": "cart",
    "CategoryRepository": "product",
    "CouponRepository": "coupon",
    "EmailVerificationRepository": "auth",
    "NotificationRepository": "notification",
    "OrderItemRepository": "order",
    "OrderRepository": "order",
    "PaymentRepository": "payment",
    "PermissionRepository": "permission",
    "ProductImageRepository": "product",
    "ProductRepository": "product",
    "ReviewRepository": "review",
    "SellerApplicationRepository": "seller",
    "UserPermissionRepository": "permission",
    "UserRepository": "user",
    "WishlistItemRepository": "wishlist",
}

ENTITY_FEATURE = {
    "Address": "user",
    "Cart": "cart",
    "CartItem": "cart",
    "Category": "product",
    "Coupon": "coupon",
    "EmailVerification": "auth",
    "Notification": "notification",
    "OrderItem": "order",
    "Payment": "payment",
    "Permission": "permission",
    "Product": "product",
    "ProductImage": "product",
    "Review": "review",
    "SellerApplication": "seller",
    "ShopOrder": "order",
    "User": "user",
    "UserPermission": "permission",
    "UserPermissionId": "permission",
    "WishlistItem": "wishlist",
}

MAPPER_FEATURE = {
    "PermissionMapper": "permission",
    "ProductMapper": "product",
    "UserMapper": "user",
}

ENUM_FEATURE = {
    "CouponType": "coupon",
    "NotificationType": "notification",
    "OrderStatus": "order",
    "PaymentMethodType": "payment",
    "PaymentStatusType": "payment",
    "PaymentTxStatus": "payment",
    "ProductStatus": "product",
    "ReviewStatus": "review",
    "SellerApplicationStatus": "seller",
    "UploadPurpose": "upload",
    "UserRole": "common",
}

SECURITY_CLASSES = {
    "JwtAuthenticationFilter",
    "JwtService",
    "JwtUserPrincipal",
    "SecurityUtils",
}

DTO_SUBFOLDER_FEATURE = {
    "addresses": "user",
    "analytics": "analytics",
    "auth": "auth",
    "cart": "cart",
    "categories": "product",
    "common": "common",
    "coupons": "coupon",
    "inventory": "inventory",
    "notifications": "notification",
    "orders": "order",
    "payments": "payment",
    "permissions": "permission",
    "products": "product",
    "reviews": "review",
    "search": "search",
    "sellers": "seller",
    "settings": "settings",
    "uploads": "upload",
    "users": "user",
    "wishlist": "wishlist",
}


def build_relocations() -> list[tuple[Path, Path, str]]:
    """Return list of (src, dst, new_package)."""
    moves: list[tuple[Path, Path, str]] = []

    for name, feature in CONTROLLER_FEATURE.items():
        src = JAVA_ROOT / "controller" / f"{name}.java"
        dst = JAVA_ROOT / "features" / feature / "controller" / f"{name}.java"
        moves.append((src, dst, f"com.backend.features.{feature}.controller"))

    for name, feature in SERVICE_FEATURE.items():
        src = JAVA_ROOT / "service" / f"{name}.java"
        dst = JAVA_ROOT / "features" / feature / "service" / f"{name}.java"
        moves.append((src, dst, f"com.backend.features.{feature}.service"))

    for name, feature in REPOSITORY_FEATURE.items():
        src = JAVA_ROOT / "repository" / f"{name}.java"
        dst = JAVA_ROOT / "features" / feature / "repository" / f"{name}.java"
        moves.append((src, dst, f"com.backend.features.{feature}.repository"))

    for name, feature in ENTITY_FEATURE.items():
        src = JAVA_ROOT / "entity" / f"{name}.java"
        dst = JAVA_ROOT / "features" / feature / f"{name}.java"
        moves.append((src, dst, f"com.backend.features.{feature}"))

    for name, feature in MAPPER_FEATURE.items():
        src = JAVA_ROOT / "mapper" / f"{name}.java"
        dst = JAVA_ROOT / "features" / feature / "mapper" / f"{name}.java"
        moves.append((src, dst, f"com.backend.features.{feature}.mapper"))

    for name, feature in ENUM_FEATURE.items():
        src = JAVA_ROOT / "enums" / f"{name}.java"
        if feature == "common":
            dst = JAVA_ROOT / "common" / "enums" / f"{name}.java"
            pkg = "com.backend.common.enums"
        else:
            dst = JAVA_ROOT / "features" / feature / "enums" / f"{name}.java"
            pkg = f"com.backend.features.{feature}.enums"
        moves.append((src, dst, pkg))

    for cls in SECURITY_CLASSES:
        src = JAVA_ROOT / "security" / f"{cls}.java"
        dst = JAVA_ROOT / "features" / "auth" / "security" / f"{cls}.java"
        moves.append((src, dst, "com.backend.features.auth.security"))

    # mail
    src = JAVA_ROOT / "mail" / "VerificationEmailRenderer.java"
    dst = JAVA_ROOT / "features" / "auth" / "mail" / "VerificationEmailRenderer.java"
    moves.append((src, dst, "com.backend.features.auth.mail"))

    # constants
    src = JAVA_ROOT / "constants" / "NotificationI18nKeys.java"
    dst = JAVA_ROOT / "features" / "notification" / "NotificationI18nKeys.java"
    moves.append((src, dst, "com.backend.features.notification"))

    # common
    for f in (JAVA_ROOT / "exception").glob("*.java"):
        dst = JAVA_ROOT / "common" / "exception" / f.name
        moves.append((f, dst, "com.backend.common.exception"))

    for f in (JAVA_ROOT / "util").glob("*.java"):
        dst = JAVA_ROOT / "common" / "util" / f.name
        moves.append((f, dst, "com.backend.common.util"))

    for subfolder, feature in DTO_SUBFOLDER_FEATURE.items():
        dto_dir = JAVA_ROOT / "dto" / subfolder
        if not dto_dir.exists():
            continue
        for f in dto_dir.glob("*.java"):
            if feature == "common":
                dst = JAVA_ROOT / "common" / "dto" / f.name
                pkg = "com.backend.common.dto"
            else:
                dst = JAVA_ROOT / "features" / feature / "dto" / f.name
                pkg = f"com.backend.features.{feature}.dto"
            moves.append((f, dst, pkg))

    return moves


def build_import_replacements() -> list[tuple[str, str]]:
    """Old import prefix/suffix -> new. Sorted longest-first at runtime."""
    reps: list[tuple[str, str]] = []

    for name, feature in CONTROLLER_FEATURE.items():
        reps.append((f"com.backend.controller.{name}", f"com.backend.features.{feature}.controller.{name}"))

    for name, feature in SERVICE_FEATURE.items():
        reps.append((f"com.backend.service.{name}", f"com.backend.features.{feature}.service.{name}"))

    for name, feature in REPOSITORY_FEATURE.items():
        reps.append((f"com.backend.repository.{name}", f"com.backend.features.{feature}.repository.{name}"))

    for name, feature in ENTITY_FEATURE.items():
        reps.append((f"com.backend.entity.{name}", f"com.backend.features.{feature}.{name}"))

    for name, feature in MAPPER_FEATURE.items():
        reps.append((f"com.backend.mapper.{name}", f"com.backend.features.{feature}.mapper.{name}"))

    for name, feature in ENUM_FEATURE.items():
        if feature == "common":
            reps.append((f"com.backend.enums.{name}", f"com.backend.common.enums.{name}"))
        else:
            reps.append((f"com.backend.enums.{name}", f"com.backend.features.{feature}.enums.{name}"))

    for cls in SECURITY_CLASSES:
        reps.append((f"com.backend.security.{cls}", f"com.backend.features.auth.security.{cls}"))

    reps.append(("com.backend.mail.VerificationEmailRenderer", "com.backend.features.auth.mail.VerificationEmailRenderer"))
    reps.append(("com.backend.constants.NotificationI18nKeys", "com.backend.features.notification.NotificationI18nKeys"))

    for f in (JAVA_ROOT / "exception").glob("*.java"):
        cls = f.stem
        reps.append((f"com.backend.exception.{cls}", f"com.backend.common.exception.{cls}"))

    for f in (JAVA_ROOT / "util").glob("*.java"):
        cls = f.stem
        reps.append((f"com.backend.util.{cls}", f"com.backend.common.util.{cls}"))

    for subfolder, feature in DTO_SUBFOLDER_FEATURE.items():
        dto_dir = JAVA_ROOT / "dto" / subfolder
        if not dto_dir.exists():
            continue
        for f in dto_dir.glob("*.java"):
            cls = f.stem
            old = f"com.backend.dto.{subfolder}.{cls}"
            if feature == "common":
                new = f"com.backend.common.dto.{cls}"
            else:
                new = f"com.backend.features.{feature}.dto.{cls}"
            reps.append((old, new))

    reps.sort(key=lambda x: len(x[0]), reverse=True)
    return reps


def set_package(content: str, new_package: str) -> str:
    if re.search(r"^package\s+", content, re.MULTILINE):
        return re.sub(r"^package\s+[\w.]+;", f"package {new_package};", content, count=1, flags=re.MULTILINE)
    return f"package {new_package};\n\n{content}"


def apply_import_replacements(content: str, replacements: list[tuple[str, str]]) -> str:
    for old, new in replacements:
        content = content.replace(old, new)
    return content


def move_files(moves: list[tuple[Path, Path, str]]) -> None:
    for src, dst, pkg in moves:
        if not src.exists():
            print(f"SKIP (missing): {src.relative_to(ROOT)}")
            continue
        dst.parent.mkdir(parents=True, exist_ok=True)
        content = src.read_text(encoding="utf-8")
        content = set_package(content, pkg)
        dst.write_text(content, encoding="utf-8")
        if src.resolve() != dst.resolve():
            src.unlink()
        print(f"MOVED: {src.relative_to(ROOT)} -> {dst.relative_to(ROOT)}")


def update_all_imports(replacements: list[tuple[str, str]]) -> None:
    java_files = list(ROOT.rglob("src/**/*.java"))
    for path in java_files:
        content = path.read_text(encoding="utf-8")
        updated = apply_import_replacements(content, replacements)
        if updated != content:
            path.write_text(updated, encoding="utf-8")


def cleanup_empty_dirs(base: Path) -> None:
    old_dirs = [
        "controller", "service", "repository", "entity", "mapper", "enums",
        "security", "mail", "constants", "exception", "util", "dto",
    ]
    for name in old_dirs:
        d = base / name
        if d.exists():
            shutil.rmtree(d, ignore_errors=True)


def main() -> None:
    moves = build_relocations()
    replacements = build_import_replacements()

    print(f"Moving {len(moves)} files...")
    move_files(moves)

    print("Updating imports across all Java files...")
    update_all_imports(replacements)

    print("Cleaning up old directories...")
    cleanup_empty_dirs(JAVA_ROOT)

    print("Done.")


if __name__ == "__main__":
    main()
