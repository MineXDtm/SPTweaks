// var app = chrome.runtime.getBackgroundPage();

function closed() {
  chrome.tabs.executeScript({
    file: 'open.js'
  }); 
}

document.getElementById('open').addEventListener('click', closed);
