// ===================================
// HEADER SCROLL EFFECT
// ===================================
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  lastScroll = currentScroll;
});

// ===================================
// MOBILE MENU TOGGLE
// ===================================
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const nav = document.getElementById('nav');

if (mobileMenuToggle) {
  mobileMenuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');

    // Animate hamburger icon
    const spans = mobileMenuToggle.querySelectorAll('span');
    if (mobileMenuToggle.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });
}

// ===================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');

    // Ignore empty hashes
    if (href === '#' || href === '#!') {
      e.preventDefault();
      return;
    }

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();

      // Close mobile menu if open
      if (nav && nav.classList.contains('active')) {
        nav.classList.remove('active');
        mobileMenuToggle.classList.remove('active');

        const spans = mobileMenuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }

      const headerHeight = header.offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ===================================
// ACTIVE NAV LINK ON SCROLL
// ===================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveNav() {
  const scrollPos = window.pageYOffset + 100;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');

    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', updateActiveNav);

// ===================================
// AOS (ANIMATE ON SCROLL) - LIGHTWEIGHT VERSION
// ===================================
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('aos-animate');
      // Optionally unobserve after animation
      // observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all elements with data-aos attribute
document.querySelectorAll('[data-aos]').forEach(el => {
  observer.observe(el);
});

// ===================================
// FORM SUBMISSION HANDLING
// ===================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);

    // Show success message (you can replace this with actual form submission)
    showNotification('Thank you! Your message has been sent successfully.', 'success');

    // Reset form
    contactForm.reset();
  });
}

// ===================================
// NOTIFICATION SYSTEM
// ===================================
function showNotification(message, type = 'success') {
  // Remove existing notifications
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
      <span>${message}</span>
    </div>
  `;

  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === 'success' ? '#10b981' : '#ef4444'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    animation: slideIn 0.3s ease-out;
  `;

  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  // Append to body
  document.body.appendChild(notification);

  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 5000);
}

// ===================================
// NEWSLETTER FORM HANDLING
// ===================================
const newsletterForm = document.querySelector('.newsletter-form');

if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const emailInput = newsletterForm.querySelector('input[type="email"]');
    const email = emailInput.value;

    if (email && validateEmail(email)) {
      showNotification('Successfully subscribed to our newsletter!', 'success');
      newsletterForm.reset();
    } else {
      showNotification('Please enter a valid email address.', 'error');
    }
  });
}

// Email validation helper
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// ===================================
// COUNTER ANIMATION FOR STATS
// ===================================
function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = formatNumber(target);
      clearInterval(timer);
    } else {
      element.textContent = formatNumber(Math.floor(current));
    }
  }, 16);
}

function formatNumber(num) {
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K+';
  }
  return num + '+';
}

// Observe stat numbers
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statNumber = entry.target;
      const text = statNumber.textContent;

      // Extract number from text (e.g., "500+" -> 500)
      const match = text.match(/(\d+)/);
      if (match) {
        const target = parseInt(match[1]);
        animateCounter(statNumber, target);
      }

      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(stat => {
  statObserver.observe(stat);
});

// ===================================
// PARALLAX EFFECT FOR HERO GRADIENT ORBS
// ===================================
window.addEventListener('mousemove', (e) => {
  const orbs = document.querySelectorAll('.gradient-orb');
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;

  orbs.forEach((orb, index) => {
    const speed = (index + 1) * 20;
    const xMove = (x - 0.5) * speed;
    const yMove = (y - 0.5) * speed;

    orb.style.transform = `translate(${xMove}px, ${yMove}px)`;
  });
});

// ===================================
// SERVICE CARDS TILT EFFECT
// ===================================
const serviceCards = document.querySelectorAll('.service-card');

serviceCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ===================================
// LAZY LOADING IMAGES
// ===================================
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      }
      imageObserver.unobserve(img);
    }
  });
});

document.querySelectorAll('img[data-src]').forEach(img => {
  imageObserver.observe(img);
});

// ===================================
// PERFORMANCE: REDUCE MOTION FOR USERS WHO PREFER IT
// ===================================
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // Disable animations
  document.querySelectorAll('[data-aos]').forEach(el => {
    el.classList.add('aos-animate');
  });

  // Remove smooth scroll
  document.documentElement.style.scrollBehavior = 'auto';
}

// ===================================
// PAGE LOAD ANIMATION
// ===================================
window.addEventListener('load', () => {
  document.body.classList.add('loaded');

  // Trigger initial animations
  setTimeout(() => {
    const heroElements = document.querySelectorAll('.hero-section [data-aos]');
    heroElements.forEach(el => {
      el.classList.add('aos-animate');
    });
  }, 100);
});

// ===================================
// INTERSECTION OBSERVER FOR SECTIONS
// ===================================
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('section').forEach(section => {
  sectionObserver.observe(section);
});

// ===================================
// COPY TO CLIPBOARD FUNCTIONALITY
// ===================================
function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showNotification('Copied to clipboard!', 'success');
    }).catch(() => {
      showNotification('Failed to copy to clipboard.', 'error');
    });
  } else {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();

    try {
      document.execCommand('copy');
      showNotification('Copied to clipboard!', 'success');
    } catch (err) {
      showNotification('Failed to copy to clipboard.', 'error');
    }

    document.body.removeChild(textarea);
  }
}

// Add click event to email/phone elements if needed
document.querySelectorAll('.contact-text p').forEach(element => {
  const text = element.textContent;
  if (text.includes('@') || text.includes('+')) {
    element.style.cursor = 'pointer';
    element.title = 'Click to copy';

    element.addEventListener('click', () => {
      copyToClipboard(text);
    });
  }
});

// ===================================
// KEYBOARD NAVIGATION ACCESSIBILITY
// ===================================
document.addEventListener('keydown', (e) => {
  // ESC key to close mobile menu
  if (e.key === 'Escape' && nav && nav.classList.contains('active')) {
    nav.classList.remove('active');
    mobileMenuToggle.classList.remove('active');

    const spans = mobileMenuToggle.querySelectorAll('span');
    spans[0].style.transform = 'none';
    spans[1].style.opacity = '1';
    spans[2].style.transform = 'none';
  }
});

// ===================================
// CONSOLE MESSAGE
// ===================================
console.log('%c👋 Welcome to UrbanConnect!', 'color: #667eea; font-size: 20px; font-weight: bold;');
console.log('%cBuilt with modern web technologies', 'color: #64748b; font-size: 14px;');
console.log('%cInterested in working with us? Visit the contact section!', 'color: #ec4899; font-size: 12px;');
