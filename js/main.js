/**
 * Africa Web3 Institute - Main JavaScript
 * Clean, optimized, and performant
 */

// DOM Content Loaded Handler
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all modules
    initNavigation();
    initScrollEffects();
    initAnimations();
    initFormHandling();
    initPerformanceOptimizations();
    
    console.log('Africa Web3 Institute - Initialized');
});

// Navigation Module
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');
    
    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            navMenu.classList.toggle('active');
            
            // Update hamburger icon
            const icon = this.querySelector('i');
            if (icon) {
                if (navMenu.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }
    
    // Close menu when clicking links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger?.contains(e.target) && !navMenu?.contains(e.target)) {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (!targetId || targetId === "#") return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                
                const navbarHeight = navbar?.offsetHeight || 0;
                const targetPosition = target.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll Effects Module
function initScrollEffects() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    // Throttled scroll handler
    let scrollTimer;
    window.addEventListener('scroll', function() {
        if (!scrollTimer) {
            scrollTimer = setTimeout(() => {
                handleScroll();
                scrollTimer = null;
            }, 16); // ~60fps
        }
    });
    
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add shadow to navbar on scroll
        if (navbar) {
            if (scrollTop > 10) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        
        lastScrollTop = scrollTop;
    }
}

// Animations Module
function initAnimations() {
    // Intersection Observer for fade-in animations
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('loaded');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        const animatedElements = document.querySelectorAll('.card, .publication-item, .event-card');
        animatedElements.forEach(el => {
            el.classList.add('loading');
            observer.observe(el);
        });
    }
    
    // Hero nodes animation
    animateHeroNodes();
}

function animateHeroNodes() {
    const nodes = document.querySelectorAll('.node');
    nodes.forEach((node, index) => {
        // Random positioning
        const container = node.parentElement;
        const containerRect = container.getBoundingClientRect();
        
        const randomX = Math.random() * (containerRect.width - 20);
        const randomY = Math.random() * (containerRect.height - 20);
        
        node.style.left = `${randomX}px`;
        node.style.top = `${randomY}px`;
        
        // Staggered animation
        node.style.animationDelay = `${index * 0.5}s`;
    });
}

// Form Handling Module
function initFormHandling() {
    const form = document.querySelector('#communityForm');
    
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Get form values
    const name = form.querySelector('#name')?.value || '';
    const email = form.querySelector('#email')?.value || '';
    const role = form.querySelector('#role')?.value || '';
    const message = form.querySelector('textarea')?.value || '';
    
    // Validation
    if (!name || !email) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Show loading state
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    
    // Simulate API call
    setTimeout(() => {
        showNotification('Thank you for joining the movement! We\'ll be in touch soon.', 'success');
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        // Log for debugging
        console.log('Form submitted:', { name, email, role, message });
    }, 1500);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '16px 24px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '600',
        zIndex: '10000',
        maxWidth: '350px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    });
    
    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.backgroundColor = '#1F7A3A';
            break;
        case 'error':
            notification.style.backgroundColor = '#DC2626';
            break;
        default:
            notification.style.backgroundColor = '#0D2C7D';
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });
    
    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

// Performance Optimizations Module
function initPerformanceOptimizations() {
    // Debounced resize handler
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            handleResize();
        }, 250);
    });
    
    // Lazy loading for images (if any are added later)
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

function handleResize() {
    // Add responsive classes
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth <= 1024;
    
    document.body.classList.toggle('mobile', isMobile);
    document.body.classList.toggle('tablet', isTablet);
    
    // Re-animate hero nodes on resize
    animateHeroNodes();
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Add CSS for animations dynamically
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    .notification {
        font-family: 'Inter', 'DM Sans', sans-serif;
    }
    
    .loading {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .loaded {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(animationStyles);
