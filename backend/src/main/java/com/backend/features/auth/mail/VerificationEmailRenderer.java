package com.backend.features.auth.mail;

public final class VerificationEmailRenderer {

    private VerificationEmailRenderer() {
    }

    public static String subject() {
        return "NovaShop — Mã xác minh email";
    }

    public static String plainText(String otp, long expiryMinutes) {
        return """
                Xin chào,

                Mã xác minh NovaShop của bạn là: %s

                Mã có hiệu lực trong %d phút.

                Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email.
                """.formatted(otp, expiryMinutes);
    }

    public static String html(String otp, long expiryMinutes) {
        return """
                <!DOCTYPE html>
                <html lang="vi">
                <head>
                  <meta charset="UTF-8"/>
                  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                  <title>NovaShop Verification</title>
                </head>
                <body style="margin:0;padding:0;background:#f4f6fb;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
                  <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="background:#f4f6fb;padding:32px 16px;">
                    <tr>
                      <td align="center">
                        <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 24px rgba(15,23,42,0.08);">
                          <tr>
                            <td style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:28px 32px;text-align:center;">
                              <div style="font-size:28px;font-weight:700;color:#ffffff;letter-spacing:0.5px;">NovaShop</div>
                              <div style="font-size:14px;color:#e0e7ff;margin-top:6px;">Xác minh địa chỉ email</div>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding:32px;">
                              <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">Xin chào,</p>
                              <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#4b5563;">
                                Cảm ơn bạn đã đăng ký NovaShop. Vui lòng sử dụng mã OTP bên dưới để kích hoạt tài khoản:
                              </p>
                              <div style="text-align:center;margin:0 0 24px;">
                                <div style="display:inline-block;background:#f8fafc;border:1px dashed #c7d2fe;border-radius:12px;padding:18px 28px;">
                                  <span style="font-size:32px;font-weight:700;letter-spacing:8px;color:#4f46e5;font-family:Consolas,Monaco,monospace;">%s</span>
                                </div>
                              </div>
                              <p style="margin:0 0 8px;font-size:14px;color:#6b7280;text-align:center;">
                                Mã có hiệu lực trong <strong style="color:#111827;">%d phút</strong>
                              </p>
                              <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#9ca3af;text-align:center;">
                                Không chia sẻ mã này với bất kỳ ai. Nếu bạn không tạo tài khoản, hãy bỏ qua email này.
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td style="background:#f9fafb;padding:16px 32px;text-align:center;border-top:1px solid #eef2f7;">
                              <p style="margin:0;font-size:12px;color:#9ca3af;">© NovaShop. Email tự động, vui lòng không trả lời.</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </body>
                </html>
                """.formatted(otp, expiryMinutes);
    }
}
