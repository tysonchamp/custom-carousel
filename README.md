# Reusable Product Carousel

A lightweight, responsive, and reusable product carousel component.

## Features

- Responsive design that adapts to different screen sizes
- Configurable number of slides to show at different breakpoints
- Auto-scrolling with configurable interval
- Touch support for mobile devices
- Keyboard navigation
- Smooth animations
- Infinite scrolling

## How to Use

### 1. Include the CSS and JavaScript files

```html
<link rel="stylesheet" href="carousel.css">
<script src="carousel.js"></script>
```

### 2. Create your carousel HTML structure

```html
<div class="product-carousel-container" id="yourCarouselId" data-carousel>
    <div class="product-carousel">
        <!-- Slide 1 -->
        <div class="slide">
            <img src="image1.jpg" alt="Product Image 1">
            <div class="overlay">
                <h2>Product Title 1</h2>
                <p>Description of Product 1</p>
            </div>
        </div>
        <!-- Add more slides as needed -->
    </div>
</div>
```

### 3. Customize with data attributes

You can customize the carousel behavior using data attributes:

- `data-carousel`: Required to initialize the carousel
- `data-auto-scroll="false"`: Disable auto-scrolling (default is true)
- `data-interval="5000"`: Set the auto-scroll interval in milliseconds (default is 3000)

Example:
```html
<div class="product-carousel-container" id="customCarousel" data-carousel data-auto-scroll="false" data-interval="5000">
    <!-- Carousel content -->
</div>
```

### 4. Advanced Customization

For more advanced customization, you can create a carousel instance manually:

```javascript
document.addEventListener('DOMContentLoaded', function() {
    const myCarousel = new ProductCarousel('yourCarouselId', {
        autoScroll: true,
        autoScrollInterval: 3000,
        breakpoints: {
            large: 1200,
            medium: 800,
            small: 500
        },
        slidesToShow: {
            large: 4,
            medium: 3,
            small: 1
        }
    });
});
```

## Browser Support

This carousel works in all modern browsers that support ES6 features.