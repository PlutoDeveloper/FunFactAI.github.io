function fetchNewFact() {
    // Show a loading message while fetching
    document.getElementById("fact").innerText = "Fetching a weird fact...";

    // Fetch a random fact from the API
    fetch("https://uselessfacts.jsph.pl/random.json?language=en")
        .then(response => response.json())
        .then(data => {
            // Display the fact
            document.getElementById("fact").innerText = data.text;
        })
        .catch(error => {
            // If something goes wrong, show an error message
            document.getElementById("fact").innerText = "Oops! Couldn't fetch a fact. Try again!";
            console.error("Error fetching fact:", error);
        });
}

// Load a fact when the page first opens
fetchNewFact();