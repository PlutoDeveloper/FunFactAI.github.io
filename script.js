// List of weird facts
const facts = [
    "Octopuses have three hearts!",
    "A group of flamingos is called a 'flamboyance.'",
    "Honey never spoils—archeologists found edible honey in Egyptian tombs!",
    "Sloths can hold their breath longer than dolphins.",
    "The shortest war in history lasted 38 minutes."
];

// Pick a random fact each time the page loads
const randomFact = facts[Math.floor(Math.random() * facts.length)];
document.getElementById("fact").innerText = randomFact;