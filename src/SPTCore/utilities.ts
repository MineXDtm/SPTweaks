import browser from "webextension-polyfill";

//отправка cors через клиента без cors сайта
const sendcors = (url) =>{
    return new Promise((resolve, reject) => {
        browser.runtime.sendMessage({ type: "CORS_HTTPREQUEST", url: url }).then(response => {
            if (response) {

                resolve(response);
            } else {
                resolve(undefined)
                console.log("no response")

            }
        });
    });
}

//сет глобального буфера
const setbuffer = (buffer_name,value) =>{
    return new Promise((resolve, reject) => {
        browser.runtime.sendMessage({ type: "SET_BUFFER", buffer_name , value}).then(response => {
            if (response) {

                resolve(response);
            } else {
                resolve(undefined)
                console.log("no response")

            }
        });
    });
}

//получения глобального буффера
const getbuffer = (buffer_name) =>{
    return new Promise((resolve, reject) => {
        browser.runtime.sendMessage({ type: "GET_BUFFER", buffer_name }).then(response => {
            if (response) {

                resolve(response);
            } else {
                resolve(undefined)
                console.log("no response")

            }
        });
    });
}



//отключение скрипта
const exit = ( status ) => {
    var i;

    if (typeof status === 'string') {
        alert(status);
    }

    window.addEventListener('error', function (e) {e.preventDefault();e.stopPropagation();}, false);

    var handlers = [
        'copy', 'cut', 'paste',
        'beforeunload', 'blur', 'change', 'click', 'contextmenu', 'dblclick', 'focus', 'keydown', 'keypress', 'keyup', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'resize', 'scroll',
        'DOMNodeInserted', 'DOMNodeRemoved', 'DOMNodeRemovedFromDocument', 'DOMNodeInsertedIntoDocument', 'DOMAttrModified', 'DOMCharacterDataModified', 'DOMElementNameChanged', 'DOMAttributeNameChanged', 'DOMActivate', 'DOMFocusIn', 'DOMFocusOut', 'online', 'offline', 'textInput',
        'abort', 'close', 'dragdrop', 'load', 'paint', 'reset', 'select', 'submit', 'unload'
    ];

    function stopPropagation (e) {
        e.stopPropagation();
        // e.preventDefault(); // Stop for the form controls, etc., too?
    }
    for (i=0; i < handlers.length; i++) {
        window.addEventListener(handlers[i], function (e) {stopPropagation(e);}, true);
    }

    if (window.stop) {
        window.stop();
    }

    throw '';
}

//ожидание пока появиться елемент
const waitForElm = (selector) => {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

//основная проверка при получении сообщения от скрипта на заднем плане
const default_check = (request,script_name)=>{
    if (request.type == "contains_script" && request.script_name == script_name) {

        return Promise.resolve(true);

    }
}

export {sendcors,default_check,waitForElm,exit,setbuffer,getbuffer};