function waitForElm(selector) {
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

waitForElm('#content').then((elm) => {
    
    waitForElm('.grid').then((elm2) => {
        elm2.firstChild.addEventListener( 'DOMNodeInserted', function ( event ) {
            if(  event.target.className == "flex items-center gap-2 pt-2") {
                event.target.addEventListener( 'DOMNodeInserted', function ( event2 ) {
                    if(  event2.target.className == "h-12 w-12 cursor-pointer rounded-lg") {
                        const para = document.createElement("p");
                        para.style.color = "aqua";
                        para.innerHTML = event2.target.alt;
                        event.target.parentElement.appendChild(para);
                    };
                   
                
                }, false );
            };
           
        
        }, false );


        
    });
});