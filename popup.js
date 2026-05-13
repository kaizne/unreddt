const sidebarToggle = document.getElementById('sidebarToggle')
const popularCommunitiesToggle = document.getElementById('popularCommunitiesToggle')
const headerToggle = document.getElementById('headerToggle')
const infiniteScrollToggle = document.getElementById('infiniteScrollToggle')
const autoplayToggle = document.getElementById('autoplayToggle')

chrome.storage.sync.get(['hideSidebar', 
                         'hidePopularCommunities', 
                         'hideHeader', 
                         'disableInfiniteScroll', 
                         'disableAutoplay'], (data) => {
    sidebarToggle.checked = data.hideSidebar
    popularCommunitiesToggle.checked = data.hidePopularCommunities
    headerToggle.checked = data.hideHeader
    infiniteScrollToggle.checked = data.disableInfiniteScroll
    autoplayToggle.checked = data.disableAutoplay
})

const handleToggle = (toggle, storageKey) => {
    toggle.addEventListener('change', () => {
        chrome.storage.sync.set({ [storageKey]: toggle.checked })
    })
}

handleToggle(sidebarToggle, 'hideSidebar')
handleToggle(popularCommunitiesToggle, 'hidePopularCommunities')
handleToggle(headerToggle, 'hideHeader')

const stopAutoplay = () => {
    const script = document.createElement('script')
    script.textContent = `
        // Store the original play function
        const originalPlay = HTMLMediaElement.prototype.play;

        // Override the play function
        HTMLMediaElement.prototype.play = function() {
        // Check if the play attempt is "trusted" (initiated by a human click)
        // Or check a custom attribute we set on click
        if (this.dataset.userAllowed === "true") {
            return originalPlay.apply(this, arguments);
        } else {
            console.log("Autoplay blocked by your script!");
            // Return a resolved promise to prevent console errors from the browser
            return Promise.resolve();
        }
        };

        // Add a listener to set the flag when the user actually clicks the video
        document.addEventListener('click', (e) => {
        if (e.target.tagName === 'VIDEO') {
            e.target.dataset.userAllowed = "true";
            e.target.play();
        }
        }, true);
    `
}

autoplayToggle.addEventListener('change', () => {
    const isEnabled = autoplayToggle.checked
    chrome.storage.sync.set({ disableAutoplay: isEnabled })

    if (isEnabled) {
        stopAutoplay()
    }
})

const SCROLL_RULE_ID = 1

infiniteScrollToggle.addEventListener('change', async () => {
    const isEnabled = infiniteScrollToggle.checked
    chrome.storage.sync.set({ disableInfiniteScroll: isEnabled })

    if (isEnabled) {
        await chrome.declarativeNetRequest.updateDynamicRules({
            addRules: [{
                "id": 1,
                "priority": 1,
                "action": { "type": "block" },
                "condition": {
                "urlFilter": "reddit.com/svc/shreddit/feeds/*after=*",
                "resourceTypes": ["xmlhttprequest"]
                }
            }],
            removeRuleIds: [SCROLL_RULE_ID]
        })
    } else {
        await chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: [SCROLL_RULE_ID]
        })
    }
})
