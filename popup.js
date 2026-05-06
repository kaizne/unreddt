const sidebarToggle = document.getElementById('sidebarToggle')

// Load saved state
chrome.storage.sync.get('hideSidebar', (data) => {
    sidebarToggle.checked = data.hideSidebar
})

sidebarToggle.addEventListener('change', () => {
    const isEnabled = sidebarToggle.checked;
    chrome.storage.sync.set({ hideSidebar: isEnabled })
})
