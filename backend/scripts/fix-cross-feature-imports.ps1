# Add missing cross-feature imports after package migration
$ErrorActionPreference = "Stop"
$ROOT = Split-Path -Parent $PSScriptRoot
$srcRoot = Join-Path $ROOT "src"

# Type simple name -> full import (entities + cross-feature services)
$typeImports = [ordered]@{
    "User" = "com.backend.features.user.User"
    "Address" = "com.backend.features.user.Address"
    "Product" = "com.backend.features.product.Product"
    "ProductImage" = "com.backend.features.product.ProductImage"
    "Category" = "com.backend.features.product.Category"
    "ShopOrder" = "com.backend.features.order.ShopOrder"
    "OrderItem" = "com.backend.features.order.OrderItem"
    "Cart" = "com.backend.features.cart.Cart"
    "CartItem" = "com.backend.features.cart.CartItem"
    "Payment" = "com.backend.features.payment.Payment"
    "Notification" = "com.backend.features.notification.Notification"
    "EmailVerification" = "com.backend.features.auth.EmailVerification"
    "Permission" = "com.backend.features.permission.Permission"
    "UserPermission" = "com.backend.features.permission.UserPermission"
    "UserPermissionId" = "com.backend.features.permission.UserPermissionId"
    "SellerApplication" = "com.backend.features.seller.SellerApplication"
    "WishlistItem" = "com.backend.features.wishlist.WishlistItem"
    "Review" = "com.backend.features.review.Review"
    "Coupon" = "com.backend.features.coupon.Coupon"
    "CartService" = "com.backend.features.cart.service.CartService"
    "NotificationService" = "com.backend.features.notification.service.NotificationService"
    "AddressService" = "com.backend.features.user.service.AddressService"
    "CouponService" = "com.backend.features.coupon.service.CouponService"
    "PermissionService" = "com.backend.features.permission.service.PermissionService"
    "EmailVerificationService" = "com.backend.features.auth.service.EmailVerificationService"
    "ProductService" = "com.backend.features.product.service.ProductService"
    "OrderService" = "com.backend.features.order.service.OrderService"
    "UserService" = "com.backend.features.user.service.UserService"
    "ReviewService" = "com.backend.features.review.service.ReviewService"
    "PaymentService" = "com.backend.features.payment.service.PaymentService"
    "UserMapper" = "com.backend.features.user.mapper.UserMapper"
    "ProductMapper" = "com.backend.features.product.mapper.ProductMapper"
    "PermissionMapper" = "com.backend.features.permission.mapper.PermissionMapper"
    "UserRepository" = "com.backend.features.user.repository.UserRepository"
    "ProductRepository" = "com.backend.features.product.repository.ProductRepository"
    "OrderRepository" = "com.backend.features.order.repository.OrderRepository"
    "ReviewRepository" = "com.backend.features.review.repository.ReviewRepository"
    "CartRepository" = "com.backend.features.cart.repository.CartRepository"
    "PaymentRepository" = "com.backend.features.payment.repository.PaymentRepository"
    "NotificationRepository" = "com.backend.features.notification.repository.NotificationRepository"
    "EmailVerificationRepository" = "com.backend.features.auth.repository.EmailVerificationRepository"
    "SellerApplicationRepository" = "com.backend.features.seller.repository.SellerApplicationRepository"
    "WishlistItemRepository" = "com.backend.features.wishlist.repository.WishlistItemRepository"
    "AddressRepository" = "com.backend.features.user.repository.AddressRepository"
    "CategoryRepository" = "com.backend.features.product.repository.CategoryRepository"
    "CouponRepository" = "com.backend.features.coupon.repository.CouponRepository"
    "PermissionRepository" = "com.backend.features.permission.repository.PermissionRepository"
    "UserPermissionRepository" = "com.backend.features.permission.repository.UserPermissionRepository"
    "OrderItemRepository" = "com.backend.features.order.repository.OrderItemRepository"
    "CartItemRepository" = "com.backend.features.cart.repository.CartItemRepository"
    "ProductImageRepository" = "com.backend.features.product.repository.ProductImageRepository"
    "JwtService" = "com.backend.features.auth.security.JwtService"
    "SecurityUtils" = "com.backend.features.auth.security.SecurityUtils"
}

function Uses-Type([string]$content, [string]$typeName) {
    # Match type usage as word boundary (field type, param, return, generic, etc.)
    return $content -match "(?<![\w.])$typeName(?![\w.])"
}

function Has-Import([string]$content, [string]$fqcn) {
    return $content -match "(?m)^import\s+$([regex]::Escape($fqcn))\s*;"
}

function Get-OwnTypeName([string]$content) {
    if ($content -match '(?m)^public\s+(?:class|interface|enum|record)\s+(\w+)') {
        return $Matches[1]
    }
    return $null
}

function Add-MissingImports([string]$filePath) {
    $content = Get-Content $filePath -Raw -Encoding UTF8
    if ($content -notmatch '(?m)^package\s+([\w.]+);') { return }
    $package = $Matches[1]
    $ownType = Get-OwnTypeName $content
    $toAdd = @()

    foreach ($entry in $typeImports.GetEnumerator()) {
        $typeName = $entry.Key
        $fqcn = $entry.Value
        if ($ownType -eq $typeName) { continue }
        if ($fqcn.StartsWith("$package.")) { continue }
        if (Has-Import $content $fqcn) { continue }
        if (Uses-Type $content $typeName) {
            $toAdd += "import $fqcn;"
        }
    }

    if ($toAdd.Count -eq 0) { return }

    $toAdd = $toAdd | Sort-Object -Unique
    if ($content -match '(?m)^(import\s+[\w.]+;\s*\r?\n)+') {
        $lastImportBlock = $Matches[0]
        $newBlock = $lastImportBlock.TrimEnd() + "`n" + ($toAdd -join "`n") + "`n"
        $content = $content.Replace($lastImportBlock, $newBlock)
    } elseif ($content -match '(?m)^package\s+[\w.]+;\s*\r?\n') {
        $content = [regex]::Replace($content, '(?m)^package\s+[\w.]+;\s*\r?\n', "`$0`n" + ($toAdd -join "`n") + "`n`n", 1)
    }

    $utf8NoBom = New-Object System.Text.UTF8Encoding $false
    [System.IO.File]::WriteAllText($filePath, $content, $utf8NoBom)
    Write-Host "Fixed imports: $filePath ($($toAdd.Count) added)"
}

Get-ChildItem $srcRoot -Recurse -Filter "*.java" | ForEach-Object { Add-MissingImports $_.FullName }
Write-Host "Done."
