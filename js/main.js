/**
 * Claude Builder Club - University of Rwanda
 * Main JavaScript File
 */

(function() {
  'use strict';

  // ===========================================
  // Mobile Navigation Toggle
  // ===========================================
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
      this.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ===========================================
  // FAQ Accordion
  // ===========================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function(item) {
    const question = item.querySelector('.faq-question');

    if (question) {
      question.addEventListener('click', function() {
        // Close other open items
        faqItems.forEach(function(otherItem) {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
          }
        });

        // Toggle current item
        item.classList.toggle('active');
      });
    }
  });

  // ===========================================
  // Project Filter (Projects Page)
  // ===========================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('[data-category]');

  if (filterButtons.length > 0 && projectCards.length > 0) {
    filterButtons.forEach(function(button) {
      button.addEventListener('click', function() {
        const filter = this.getAttribute('data-filter');

        // Update active button
        filterButtons.forEach(function(btn) {
          btn.classList.remove('active');
        });
        this.classList.add('active');

        // Filter projects
        projectCards.forEach(function(card) {
          if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.style.display = '';
            card.style.animation = 'fadeIn 0.3s ease-out';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // ===========================================
  // Smooth Scroll for Anchor Links
  // ===========================================
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');

      if (href !== '#') {
        const target = document.querySelector(href);

        if (target) {
          e.preventDefault();
          const headerHeight = document.querySelector('.header').offsetHeight;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // ===========================================
  // Form Handling
  // ===========================================
  const registrationForm = document.getElementById('registration-form');

  if (registrationForm) {
    registrationForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(this);
      const data = {};

      formData.forEach(function(value, key) {
        if (data[key]) {
          // Handle multiple values (checkboxes)
          if (Array.isArray(data[key])) {
            data[key].push(value);
          } else {
            data[key] = [data[key], value];
          }
        } else {
          data[key] = value;
        }
      });

      // Simple validation
      const requiredFields = ['fullname', 'email', 'phone', 'faculty', 'year'];
      let isValid = true;

      requiredFields.forEach(function(field) {
        const input = document.getElementById(field);
        if (!input.value.trim()) {
          input.style.borderColor = '#ef4444';
          isValid = false;
        } else {
          input.style.borderColor = '';
        }
      });

      if (!isValid) {
        alert('Please fill in all required fields.');
        return;
      }

      // Show success message
      // In production, you would send this data to a server
      const submitButton = this.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;

      submitButton.textContent = 'Submitting...';
      submitButton.disabled = true;

      // Simulate submission (replace with actual API call)
      setTimeout(function() {
        // Create success message
        const successDiv = document.createElement('div');
        successDiv.className = 'alert alert-success';
        successDiv.innerHTML = '<strong>Registration Successful!</strong><br>Thank you for joining Claude Builder Club! You\'ll receive a WhatsApp message within 24 hours with next steps. Welcome to the community!';

        // Replace form with success message
        registrationForm.innerHTML = '';
        registrationForm.appendChild(successDiv);

        // Scroll to message
        successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 1500);
    });
  }

  // ===========================================
  // Add scroll animation class
  // ===========================================
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe cards and sections for fade-in animation
  const animatedElements = document.querySelectorAll('.card, .feature, .stat, .event-card, .project-card, .project-card-large, .team-card, .timeline-item');

  animatedElements.forEach(function(element) {
    element.style.opacity = '0';
    observer.observe(element);
  });

  // ===========================================
  // Header shadow on scroll
  // ===========================================
  const header = document.querySelector('.header');

  if (header) {
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 50) {
        header.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
      } else {
        header.style.boxShadow = '0 1px 2px 0 rgb(0 0 0 / 0.05)';
      }

      lastScroll = currentScroll;
    });
  }

  // ===========================================
  // Active navigation link based on current page
  // ===========================================
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinksAll = document.querySelectorAll('.nav-link');

  navLinksAll.forEach(function(link) {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    } else if (link.classList.contains('active') && href !== currentPage) {
      // Keep the active class only if it's intentionally set in HTML
    }
  });

  // ===========================================
  // Lazy loading images (for future use)
  // ===========================================
  if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(function(img) {
      img.src = img.dataset.src;
    });
  }

  // ===========================================
  // Console welcome message
  // ===========================================
  console.log('%c Claude Builder Club - University of Rwanda ', 'background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 10px 20px; font-size: 16px; font-weight: bold; border-radius: 5px;');
  console.log('Welcome! Interested in learning more? Visit https://claude.ai');

})();
