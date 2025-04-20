// Main JavaScript file for ExypnosFinder
// This is the entry point for the application that imports all modules
// and initializes the components when the DOM is fully loaded.
// It coordinates the different features of the application.

// Import all required modules
import './video-controls.js'; // Video background controls (auto-initializes)
import { findNearestCharger } from './maps.js'; // Function to find nearest charging station
import { initCalculator } from './calculator.js'; // Calculator initialization function
import { initNavigation } from './navigation.js'; // Navigation menu initialization
import { initMap } from './maps.js'; // Map initialization function
import { initEvFacts } from './ev-facts.js'; // EV facts initialization function

// Initialize all components when DOM content is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the navigation menu (mobile menu, scroll effects)
    initNavigation();

    // Initialize the Google Map with default location
    initMap();

    // Initialize the EV cost calculator form and functionality
    initCalculator();
    
    // Initialize the random EV facts display
    initEvFacts();
    
    // No animations as per project requirement

    // Add event listener for the main Call-to-Action button in the hero section
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            // When CTA button is clicked, find the nearest charging station
            findNearestCharger();
        });
    }
});