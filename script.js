function fetchNewFact() {
    const factBox = document.getElementById("fact");
    const refreshBtn = document.getElementById("refreshBtn");
    const factImage = document.getElementById("factImage");

    // Add spinning animation and disable button
    factBox.classList.add("spinning");
    refreshBtn.disabled = true;
    factBox.innerText = "Fetching a weird fact...";
    factImage.style.display = "none"; // Hide image while loading

    // Fetch fact from Useless Facts API
    fetch("https://uselessfacts.jsph.pl/random.json?language=en")
        .then(response => response.json())
        .then(data => {
            // Stop spinning, show fact
            factBox.classList.remove("spinning");
            factBox.innerText = data.text;
            refreshBtn.disabled = false;

            // Get keyword and fetch image from Flickr
            const keyword = extractKeyword(data.text);
            fetchFlickrImage(keyword);
        })
        .catch(error => {
            factBox.classList.remove("spinning");
            factBox.innerText = "Oops! Couldn't fetch a fact. Try again!";
            refreshBtn.disabled = false;
            factImage.style.display = "none";
            console.error("Error fetching fact:", error);
        });
}

function extractKeyword(fact) {
    // Simple keyword extraction: pick first noun-like word
    const words = fact.toLowerCase().split(" ");
    const commonNouns = ["octopus", "sloth", "honey", "flamingo", "war", "banana", "shrimp"];
    for (let word of words) {
        if (commonNouns.includes(word) || word.length > 3) {
            return word;
        }
    }
    return words[0]; // Default to first word
}

function fetchFlickrImage(keyword) {
    const factImage = document.getElementById("factImage");
    // Use Flickr's public RSS feed (no API key needed)
    const flickrUrl = `https://api.flickr.com/services/feeds/photos_public.gne?format=json&nojsoncallback=1&tags=${encodeURIComponent(keyword)}`;

    fetch(flickrUrl)
        .then(response => response.json())
        .then(data => {
            if (data.items && data.items.length > 0) {
                // Pick the first image's thumbnail
                const imageUrl = data.items[0].media.m.replace("_m", "_s"); // Small size
                factImage.src = imageUrl;
                factImage.style.display = "block";
            } else {
                factImage.style.display = "none"; // No image found
            }
        })
        .catch(error => {
            factImage.style.display = "none";
            console.error("Error fetching image:", error);
        });
}

// Load a fact on page start
fetchNewFact();