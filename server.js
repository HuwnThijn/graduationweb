const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Email transporter configuration
const transporter = nodemailer.createTransport({
    service: 'gmail', // hoặc 'outlook', 'yahoo', etc.
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // Sử dụng App Password nếu dùng Gmail
    }
});

// API endpoint to send confirmation email
app.post('/api/send-email', async (req, res) => {
    const { guestName, guestEmail, guestPhone, numGuests, message } = req.body;
    
    // Validate required fields
    if (!guestName || !guestEmail) {
        return res.status(400).json({ 
            success: false, 
            message: 'Vui lòng điền đầy đủ thông tin bắt buộc' 
        });
    }
    
    // Email to guest (confirmation)
    const guestMailOptions = {
        from: `"Lễ Tốt Nghiệp 2025" <${process.env.EMAIL_USER}>`,
        to: guestEmail,
        subject: '🎓 Xác nhận tham dự Lễ Tốt Nghiệp',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body {
                        font-family: 'Georgia', serif;
                        background-color: #0d0d0d;
                        color: #ffffff;
                        padding: 40px 20px;
                    }
                    .container {
                        max-width: 500px;
                        margin: 0 auto;
                        background: linear-gradient(145deg, #1a1a1a, #0d0d0d);
                        border: 1px solid rgba(201, 169, 98, 0.3);
                        padding: 50px 40px;
                        text-align: center;
                    }
                    .gold-text {
                        color: #c9a962;
                    }
                    .title {
                        font-size: 28px;
                        color: #c9a962;
                        margin-bottom: 30px;
                    }
                    .content {
                        color: #d4d4d4;
                        line-height: 1.8;
                        font-size: 16px;
                    }
                    .event-info {
                        background: rgba(201, 169, 98, 0.1);
                        padding: 25px;
                        margin: 30px 0;
                        border-left: 3px solid #c9a962;
                        text-align: left;
                    }
                    .event-info p {
                        margin: 10px 0;
                        color: #e8e8e8;
                    }
                    .footer {
                        margin-top: 40px;
                        padding-top: 20px;
                        border-top: 1px solid rgba(201, 169, 98, 0.2);
                        color: #888;
                        font-size: 14px;
                    }
                    .divider {
                        width: 60px;
                        height: 2px;
                        background: linear-gradient(90deg, transparent, #c9a962, transparent);
                        margin: 20px auto;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1 class="title">🎓 Xác Nhận Tham Dự</h1>
                    <div class="divider"></div>
                    
                    <div class="content">
                        <p>Kính gửi <strong class="gold-text">${guestName}</strong>,</p>
                        <p>Cảm ơn bạn đã xác nhận tham dự Lễ Tốt Nghiệp!</p>
                    </div>
                    
                    <div class="event-info">
                        <p><strong class="gold-text">📅 Thời gian:</strong> Thứ Sáu, ngày 09/01/2026, lúc 9:00 sáng</p>
                        <p><strong class="gold-text">📍 Địa điểm:</strong> Thu Duc Campus - Trường Đại học Công Nghệ TP.HCM (HUTECH)</p>
                        <p><strong class="gold-text">🗺️ Địa chỉ:</strong> Phân khu đào tạo E1, Khu Công Nghệ cao TP.HCM, Phường Tăng Nhơn Phú, TP.HCM</p>
                        <p><strong class="gold-text">👥 Số người tham dự:</strong> ${numGuests} người</p>
                    </div>
                    
                    <div class="content">
                        <p>Vui lòng đến trước 15 phút để check-in.</p>
                        <p>Tôi rất mong được đón tiếp bạn!</p>
                    </div>
                    
                    <div class="footer">
                        <p>Trân trọng,</p>
                        <p class="gold-text"><strong>Thái Hưng Thịnh</strong></p>
                        <p>Khóa 2021 - 2025</p>
                        <p>Trường Đại học Công Nghệ TP.HCM (HUTECH)</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };
    
    // Email to organizer (notification)
    const organizerMailOptions = {
        from: `"RSVP System" <${process.env.EMAIL_USER}>`,
        to: process.env.ORGANIZER_EMAIL || process.env.EMAIL_USER,
        subject: `📬 Xác nhận tham dự mới từ ${guestName}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .container { max-width: 500px; margin: 0 auto; }
                    h2 { color: #c9a962; }
                    .info { background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0; }
                    .info p { margin: 10px 0; }
                    .label { font-weight: bold; color: #333; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>🎉 Có người xác nhận tham dự mới!</h2>
                    
                    <div class="info">
                        <p><span class="label">Họ tên:</span> ${guestName}</p>
                        <p><span class="label">Email:</span> ${guestEmail}</p>
                        <p><span class="label">Số điện thoại:</span> ${guestPhone || 'Không cung cấp'}</p>
                        <p><span class="label">Số người tham dự:</span> ${numGuests}</p>
                        <p><span class="label">Lời nhắn:</span> ${message || 'Không có'}</p>
                    </div>
                    
                    <p><em>Email này được gửi tự động từ hệ thống RSVP.</em></p>
                </div>
            </body>
            </html>
        `
    };
    
    try {
        // Send both emails
        await transporter.sendMail(guestMailOptions);
        await transporter.sendMail(organizerMailOptions);
        
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
    console.log(`📧 Email service: ${process.env.EMAIL_USER ? 'Đã cấu hình' : 'Chưa cấu hình'}`);
});
