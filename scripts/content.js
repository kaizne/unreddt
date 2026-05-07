/*
function updateUI() {
    chrome.storage.sync.get('hideSidebar', (data) => {
        if (data.hideSidebar) {
            document.body.classList.add('hide-left-sidebar')
        } else {
            document.body.classList.remove('hide-left-sidebar')
        }
    })
}

updateUI()

chrome.storage.onChanged.addListener((changes) => {
    if (changes.hideSidebar) {
        updateUI()
    }
})

function init() {
    updateUI();
    
    // Listen for storage changes
    chrome.storage.onChanged.addListener((changes) => {
        if (changes.hideSidebar) {
            updateUI();
        }
    });
}

// Check if DOM is already loaded, otherwise wait for it
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

*/

// 1. Create a style element immediately
const styleTag = document.createElement('style');
styleTag.id = 'hide-left-sidebar';
// Replace '.sidebar-selector' with the actual CSS selector for the sidebar
styleTag.innerHTML = `#left-sidebar { display: none !important; }`;

function applyPreference() {
    chrome.storage.sync.get('hideSidebar', (data) => {
        if (data.hideSidebar) {
            // Append the style to the root element (available at document_start)
            document.documentElement.appendChild(styleTag);
        } else if (styleTag.parentNode) {
            // Remove it if the user wants the sidebar shown
            styleTag.remove();
        }
    });
}

// Run immediately at document_start
applyPreference();

// Listen for toggles while the user is on the page
chrome.storage.onChanged.addListener((changes) => {
    if (changes.hideSidebar) {
        applyPreference();
    }
});
