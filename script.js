// Intersection Observer for Scroll Animations
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Observe timeline items separately for staggered animation
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.2}s`;
        observer.observe(item);
    });
    
    // Observe expertise cards for staggered animation
    const expertiseCards = document.querySelectorAll('.expertise-card');
    expertiseCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        card.style.transitionDelay = `${index * 0.15}s`;
        
        observer.observe(card);
    });
}

// Smooth Scroll for Navigation
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                // Close mobile menu if open
                const navMenu = document.querySelector('.nav-menu');
                navMenu.classList.remove('active');
                
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Mobile Menu Toggle
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    }
}

// Navbar Scroll Effect
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Active Nav Link on Scroll
function initActiveNavLink() {
    const sections = document.querySelectorAll('.section, .header');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Enhanced Card Interactions
function initCardInteractions() {
    const expertiseCards = document.querySelectorAll('.expertise-card');
    const timelineItems = document.querySelectorAll('.timeline-item');
    const projectItems = document.querySelectorAll('.project-item');
    
    // Add smooth transitions to all interactive elements
    [...expertiseCards, ...timelineItems, ...projectItems].forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        });
    });
    
    // Add hover effect to tech badges
    const techBadges = document.querySelectorAll('.tech-badge');
    techBadges.forEach(badge => {
        badge.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });
}

// Keyboard Navigation
function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        const sections = Array.from(document.querySelectorAll('.section, .header'));
        const currentSection = sections.find(section => {
            const rect = section.getBoundingClientRect();
            return rect.top >= 0 && rect.top < window.innerHeight / 2;
        });
        
        if (currentSection) {
            const currentIndex = sections.indexOf(currentSection);
            
            // Arrow Down - Next section
            if (e.key === 'ArrowDown' && currentIndex < sections.length - 1) {
                e.preventDefault();
                sections[currentIndex + 1].scrollIntoView({ behavior: 'smooth' });
            }
            
            // Arrow Up - Previous section
            if (e.key === 'ArrowUp' && currentIndex > 0) {
                e.preventDefault();
                sections[currentIndex - 1].scrollIntoView({ behavior: 'smooth' });
            }
        }
        
        // Home key - Scroll to top
        if (e.key === 'Home') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        // End key - Scroll to bottom
        if (e.key === 'End') {
            e.preventDefault();
            window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
        }
    });
}

// Lazy Load Images
function initLazyLoading() {
    const images = document.querySelectorAll('img[src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// Update Copyright Year
function updateCopyright() {
    const copyrightElements = document.querySelectorAll('[data-year]');
    const currentYear = new Date().getFullYear();
    
    copyrightElements.forEach(el => {
        el.textContent = el.textContent.replace(/\d{4}/, currentYear);
    });
}

// Contact Form Submission
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form button and show loading state
            const submitBtn = form.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Get form data
            const formData = new FormData(form);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);
            
            // Debug logging
            console.log('Form submission started...');
            console.log('Form data:', object);
            
            try {
                // Submit to Web3Forms API
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: json
                });
                
                const result = await response.json();
                console.log('Response:', result);
                
                if (result.success) {
                    console.log('✅ Form submitted successfully!');
                    // Show success modal
                    showSuccessModal();
                    // Reset form
                    form.reset();
                } else {
                    console.error('❌ Form submission failed:', result);
                    throw new Error(result.message || 'Form submission failed');
                }
            } catch (error) {
                console.error('❌ Error:', error);
                alert('Oops! There was a problem sending your message.\n\nPlease either:\n1. Setup Web3Forms (see instructions above form)\n2. Or email directly: prem.pagare2000@gmail.com\n\nError: ' + error.message);
            } finally {
                // Restore button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

// Show Success Modal
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

// Close Modal Function (called from HTML button)
function closeModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// Check for success parameter in URL (for external form services)
function checkSuccessParameter() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
        showSuccessModal();
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('successModal');
    if (event.target === modal) {
        closeModal();
    }
});

// Close modal with Escape key
window.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Initialize all functions when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Core functionality
    initIntersectionObserver();
    initSmoothScroll();
    initMobileMenu();
    initNavbarScroll();
    initActiveNavLink();
    
    // Enhanced interactions
    initCardInteractions();
    initKeyboardNavigation();
    initLazyLoading();
    
    // Contact Form
    initContactForm();
    
    // Utilities
    updateCopyright();
    
    // Check for success parameter in URL
    checkSuccessParameter();
    
    console.log('🚀 Modern Portfolio 2025 loaded successfully!');
});

// Resize handler for responsive behavior
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        console.log('Window resized, layout adjusted');
    }, 250);
});

// Performance optimization for animations
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.body.style.scrollBehavior = 'auto';
    console.log('Reduced motion enabled');
}
