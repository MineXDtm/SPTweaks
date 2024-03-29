
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
var searched = false;
var last_search = "";
async function search_player(value){
    last_search = value;
    if(value == ""){
        searched = false;
    }
    else{
        
        searched = true;
    }
    var text = value.toLowerCase();
    var paras = document.getElementsByClassName("focusable space-y-3 rounded-2xl bg-gray-500 p-3 text-lg font-medium");
    var arr = Array.from(paras);
    document.getElementById("content").getElementsByClassName("grid grid-cols-1 gap-3 pt-2 lg:grid-cols-2 xl:grid-cols-3")[0].addEventListener( 'DOMNodeInserted',   function ( event ) {
        if(event.target.className == "focusable space-y-3 rounded-2xl bg-gray-500 p-3 text-lg font-medium") {
            window.scrollTo(0, 0);
            var c = 0;
            event.target.addEventListener( 'DOMNodeInserted', async function ( event2 ) {
                
                if(  event2.target.className == "flex items-center gap-2 pt-2_") {
                    c +=1;
                    if(c == 2){
                        const delay = ms => new Promise(res => setTimeout(res, ms));
                        await delay(1);
                        var e = event.target.getElementsByClassName("flex items-center gap-2 pt-2_");
                        var tag = event.target.firstChild;
                    
                        var name =  e[0].innerHTML.toLowerCase();
                        var name2 =e[1].innerHTML.toLowerCase();

                       
                        if(!name.includes(text) && !name2.includes(text) ){
                            event.target.style.display = "none";
                           
                        }
                    }
                };
           
        
            }, false );
                    
                    
                    
               
            
        };
    }, false );
    for (let item of arr) {
        
        var e = item.getElementsByClassName("flex items-center gap-2 pt-2_");
        var name =  e[0].innerHTML.toLowerCase();
        var name2 =e[1].innerHTML.toLowerCase();
        if(!name.includes(text) && !name2.includes(text) ){
            item.style.display = "none";
        }
        else{
            item.style.display = "block";
        }
        var tag = item.firstChild;
       
    }

    



}
waitForElm('#content').then((elm) => {
    if(document.getElementById('sudeholder')) {
        return;
    } else {
       var pluginHolder = document.createElement('div');
       pluginHolder.id = "sudeholder";
       document.body.appendChild(pluginHolder);
    }
    if(elm.firstChild.className == "my-6 flex items-center gap-4" ){
        elm.firstChild.remove();
    }
    var search = document.createElement("div");
    search.className= 'my-6 flex items-center gap-4';
    var checker = document.createElement("div");
    var upbut = document.createElement("a");
    var oldHref = document.location.href;


    
    checker.style.display = "flex";
    
        var bodyList = document.querySelector("body")

        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (oldHref != document.location.href) {
                    oldHref = document.location.href;
                    document.getElementById('sudeholder').remove();
                    search.remove();
                    observer.disconnect();
                    checker.remove();
                    upbut.remove();
                }
            });
        });
        
        var config = {
            childList: true,
            subtree: true
        };
        
        observer.observe(bodyList, config);




    

        search.innerHTML = "<div class='relative grid w-full rounded-2xl bg-gray-700 px-4 pt-6 pb-2 ring-primary focus-within:ring-2 grid-cols-[2.5rem,1fr]'><svg class='fill-current p-1 -mt-3 block h-8 w-8' viewBox='0 0 18 18'><path d='M17.8 16.7 13.1 12c1-1.3 1.7-2.9 1.7-4.7 0-4.1-3.3-7.4-7.4-7.4C3.3 0 0 3.3 0 7.4s3.3 7.4 7.4 7.4c1.8 0 3.4-.6 4.7-1.7l4.7 4.7c.1.1.3.2.5.2s.4-.1.5-.2c.3-.3.3-.8 0-1.1zM1.5 7.4c0-3.2 2.6-5.9 5.9-5.9s5.9 2.6 5.9 5.9-2.6 5.9-5.9 5.9-5.9-2.7-5.9-5.9z'></path></svg> <div><input id='text_input_16' maxlength='300' type='text' class='peer w-full border-0 bg-gray-700 text-white caret-primary-lighter outline-none' placeholder=' '> <label  style='pointer-events: none;user-select: none;for='text_input_15' class='absolute top-1 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus-visible:top-1 peer-focus-visible:text-sm left-14'>Поиск по нику</label></div></div> <button id='sr' class='btn rounded-2xl bg-primary py-4 px-6'>Поиск</button><button id='ld' class='btn rounded-2xl bg-primary py-4 px-6' style='background-color: orange'>Прогрузить все дела</button>";
   

    
        
    
    checker.innerHTML = "<section class='flex items-center gap-2 rounded-2xl bg-gray-700 p-4 text-lg'><input type='checkbox' class='h-5 w-5' id='close'> Скрыть закрытые дела</section> <section class='flex items-center gap-2 rounded-2xl bg-gray-700 p-4 text-lg'><input type='checkbox' class='h-5 w-5' id='open'> Скрыть открытые дела</section>"


  
    upbut.innerHTML = "прокрутить на самый верх";
    upbut.style.cursor = "pointer";
    
    upbut.className = "btn bg-gray-500 text-xl";
    upbut.style.marginTop = "20px";
    upbut.addEventListener("click",function(){
        window.scrollTo(0, 0);
    });
    elm.appendChild(upbut);
    




    elm.appendChild(search);
    elm.insertBefore(search, elm.firstChild);
    document.getElementById("sr").addEventListener("click", function(){

        
        search_player( document.getElementById("text_input_16").value);

    });
    document.getElementById("ld").addEventListener("click", function(){
        window.scrollTo(0, document.body.scrollHeight);
        elm.children[1].addEventListener( 'DOMNodeInserted', async function ( event ) {
            
            
            if(event.target.className == "focusable space-y-3 rounded-2xl bg-gray-500 p-3 text-lg font-medium") {
                const delay = ms => new Promise(res => setTimeout(res, ms));
                await delay(1000);
                window.scrollTo(0, document.body.scrollHeight);
                
                
            };


        
        });
    });

       

    elm.children[1].addEventListener( 'DOMNodeInserted', function ( event ) {
            if(event.target != null && event.target.className == "flex items-center gap-2 pt-2") {
                
                    var c = 0;
                    event.target.addEventListener( 'DOMNodeInserted', async function ( event2 ) {
                       
                        if(  event2.target.className == "max-w-[6rem] overflow-hidden text-ellipsis text-white") {
                           
                            c += 1;
                            const s = c;
                            
                            
                            
                            
                            if(s == 1){
                                event2.target.className = event.target.className.replace("overflow-hidden","") + "_";
                                event2.target.style.color = "#149A00";
                                
                               
                            }
                            else if(s == 2){
                                event2.target.className = event.target.className.replace("overflow-hidden","")+ "_";
                                event2.target.style.color = "#990000";
                            }
                            
                            
                        };
                   
                
                }, false );
            };
           
        



        
    });
});
function getplayer(playername) {
    var h = new Headers();
    return fetch(`https://api.ashcon.app/mojang/v2/user/${playername}`)
    .then(response => response.json())
    .then(data => data);
  }

function closedd(value) {

  if(value){
    var paras = document.getElementsByClassName('rounded-lg bg-opacity-10 p-1 text-center bg-red text-red');

    for(let item of paras) {
        item.parentNode.style.display = "none";
    }


    document.getElementsByClassName('grid')[1].firstChild.addEventListener( 'DOMNodeInserted', close_loop);



  }
  else{
    document.getElementsByClassName('grid')[1].firstChild.removeEventListener( 'DOMNodeInserted', close_loop);
    var paras = document.getElementsByClassName('rounded-lg bg-opacity-10 p-1 text-center bg-red text-red');
    console.log("tes");
    for(let item of paras) {
        item.parentNode.style.display = "block";
        
    }
    if(searched)search_player(last_search);
  }
  
 
}

function opened(value) {
    if(value){
      
        var paras = document.getElementsByClassName('rounded-lg bg-opacity-10 p-1 text-center bg-green text-green');
    
        for(let item of paras) {
            item.parentNode.style.display = "none";
        }
    document.getElementsByClassName('grid')[1].firstChild.addEventListener( 'DOMNodeInserted', open_loop);
    
    
    
    }
    else{
      document.getElementsByClassName('grid')[1].firstChild.removeEventListener( 'DOMNodeInserted', open_loop);
      var paras = document.getElementsByClassName('rounded-lg bg-opacity-10 p-1 text-center bg-green text-green');
      for(let item of paras) {
          item.parentNode.style.display = "block";
          
      }
      if(searched)search_player(last_search);
    }
   
  }
  

 function close_loop( event ) {


            
    toclose(event.target,"rounded-lg bg-opacity-10 p-1 text-center bg-red text-red");
    
           
        
}
function open_loop( event ) {


    toclose(event.target,"rounded-lg bg-opacity-10 p-1 text-center bg-green text-green");
    
   

}

async function toclose(obj,classto){
    if(obj.className == classto) {
        const delay = ms => new Promise(res => setTimeout(res, ms));
        await delay(0.1);
        obj.parentElement.style.display = "none";
    };
}