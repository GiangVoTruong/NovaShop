# Migrate com.backend from layer-based to feature-based structure
$ErrorActionPreference = "Stop"
$ROOT = Split-Path -Parent $PSScriptRoot
$JAVA_ROOT = Join-Path $ROOT "src\main\java\com\backend"

function Set-Package([string]$content, [string]$newPackage) {
    if ($content -match '(?m)^package\s+[\w.]+;') {
        return [regex]::Replace($content, '(?m)^package\s+[\w.]+;', "package $newPackage;", 1)
    }
    return "package $newPackage;`n`n$content"
}

function Move-FileWithPackage($src, $dst, $pkg) {
    if (-not (Test-Path $src)) {
        Write-Host "SKIP (missing): $src"
        return
    }
    $dstDir = Split-Path $dst -Parent
    if (-not (Test-Path $dstDir)) { New-Item -ItemType Directory -Path $dstDir -Force | Out-Null }
    $content = Get-Content $src -Raw -Encoding UTF8
    $content = Set-Package $content $pkg
    Set-Content -Path $dst -Value $content -Encoding UTF8 -NoNewline
    if ($src -ne $dst) { Remove-Item $src -Force }
    Write-Host "MOVED: $src -> $dst"
}

# Build moves: @(src, dst, package)
$moves = @()

$controllerFeature = @{
    AdminAnalyticsController="analytics"; AdminCouponController="coupon"; AdminInventoryController="inventory"
    AdminOrderController="order"; AdminReviewController="review"; AdminSearchController="search"
    AdminSettingsController="settings"; AuthController="auth"; CartController="cart"
    CategoryController="product"; CouponController="coupon"; HealthController="health"
    NotificationController="notification"; NotificationPreferenceController="notification"
    OrderController="order"; PaymentController="payment"; PermissionController="permission"
    ProductController="product"; ReviewController="review"; SellerApplicationController="seller"
    SellerOrderController="order"; SellerProductController="product"; SettingsController="settings"
    StripePaymentController="payment"; UploadController="upload"; UserAddressController="user"
    UserController="user"; WishlistController="wishlist"
}
foreach ($kv in $controllerFeature.GetEnumerator()) {
    $moves += ,@(
        (Join-Path $JAVA_ROOT "controller\$($kv.Key).java"),
        (Join-Path $JAVA_ROOT "features\$($kv.Value)\controller\$($kv.Key).java"),
        "com.backend.features.$($kv.Value).controller"
    )
}

$serviceFeature = @{
    AddressService="user"; AdminSearchService="search"; AnalyticsService="analytics"
    AuthService="auth"; CartService="cart"; CategoryService="product"; CouponService="coupon"
    EmailVerificationService="auth"; GoogleTokenVerifierService="auth"; InventoryService="inventory"
    NotificationPreferenceService="notification"; NotificationResponseBuilder="notification"
    NotificationService="notification"; OrderService="order"; PasswordResetService="auth"
    PaymentService="payment"; PermissionService="permission"; ProductService="product"
    ReviewService="review"; SellerApplicationService="seller"; ShopSettingsService="settings"
    StripeService="payment"; UploadService="upload"; UserService="user"; VnpayService="payment"
    WishlistService="wishlist"
}
foreach ($kv in $serviceFeature.GetEnumerator()) {
    $moves += ,@(
        (Join-Path $JAVA_ROOT "service\$($kv.Key).java"),
        (Join-Path $JAVA_ROOT "features\$($kv.Value)\service\$($kv.Key).java"),
        "com.backend.features.$($kv.Value).service"
    )
}

$repoFeature = @{
    AddressRepository="user"; CartItemRepository="cart"; CartRepository="cart"
    CategoryRepository="product"; CouponRepository="coupon"; EmailVerificationRepository="auth"
    NotificationRepository="notification"; OrderItemRepository="order"; OrderRepository="order"
    PaymentRepository="payment"; PermissionRepository="permission"; ProductImageRepository="product"
    ProductRepository="product"; ReviewRepository="review"; SellerApplicationRepository="seller"
    UserPermissionRepository="permission"; UserRepository="user"; WishlistItemRepository="wishlist"
}
foreach ($kv in $repoFeature.GetEnumerator()) {
    $moves += ,@(
        (Join-Path $JAVA_ROOT "repository\$($kv.Key).java"),
        (Join-Path $JAVA_ROOT "features\$($kv.Value)\repository\$($kv.Key).java"),
        "com.backend.features.$($kv.Value).repository"
    )
}

$entityFeature = @{
    Address="user"; Cart="cart"; CartItem="cart"; Category="product"; Coupon="coupon"
    EmailVerification="auth"; Notification="notification"; OrderItem="order"; Payment="payment"
    Permission="permission"; Product="product"; ProductImage="product"; Review="review"
    SellerApplication="seller"; ShopOrder="order"; User="user"; UserPermission="permission"
    UserPermissionId="permission"; WishlistItem="wishlist"
}
foreach ($kv in $entityFeature.GetEnumerator()) {
    $moves += ,@(
        (Join-Path $JAVA_ROOT "entity\$($kv.Key).java"),
        (Join-Path $JAVA_ROOT "features\$($kv.Value)\$($kv.Key).java"),
        "com.backend.features.$($kv.Value)"
    )
}

$mapperFeature = @{ PermissionMapper="permission"; ProductMapper="product"; UserMapper="user" }
foreach ($kv in $mapperFeature.GetEnumerator()) {
    $moves += ,@(
        (Join-Path $JAVA_ROOT "mapper\$($kv.Key).java"),
        (Join-Path $JAVA_ROOT "features\$($kv.Value)\mapper\$($kv.Key).java"),
        "com.backend.features.$($kv.Value).mapper"
    )
}

$enumFeature = @{
    CouponType="coupon"; NotificationType="notification"; OrderStatus="order"
    PaymentMethodType="payment"; PaymentStatusType="payment"; PaymentTxStatus="payment"
    ProductStatus="product"; ReviewStatus="review"; SellerApplicationStatus="seller"
    UploadPurpose="upload"; UserRole="common"
}
foreach ($kv in $enumFeature.GetEnumerator()) {
    if ($kv.Value -eq "common") {
        $moves += ,@(
            (Join-Path $JAVA_ROOT "enums\$($kv.Key).java"),
            (Join-Path $JAVA_ROOT "common\enums\$($kv.Key).java"),
            "com.backend.common.enums"
        )
    } else {
        $moves += ,@(
            (Join-Path $JAVA_ROOT "enums\$($kv.Key).java"),
            (Join-Path $JAVA_ROOT "features\$($kv.Value)\enums\$($kv.Key).java"),
            "com.backend.features.$($kv.Value).enums"
        )
    }
}

$securityClasses = @("JwtAuthenticationFilter","JwtService","JwtUserPrincipal","SecurityUtils")
foreach ($cls in $securityClasses) {
    $moves += ,@(
        (Join-Path $JAVA_ROOT "security\$cls.java"),
        (Join-Path $JAVA_ROOT "features\auth\security\$cls.java"),
        "com.backend.features.auth.security"
    )
}

$moves += ,@(
    (Join-Path $JAVA_ROOT "mail\VerificationEmailRenderer.java"),
    (Join-Path $JAVA_ROOT "features\auth\mail\VerificationEmailRenderer.java"),
    "com.backend.features.auth.mail"
)
$moves += ,@(
    (Join-Path $JAVA_ROOT "constants\NotificationI18nKeys.java"),
    (Join-Path $JAVA_ROOT "features\notification\NotificationI18nKeys.java"),
    "com.backend.features.notification"
)

foreach ($f in Get-ChildItem (Join-Path $JAVA_ROOT "exception") -Filter "*.java" -ErrorAction SilentlyContinue) {
    $moves += ,@($f.FullName, (Join-Path $JAVA_ROOT "common\exception\$($f.Name)"), "com.backend.common.exception")
}
foreach ($f in Get-ChildItem (Join-Path $JAVA_ROOT "util") -Filter "*.java" -ErrorAction SilentlyContinue) {
    $moves += ,@($f.FullName, (Join-Path $JAVA_ROOT "common\util\$($f.Name)"), "com.backend.common.util")
}

$dtoSubfolderFeature = @{
    addresses="user"; analytics="analytics"; auth="auth"; cart="cart"; categories="product"
    common="common"; coupons="coupon"; inventory="inventory"; notifications="notification"
    orders="order"; payments="payment"; permissions="permission"; products="product"
    reviews="review"; search="search"; sellers="seller"; settings="settings"
    uploads="upload"; users="user"; wishlist="wishlist"
}
foreach ($kv in $dtoSubfolderFeature.GetEnumerator()) {
    $dtoDir = Join-Path $JAVA_ROOT "dto\$($kv.Key)"
    if (-not (Test-Path $dtoDir)) { continue }
    foreach ($f in Get-ChildItem $dtoDir -Filter "*.java") {
        if ($kv.Value -eq "common") {
            $moves += ,@($f.FullName, (Join-Path $JAVA_ROOT "common\dto\$($f.Name)"), "com.backend.common.dto")
        } else {
            $moves += ,@($f.FullName, (Join-Path $JAVA_ROOT "features\$($kv.Value)\dto\$($f.Name)"), "com.backend.features.$($kv.Value).dto")
        }
    }
}

Write-Host "Moving $($moves.Count) files..."

# Build import replacements BEFORE moving (old dirs still exist)
$replacements = @()

foreach ($kv in $controllerFeature.GetEnumerator()) {
    $replacements += @("com.backend.controller.$($kv.Key)", "com.backend.features.$($kv.Value).controller.$($kv.Key)")
}
foreach ($kv in $serviceFeature.GetEnumerator()) {
    $replacements += @("com.backend.service.$($kv.Key)", "com.backend.features.$($kv.Value).service.$($kv.Key)")
}
foreach ($kv in $repoFeature.GetEnumerator()) {
    $replacements += @("com.backend.repository.$($kv.Key)", "com.backend.features.$($kv.Value).repository.$($kv.Key)")
}
foreach ($kv in $entityFeature.GetEnumerator()) {
    $replacements += @("com.backend.entity.$($kv.Key)", "com.backend.features.$($kv.Value).$($kv.Key)")
}
foreach ($kv in $mapperFeature.GetEnumerator()) {
    $replacements += @("com.backend.mapper.$($kv.Key)", "com.backend.features.$($kv.Value).mapper.$($kv.Key)")
}
foreach ($kv in $enumFeature.GetEnumerator()) {
    if ($kv.Value -eq "common") {
        $replacements += @("com.backend.enums.$($kv.Key)", "com.backend.common.enums.$($kv.Key)")
    } else {
        $replacements += @("com.backend.enums.$($kv.Key)", "com.backend.features.$($kv.Value).enums.$($kv.Key)")
    }
}
foreach ($cls in $securityClasses) {
    $replacements += @("com.backend.security.$cls", "com.backend.features.auth.security.$cls")
}
$replacements += @("com.backend.mail.VerificationEmailRenderer", "com.backend.features.auth.mail.VerificationEmailRenderer")
$replacements += @("com.backend.constants.NotificationI18nKeys", "com.backend.features.notification.NotificationI18nKeys")

foreach ($f in Get-ChildItem (Join-Path $JAVA_ROOT "exception") -Filter "*.java" -ErrorAction SilentlyContinue) {
    $replacements += @("com.backend.exception.$($f.BaseName)", "com.backend.common.exception.$($f.BaseName)")
}
foreach ($f in Get-ChildItem (Join-Path $JAVA_ROOT "util") -Filter "*.java" -ErrorAction SilentlyContinue) {
    $replacements += @("com.backend.util.$($f.BaseName)", "com.backend.common.util.$($f.BaseName)")
}
foreach ($kv in $dtoSubfolderFeature.GetEnumerator()) {
    $dtoDir = Join-Path $JAVA_ROOT "dto\$($kv.Key)"
    if (-not (Test-Path $dtoDir)) { continue }
    foreach ($f in Get-ChildItem $dtoDir -Filter "*.java") {
        $old = "com.backend.dto.$($kv.Key).$($f.BaseName)"
        if ($kv.Value -eq "common") { $new = "com.backend.common.dto.$($f.BaseName)" }
        else { $new = "com.backend.features.$($kv.Value).dto.$($f.BaseName)" }
        $replacements += @($old, $new)
    }
}

# Sort by old string length descending
$sortedPairs = @()
for ($i = 0; $i -lt $replacements.Count; $i += 2) {
    $sortedPairs += [PSCustomObject]@{ Old = $replacements[$i]; New = $replacements[$i + 1]; Len = $replacements[$i].Length }
}
$sortedPairs = $sortedPairs | Sort-Object Len -Descending

foreach ($m in $moves) { Move-FileWithPackage $m[0] $m[1] $m[2] }

Write-Host "Updating imports..."
$javaFiles = Get-ChildItem (Join-Path $ROOT "src") -Recurse -Filter "*.java"
foreach ($file in $javaFiles) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $updated = $content
    foreach ($pair in $sortedPairs) { $updated = $updated.Replace($pair.Old, $pair.New) }
    if ($updated -ne $content) {
        Set-Content -Path $file.FullName -Value $updated -Encoding UTF8 -NoNewline
    }
}

Write-Host "Cleaning up old directories..."
@("controller","service","repository","entity","mapper","enums","security","mail","constants","exception","util","dto") | ForEach-Object {
    $d = Join-Path $JAVA_ROOT $_
    if (Test-Path $d) { Remove-Item $d -Recurse -Force }
}

Write-Host "Done."
