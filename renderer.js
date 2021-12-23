let { ipcRenderer } = require('electron')
let remove_headers_toggle_btn = document.querySelector('#remove-headers-toggle-btn')
let remove_header_status = document.querySelector('#removeheaderstatus')
let reloadbtn = document.querySelector('#reloadbtn')
let webview = document.querySelector('#webview')
let webview_dom_is_ready = false
let should_remove_target_headers = true

updateShouldRemoveTargetHeaders()
remove_headers_toggle_btn.addEventListener('click', async () => {
  should_remove_target_headers = !should_remove_target_headers
  ipcRenderer.invoke('set-should-remove-target-headers', should_remove_target_headers)
  updateShouldRemoveTargetHeaders()
}, false)
reloadbtn.addEventListener('click', () => reload(), false)
webview.addEventListener('dom-ready', () => {
  if (!webview_dom_is_ready) {
    webview_dom_is_ready = true
    reload()
  }
}, false)
function updateShouldRemoveTargetHeaders () {
  remove_header_status.textContent = should_remove_target_headers ?
    '[REMOVE TARGET HEADERS]' : '[HEADERS UNTOUCHED]'
}
function reload () {
  webview.loadURL('https://www.facebook.com/')
}
