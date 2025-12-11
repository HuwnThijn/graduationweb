const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Hàm gửi email qua Resend HTTP API (hoạt động trên Render.com)
async function sendEmailViaResend(to, subject, html) {
    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            from: process.env.FROM_EMAIL || 'Lễ Tốt Nghiệp 2025 <onboarding@resend.dev>',
            to: [to],
            subject: subject,
            html: html
        })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message || 'Failed to send email via Resend');
    }
    
    return data;
}

// Xác định email gửi đi
const getFromEmail = () => {
    return process.env.FROM_EMAIL || 'Lễ Tốt Nghiệp 2025 <onboarding@resend.dev>';
};

// API endpoint to send confirmation email
app.post('/api/send-email', async (req, res) => {
    const { guestName, guestEmail, guestPhone, message } = req.body;
    
    // Validate required fields
    if (!guestName || !guestEmail) {
        return res.status(400).json({ 
            success: false, 
            message: 'Vui lòng điền đầy đủ thông tin bắt buộc' 
        });
    }
    
    const fromEmail = getFromEmail();
    
    // Email to guest (confirmation)
    const guestMailOptions = {
        from: fromEmail,
        to: guestEmail,
        subject: '🎓 Xác nhận tham dự Lễ Tốt Nghiệp - Thái Hưng Thịnh',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 40px 20px; background-color: #0a0a0a; font-family: Georgia, serif;">
                <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 550px; margin: 0 auto;">
                    <tr>
                        <td style="background-color: #0d0d0d; border: 1px solid rgba(201, 169, 98, 0.3); padding: 0;">
                            
                            <!-- Top decorative line -->
                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                <tr>
                                    <td style="padding: 20px 25px 0 25px;">
                                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                            <tr>
                                                <td width="50" style="height: 2px; background: linear-gradient(90deg, #c9a962, transparent);"></td>
                                                <td></td>
                                                <td width="50" style="height: 2px; background: linear-gradient(90deg, transparent, #c9a962);"></td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Main Content -->
                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                <tr>
                                    <td style="padding: 40px 40px 30px 40px; text-align: center;">
                                        
                                        <!-- Header -->
                                        <p style="font-family: Arial, sans-serif; font-size: 11px; letter-spacing: 4px; color: #b8b8b8; margin: 0 0 20px 0;">X Á C &nbsp; N H Ậ N &nbsp; T H A M &nbsp; D Ự</p>
                                        <h1 style="font-family: 'Brush Script MT', cursive; font-size: 52px; color: #c9a962; margin: 0; font-weight: normal;">Graduation</h1>
                                        <p style="font-family: Arial, sans-serif; font-size: 18px; letter-spacing: 8px; color: #ffffff; margin: 10px 0 0 0;">LỄ TỐT NGHIỆP</p>
                                        
                                        <!-- Divider -->
                                        <table cellpadding="0" cellspacing="0" border="0" style="margin: 25px auto;">
                                            <tr>
                                                <td style="width: 40px; height: 2px; background: linear-gradient(90deg, transparent, #c9a962, transparent);"></td>
                                            </tr>
                                        </table>
                                        
                                        <!-- Content -->
                                        <p style="color: #d4d4d4; font-size: 16px; line-height: 1.8; margin: 0 0 15px 0;">Kính gửi <span style="color: #c9a962; font-weight: bold;">${guestName}</span>,</p>
                                        <p style="color: #d4d4d4; font-size: 16px; line-height: 1.8; margin: 0;">Cảm ơn bạn đã xác nhận tham dự Lễ Tốt Nghiệp của tôi!</p>
                                        
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Event Info Box -->
                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                <tr>
                                    <td style="padding: 0 40px;">
                                        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: rgba(201, 169, 98, 0.1); border: 1px solid rgba(201, 169, 98, 0.25);">
                                            <tr>
                                                <td style="padding: 25px 30px;">
                                                    <p style="font-family: Arial, sans-serif; font-size: 14px; color: #e8e8e8; margin: 0 0 12px 0;">
                                                        <span style="color: #c9a962;">◆</span>&nbsp;&nbsp;<strong style="color: #c9a962;">Thời gian:</strong> Thứ Sáu, ngày 09/01/2026, lúc 9:00 sáng
                                                    </p>
                                                    <p style="font-family: Arial, sans-serif; font-size: 14px; color: #e8e8e8; margin: 0 0 12px 0;">
                                                        <span style="color: #c9a962;">◆</span>&nbsp;&nbsp;<strong style="color: #c9a962;">Địa điểm:</strong> Thu Duc Campus - HUTECH
                                                    </p>
                                                    <p style="font-family: Arial, sans-serif; font-size: 14px; color: #e8e8e8; margin: 0;">
                                                        <span style="color: #c9a962;">◆</span>&nbsp;&nbsp;<strong style="color: #c9a962;">Địa chỉ:</strong> Phân khu đào tạo E1, Khu Công Nghệ cao TP.HCM
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Note & Footer -->
                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                <tr>
                                    <td style="padding: 30px 40px; text-align: center;">
                                        
                                        <p style="color: #b8b8b8; font-size: 14px; line-height: 1.8; font-style: italic; margin: 0;">Vui lòng đến trước 15 phút để check-in.</p>
                                        <p style="color: #b8b8b8; font-size: 14px; line-height: 1.8; font-style: italic; margin: 10px 0 0 0;">Tôi rất mong được đón tiếp bạn!</p>
                                        
                                        <!-- Divider -->
                                        <table cellpadding="0" cellspacing="0" border="0" style="margin: 30px auto;">
                                            <tr>
                                                <td style="width: 40px; height: 2px; background: linear-gradient(90deg, transparent, #c9a962, transparent);"></td>
                                            </tr>
                                        </table>
                                        
                                        <!-- Signature -->
                                        <p style="font-family: Arial, sans-serif; font-size: 12px; letter-spacing: 2px; color: #888; margin: 0 0 10px 0;">Trân trọng,</p>
                                        <p style="font-family: 'Brush Script MT', cursive; font-size: 36px; color: #ffffff; margin: 0;">Thái Hưng Thịnh</p>
                                        <p style="font-family: Arial, sans-serif; font-size: 11px; letter-spacing: 3px; color: #c9a962; margin: 15px 0 5px 0;">KHÓA 2021 - 2025</p>
                                        <p style="font-family: Arial, sans-serif; font-size: 11px; letter-spacing: 2px; color: #c9a962; margin: 0;">TRƯỜNG ĐẠI HỌC CÔNG NGHỆ TP.HCM (HUTECH)</p>
                                        
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Bottom decorative line -->
                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                <tr>
                                    <td style="padding: 0 25px 20px 25px;">
                                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                            <tr>
                                                <td width="50" style="height: 2px; background: linear-gradient(90deg, #c9a962, transparent);"></td>
                                                <td></td>
                                                <td width="50" style="height: 2px; background: linear-gradient(90deg, transparent, #c9a962);"></td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                        </td>
                    </tr>
                </table>
                
                <!-- Email footer -->
                <p style="text-align: center; color: #555; font-size: 12px; margin-top: 30px; font-family: Arial, sans-serif;">Email này được gửi tự động từ hệ thống RSVP</p>
            </body>
            </html>
        `
    };
    
    // Email to organizer (notification)
    const organizerMailOptions = {
        from: fromEmail,
        to: process.env.ORGANIZER_EMAIL || process.env.EMAIL_USER,
        subject: `📬 Xác nhận tham dự mới từ ${guestName}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Josefin+Sans:wght@300;400&display=swap" rel="stylesheet">
            </head>
            <body style="margin: 0; padding: 40px 20px; background-color: #0a0a0a; font-family: 'Cormorant Garamond', Georgia, serif;">
                <div style="max-width: 500px; margin: 0 auto; background-color: #0d0d0d; border: 1px solid rgba(201, 169, 98, 0.3); box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5); padding: 40px 35px;">
                    
                    <!-- Header -->
                    <div style="text-align: center; margin-bottom: 25px;">
                        <p style="font-family: 'Josefin Sans', Arial, sans-serif; font-size: 11px; letter-spacing: 4px; color: #b8b8b8; margin: 0 0 15px 0;">THÔNG BÁO MỚI</p>
                        <h1 style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 26px; color: #c9a962; margin: 0; font-weight: 500;">🎉 Có người xác nhận tham dự!</h1>
                    </div>
                    
                    <!-- Divider -->
                    <div style="width: 40px; height: 2px; background: linear-gradient(90deg, transparent, #c9a962, transparent); margin: 20px auto;"></div>
                    
                    <!-- Guest Info Box -->
                    <div style="background: rgba(201, 169, 98, 0.08); border: 1px solid rgba(201, 169, 98, 0.2); padding: 25px; margin: 25px 0;">
                        <p style="font-family: 'Josefin Sans', Arial, sans-serif; font-size: 13px; color: #e8e8e8; margin: 0 0 15px 0;">
                            <span style="color: #c9a962; font-weight: bold;">Họ tên:</span><br>
                            <span style="font-size: 18px; color: #ffffff;">${guestName}</span>
                        </p>
                        <p style="font-family: 'Josefin Sans', Arial, sans-serif; font-size: 13px; color: #e8e8e8; margin: 0 0 15px 0;">
                            <span style="color: #c9a962; font-weight: bold;">Email:</span><br>
                            <a href="mailto:${guestEmail}" style="color: #d4d4d4; text-decoration: none;">${guestEmail}</a>
                        </p>
                        <p style="font-family: 'Josefin Sans', Arial, sans-serif; font-size: 13px; color: #e8e8e8; margin: 0 0 15px 0;">
                            <span style="color: #c9a962; font-weight: bold;">Số điện thoại:</span><br>
                            <span style="color: #d4d4d4;">${guestPhone || 'Không cung cấp'}</span>
                        </p>
                        <p style="font-family: 'Josefin Sans', Arial, sans-serif; font-size: 13px; color: #e8e8e8; margin: 0;">
                            <span style="color: #c9a962; font-weight: bold;">Lời nhắn:</span><br>
                            <span style="color: #d4d4d4; font-style: italic;">${message || 'Không có'}</span>
                        </p>
                    </div>
                    
                    <!-- Footer -->
                    <p style="text-align: center; color: #666; font-size: 12px; margin: 25px 0 0 0; font-family: 'Josefin Sans', Arial, sans-serif; letter-spacing: 1px;">Email được gửi tự động từ hệ thống RSVP</p>
                </div>
            </body>
            </html>
        `
    };
    
    try {
        // Send emails via Resend HTTP API
        await sendEmailViaResend(
            guestEmail,
            guestMailOptions.subject,
            guestMailOptions.html
        );
        
        await sendEmailViaResend(
            process.env.ORGANIZER_EMAIL || 'hthin217@gmail.com',
            organizerMailOptions.subject,
            organizerMailOptions.html
        );
        
        console.log(`✅ Emails sent successfully to ${guestEmail}`);
        
        res.json({ 
            success: true, 
            message: 'Xác nhận đã được gửi thành công!' 
        });
        
    } catch (error) {
        console.error('❌ Error sending email:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Có lỗi xảy ra khi gửi email. Vui lòng thử lại.' 
        });
    }
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
    console.log(`📧 Email service: Resend HTTP API`);
});
