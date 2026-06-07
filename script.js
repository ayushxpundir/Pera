// ==========================================
// 1. Core Data Model & State
// ==========================================
let bookmarks = JSON.parse(localStorage.getItem('pero_bookmarks')) || [];

// ==========================================
// 2. DOM Elements Mapping
// ==========================================
const inpName = document.getElementById('inp-name');
const inpUrl = document.getElementById('inp-url');
const inpSearch = document.getElementById('inp-search');
const cardGrid = document.getElementById('card-grid');

// ==========================================
// 3. Main Functions
// ==========================================

// Function to add a new bookmark
function addBookmark() {
    const nameValue = inpName.value.trim();
    let urlValue = inpUrl.value.trim();

    // Validation: Ensure fields aren't empty
    if (nameValue === "" || urlValue === "") {
        alert("Please fill out both the Site Name and URL fields.");
        return;
    }

    // Smart formatting
    if (!urlValue.startsWith('http://') && !urlValue.startsWith('https://')) {
        urlValue = 'https://' + urlValue;
    }

    // Create a new bookmark object with a unique ID based on timestamp
    const newBookmark = {
        id: Date.now(),
        name: nameValue,
        url: urlValue,
    };

    // Update data array
    bookmarks.push(newBookmark);

    // Sync to localStorage
    saveToStorage();

    // Clear inputs for the next entry
    inpName.value = "";
    inpUrl.value = "";

    // Re-render UI
    renderBookmarks(bookmarks);
}

// Function to render the bookmarks array onto the screen
function renderBookmarks(arrayToRender) {
    // clear out the grid before rebuilding it
    cardGrid.innerHTML = "";

    // Handle empty state visualization
    if (arrayToRender.length === 0) {
        cardGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #9e9e9e; font-size: 20px; padding: 20px;">No bookmarks found.</p>`;
        return;
    }

    // Loop through array and build visual cards using template literals
    arrayToRender.forEach(bookmark => {
        // Dynamic Favicon API link targeting the bookmarked website
        const faviconUrl = `https://www.google.com/s2/favicons?sz=64&domain=${bookmark.url}`;

        cardGrid.innerHTML += `
        <div class="bookmark-card">
            <div class="card-header">
                <img src="${faviconUrl}" alt="" class="provider-icon" onerror="this.style.display='none'">
                <h3>${bookmark.name}</h3>
            </div>
            <div class="card-actions">
                <a href="${bookmark.url}" target="_blank" rel="noopener noreferrer" class="visit-link">Visit</a>
                <button onclick="deleteBookmark(${bookmark.id})" class="delete-btn">Delete</button>
            </div>
        </div>
    `;
    });
}

// Function to delete a specific bookmark using its unique ID
function deleteBookmark(idToDelete) {
    // Filter out the deleted bookmark from our master array
    bookmarks = bookmarks.filter(bookmark => bookmark.id !== idToDelete);

    // Sync updated array to localStorage
    saveToStorage();

    // Re-render the updated list or respect the active search value
    searchBookmark();
}

// Function for live filtering / search match
function searchBookmark() {
    const searchTerm = inpSearch.value.toLowerCase().trim();

    // Create a temporary array of items matching search query
    const filteredBookmarks = bookmarks.filter(bookmark => {
        return bookmark.name.toLowerCase().includes(searchTerm);
    });

    // Render the smaller filtered list to the UI
    renderBookmarks(filteredBookmarks);
}

// Helper utility function to sync array to local browser memory
function saveToStorage() {
    localStorage.setItem('pero_bookmarks', JSON.stringify(bookmarks));
}

// ==========================================
// 4. App Initialization
// ==========================================
// Instantly run this on page load to draw any previously saved bookmarks
renderBookmarks(bookmarks);