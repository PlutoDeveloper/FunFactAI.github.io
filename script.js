function fetchNewFact() {
    const factBox = document.getElementById("fact");
    const refreshBtn = document.getElementById("refreshBtn");
    const imageLink = document.getElementById("imageLink");

    // Add spinning animation and disable button
    factBox.classList.add("spinning");
    refreshBtn.disabled = true;
    factBox.innerText = "Fetching a weird fact...";
    imageLink.style.display = "none"; // Hide link while loading

    // Fetch from API
    fetch("https://uselessfacts.jsph.pl/random.json?language=en")
        .then(response => response.json())
        .then(data => {
            // Stop spinning, show fact, re-enable button
            factBox.classList.remove("spinning");
            factBox.innerText = data.text;
            refreshBtn.disabled = false;

            // Store the fact and generate image link
            window.currentFact = data.text;
            const keyword = extractKeyword(data.text);
            const googleImageUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(keyword)}`;
            imageLink.href = googleImageUrl;
            imageLink.style.display = "inline-block"; // Show link
        })
        .catch(error => {
            factBox.classList.remove("spinning");
            factBox.innerText = "Oops! Couldn't fetch a fact. Try again!";
            refreshBtn.disabled = false;
            imageLink.style.display = "none";
            console.error("Error fetching fact:", error);
        });
}

function extractKeyword(fact) {
    // Simple keyword extraction: split into words, pick first noun-like word
    const words = fact.toLowerCase().split(" ");
    const commonNouns = ["octopus", "sloth", "honey", "flamingo", "war", "banana", "shrimp"];
    for (let word of words) {
        if (commonNouns.includes(word) || word.length > 3) { // Fallback to longer words
            return word;
        }
    }
    return words[0]; // Default to first word if no match
}

function shareOnTwitter() {
    const fact = window.currentFact || "Check out Weird Fact of the Day!";
    const tweetText = encodeURIComponent(fact + " #WeirdFacts");
    const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}&url=${encodeURIComponent(window.location.href)}`;
    window.open(twitterUrl, "_blank");
}

// Load a fact on page start
fetchNewFact();