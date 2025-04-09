// Calculator Module for ExypnosFinder
// This module provides functionality to calculate and compare the costs
// of running an electric vehicle versus a petrol vehicle.
// It dynamically creates a form with inputs for vehicle type, annual mileage,
// and electricity cost, then calculates and displays the results.

// Initialize the calculator functionality
// This is the main entry point for the calculator module
export function initCalculator() {
    // Check if the calculator container exists in the DOM
    const calculatorContainer = document.querySelector('.calculator-container');
    if (!calculatorContainer) return; // Exit if container not found

    // Create the calculator form and add it to the container
    createCalculatorForm(calculatorContainer);
}

// Create the calculator form with all input fields and submit button
// @param {HTMLElement} container - The DOM container to add the form to
function createCalculatorForm(container) {
    // Create the main form element
    const form = document.createElement('form');
    form.className = 'calculator-form';
    form.addEventListener('submit', handleCalculatorSubmit);

    // Create vehicle type selection dropdown
    const vehicleGroup = document.createElement('div');
    vehicleGroup.className = 'form-group';
    
    const vehicleLabel = document.createElement('label');
    vehicleLabel.textContent = 'Vehicle Type';
    vehicleLabel.setAttribute('for', 'vehicle-type');
    
    const vehicleSelect = document.createElement('select');
    vehicleSelect.id = 'vehicle-type';
    vehicleSelect.required = true;
    
    // Define vehicle options with their display text and values
    const vehicleOptions = [
        { value: '', text: 'Select a vehicle type', disabled: true, selected: true },
        { value: 'small', text: 'Small (e.g., Nissan Leaf, Mini Electric)' },
        { value: 'medium', text: 'Medium (e.g., Tesla Model 3, VW ID.3)' },
        { value: 'large', text: 'Large (e.g., Tesla Model X, Audi e-tron)' }
    ];
    
    // Create and add option elements to the select dropdown
    vehicleOptions.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        if (option.disabled) optionElement.disabled = true;
        if (option.selected) optionElement.selected = true;
        vehicleSelect.appendChild(optionElement);
    });
    
    // Add label and select to the vehicle group
    vehicleGroup.appendChild(vehicleLabel);
    vehicleGroup.appendChild(vehicleSelect);

    // Create annual mileage input field group
    const mileageGroup = document.createElement('div');
    mileageGroup.className = 'form-group';
    
    const mileageLabel = document.createElement('label');
    mileageLabel.textContent = 'Annual Mileage'; // Label text
    mileageLabel.setAttribute('for', 'annual-mileage'); // Associate with input
    
    // Create number input for annual mileage
    const mileageInput = document.createElement('input');
    mileageInput.type = 'number'; // Numeric input only
    mileageInput.id = 'annual-mileage'; // ID for label association and retrieval
    mileageInput.min = '0'; // Prevent negative values
    mileageInput.required = true; // Make field required
    mileageInput.placeholder = 'e.g., 10000'; // Example value
    
    // Add label and input to the mileage group
    mileageGroup.appendChild(mileageLabel);
    mileageGroup.appendChild(mileageInput);

    // Create electricity cost input field group
    const electricityGroup = document.createElement('div');
    electricityGroup.className = 'form-group';
    
    const electricityLabel = document.createElement('label');
    electricityLabel.textContent = 'Electricity Cost (pence per kWh)'; // Label text
    electricityLabel.setAttribute('for', 'electricity-cost'); // Associate with input
    
    // Create number input for electricity cost
    const electricityInput = document.createElement('input');
    electricityInput.type = 'number'; // Numeric input only
    electricityInput.id = 'electricity-cost'; // ID for label association and retrieval
    electricityInput.min = '0'; // Prevent negative values
    electricityInput.step = '0.01'; // Allow decimal values with 2 decimal places
    electricityInput.required = true; // Make field required
    electricityInput.placeholder = 'e.g., 15'; // Example value
    electricityInput.value = '15'; // Default value (15p per kWh)
    
    // Add label and input to the electricity group
    electricityGroup.appendChild(electricityLabel);
    electricityGroup.appendChild(electricityInput);

    // Create submit button for the form
    const calculateButton = document.createElement('button');
    calculateButton.type = 'submit'; // Make it a submit button
    calculateButton.className = 'calculate-button'; // CSS class for styling
    calculateButton.textContent = 'Calculate Savings'; // Button text

    // Create container for displaying calculation results
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'result-container'; // CSS class for styling
    resultsContainer.style.display = 'none'; // Initially hidden until results are available

    // Add all form elements to the form in the correct order
    form.appendChild(vehicleGroup);
    form.appendChild(mileageGroup);
    form.appendChild(electricityGroup);
    form.appendChild(calculateButton);

    // Add the form and results container to the main container
    container.appendChild(form);
    container.appendChild(resultsContainer);
}

/**
 * Handle calculator form submission
 * This function is called when the user submits the calculator form
 * @param {Event} event - The form submission event
 */
function handleCalculatorSubmit(event) {
    // Prevent the default form submission behavior (page reload)
    event.preventDefault();
    
    // Get and parse form values from input fields
    const vehicleType = document.getElementById('vehicle-type').value;
    const annualMileage = parseFloat(document.getElementById('annual-mileage').value);
    const electricityCost = parseFloat(document.getElementById('electricity-cost').value);
    
    // Validate all inputs to ensure they contain valid values
    if (!vehicleType || isNaN(annualMileage) || isNaN(electricityCost)) {
        alert('Please fill in all fields with valid values');
        return; // Exit function if validation fails
    }
    
    // Calculate costs and savings based on the input values
    const results = calculateCostsAndSavings(vehicleType, annualMileage, electricityCost);
    
    // Display the calculation results to the user
    displayResults(results);
}

/**
 * Calculate costs and savings based on user inputs
 * This function performs all the calculations to compare EV vs petrol costs
 * @param {string} vehicleType - The type of vehicle (small, medium, large)
 * @param {number} annualMileage - Annual mileage driven
 * @param {number} electricityCost - Electricity cost per kWh in pence
 * @returns {Object} - Object containing all calculation results formatted to 2 decimal places
 */
function calculateCostsAndSavings(vehicleType, annualMileage, electricityCost) {
    // Vehicle efficiency data (miles per kWh) for different EV sizes
    // These values represent average efficiency for each vehicle category
    const efficiencyData = {
        small: 4.0,  // Small EV: 4 miles per kWh (e.g., Nissan Leaf)
        medium: 3.5, // Medium EV: 3.5 miles per kWh (e.g., Tesla Model 3)
        large: 2.8   // Large EV: 2.8 miles per kWh (e.g., Tesla Model X)
    };
    
    // Average petrol costs in pounds per mile
    // This is an average value for a typical petrol car in the UK
    const petrolCostPerMile = 0.15; // £0.15 per mile
    
    // Calculate EV electricity consumption and costs
    const efficiency = efficiencyData[vehicleType]; // Get efficiency for selected vehicle type
    const totalKwh = annualMileage / efficiency; // Calculate total kWh needed per year
    const evAnnualCost = totalKwh * electricityCost / 100; // Convert pence to pounds
    
    // Calculate equivalent petrol costs for comparison
    const petrolAnnualCost = annualMileage * petrolCostPerMile;
    
    // Calculate financial and environmental savings
    const annualSavings = petrolAnnualCost - evAnnualCost; // Money saved per year
    const co2Savings = annualMileage * 0.12; // Approx 120g CO2 saved per mile
    
    // Return formatted results object with all values rounded to 2 decimal places
    return {
        annualSavings: annualSavings.toFixed(2), // Annual savings in pounds
        evAnnualCost: evAnnualCost.toFixed(2), // Annual EV charging cost in pounds
        petrolAnnualCost: petrolAnnualCost.toFixed(2), // Annual petrol cost in pounds
        co2Savings: (co2Savings / 1000).toFixed(2), // CO2 savings in kg (converted from g)
        totalKwh: totalKwh.toFixed(2) // Total electricity used in kWh
    };
}

/**
 * Display calculation results to the user
 * This function creates and displays the calculation results in a formatted way
 * @param {Object} results - Object containing all calculation results
 */
function displayResults(results) {
    // Get the results container element
    const resultsContainer = document.querySelector('.result-container');
    if (!resultsContainer) return; // Exit if container not found
    
    // Make the results container visible
    resultsContainer.style.display = 'block';
    
    // Clear any previous results to avoid duplication
    resultsContainer.innerHTML = '';
    
    // Define the result items to display with their labels and formatted values
    const resultItems = [
        { label: 'Annual Savings', value: `£${results.annualSavings}` }, // Money saved per year
        { label: 'Annual EV Charging Cost', value: `£${results.evAnnualCost}` }, // Cost of charging the EV
        { label: 'Annual Petrol Cost', value: `£${results.petrolAnnualCost}` }, // Equivalent petrol cost
        { label: 'Annual CO2 Savings', value: `${results.co2Savings} kg` }, // Environmental benefit
        { label: 'Annual Electricity Usage', value: `${results.totalKwh} kWh` } // Total electricity consumed
    ];
    
    // Create and add each result item to the container
    resultItems.forEach(item => {
        // Create container for this result item
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        
        // Create label element
        const resultLabel = document.createElement('div');
        resultLabel.className = 'result-label';
        resultLabel.textContent = item.label;
        
        // Create value element
        const resultValue = document.createElement('div');
        resultValue.className = 'result-value';
        resultValue.textContent = item.value;
        
        // Add label and value to the result item
        resultItem.appendChild(resultLabel);
        resultItem.appendChild(resultValue);
        
        // Add the complete result item to the results container
        resultsContainer.appendChild(resultItem);
    });
}