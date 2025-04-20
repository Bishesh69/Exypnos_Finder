// Video Controls Module for ExypnosFinder
// This module provides functionality for the hero video background controls,
// allowing users to play/pause, mute/unmute, and toggle fullscreen mode.
// It enhances user experience by giving control over the background video.

// Initialize video controls when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get references to the video element and control buttons
    const video = document.getElementById('hero-video'); // The video element
    const playPauseBtn = document.getElementById('play-pause-btn'); // Play/pause button
    const muteBtn = document.getElementById('mute-btn'); // Mute/unmute button
    const fullscreenBtn = document.getElementById('fullscreen-btn'); // Fullscreen toggle button
    
    // Configure video to loop continuously when it reaches the end
    video.loop = true;
    
    // Set initial play/pause button state to show pause icon (||)
    // This is because the video is set to autoplay by default
    playPauseBtn.innerHTML = `
        <svg viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path>
        </svg>
    `;
    
    // Add click event listener for play/pause button
    playPauseBtn.addEventListener('click', () => {
        // Check if video is currently paused
        if (video.paused) {
            // If paused, play the video
            video.play();
            // Change button icon to pause symbol (||)
            playPauseBtn.innerHTML = `
                <svg viewBox="0 0 24 24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path>
                </svg>
            `;
        } else {
            // If playing, pause the video
            video.pause();
            // Change button icon to play symbol (▶)
            playPauseBtn.innerHTML = `
                <svg viewBox="0 0 24 24">
                    <path d="M6 4l12 8-12 8V4z"></path>
                </svg>
            `;
        }
    });
    
    // Add click event listener for mute/unmute button
    muteBtn.addEventListener('click', () => {
        // Toggle the muted state of the video
        video.muted = !video.muted;
        
        // Update button icon based on muted state
        if (video.muted) {
            // If muted, show the muted speaker icon (speaker with X)
            muteBtn.innerHTML = `
                <svg viewBox="0 0 24 24">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"></path>
                </svg>
            `;
        } else {
            // If unmuted, show the speaker icon with sound waves
            muteBtn.innerHTML = `
                <svg viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path>
                </svg>
            `;
        }
    });
    
    // Add click event listener for fullscreen toggle button
    fullscreenBtn.addEventListener('click', () => {
        // Get the hero section element to make it fullscreen
        const heroSection = document.getElementById('home');
        
        // Check if we're currently in fullscreen mode
        if (!document.fullscreenElement) {
            // If not in fullscreen, enter fullscreen mode
            // Using different methods for cross-browser compatibility
            if (heroSection.requestFullscreen) {
                heroSection.requestFullscreen();
            } else if (heroSection.mozRequestFullScreen) { // Firefox
                heroSection.mozRequestFullScreen();
            } else if (heroSection.webkitRequestFullscreen) { // Chrome, Safari and Opera
                heroSection.webkitRequestFullscreen();
            } else if (heroSection.msRequestFullscreen) { // IE/Edge
                heroSection.msRequestFullscreen();
            }
            
            // Update button icon to exit fullscreen icon
            fullscreenBtn.innerHTML = `
                <svg viewBox="0 0 24 24">
                    <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"></path>
                </svg>
            `;
        } else {
            // If in fullscreen, exit fullscreen mode
            // Using different methods for cross-browser compatibility
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            
            // Update button icon to enter fullscreen icon
            fullscreenBtn.innerHTML = `
                <svg viewBox="0 0 24 24">
                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"></path>
                </svg>
            `;
        }
    });
    
    // Add event listener for when video playback ends
    // This is needed because even though the video is set to loop,
    // we still need to update the button state if the loop fails
    video.addEventListener('ended', () => {
        // Change button icon to play symbol (▶) when video ends
        playPauseBtn.innerHTML = `
            <svg viewBox="0 0 24 24">
                <path d="M6 4l12 8-12 8V4z"></path>
            </svg>
        `;
    });
    
    // Add scroll event listener to automatically pause video when scrolled out of view
    // This improves performance and user experience
    window.addEventListener('scroll', () => {
        // Get reference to the hero section
        const heroSection = document.getElementById('home');
        // Get the bottom position of the hero section relative to viewport
        const heroBottom = heroSection.getBoundingClientRect().bottom;
        
        // If user has scrolled past the hero section and video is still playing
        if (heroBottom < 0 && !video.paused) {
            // Pause the video to save resources
            video.pause();
            // Update button icon to play symbol (▶)
            playPauseBtn.innerHTML = `
                <svg viewBox="0 0 24 24">
                    <path d="M6 4l12 8-12 8V4z"></path>
                </svg>
            `;
        }
    });

}); // End of DOMContentLoaded event listener