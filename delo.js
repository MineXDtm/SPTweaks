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
    if(document.getElementById('deloholder')) {
        return;
    } else {
       var pluginHolder = document.createElement('div');
       pluginHolder.id = "deloholder";
       document.body.appendChild(pluginHolder);
    }

    var oldHref = document.location.href;

        
    
    
        var bodyList = document.querySelector("body")

        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (oldHref != document.location.href) {
                    oldHref = document.location.href;
                    document.getElementById('deloholder').remove();
                    observer.disconnect();
                }
            });
        });
        
        var config = {
            childList: true,
            subtree: true
        };
        
        observer.observe(bodyList, config);
    
        waitForElm('.space-y-4').then((elm2) => {
            waitForElm('.grid').then((elm3) => {
                
                cheangeheads();
            });
        });
});

async function cheangeheads(){
    const delay = ms => new Promise(res => setTimeout(res, ms));
    await delay(1);
    var para = document.getElementsByClassName("h-12 w-12 cursor-pointer rounded-lg");
    
    for(let item of para){
        console.log(item.parentElement.innerText);
        item.addEventListener("click",function(){
            window.open("https://spworlds.ru/sp/users/"+item.parentElement.innerText.replace("Судья ",""));
        });
    }

}