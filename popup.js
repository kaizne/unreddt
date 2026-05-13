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
    const videos = document.querySelectorAll('video')
    videos.forEach(video => {
        video.autoplay = false
        video.removeAttribute('autoplay')
        if (!video.paused) {
            video.pause()
        }
    })
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
