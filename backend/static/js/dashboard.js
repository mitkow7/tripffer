// Enhanced Dashboard Enhancement Script with Cool Effects
document.addEventListener("DOMContentLoaded", function () {
  // Initialize cool entrance animation
  initializePageEntrance();
  
  // Create dynamic particle system
  createParticleSystem();
  
  // Enhanced statistics cards animation
  animateStatsCards();
  
  // Initialize interactive elements
  initializeInteractiveElements();
  
  // Initialize theme system
  initializeThemeSystem();

  // Initialize charts with real data
  initializeCharts();

  function initializePageEntrance() {
    const body = document.body;
    body.style.opacity = '0';
    body.style.transform = 'scale(0.95)';
    body.style.transition = 'all 1s cubic-bezier(0.23, 1, 0.32, 1)';

    setTimeout(() => {
      body.style.opacity = '1';
      body.style.transform = 'scale(1)';
    }, 100);
    
    // Staggered animation for dashboard cards
    const cards = document.querySelectorAll('.glass-card, .stat-card');
    cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(50px) rotateX(10deg)';
      card.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0) rotateX(0)';
      }, 200 + (index * 100));
    });
  }

  function createParticleSystem() {
    const particleContainer = document.querySelector('.floating-particles') || document.body;
    
    // Create additional floating particles
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 6 + 2}px;
        height: ${Math.random() * 6 + 2}px;
        background: rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2});
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: float ${Math.random() * 10 + 5}s infinite ease-in-out;
        animation-delay: ${Math.random() * 5}s;
        pointer-events: none;
      `;
      particleContainer.appendChild(particle);
    }
  }

  function animateStatsCards() {
    const counters = document.querySelectorAll(".counter");
    
    const animateCounter = (counter) => {
      const target = parseInt(counter.getAttribute("data-target") || counter.textContent.replace(/[^\d.]/g, ''));
      const duration = 2000;
      const increment = target / (duration / 16);
      let current = 0;
      
      const updateCounter = () => {
        current += increment;
        if (current < target) {
          counter.textContent = Math.floor(current);
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
          counter.style.animation = 'pulse 0.5s ease';
        }
      };
      
      updateCounter();
    };
    
    // Intersection Observer for counter animation
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    });
    
    counters.forEach(counter => observer.observe(counter));
  }

  function initializeInteractiveElements() {
    // Enhanced hover effects for cards
    const cards = document.querySelectorAll('.glass-card, .stat-card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-15px) scale(1.02)';
        this.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.3)';
        this.style.filter = 'brightness(1.1)';
      });
      
      card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
        this.style.filter = 'brightness(1)';
      });
    });
    
    // Interactive buttons with ripple effect
    const buttons = document.querySelectorAll('.quick-action-btn');
    buttons.forEach(button => {
      button.addEventListener('click', function(e) {
        const action = this.getAttribute('data-action');
        switch (action) {
          case 'add-user':
            window.location.href = '/admin/accounts/appuser/add/';
            break;
          case 'add-hotel':
            window.location.href = '/admin/hotels/hotel/add/';
            break;
          case 'view-bookings':
            window.location.href = '/admin/hotels/booking/';
            break;
          case 'generate-report':
            alert('Report generation feature coming soon!');
            break;
        }

        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          transform: scale(0);
          animation: ripple 0.6s linear;
          pointer-events: none;
        `;
        
        this.appendChild(ripple);
        setTimeout(() => this.removeChild(ripple), 600);
      });
    });
  }

  function initializeThemeSystem() {
    const themeToggle = document.getElementById('theme-toggle');
    let isDark = localStorage.getItem('dashboard-theme') === 'dark';
    
    function applyTheme() {
      if (isDark) {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
      } else {
        document.body.classList.remove('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
      }
    }
    
    window.toggleTheme = function() {
      isDark = !isDark;
      localStorage.setItem('dashboard-theme', isDark ? 'dark' : 'light');
      applyTheme();
    };
    
    if (themeToggle) {
      themeToggle.addEventListener('click', toggleTheme);
    }
    
    applyTheme();
  }

  function initializeCharts() {
    // Get analytics data from the backend
    const analyticsData = window.dashboardAnalytics || {
      monthly_bookings: { labels: [], data: [] },
      revenue_distribution: { labels: [], data: [] }
    };

    // Bookings Chart
    const bookingsCtx = document.getElementById('bookingsChart');
    if (bookingsCtx) {
      new Chart(bookingsCtx.getContext('2d'), {
        type: 'line',
        data: {
          labels: analyticsData.monthly_bookings.labels,
          datasets: [{
            label: 'Monthly Bookings',
            data: analyticsData.monthly_bookings.data,
            borderColor: 'rgba(59, 130, 246, 1)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: 'white'
              }
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleColor: 'white',
              bodyColor: 'white',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              borderWidth: 1
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: 'white',
                precision: 0
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              }
            },
            x: {
              ticks: {
                color: 'white'
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              }
            }
          }
        }
      });
    }

    // Revenue Distribution Chart
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
      new Chart(revenueCtx.getContext('2d'), {
        type: 'doughnut',
        data: {
          labels: analyticsData.revenue_distribution.labels,
          datasets: [{
            data: analyticsData.revenue_distribution.data,
            backgroundColor: [
              'rgba(16, 185, 129, 0.8)',  // Hotels
              'rgba(245, 158, 11, 0.8)',  // Bookings
              'rgba(139, 92, 246, 0.8)'   // Reviews
            ],
            borderColor: [
              'rgba(16, 185, 129, 1)',
              'rgba(245, 158, 11, 1)',
              'rgba(139, 92, 246, 1)'
            ],
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: 'white'
              }
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleColor: 'white',
              bodyColor: 'white',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              borderWidth: 1,
              callbacks: {
                label: function(context) {
                  return `${context.label}: ${context.raw}%`;
                }
              }
            }
          }
        }
      });
    }
  }

  // Initialize search functionality
  const searchInput = document.querySelector("#dashboard-search");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase();
      const searchableItems = document.querySelectorAll("[data-searchable]");

      searchableItems.forEach((item) => {
        const text = item.textContent.toLowerCase();
        const shouldShow = text.includes(searchTerm);
        item.style.display = shouldShow ? "" : "none";
      });
    });
  }
});

// Add CSS animations
const additionalStyles = document.createElement("style");
additionalStyles.textContent = `
  @keyframes ripple {
    to { transform: scale(4); opacity: 0; }
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  .glass-card {
    will-change: transform;
  }
  
  .quick-action-btn {
    will-change: transform;
    position: relative;
        overflow: hidden;
    }
`;

document.head.appendChild(additionalStyles); 