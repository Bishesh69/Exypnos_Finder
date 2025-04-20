// Navigation Module for ExypnosFinder
// This module handles the responsive navigation menu functionality,
// including mobile menu toggle, scroll effects, and menu interactions.
// It provides a smooth user experience across different device sizes.

// Initialize the navigation functionality
// This is the main entry point for the navigation module
export function initNavigation() {
    // Get references to navigation elements in the DOM
    const mobileMenuButton = document.querySelector('.mobile-menu'); // Hamburger menu button
    const navLinks = document.querySelector('.nav-links'); // Navigation links container
    const header = document.querySelector('.header'); // Header element
    let menuOpen = false; // Track if mobile menu is currently open

    // Add scroll event listener to change header background when scrolling
    // This creates a transparent header at the top and solid background when scrolled
    window.addEventListener('scroll', () => {
        // Add 'scrolled' class when page is scrolled down more than 50px
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            // Remove 'scrolled' class when at the top of the page
            header.classList.remove('scrolled');
        }
        
        // Note: Automatic menu closing on scroll was removed
        // This was causing the white background to disappear when scrolling
    });

    // Add mobile menu functionality if both button and links exist
    if (mobileMenuButton && navLinks) {
        // Add click event listener to the mobile menu button (hamburger icon)
        mobileMenuButton.addEventListener('click', () => {
            // Toggle the mobile menu open/closed state
            toggleMobileMenu();
            // Update the menu state tracking variable
            menuOpen = !menuOpen;
        });
        
        // Add click event listeners to all navigation links
        // This allows the menu to close automatically when a link is clicked on mobile
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                // Only close the menu if we're in mobile view (screen width <= 768px)
                if (window.innerWidth <= 768) {
                    closeMobileMenu();
                    menuOpen = false;
                }
            });
        });

        // Close menu when clicking outside of the menu or button
        // This improves user experience by allowing clicks anywhere to dismiss the menu
        document.addEventListener('click', (event) => {
            // Check if the click was inside the menu or on the menu button
            const isClickInsideMenu = navLinks.contains(event.target);
            const isClickOnMenuButton = mobileMenuButton.contains(event.target);
            
            // If menu is open and click was outside menu and button, close the menu
            if (menuOpen && !isClickInsideMenu && !isClickOnMenuButton) {
                closeMobileMenu();
                menuOpen = false;
            }
        });

        // Handle window resize events to ensure proper menu display
        // This handles transitions between mobile and desktop views
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                // On desktop view:
                // Remove active classes from menu elements
                navLinks.classList.remove('active');
                mobileMenuButton.classList.remove('active');
                // Ensure navigation links are visible on desktop
                navLinks.style.display = 'flex';
                menuOpen = false;
            } else if (!navLinks.classList.contains('active')) {
                // On mobile view, if menu is not active:
                // Hide the navigation links
                navLinks.style.display = 'none';
            }
        });
        
        // Set initial state for mobile devices
        if (window.innerWidth <= 768) {
            navLinks.style.display = 'none';
        }
        
        // Ensure header has correct styling on page load
        // This handles cases where the page is loaded while scrolled down
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        }
    }
}

/**
 * Toggle the mobile menu open/closed state
 * This function handles the visual transition and accessibility aspects
 * of opening and closing the mobile navigation menu
 */
function toggleMobileMenu() {
    // Get references to the required DOM elements
    const navLinks = document.querySelector('.nav-links'); // Navigation links container
    const mobileMenuButton = document.querySelector('.mobile-menu'); // Hamburger button
    const body = document.body; // Body element for controlling scroll
    
    // Check if menu is currently active/open
    if (navLinks.classList.contains('active')) {
        // If menu is open, close it
        closeMobileMenu();
    } else {
        // If menu is closed, open it
        // First make the nav links visible
        navLinks.style.display = 'flex';
        // Force a browser reflow to ensure the transition animation works properly
        // This is needed because we're changing from display:none to display:flex
        navLinks.offsetHeight;
        // Add active classes to trigger CSS transitions
        navLinks.classList.add('active');
        mobileMenuButton.classList.add('active');
        // Prevent page scrolling in background while menu is open
        body.style.overflow = 'hidden'; // Improves mobile UX
    }
}

/**
 * Close the mobile menu with smooth transition
 * This function handles the animation and state changes when closing the menu
 */
function closeMobileMenu() {
    // Get references to the required DOM elements
    const navLinks = document.querySelector('.nav-links'); // Navigation links container
    const mobileMenuButton = document.querySelector('.mobile-menu'); // Hamburger button
    const body = document.body; // Body element for controlling scroll
    
    // Remove active classes to trigger CSS transitions for closing
    navLinks.classList.remove('active');
    mobileMenuButton.classList.remove('active');
    // Re-enable page scrolling
    body.style.overflow = ''; // Restore default overflow behavior
    
    // Wait for the CSS transition to complete before hiding the menu
    // This ensures the closing animation plays fully before hiding the element
    setTimeout(() => {
        navLinks.style.display = 'none';
    }, 400); // 400ms matches the CSS transition duration
}

/**
 * Reset the mobile menu icon to its original state
 * This utility function is used to reset just the icon without affecting the menu
 */
function resetMobileMenuIcon() {
    // Get reference to the mobile menu button
    const mobileMenuButton = document.querySelector('.mobile-menu');
    // Remove the active class to reset its appearance
    mobileMenuButton.classList.remove('active');
}