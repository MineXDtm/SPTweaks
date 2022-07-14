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
    if(document.getElementById('aboutholder')) {
        return;
    } else {
       var pluginHolder = document.createElement('div');
       pluginHolder.id = "aboutholder";
       document.body.appendChild(pluginHolder);
    }
    var e = document.getElementsByClassName("mt-8 space-y-4 ")[0];
    const para = document.createElement("p");
    var oldHref = document.location.href;


    
    
        var bodyList = document.querySelector("body")

        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (oldHref != document.location.href) {
                    oldHref = document.location.href;
                    document.getElementById('aboutholder').remove();
                    observer.disconnect();
                }
            });
        });
        
        var config = {
            childList: true,
            subtree: true
        };
        
        observer.observe(bodyList, config);
    
    para.innerHTML = "Расширение слепили";
    para.className = "flex items-center gap-2 text-white"
    e.appendChild(para);
    addperson(para,"https://visage.surgeplay.com/face/80/266f26f151114cc09f088fd2298df61d","lodo4nik","лодка#4433");
    addperson(para,"https://visage.surgeplay.com/face/80/cb5fd9c57e514267aa2ce7fcdbcd80f6","Andreu333XD","Andreu333XD#4794");
    const person = document.createElement("a");
    person.href = "https://minexdtm.com/";
    person.target = "_blank";
    person.rel = "noopener noreferrer";
    person.style.backgroundImage = "linear-gradient(to right, darkred, #510202)";
    person.className= "focusable flex gap-2 rounded-lg bg-gray-500 p-2 text-white";
    
    para.appendChild(person);
    person.innerHTML = person.innerHTML+ "Mine-XD";
    // <p class="flex items-center gap-2 text-white">Первую версию сайта сделал <a href="https://jakksoft.com/" target="_blank" rel="noopener noreferrer" class="focusable flex gap-2 rounded-lg bg-gray-500 p-2 text-white"><img width="24" height="24" src="https://visage.surgeplay.com/face/24/ed9b27f5cd80474dbff81ca8a5f2e7d2" alt="">Jakkson</a></p>
    
});

function addperson( para,link,name,title ){
    const person = document.createElement("a");
    person.href = "https://spworlds.ru/sp/users/" + name;
    person.target = "_blank";
    person.rel = "noopener noreferrer";
    person.style.backgroundImage = "linear-gradient(to right, darkred, #510202)";
    person.className= "focusable flex gap-2 rounded-lg bg-gray-500 p-2 text-white";
    const icon = document.createElement("img");
    icon.width = 24;
    icon.height = 24;
    icon.src = link;
    
    para.appendChild(person);
    person.appendChild(icon);
    person.innerHTML = person.innerHTML + title;
}