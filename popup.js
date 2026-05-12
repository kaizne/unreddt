const sidebarToggle = document.getElementById('sidebarToggle')
const popularCommunitiesToggle = document.getElementById('popularCommunitiesToggle')
const headerToggle = document.getElementById('headerToggle')
const infiniteScrollToggle = document.getElementById('infiniteScrollToggle')

sidebarToggle.addEventListener('change', () => {
    const isEnabled = sidebarToggle.checked;
    chrome.storage.sync.set({ hideSidebar: isEnabled })
})

popularCommunitiesToggle.addEventListener('change', () => {
    const isEnabled = popularCommunitiesToggle.checked;
    chrome.storage.sync.set({ hidePopularCommunities: isEnabled })
})

headerToggle.addEventListener('change', () => {
    const isEnabled = headerToggle.checked;
    chrome.storage.sync.set({ hideHeader: isEnabled })
})

chrome.storage.sync.get('hideSidebar', (data) => {
    sidebarToggle.checked = data.hideSidebar
})

chrome.storage.sync.get('hidePopularCommunities', (data) => {
    popularCommunitiesToggle.checked = data.hidePopularCommunities
})

chrome.storage.sync.get('hideHeader', (data) => {
    headerToggle.checked = data.hideHeader
})

chrome.storage.sync.get('infiniteScrollToggle', (data) => {
    infiniteScrollToggle.checked = data.infiniteScroll
})

const SCROLL_RULE_ID = 1

infiniteScrollToggle.addEventListener('change', async () => {
    const isEnabled = infiniteScrollToggle.checked;
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
