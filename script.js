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

            // Get keyword and fetch image
            const keyword = extractKeyword(data.text);
            console.log("Keyword:", keyword); // Debug
            fetchWikimediaImage(keyword);
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
    // Improved keyword extraction
    const words = fact.toLowerCase().split(" ");
    const commonNouns = ["octopus", "sloth", "honey", "flamingo", "war", "banana", "shrimp", "heart", "dolphin", "babies"];
    for (let word of words) {
        if (commonNouns.includes(word)) {
            return word;
        }
        if (word.length > 3 && !["have", "that", "with", "they"].includes(word)) {
            return word;
        }
    }
    return words[0]; // Fallback
}

function fetchWikimediaImage(keyword) {
    const factImage = document.getElementById("factImage");
    // Wikimedia Commons API with CORS support
    const wikiUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(keyword)}&format=json&origin=*`;

    console.log("Wikimedia URL:", wikiUrl); // Debug
    fetch(wikiUrl)
        .then(response => {
            if (!response.ok) throw new Error("Wikimedia fetch failed");
            return response.json();
        })
        .then(data => {
            console.log("Wikimedia data:", data); // Debug
            if (data.query.search.length > 0) {
                const title = data.query.search[0].title; // First result
                // Construct thumbnail URL (100px width)
                const imageUrl = `https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/${encodeURIComponent(title)}&width=100`;
                console.log("Image URL:", imageUrl); // Debug
                factImage.src = imageUrl;
                factImage.onerror = () => {
                    console.log("Image failed to load");
                    factImage.style.display = "none";
                };
                factImage.onload = () => {
                    factImage.style.display = "block";
                };
            } else {
                console.log("No images found for keyword");
                factImage.style.display = "none";
            }
        })
        .catch(error => {
            console.error("Error fetching image:", error);
            factImage.style.display = "none";
        });
}

// Load a fact on page start
fetchNewFact();
