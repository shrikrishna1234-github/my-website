// Google Custom Search API configuration
const API_KEY = 'AIzaSyBR3RXplFF0U2QvaX4pqWM7LeKCD8qxnis';
const SEARCH_ENGINE_ID = 'c7fa420cfd54844b2';

// DOM Elements
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const resultsContainer = document.getElementById('results-container');
const resultsContent = document.getElementById('results-content');
const optionButtons = document.querySelectorAll('.option-btn');
const signInBtn = document.getElementById('signInBtn');
const signInModal = document.getElementById('signin-modal');
const signInSubmit = document.getElementById('signin-submit');
const googleSignIn = document.getElementById('google-signin');
const closeModal = document.getElementById('close-modal');
const loader = document.querySelector('.loader');

let currentSearchType = 'web'; // Default search type is 'web'
let isLoggedIn = false;

// Event Listeners
searchButton.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
});

optionButtons.forEach(button => {
    button.addEventListener('click', () => {
        optionButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentSearchType = button.dataset.type;
        performSearch();
    });
});

signInBtn.addEventListener('click', () => {
    signInModal.style.display = 'block';
});

signInSubmit.addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (username && password) {
        isLoggedIn = true;
        alert(`Access granted, ${username}. Welcome to the deep web.`);
        signInModal.style.display = 'none';
        signInBtn.textContent = `Logged in: ${username}`;
        unlockSecretFeatures();
    } else {
        alert('Invalid credentials. Access denied.');
    }
});

googleSignIn.addEventListener('click', () => {
    alert('G-Network infiltration not implemented in this prototype.');
});

closeModal.addEventListener('click', () => {
    signInModal.style.display = 'none';
});

window.onclick = (event) => {
    if (event.target == signInModal) {
        signInModal.style.display = 'none';
    }
};

// Search function (updated to inject results directly)
function performSearch() {
    const query = searchInput.value;
    if (!query) {
        resultsContent.innerHTML = '<p>Error: Query cannot be empty. Please enter a search term.</p>';
        return;
    }

    loader.style.display = 'block';
    resultsContent.innerHTML = '';

    // Build the URL based on the search type
    let url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}`;
    if (currentSearchType === 'images') {
        url += `&searchType=image`; // Only add searchType for images
    }

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            loader.style.display = 'none';
            if (data.items && data.items.length > 0) {
                displayResults(data.items); // Call to display the results
            } else if (data.searchInformation && data.searchInformation.totalResults === '0') {
                resultsContent.innerHTML = '<p>No results found. Adjust your query and try again.</p>';
            } else {
                throw new Error('Unexpected response structure');
            }
        })
        .catch(error => {
            loader.style.display = 'none';
            resultsContent.innerHTML = `<p>Error: Unable to establish connection. ${error.message}</p>`;
        });
}

// Display search results (updated for traditional display)
function displayResults(items) {
    let resultsHTML = '<h2>Search Results:</h2>';
    items.forEach((item, index) => {
        resultsHTML += `
            <div class="result-item">
                <h3>${index + 1}. <a href="${item.link}" target="_blank">${item.title}</a></h3>
                <p>${item.snippet}</p>
                ${item.pagemap && item.pagemap.cse_thumbnail ? `<img src="${item.pagemap.cse_thumbnail[0].src}" alt="Thumbnail">` : ''}
            </div>
        `;
    });

    resultsContent.innerHTML = resultsHTML;
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    resultsContent.innerHTML = 'Multiplex Deep Web Browser initialized. Enter your query to begin.';
});
