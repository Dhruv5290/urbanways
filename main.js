// Header scroll effect
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Portfolio Carousel - Premium Multi-Card Design
const portfolioTrack = document.getElementById('portfolioTrack');
const portfolioDots = document.querySelectorAll('.portfolio-dot');
const prevButton = document.getElementById('prevSlide');
const nextButton = document.getElementById('nextSlide');
const progressBar = document.getElementById('progressBar');
const portfolioCards = document.querySelectorAll('.portfolio-card');

let currentIndex = 0;
let isTransitioning = false;
let autoplayTimer;
const totalCards = portfolioCards.length;

// Get cards per view based on screen size
function getCardsPerView() {
  if (window.innerWidth <= 768) return 1;
  if (window.innerWidth <= 1024) return 2;
  return 3;
}

// Calculate maximum index (total cards - 1)
function getMaxIndex() {
  return totalCards - 1;
}

// Update carousel position
function updateCarousel(instant = false) {
  if (isTransitioning && !instant) return;
  
  isTransitioning = true;
  
  const maxIndex = getMaxIndex();
  
  // Clamp index to valid range
  if (currentIndex < 0) currentIndex = 0;
  if (currentIndex > maxIndex) currentIndex = maxIndex;
  
  // Calculate offset
  const cardWidth = portfolioCards[0].offsetWidth;
  const gap = window.innerWidth <= 768 ? 20 : (window.innerWidth <= 1024 ? 30 : 40);
  const offset = currentIndex * (cardWidth + gap);
  
  // Apply transform
  if (instant) {
    portfolioTrack.style.transition = 'none';
  } else {
    portfolioTrack.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  }
  
  portfolioTrack.style.transform = `translateX(-${offset}px)`;
  
  // Update dots - each dot represents one card
  portfolioDots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentIndex);
  });
  
  // Update progress bar - smooth gradient across all slides
  const progressPercentage = ((currentIndex + 1) / totalCards) * 100;
  progressBar.style.width = `${progressPercentage}%`;
  
  setTimeout(() => {
    isTransitioning = false;
  }, instant ? 0 : 800);
}

// Navigate to specific slide
function goToSlide(index) {
  if (index >= 0 && index < totalCards) {
    currentIndex = index;
    updateCarousel();
    resetAutoplay();
  }
}

// Previous slide
function prevSlide() {
  if (currentIndex > 0) {
    currentIndex--;
    updateCarousel();
    resetAutoplay();
  }
}

// Next slide
function nextSlide() {
  if (currentIndex < getMaxIndex()) {
    currentIndex++;
    updateCarousel();
    resetAutoplay();
  }
}

// Dot navigation - click any dot to go to that card
portfolioDots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    goToSlide(index);
  });
});

// Button navigation
prevButton.addEventListener('click', prevSlide);
nextButton.addEventListener('click', nextSlide);

// Card click - go to next slide
portfolioCards.forEach((card) => {
  card.addEventListener('click', () => {
    nextSlide();
  });
});

// Autoplay
function startAutoplay() {
  autoplayTimer = setInterval(() => {
    if (currentIndex < getMaxIndex()) {
      nextSlide();
    } else {
      // Loop back to start
      currentIndex = 0;
      updateCarousel();
    }
  }, 4000);
}

function resetAutoplay() {
  clearInterval(autoplayTimer);
  startAutoplay();
}

// Pause on hover
const carouselContainer = document.querySelector('.portfolio-carousel-container');
carouselContainer.addEventListener('mouseenter', () => {
  clearInterval(autoplayTimer);
});

carouselContainer.addEventListener('mouseleave', () => {
  startAutoplay();
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    prevSlide();
  } else if (e.key === 'ArrowRight') {
    nextSlide();
  }
});

// Touch swipe
let touchStartX = 0;
let touchEndX = 0;

portfolioTrack.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

portfolioTrack.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
}, { passive: true });

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      nextSlide();
    } else {
      prevSlide();
    }
  }
}

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    updateCarousel(true);
  }, 250);
});

// Initialize
updateCarousel(true);
startAutoplay();

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Update active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.pageYOffset >= sectionTop - 200) {
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

// Intersection Observer for premium fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe all premium animation elements
document.querySelectorAll('[class*="premium-fade"]').forEach(el => {
  observer.observe(el);
});