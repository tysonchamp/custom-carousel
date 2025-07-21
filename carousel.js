/**
 * ProductCarousel - A reusable carousel component
 */
class ProductCarousel {
    /**
     * Create a new carousel instance
     * @param {string} containerId - The ID of the container element
     * @param {Object} options - Configuration options
     */
    constructor(containerId, options = {}) {
        // Default configuration
        this.config = {
            breakpoints: {
                large: 1000,  // Show 4 slides when width >= 1000px
                medium: 780,   // Show 2 slides when width >= 780px and < 1000px
                small: 480     // Show 1 slide when width < 480px
            },
            slidesToShow: {
                large: 4,
                medium: 2,
                small: 1
            },
            autoScroll: true,  // Enable/disable auto scrolling
            autoScrollInterval: 3000  // Time between slides in milliseconds
        };
        
        // Override defaults with provided options
        this.config = {...this.config, ...options};
        
        // Get container element
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container with ID "${containerId}" not found`);
            return;
        }
        
        // Get carousel element
        this.carousel = this.container.querySelector('.product-carousel');
        if (!this.carousel) {
            console.error(`Carousel element not found in container "${containerId}"`);
            return;
        }
        
        // Store original slides
        this.originalSlides = Array.from(this.carousel.children);
        this.currentIndex = 0;
        this.autoScrollInterval = null;
        
        // Initialize the carousel
        this.init();
    }
    
    /**
     * Initialize the carousel
     */
    init() {
        this.setupInfiniteCarousel();
        this.updateSlideWidths();
        this.updateSlides();
        this.setupEventListeners();
        
        if (this.config.autoScroll) {
            this.startAutoScroll();
        }
    }
    
    /**
     * Setup infinite carousel by cloning slides
     */
    setupInfiniteCarousel() {
        // Get the number of slides to show based on current screen size
        const slidesToShow = this.getSlidesToShow();
        
        // Remove any previously cloned slides
        const existingClones = this.carousel.querySelectorAll('.slide-clone');
        existingClones.forEach(clone => clone.remove());
        
        // Clone the first few slides and append them to the end
        for (let i = 0; i < slidesToShow; i++) {
            const clone = this.originalSlides[i % this.originalSlides.length].cloneNode(true);
            clone.classList.add('slide-clone');
            this.carousel.appendChild(clone);
        }
    }
    
    /**
     * Get all slides including clones
     */
    getSlides() {
        return this.carousel.children;
    }
    
    /**
     * Determine how many slides to show based on screen width
     */
    getSlidesToShow() {
        const width = window.innerWidth;
        if (width >= this.config.breakpoints.large) {
            return this.config.slidesToShow.large;
        } else if (width >= this.config.breakpoints.medium) {
            return this.config.slidesToShow.medium;
        } else if (width >= this.config.breakpoints.small) {
            return this.config.slidesToShow.medium; // Show 2 slides
        } else {
            return this.config.slidesToShow.small; // Show 1 slide
        }
    }
    
    /**
     * Update slide widths based on how many to show
     */
    updateSlideWidths() {
        const slidesToShow = this.getSlidesToShow();
        const slideWidth = 100 / slidesToShow;
        
        const allSlides = this.getSlides();
        for (let i = 0; i < allSlides.length; i++) {
            allSlides[i].style.minWidth = `calc(${slideWidth}% - 10px)`;
        }
    }
    
    /**
     * Update which slides are visible
     */
    updateSlides() {
        const slidesToShow = this.getSlidesToShow();
        const allSlides = this.getSlides();
        
        for (let i = 0; i < allSlides.length; i++) {
            allSlides[i].classList.remove('active-slide');
            allSlides[i].classList.add('hide-slide');
        }
        
        for (let i = 0; i < Math.min(slidesToShow, allSlides.length); i++) {
            allSlides[(this.currentIndex + i) % allSlides.length].classList.add('active-slide');
            allSlides[(this.currentIndex + i) % allSlides.length].classList.remove('hide-slide');
        }
    }
    
    /**
     * Move to the next slide
     */
    nextSlide() {
        this.currentIndex++;
        // Handle wrapping around to the first slide
        if (this.currentIndex >= this.originalSlides.length) {
            this.currentIndex = 0;
        }
        this.updateSlides();
        this.animateSlides('next');
    }
    
    /**
     * Move to the previous slide
     */
    prevSlide() {
        this.currentIndex--;
        // Handle wrapping around to the last slide
        if (this.currentIndex < 0) {
            this.currentIndex = this.originalSlides.length - 1;
        }
        this.updateSlides();
        this.animateSlides('prev');
    }
    
    /**
     * Animate slide transitions
     */
    animateSlides(direction) {
        // Get all active slides
        const activeSlides = this.carousel.querySelectorAll('.active-slide');
        
        // Remove any existing animation classes
        activeSlides.forEach(slide => {
            slide.classList.remove('slide-animation-next', 'slide-animation-prev');
            
            // Trigger reflow to restart animation
            void slide.offsetWidth;
            
            // Add animation class based on direction
            if (direction === 'next') {
                slide.classList.add('slide-animation-next');
            } else {
                slide.classList.add('slide-animation-prev');
            }
        });
    }
    
    /**
     * Start auto scrolling if enabled in config
     */
    startAutoScroll() {
        if (this.config.autoScroll) {
            this.stopAutoScroll(); // Clear any existing interval
            this.autoScrollInterval = setInterval(() => {
                this.nextSlide();
            }, this.config.autoScrollInterval);
        }
    }
    
    /**
     * Stop auto scrolling
     */
    stopAutoScroll() {
        if (this.autoScrollInterval) {
            clearInterval(this.autoScrollInterval);
        }
    }
    
    /**
     * Setup event listeners for the carousel
     */
    setupEventListeners() {
        // Handle window resize
        window.addEventListener('resize', () => {
            this.setupInfiniteCarousel();
            this.updateSlideWidths();
            this.updateSlides();
        });
        
        // Pause auto scroll on hover
        this.carousel.addEventListener('mouseenter', () => {
            this.stopAutoScroll();
        });
        
        // Resume auto scroll on mouse leave
        this.carousel.addEventListener('mouseleave', () => {
            if (this.config.autoScroll) {
                this.startAutoScroll();
            }
        });
        
        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') this.nextSlide();
            else if (e.key === 'ArrowLeft') this.prevSlide();
        });
        
        // Add touch support for mobile
        let touchStartX = 0;
        
        this.carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });
        
        this.carousel.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const diffX = touchEndX - touchStartX;
            
            if (diffX > 50) this.prevSlide();
            else if (diffX < -50) this.nextSlide();
        });
    }
}

// Initialize carousels when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Find all carousel containers with data-carousel attribute
    const carouselContainers = document.querySelectorAll('[data-carousel]');
    
    // Initialize each carousel with its ID and any custom options
    carouselContainers.forEach(container => {
        const id = container.id;
        
        // Get custom options from data attributes if available
        const autoScroll = container.dataset.autoScroll === 'false' ? false : true;
        const autoScrollInterval = parseInt(container.dataset.interval) || 3000;
        
        // Create carousel instance
        new ProductCarousel(id, {
            autoScroll,
            autoScrollInterval
        });
    });
});