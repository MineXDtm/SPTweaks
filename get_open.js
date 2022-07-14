// var app = chrome.runtime.getBackgroundPage();
var open = false;
function closed() {
  if(!open){
    open = true;
    chrome.tabs.executeScript({
      file: 'open.js'
    }); 
  }
  else{
    open = false;
    chrome.tabs.executeScript({
      file: 'unopen.js'
    }); 
  }
 
}

document.getElementById('open').addEventListener('click', closed);
