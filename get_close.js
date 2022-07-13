// var app = chrome.runtime.getBackgroundPage();

function closed() {
  chrome.tabs.executeScript({
    file: 'close.js'
  }); 
}

document.getElementById('close').addEventListener('click', closed);
