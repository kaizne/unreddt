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
