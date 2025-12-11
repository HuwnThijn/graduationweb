// Modal Functions
function openRSVPModal() {
    document.getElementById('rsvpModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeRSVPModal() {
    document.getElementById('rsvpModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    document.getElementById('rsvpForm').reset();
}

function closeSuccessModal() {
    document.getElementById('successModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const rsvpModal = document.getElementById('rsvpModal');
    const successModal = document.getElementById('successModal');
    
    if (event.target === rsvpModal) {
        closeRSVPModal();
    }
    if (event.target === successModal) {
        closeSuccessModal();
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeRSVPModal();
        closeSuccessModal();
    }
});

// Form submission
async function submitRSVP(event) {
    event.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnLoader = document.getElementById('btnLoader');
    
    // Get form data
    const formData = {
        guestName: document.getElementById('guestName').value,
        guestEmail: document.getElementById('guestEmail').value,
        guestPhone: document.getElementById('guestPhone').value,
        message: document.getElementById('message').value
    };
    
    // Show loading state
    submitBtn.disabled = true;
    btnText.textContent = 'ĐANG GỬI...';
    btnLoader.classList.remove('hidden');
    
    try {
        // Send email using EmailJS or similar service
        await sendConfirmationEmail(formData);
        
        // Close RSVP modal and show success modal
        closeRSVPModal();
        document.getElementById('successModal').style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
    } catch (error) {
        console.error('Error:', error);
        alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        btnText.textContent = 'GỬI XÁC NHẬN';
        btnLoader.classList.add('hidden');
    }
}

// Email sending function - Gọi API backend
async function sendConfirmationEmail(data) {
    const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    
    const result = await response.json();
    
    if (!response.ok || !result.success) {
        throw new Error(result.message || 'Gửi email thất bại');
    }
    
    return result;
}

// ============================================
// EMAILJS SETUP INSTRUCTIONS
// ============================================
/*
Để kích hoạt tính năng gửi email thực tế, làm theo các bước sau:

1. Đăng ký tài khoản tại https://www.emailjs.com/ (miễn phí 200 email/tháng)

2. Thêm Email Service (Gmail, Outlook, etc.)
   - Vào Dashboard > Email Services > Add New Service
   - Chọn nhà cung cấp email và kết nối tài khoản

3. Tạo Email Template
   - Vào Dashboard > Email Templates > Create New Template
   - Thiết kế template với các biến như:
     {{to_name}}, {{to_email}}, {{guest_count}}, {{message}}, etc.

4. Lấy credentials:
   - Public Key: Account > General
   - Service ID: Email Services > Your Service
   - Template ID: Email Templates > Your Template

5. Thêm EmailJS SDK vào HTML:
   <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>

6. Uncomment và cập nhật code trong hàm sendConfirmationEmail() với credentials của bạn

*/

// Alternative: Using Formspree (simpler setup)
/*
1. Đăng ký tại https://formspree.io/
2. Tạo form mới và lấy form ID
3. Thay thế hàm sendConfirmationEmail:

async function sendConfirmationEmail(data) {
    return fetch("https://formspree.io/f/YOUR_FORM_ID", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: data.guestName,
            email: data.guestEmail,
            phone: data.guestPhone,
            guests: data.numGuests,
            message: data.message
        })
    });
}
*/
