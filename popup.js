const sidebarToggle = document.getElementById('sidebarToggle')
const popularCommunitiesToggle = document.getElementById('popularCommunitiesToggle')
const headerToggle = document.getElementById('headerToggle')
const infiniteScrollToggle = document.getElementById('infiniteScrollToggle')

chrome.storage.sync.get(['hideSidebar', 
                         'hidePopularCommunities', 
                         'hideHeader', 
                         'disableInfiniteScroll'], (data) => {
    sidebarToggle.checked = data.hideSidebar
    popularCommunitiesToggle.checked = data.hidePopularCommunities
    headerToggle.checked = data.hideHeader
    infiniteScrollToggle.checked = data.disableInfiniteScroll
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
