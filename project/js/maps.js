// Maps module for ExypnosFinder
// This module handles all map-related functionality including:
// - Initializing the Google Map
// - Getting user's location
// - Finding and displaying nearby charging stations

// Initializes the Google Map in the #map element
// @returns {google.maps.Map} The initialized map object
export function initMap() {
    // Default center (London coordinates as fallback if geolocation fails)
    const defaultCenter = { lat: 51.5074, lng: -0.1278 }; // London coordinates

    // Create map with initial settings
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: defaultCenter,
    });

    // Try to get user's current location using browser's geolocation API
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            // Success callback - user allowed location access
            (position) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                // Center map on user's location
                map.setCenter(userLocation);

                // Add blue marker for user's current location
                new google.maps.Marker({
                    position: userLocation,
                    map: map,
                    title: 'Your Location',
                    icon: {
                        url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                    }
                });

                // Search for nearby charging stations around user's location
                searchNearbyChargingStations(map, userLocation);
            },
            // Error callback - user denied location or error occurred
            () => {
                console.error("Error: The Geolocation service failed.");
                alert("Error: Unable to get your location. Please enable location services.");
            }
        );
    } else {
        // Browser doesn't support geolocation
        alert("Error: Your browser doesn't support geolocation.");
    }
    return map;
}

// Global variables to maintain state across function calls

/**
 * Stores the current map instance to avoid reinitializing the map
 * @type {google.maps.Map|null}
 */
let currentMap = null;

/**
 * Stores all current markers on the map so they can be cleared later
 * @type {Array<google.maps.Marker>}
 */
let currentMarkers = [];

/**
 * Finds the nearest charging station to the user's current location
 * This function is called when the user clicks the "Find Nearest Charger" button
 */
export function findNearestCharger() {
    // Initialize map if it doesn't exist yet
    if (!currentMap) {
        currentMap = initMap();
    }
    
    // Try to get user's current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            // Success callback - user allowed location access
            (position) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                // Center map on user's location and zoom in closer
                currentMap.setCenter(userLocation);
                currentMap.setZoom(14);

                // Clear any existing markers from previous searches
                currentMarkers.forEach(marker => marker.setMap(null));
                currentMarkers = [];

                // Search for nearby stations with a smaller radius (2km) for better relevance
                searchNearbyChargingStations(currentMap, userLocation, 2000); // 2km radius
            },
            // Error callback - user denied location or error occurred
            () => {
                alert("Error: Unable to get your location. Please enable location services.");
            }
        );
    } else {
        // Browser doesn't support geolocation
        alert("Error: Your browser doesn't support geolocation.");
    }

    // Scroll to the map section for better user experience
    const mapSection = document.getElementById('charging-map');
    if (mapSection) {
        mapSection.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Searches for nearby charging stations using the OpenChargeMap API
 * @param {google.maps.Map} map - The Google Map instance to display markers on
 * @param {Object} userLocation - Object containing lat and lng properties of user's location
 * @param {number} radius - Search radius in meters (default: 5000m = 5km)
 */
function searchNearbyChargingStations(map, userLocation, radius = 5000) {
    // Show loading indicator while fetching data
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
        // Create and style loading indicator
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'map-loading';
        loadingDiv.innerHTML = '<p>Loading charging stations...</p>';
        loadingDiv.style.position = 'absolute';
        loadingDiv.style.top = '50%';
        loadingDiv.style.left = '50%';
        loadingDiv.style.transform = 'translate(-50%, -50%)';
        loadingDiv.style.background = 'rgba(255,255,255,0.8)';
        loadingDiv.style.padding = '15px';
        loadingDiv.style.borderRadius = '5px';
        loadingDiv.style.zIndex = '100';
        mapContainer.style.position = 'relative';
        mapContainer.appendChild(loadingDiv);
    }

    // OpenChargeMap API key
    const apiKey = '8088e80c-9c19-40c6-84fc-2f16409ac822'; 
    
    // Fetch charging station data from OpenChargeMap API
    fetch(`https://api.openchargemap.io/v3/poi/?output=json&latitude=${userLocation.lat}&longitude=${userLocation.lng}&distance=${radius}&distanceunit=KM&maxresults=20&key=${apiKey}`)
        .then(response => {
            // Remove loading indicator once response is received
            const loadingDiv = document.getElementById('map-loading');
            if (loadingDiv) loadingDiv.remove();
            
            // Check if response is successful
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(stations => {
            // Handle case when no stations are found
            if (stations.length === 0) {
                alert('No charging stations found in your area. Try increasing the search radius.');
                return;
            }

            // Process each charging station
            stations.forEach(station => {
                // Extract station coordinates
                const position = {
                    lat: station.AddressInfo.Latitude,
                    lng: station.AddressInfo.Longitude
                };

                // Calculate distance from user to this station
                const distance = calculateDistance(
                    userLocation.lat,
                    userLocation.lng,
                    station.AddressInfo.Latitude,
                    station.AddressInfo.Longitude
                );

                // Add green marker for each charging station
                const marker = new google.maps.Marker({
                    position: position,
                    map: map,
                    title: station.AddressInfo.Title,
                    icon: {
                        url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                    }
                });

                // Add info window for each marker
                const infoWindow = new google.maps.InfoWindow({
                    content: `
                        <h3>${station.AddressInfo.Title}</h3>
                        <p>${station.AddressInfo.AddressLine1}</p>
                        <p>Distance: ${distance.toFixed(1)} km</p>
                        <p>Status: ${station.StatusType ? station.StatusType.Title : 'Unknown'}</p>
                        <p>Connector Types: ${getConnectorTypes(station)}</p>
                    `
                });

                marker.addListener('click', () => {
                    infoWindow.open(map, marker);
                });

                currentMarkers.push(marker);
            });

            // Find and highlight the nearest station
            const nearest = findNearestStation(stations, userLocation);
            if (nearest) {
                highlightNearestStation(map, nearest);
            }
        })
        .catch(error => {
            // Remove loading indicator
            const loadingDiv = document.getElementById('map-loading');
            if (loadingDiv) loadingDiv.remove();
            
            console.error('Error fetching charging stations:', error);
            
            // Create error message element
            const mapContainer = document.getElementById('map');
            if (mapContainer) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.innerHTML = `
                    <h3>127.0.0.1:5500 SAYS</h3>
                    <p>Error fetching charging stations. Please try again later.</p>
                    <button onclick="this.parentElement.remove()" class="ok-button">OK</button>
                `;
                errorDiv.style.position = 'absolute';
                errorDiv.style.top = '50%';
                errorDiv.style.left = '50%';
                errorDiv.style.transform = 'translate(-50%, -50%)';
                errorDiv.style.background = '#2d2d3a';
                errorDiv.style.color = 'white';
                errorDiv.style.padding = '20px';
                errorDiv.style.borderRadius = '5px';
                errorDiv.style.zIndex = '100';
                errorDiv.style.textAlign = 'center';
                errorDiv.style.minWidth = '300px';
                
                // Style the OK button
                const style = document.createElement('style');
                style.textContent = `
                    .ok-button {
                        background-color: #e91e63;
                        color: white;
                        border: none;
                        padding: 8px 20px;
                        border-radius: 4px;
                        cursor: pointer;
                        margin-top: 15px;
                    }
                    .ok-button:hover {
                        background-color: #d81b60;
                    }
                `;
                document.head.appendChild(style);
                
                mapContainer.style.position = 'relative';
                mapContainer.appendChild(errorDiv);
            } else {
                alert('Error fetching charging stations. Please try again later.');
            }
        });
}

/**
 * Calculates the distance between two geographic coordinates using the Haversine formula
 * @param {number} lat1 - Latitude of first point in decimal degrees
 * @param {number} lon1 - Longitude of first point in decimal degrees
 * @param {number} lat2 - Latitude of second point in decimal degrees
 * @param {number} lon2 - Longitude of second point in decimal degrees
 * @returns {number} Distance in kilometers
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180; // Convert degrees to radians
    const dLon = (lon2 - lon1) * Math.PI / 180; // Convert degrees to radians
    
    // Haversine formula calculation
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
}

/**
 * Extracts and formats connector types from a charging station object
 * @param {Object} station - Charging station data from OpenChargeMap API
 * @returns {string} Comma-separated list of unique connector types
 */
function getConnectorTypes(station) {
    // Handle case when station has no connection data
    if (!station.Connections || station.Connections.length === 0) {
        return 'Not specified';
    }
    
    // Extract connector types, remove duplicates, and join with commas
    return station.Connections
        .map(conn => conn.ConnectionType.Title) // Extract connector type names
        .filter((type, index, self) => self.indexOf(type) === index) // Remove duplicates
        .join(', '); // Join with commas
}

/**
 * Finds the nearest charging station to the user's location
 * @param {Array} stations - Array of charging station objects from OpenChargeMap API
 * @param {Object} userLocation - Object containing lat and lng properties of user's location
 * @returns {Object|null} Object containing the nearest station and its distance, or null if no stations
 */
function findNearestStation(stations, userLocation) {
    // Use reduce to find the station with minimum distance
    return stations.reduce((nearest, station) => {
        // Calculate distance between user and this station
        const distance = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            station.AddressInfo.Latitude,
            station.AddressInfo.Longitude
        );
        
        // If this is the first station or it's closer than the current nearest
        if (!nearest || distance < nearest.distance) {
            return { station, distance }; // Update nearest station
        }
        return nearest; // Keep current nearest station
    }, null); // Start with null for the first iteration
}

/**
 * Highlights the nearest charging station on the map with a special marker and info window
 * @param {google.maps.Map} map - The Google Map instance
 * @param {Object} nearest - Object containing the nearest station and its distance
 */
function highlightNearestStation(map, nearest) {
    // Extract station position
    const position = {
        lat: nearest.station.AddressInfo.Latitude,
        lng: nearest.station.AddressInfo.Longitude
    };

    // Create a special yellow marker for the nearest station
    const marker = new google.maps.Marker({
        position: position,
        map: map,
        title: `Nearest Station: ${nearest.station.AddressInfo.Title}`,
        icon: {
            url: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
        },
        zIndex: 1000 // Ensure this marker appears above others
    });

    // Create an info window with detailed information about the nearest station
    const infoWindow = new google.maps.InfoWindow({
        content: `
            <h3>🌟 Nearest Station</h3>
            <h4>${nearest.station.AddressInfo.Title}</h4>
            <p>${nearest.station.AddressInfo.AddressLine1}</p>
            <p>Distance: ${nearest.distance.toFixed(1)} km</p>
            <p>Status: ${nearest.station.StatusType ? nearest.station.StatusType.Title : 'Unknown'}</p>
            <p>Connector Types: ${getConnectorTypes(nearest.station)}</p>
        `
    });

    // Open the info window immediately to highlight this station
    infoWindow.open(map, marker);
    // Add marker to global array so it can be cleared later
    currentMarkers.push(marker);
}