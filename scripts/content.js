const styleTag = document.createElement('style')
styleTag.id = 'hide-left-sidebar'
styleTag.innerHTML = `#left-sidebar-container { display: none !important; }`

const styleTag2 = document.createElement('style')
styleTag2.id = 'hide-popular-communities-list'
styleTag2.innerHTML = `.right-rail-popular-communities { display: none !important; }`

const styleTag3 = document.createElement('style')
styleTag3.id = 'hide-header'
styleTag3.innerHTML = `.h-header-large { display: none !important; }`

function applySideBarPreference() {
    chrome.storage.sync.get('hideSidebar', (data) => {
        if (data.hideSidebar) {
            // Append the style to the root element (available at document_start)
            document.documentElement.appendChild(styleTag)
        } else if (styleTag.parentNode) {
            // Remove it if the user wants the sidebar shown
            styleTag.remove()
        }
    });
}

applySideBarPreference();

function applyPopularCommunitiesPreference() {
    chrome.storage.sync.get('hidePopularCommunities', (data) => {
        if (data.hidePopularCommunities) {
            // Append the style to the root element (available at document_start)
            document.documentElement.appendChild(styleTag2)
        } else if (styleTag2.parentNode) {
            // Remove it if the user wants the sidebar shown
            styleTag2.remove()
        }
    });
}

applyPopularCommunitiesPreference();

function applyHeaderPreference() {
    chrome.storage.sync.get('hideHeader', (data) => {
        if (data.hideHeader) {
            // Append the style to the root element (available at document_start)
            document.documentElement.appendChild(styleTag3)
        } else if (styleTag3.parentNode) {
            // Remove it if the user wants the sidebar shown
            styleTag3.remove()
        }
    });
}

applyHeaderPreference();

chrome.storage.onChanged.addListener((changes) => {
    if (changes.hideSidebar) {
        applySideBarPreference()
    } 
    if (changes.hidePopularCommunities) {
        applyPopularCommunitiesPreference()
    }
    if (changes.hideHeader) {
        applyHeaderPreference()
    }
})
