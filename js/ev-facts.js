// EV Facts Module for ExypnosFinder
// This module provides functionality to display random interesting facts
// about electric vehicles to educate users about EV benefits and statistics.

// Array of interesting facts about electric vehicles in the UK
// These facts cover environmental benefits, infrastructure, costs, and history
const evFacts = [
    "Electric vehicles emit 54% less CO2 than the average new car in the UK.", // Environmental benefit
    "The UK has over 42,000 public charging points across more than 15,500 locations.", // Infrastructure fact
    "The best-selling electric car in the UK is the Tesla Model 3.", // Market fact
    "Electric vehicles have fewer moving parts than conventional cars, resulting in lower maintenance costs.", // Cost benefit
    "The UK government offers grants of up to £2,500 for electric vehicles under £35,000.", // Financial incentive
    "The average EV driver in the UK saves around £1,000 per year on fuel costs compared to petrol/diesel.", // Cost saving
    "The first practical production electric car was built in London by Thomas Parker in 1884.", // Historical fact
    "The UK plans to ban the sale of new petrol and diesel cars by 2030.", // Policy fact
    "Many parking locations in the UK offer free parking for electric vehicles.", // Practical benefit
    "Electric vehicles can be charged at home using a standard 3-pin plug, though dedicated chargers are faster.", // Charging fact
    "The UK's electric vehicle market grew by 186% in 2020 despite the pandemic.", // Market growth
    "An electric vehicle's battery can last between 10-20 years before needing replacement.", // Durability fact
    "Some electric vehicles can accelerate from 0-60mph faster than many supercars.", // Performance fact
    "The UK has more public charging locations than petrol stations.", // Infrastructure comparison
    "Electric vehicles are significantly quieter than conventional cars, reducing noise pollution." // Environmental benefit
];

// Initializes the EV Facts section by selecting and displaying a random fact
// This function is called when the page loads to show a random EV fact
export function initEvFacts() {
    // Get the container element where the fact will be displayed
    const factContainer = document.getElementById('ev-fact-text');
    if (factContainer) {
        // Get a random fact from the array
        const randomFact = getRandomFact();
        // Display the fact in the container
        factContainer.textContent = randomFact;
    }
}

// Returns a random fact from the evFacts array
// Uses Math.random to select a random index from the facts array
// @returns {string} A random EV fact
function getRandomFact() {
    // Generate a random index between 0 and the length of the facts array
    const randomIndex = Math.floor(Math.random() * evFacts.length);
    // Return the fact at the random index
    return evFacts[randomIndex];
}