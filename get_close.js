// var app = chrome.runtime.getBackgroundPage();
var open = false;
function closed() {
  if(!open){
    open = true;
    chrome.tabs.executeScript({
      file: 'close.js'
    }); 
  }
  else{
    open = false;
    chrome.tabs.executeScript({
      file: 'unclose.js'
    }); 
  }
 
}
document.getElementById('close').addEventListener('click', closed);
