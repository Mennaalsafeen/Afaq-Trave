// 1. دالة إظهار الرسالة المخصصة (خارج DOMContentLoaded لتعمل في أي وقت)
function showMessage(title, message, redirect = null) {
    const modal = document.getElementById('customModal');
    if (modal) {
        document.getElementById('modalTitle').innerText = title;
        document.getElementById('modalMessage').innerText = message;
        modal.style.display = 'flex';

        if (redirect) {
            modal.dataset.redirect = redirect;
        }
    }
}

// 2. دالة إغلاق الرسالة
function closeModal() {
    const modal = document.getElementById('customModal');
    if (modal) {
        modal.style.display = 'none';
        if (modal.dataset.redirect) {
            window.location.href = modal.dataset.redirect;
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {
    
    // --- الجزء الخاص بحل مشكلة اللون الأزرق (Active Link) ---
    const currentUrl = window.location.href;
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        // نتحقق إذا كان الرابط الحالي ينتهي باسم الملف الموجود في href
        if (currentUrl.endsWith(linkHref) || (linkHref === "index.html" && currentUrl.endsWith("/"))) {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        }
    });

    // --- الجزء الخاص باختيار الباقات والوجهات ---
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        // نطبق الكود فقط على الكروت التي تحتوي على عنوان h3 (الباقات والوجهات)
        const titleElement = card.querySelector('h3');
        if (titleElement) {
            card.addEventListener('click', function() {
                const title = titleElement.innerText;
                // تخزين الاختيار لنقله لصفحة التواصل
                localStorage.setItem('selectedPackage', title);
                // إظهار الرسالة المخصصة بدلاً من alert
                showMessage("اختيار موفق!", `تم اختيار ${title} بنجاح، سنقوم بتوجيهك الآن لتأكيد الطلب.`, "contact.html");
            });
        }
    });

    // --- الجزء الخاص بصفحة التواصل (تعبئة البيانات وإرسال الفورم) ---
    const contactForm = document.querySelector('form');
    if (contactForm) {
        // تعبئة حقل الموضوع تلقائياً إذا كان هناك باقة مختارة
        const savedPackage = localStorage.getItem('selectedPackage');
        const subjectInput = document.querySelector('form input[placeholder*="الموضوع"], form input[placeholder*="موضوع"]');
        
        if (savedPackage && subjectInput) {
            subjectInput.value = "استفسار عن: " + savedPackage;
            localStorage.removeItem('selectedPackage');
        }

        // إظهار رسالة النجاح عند إرسال النموذج
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showMessage("تم الإرسال بنجاح", "الرجاء انتظار الرد خلال 24 ساعة من الطلب.");
            contactForm.reset();
        });
    }
});