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
function search_player(){
    var text = document.getElementById("text_input_16").value.toLowerCase();
    var paras = document.getElementsByClassName('focusable space-y-1 rounded-3xl border border-white border-opacity-5 bg-gray-500 p-6 font-medium');
    var arr = Array.from(paras);
    document.getElementById("content").getElementsByClassName("grid")[1].firstChild.addEventListener( 'DOMNodeInserted', async function ( event ) {
        if(event.target.className == "focusable space-y-1 rounded-3xl border border-white border-opacity-5 bg-gray-500 p-6 font-medium") {
                    
                    const delay = ms => new Promise(res => setTimeout(res, ms));
                    await delay(0.1);
                    var e = event.target.getElementsByClassName("name_MC");
                    var name =  e[0].innerHTML.replace("Подающий: ","").toLowerCase();
                    var name2 =e[1].innerHTML.replace("Ответчик: ","").toLowerCase();
                    if(!name.includes(text) && !name2.includes(text) ){
                        event.target.style.display = "none";
                        
                    }
                    
               
            
        };
    }, false );
    for (let item of arr) {
        
        var e = item.getElementsByClassName("name_MC");
        var name =  e[0].innerHTML.replace("Подающий: ","").toLowerCase();
        var name2 =e[1].innerHTML.replace("Ответчик: ","").toLowerCase();
        if(!name.includes(text) && !name2.includes(text) ){
            item.style.display = "none";
        }
        else{
            item.style.display = "block";
        }
        
    }

    
    
       
    


}
waitForElm('#content').then((elm) => {
    if(elm.firstChild.className == "my-6 flex items-center gap-4" ){
        elm.firstChild.remove();
    }
    var search = document.createElement("div");
    search.className= 'my-6 flex items-center gap-4';
    var oldHref = document.location.href;


    var checker = document.createElement("section")
    
        var bodyList = document.querySelector("body")

        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (oldHref != document.location.href) {
                    oldHref = document.location.href;
                   
                    search.remove();
                    observer.disconnect();
                    checker.remove();
                }
            });
        });
        
        var config = {
            childList: true,
            subtree: true
        };
        
        observer.observe(bodyList, config);




    
        search.innerHTML = "<div class='relative grid w-full rounded-2xl bg-gray-700 px-4 pt-6 pb-2 ring-primary focus-within:ring-2 grid-cols-[2.5rem,1fr]'><svg class='fill-current p-1 -mt-3 block h-8 w-8' viewBox='0 0 18 18'><path d='M17.8 16.7 13.1 12c1-1.3 1.7-2.9 1.7-4.7 0-4.1-3.3-7.4-7.4-7.4C3.3 0 0 3.3 0 7.4s3.3 7.4 7.4 7.4c1.8 0 3.4-.6 4.7-1.7l4.7 4.7c.1.1.3.2.5.2s.4-.1.5-.2c.3-.3.3-.8 0-1.1zM1.5 7.4c0-3.2 2.6-5.9 5.9-5.9s5.9 2.6 5.9 5.9-2.6 5.9-5.9 5.9-5.9-2.7-5.9-5.9z'></path></svg> <div><input id='text_input_16' maxlength='300' type='text' class='peer w-full border-0 bg-gray-700 text-white caret-primary-lighter outline-none' placeholder=' '> <label for='text_input_15' class='absolute top-1 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus-visible:top-1 peer-focus-visible:text-sm left-14'>Поиск по нику</label></div></div> <button id='sr' class='btn rounded-2xl bg-primary py-4 px-6'>Поиск</button><button id='ld' class='btn rounded-2xl bg-primary py-4 px-6' style='background-color: orange'>прогрузить все дела</button>";
   

    
        
    
    checker.innerHTML = "<section class='flex items-center gap-2 rounded-2xl bg-gray-700 p-4 text-lg'><input type='checkbox' class='h-5 w-5' id='close'> Скрыть закрытые дела</section>"


    elm.appendChild(checker);
    elm.insertBefore(checker, elm.firstChild);
    document.getElementById("close").addEventListener("click", closed);

    




    elm.appendChild(search);
    elm.insertBefore(search, elm.firstChild);
    document.getElementById("sr").addEventListener("click", search_player);
    document.getElementById("ld").addEventListener("click", function(){
        window.scrollTo(0, document.body.scrollHeight);
        elm.children[1].addEventListener( 'DOMNodeInserted', async function ( event ) {
            
            
            if(event.target.className == "focusable space-y-1 rounded-3xl border border-white border-opacity-5 bg-gray-500 p-6 font-medium") {
                const delay = ms => new Promise(res => setTimeout(res, ms));
                await delay(0.1);
                window.scrollTo(0, document.body.scrollHeight);
                
                
            };


        
        });
    });

       
    elm.children[1].addEventListener( 'DOMNodeInserted', function ( event ) {
            if(event.target != null && event.target.className == "flex items-center gap-2 pt-2") {
                    event.target.addEventListener( 'DOMNodeInserted', function ( event2 ) {
                    if(  event2.target.className == "h-12 w-12 cursor-pointer rounded-lg") {
                        const para = document.createElement("p");
                        para.style.color = "aqua";
                        para.style.backgroundColor = "rgba(0, 255, 255, 0.1)";
                        para.style.borderRadius = "4px";
                        para.style.padding = "5px";
                        para.style.marginTop = "10px";
                        para.style.marginBottom = "10px";
                        para.style.width = "fit-content";
                        para.innerHTML = event2.target.alt;
                        para.className = "name_MC";
                        event.target.parentElement.appendChild(para);
                    };
                   
                
                }, false );
            };
           
        



        
    });
});

var open = false;
function closed() {
  if(!open){
    open = true;
    var paras = document.getElementsByClassName('rounded-lg bg-opacity-10 p-1 text-center bg-red text-red');

for(let item of paras) {
    item.parentNode.style.display = "none";
}


 document.getElementsByClassName('grid')[1].firstChild.addEventListener( 'DOMNodeInserted', close_loop);



  }
  else{
    open = false;
    document.getElementsByClassName('grid')[1].firstChild.removeEventListener( 'DOMNodeInserted', close_loop);
    var paras = document.getElementsByClassName('rounded-lg bg-opacity-10 p-1 text-center bg-red text-red');
    for(let item of paras) {
        item.parentNode.style.display = "block";
        
    }
  }
 
}


async function close_loop( event ) {


            
            if(event.target.className == "rounded-lg bg-opacity-10 p-1 text-center bg-red text-red") {
                const delay = ms => new Promise(res => setTimeout(res, ms));
                await delay(0.1);
                event.target.parentNode.style.display = "none";
            };
           
        
}