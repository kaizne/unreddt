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

autoplayToggle.addEventListener('change', async () => {
    const isEnabled = autoplayToggle.checked;
    await chrome.storage.sync.set({ disableAutoplay: isEnabled });

    if (isEnabled) {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        if (tab?.id) {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: injectAutoplayBlocker,
                world: 'MAIN'
            });
        }
    } else {
        chrome.tabs.reload(tab.id);
    }
});

function injectAutoplayBlocker() {
    if (window.hasAutoplayBlockerRun) return;
    window.hasAutoplayBlockerRun = true;

    const originalPlay = HTMLMediaElement.prototype.play;

    HTMLMediaElement.prototype.play = function(...args) {
        if (this.dataset.userAllowed === "true") {
            return originalPlay.apply(this, args);
        } else {
            console.log("Autoplay blocked by your script!");
            return Promise.resolve();
        }
    };

    window.addEventListener('click', (e) => {
        const video = e.target.closest('video');
        if (video) {
            video.dataset.userAllowed = "true";
            video.play();
        }
    }, true);
}

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
