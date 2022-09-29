
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

let scene;
let camera;



var needtorender = []
let renderer;
var obj;
async function serverdata_r(){
    const server_data = await fetch(`https://api.mcsrvstat.us/2/sp.spworlds.ru`)
    .then(response => response.json())
    .then(data => data);
  
    const splash =  document.getElementsByClassName("hidden md:block")[1].textContent
    if(server_data.players !== undefined){
        const o =  server_data.players.online;
        const v = server_data.version;
        if( o !== undefined  && v !== undefined){
            document.getElementsByClassName("hidden md:block")[1].textContent = "Онлайн: " + o + " - Версия: " + v + " //  " + splash;
        }
        
    }
    (async function main(counter){
        if(counter > 1500){
            
            counter = 0;
            const server_data = await fetch(`https://api.mcsrvstat.us/2/sp.spworlds.ru`)
            .then(response => response.json())
            .then(data => data);
            if(server_data.players !== undefined){
                const o =  server_data.players.online;
                const v = server_data.version;
                if( o !== undefined  && v !== undefined){
                    document.getElementsByClassName("hidden md:block")[1].textContent = "Онлайн: " + o + " - Версия: " + v + " //  " + splash;
                }
                
            }
        }
        
        setTimeout(main,0,counter+1);
    })(0);
  
  
}
 function init(){
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera( 75,1, 0.1, 1000 );
    renderer  = new THREE.WebGLRenderer({preserveDrawingBuffer:true,  alpha: true });
    renderer.setClearColor( 0x000000, 0 );
    renderer.setSize( 512, 512);
    serverdata_r();
    (async function main(){
     
        if(needtorender.length > 0){
          console.log( )
            if(needtorender[0].img === undefined ||  needtorender[0].img.parentElement == null ||  needtorender[0].img.parentElement != null && typeof needtorender[0].img.parentElement === Node || 
                needtorender[0].img.parentElement.parentElement == null){
               needtorender.shift();

            }
            else{
                
                if(needtorender[0].test == undefined){
                    await load_player_p(needtorender[0].name , needtorender[0].img,needtorender[0].pose)
                }
                else{
                    await load_player_p(needtorender[0].name , needtorender[0].img,needtorender[0].pose,needtorender[0].test)
                }
             
               needtorender.shift();
            }
       }
        setTimeout(main,0);
    })(0);
    
}
function reload_scene(){
    scene.clear()
    renderer.setSize(512,512)
    scene.background = null;
    const drl = new THREE.DirectionalLight(0xffffff,0.55);
    drl.position.x = 0;
    drl.position.z = -2;
    drl.position.y = 1;
    drl.rotation.y = THREE.MathUtils.degToRad(-180);
    drl.castShadow = true;
    scene.add(drl);
    camera.position.x = 0;
    camera.position.z = 1.1;
    camera.position.y = 1.5;

    var light = new THREE.AmbientLight(0x404040,2);
    scene.add(light);
}

async function load_player_p(name,image,pose,test = false){
    

    var pn = await getplayer2(name);
   
    let loader = new THREE.GLTFLoader();
    
    let object;
      if(pn.textures == undefined) {
        console.log(pn)
        return;
      };
    if(pn.textures.slim){
        object=  await loader.loadAsync(chrome.runtime.getURL("./alex.gltf"))
    }
    else {
        object=  await loader.loadAsync(chrome.runtime.getURL("./steve.gltf"))
    }
       
        obj= object;
     
      let texture = await new THREE.TextureLoader().loadAsync("data:image/png;base64, "+pn.textures.skin.data);
      texture.minFilter = THREE.NearestFilter;
                texture.magFilter = THREE.NearestFilter;
                texture.generateMipmaps = false;
                texture.type = THREE.UnsignedByteType;
                
                texture.format = THREE.RGBAFormat;
            
                // in this example we create the material when the texture is loaded
                object.scene.traverse( function ( child ) {

                    if ( child instanceof THREE.Mesh ) {
                   
                        if(child.name.includes("_Layer")){
                            child.material = new  THREE.MeshStandardMaterial({
                         
                                // using the alpha map property to set the texture
                                // as the alpha map for the material
                                map: texture,
                                // I also need to make sure the transparent
                                // property is true
                                transparent: true,
                                // even when opacity is one the alpha map will 
                                // still effect transparency this can just be used to set it even lower
                                opacity: 1,
                             
                                side: THREE.DoubleSide
                            });
                        }
                        else{
                            child.material.map = texture;
                        }
                        
                        
                    }
        
                } );
                
                



                reload_scene()

              
                
                
                
                object.scene.name = "p";
         
                scene.add(object.scene);
                let pose_json 
               if(test == false){
                if(sticker_data[pose] === undefined) return;
               
                pose_json = await sendcors("https://pastebin.com/raw/" + sticker_data[pose].link_id);
               }
               else{
                
                pose_json = await TEST(pose);
               }
           
          
             camera.position.x = pose_json.camera.position.x;
             camera.position.z = pose_json.camera.position.z;
             camera.position.y = pose_json.camera.position.y;
             camera.rotation.x =THREE.MathUtils.degToRad( pose_json.camera.rotation.x);
             camera.rotation.z = THREE.MathUtils.degToRad(pose_json.camera.rotation.z);
             camera.rotation.y = THREE.MathUtils.degToRad(pose_json.camera.rotation.y);
                for(var i = 0; i < pose_json.moves.length; i++){
                    var e = pose_json.moves[i]


                    let b = scene.getObjectByName( e.id );
                    if(b === undefined){
                       var s =   await loader.loadAsync(chrome.runtime.getURL("./decorations/" + e.id + '.gltf' ))
                        if(s === undefined)return;
                        s.scene.name = "d";
                
                        scene.add(s.scene);
                        b = scene.getObjectByName( e.id );
                

                    }
                    
                    if(e["rotate"] !== undefined ){
                       
                        b.rotation.x  = THREE.MathUtils.degToRad(e["rotate"][0] ) ;
                        b.rotation.y =  THREE.MathUtils.degToRad(e["rotate"][1] );
                        b.rotation.z = THREE.MathUtils.degToRad(e["rotate"][2] ) ;
                    }

                 
                    b.position.x =  e["translate"][0]/-16;
                    b.position.y =  e["translate"][1]/-16;
                    b.position.z =  e["translate"][2]/-16;
               
                }
                
                if(pose === "saul"){
                    scene.background = await new THREE.TextureLoader().loadAsync(chrome.runtime.getURL("./decorations/saul_bg.png") );
                    
                    image.title = "Лушче Позвони " + pn.username
                    renderer.setSize(32,32)
                }
                else if(pose === "i_am_eblan"){
                    scene.background = await new THREE.TextureLoader().loadAsync(chrome.runtime.getURL("./decorations/i_am_eblan_bg.png"))
                    
                    renderer.setSize(64,64);
                    
                }
                renderer.render(scene,camera);
              
                image.src = renderer.domElement.toDataURL();
               

       
        
    
}


function TEST(pose) {
    var h = new Headers();
    return fetch(chrome.runtime.getURL("./poses/"+pose+".json"))
    .then(response => response.json())
    .then(data => data);
  }

function getplayer2(playername) {
    var h = new Headers();
    return fetch(`https://api.ashcon.app/mojang/v2/user/${playername}`)
    .then(response => response.json())
    .then(data => data);
  }
  
var s = undefined;
var s_emote  = undefined;

function changesize(obj){
    if(window.innerWidth  >= 1280){
        obj.style.width = "624px";
    }
    else if (window.innerWidth  >= 1025){
        obj.style.width = "368px";
    }
    else{
        obj.style.width = "416px";
    }
}
var prefix;

var default_stickers = []
var sticker_data = {
 
}

function changevalue(d_input,input){
    if( s_emote !== undefined){
        var parent = s_emote.parentNode;
            
            var index = Array.prototype.indexOf.call(parent.children, s_emote);
            if( input.value.length <3){
                d_input.textContent = "_"
                return
            };
            d_input.value = prefix + sticker_data[default_stickers[index]].symbol  + input.value
            var event = new Event('input', {
                bubbles: true,
                cancelable: true,
            });

            input.maxLength = 300 - (prefix + sticker_data[default_stickers[index]].symbol).length
            console.log((prefix + sticker_data[default_stickers[index]].symbol).length)
            if(input.value.length > input.maxLength ){
                
                
                input.value = input.value.replace(input.value.substring(input.maxLength),"")
            
            }
        
            d_input.dispatchEvent(event);
    }
    else{
        if( input.value.length <3){
            d_input.textContent = ""
            return
        };
        d_input.value = input.value
        var event = new Event('input', {
            bubbles: true,
            cancelable: true,
        });
        input.maxLength = 300
        d_input.dispatchEvent(event);
    }
   
   
}
function changevalue_post(d_input,input){
    if( s_emote !== undefined){
        var parent = s_emote.parentNode;

            var index = Array.prototype.indexOf.call(parent.children, s_emote);
            if( input.value.length <3){
                d_input.textContent = "_"
                return
            };
            d_input.textContent = prefix + sticker_data[default_stickers[index]].symbol  + input.value
            var event = new Event('input', {
                bubbles: true,
                cancelable: true,
            });
            input.maxLength = 300  - (prefix + sticker_data[default_stickers[index]].symbol).length
            if(input.value.length > input.maxLength ){
                
                
                input.value = input.value.replace(input.value.substring(input.maxLength),"")
            
            }
            d_input.dispatchEvent(event);
    }
    else{
        if( input.value.length <3){
            d_input.textContent = ""
            return;
        };
        d_input.textContent = input.value
        var event = new Event('input', {
            bubbles: true,
            cancelable: true,
        });
          
        d_input.dispatchEvent(event);
    }

}

var emote_box_used = undefined
function loadPOST(target ){
    target.parentElement.style.display = "none"
       
        var e = document.createElement("input");
        var b = document.createElement("div");
       
        
        var b_icon= document.createElement("img");

        b_icon.src= chrome.runtime.getURL("emote_icon.png");
        b_icon.style.filter = "grayscale(1)";
        b_icon.className = "fill-current p-1 h-8 w-8";
        b.style.display = "flex";
        b.style.marginTop = "10px";
        b_icon.style.justifyContent = "center";
        b_icon.style.userSelect = "none";
        b_icon.style.pointerEvents =  "none";
        b.style.cursor = "pointer";
        
        e.className = "peer w-full border-0 bg-gray-700 text-white caret-primary-lighter outline-none";
        e.minlength = "3";
        e.maxLength = "300"
        var p = document.createElement("p");
        p.className = "tag_i";
        p.style.paddingRight = "5px"
        p.style.color = "darkgray"
        target.parentElement.parentNode.appendChild(p);
       
        target.parentElement.parentNode.appendChild(e);
        b.style.width = "50px";
        var ID = document.createElement("p");
        b.className = "focusable rounded-full pr-3 transition-colors hover:text-white _";
        target.parentElement.parentElement.style.display = "inline-flex";
        target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.appendChild(ID);
        target.parentElement.parentElement.parentElement.appendChild(b);
        ID.style.color = "white";
        b.appendChild(b_icon);
        b.onclick = async function(){
            if(s === b){
                while (emote_box_used.firstChild.lastElementChild) {
                    emote_box_used.firstChild.removeChild(emote_box_used.firstChild.lastElementChild);
                  }
                emote_box_used.parentElement.removeChild(document.getElementById("emotes_box"));
                s= undefined;
                s_emote = undefined;
                p.textContent = "";
                ID.textContent = "";
                changevalue_post(target,e)
            }
            else {
                if (emote_box_used !== undefined   ){
                    if(typeof emote_box_used.parentElement === Node){
                        emote_box_used = undefined
                        s = undefined
                        
                    }
                    else if(emote_box_used.parentElement  != undefined){
                        while (emote_box_used.firstChild.lastElementChild) {
                            emote_box_used.firstChild.removeChild(emote_box_used.firstChild.lastElementChild);
                          }
                        emote_box_used.parentElement.removeChild(emote_box_used);
                        s = undefined;
                    }
                    else{
                        emote_box_used = undefined
                        s = undefined
                    }
                    
                }
                var EMOTE_MENU = document.createElement("div");
              
                var list = document.createElement("div");
                list.style.whiteSpace = "nowrap";
                list.style.paddingTop = "25px"
                list.style.margin = "25px";
                list.style.overflowX = "scroll";
                list.style.scrollBehavior = "smooth";
                for(var i = 0; i < default_stickers.length; i++){
                    const obj = document.createElement("div");
                    const img = document.createElement("img");
                    const ii = i;
                    img.setAttribute('style','-webkit-user-drag: none')
                    img.src = chrome.runtime.getURL("./loading_emote.png")
                    img.style.userSelect = "none"
                    img.style.objectFit = "contain"
                    img.height = "118"
                    img.style.borderRadius = "15px"
                    img.width = "118"
                    img.title =  sticker_data[default_stickers[ii]].title
                    needtorender.push({
                        name:document.getElementsByClassName("h-10 w-10 cursor-pointer rounded-lg transition-transform hover:scale-105")[0].src.replace("https://visage.surgeplay.com/face/80/",''),
                        img:img,
                        pose:default_stickers[i]
                    })
 
                    obj.appendChild(img);
                    obj.className  = "rounded-2xl  bg-gray-300 p-4 text-white ";
                    EMOTE_MENU.id = "emotes_box";
                    obj.style.display = "inline-block";
                    obj.style.width = "150px";
                    obj.style.height = "150px";
                    obj.style.marginLeft = "15px";
                    
                    obj.onclick = function(){
                        if(s_emote !== undefined){
                            s_emote.style.borderWidth = "0"; 
                        }
                        s_emote = obj;
                       ID.textContent =  "айди: " + default_stickers[ii];
                        p.textContent = "использываемые символы: " +prefix + sticker_data[default_stickers[ii]].symbol ;
                        obj.style.borderWidth = "initial";
                        changevalue_post(target,e)
                       
                     
                       
                    }
                    list.append(obj);
                    
                    
                }
                
                
                EMOTE_MENU.append(list);
                EMOTE_MENU.className = "rounded-2xl text-white ";
                EMOTE_MENU.style.backgroundColor = "#5553C3";
                EMOTE_MENU.style.height = "200px"
                changesize(EMOTE_MENU);
                addEventListener('resize', (event) => {
                    if(EMOTE_MENU == undefined){
                        removeEventListener(this);
                    }
                    
                    
                    changesize(EMOTE_MENU)});
                target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.appendChild(EMOTE_MENU);
                emote_box_used = EMOTE_MENU;
                s = b;
            }
        }
        e.oninput = function(){

          
            changevalue_post(target,e);
           
        }
}

function sendcors(url) {
    return new Promise((resolve, reject) => {
        chrome.extension.sendMessage({type:  "CORS_HTTPREQUEST",url:url}, response => {
            if(response) {
                
                resolve(response);
            } else {
                console.log("no response")
                
            }
        });
    });
}
function checkforemotes1(event,data,pose){
    if(event.target.textContent.includes(data)){
        const emote = pose;
        
        
       
        if(event.target.parentElement.className.includes("grow lg:hidden")){
            event.target.textContent =  ""
            return;
        }
        else{
            event.target.textContent =  event.target.textContent.replace(data,"")
        }
       
        if( event.target.parentElement.className.includes("space-y-4 px-4")){
           
            needtorender.push({
                name:document.getElementsByClassName("hidden text-6xl text-white lg:block")[0].textContent,
                img: document.getElementsByClassName("bg-primary rounded-3xl")[0],
                pose:emote
            })
        }
        else {
            const img = document.createElement("img");
            img.setAttribute('style','-webkit-user-drag: none')
            img.style.width = "200px";
            img.style.userSelect = "none"
            img.style.height = "200px"
            img.style.objectFit = "contain"
            img.src = chrome.runtime.getURL("./loading_emote.png")
            img.style.filter  = "drop-shadow(0 2px white) drop-shadow(0 -2px white) drop-shadow(2px 0 white) drop-shadow(-2px 0 white)"
        img.height = "118"

        img.style.borderRadius = "15px"
        img.title =  sticker_data[emote].title
        img.width = "118"
        
            needtorender.push({
                name:event.target.parentElement.firstChild.href.replace("https://spworlds.ru/sp/users/",""),
                img:img,
                pose:emote
            })
             event.target.parentElement.append(img);
        }
        
      
    }
}
function  checkforemotes2(event,data,pose){
    if(event.target.textContent.includes(data) && !location.href.includes("groups")){
           
        const emote = pose;
       
        event.target.textContent =  event.target.textContent.replace(data,"")
        const img = document.createElement("img");
        img.setAttribute('style','-webkit-user-drag: none')
        img.style.width = "200px";
        img.style.filter  = "drop-shadow(0 2px white) drop-shadow(0 -2px white) drop-shadow(2px 0 white) drop-shadow(-2px 0 white)"
        img.style.height = "200px"
        img.style.objectFit = "contain"
        img.src = chrome.runtime.getURL("./loading_emote.png")
        img.style.borderRadius = "15px"
        img.title =  sticker_data[emote].title
        needtorender.push({
            name:event.target.parentElement.parentElement.firstChild.firstChild.href.replace("https://spworlds.ru/sp/users/",""),
            img:img,
            pose:emote
        })
       
        event.target.parentElement.append(img);
        }
}
waitForElm('#content').then(async (elm) => {
    
    var Maininfo = await sendcors(`https://pastebin.com/raw/y4VEvKse`);
    default_stickers = Maininfo.default_stickers;
    sticker_data = Maininfo.sticker_data;
    prefix = Maininfo.prefix;
    //code to send message to open notification. This will eventually move into my extension logic
    
    init()
    if(document.getElementsByClassName("ProseMirror").length > 0){
        loadPOST(document.getElementsByClassName("ProseMirror")[0].firstChild)
    }
    if(document.getElementsByClassName("mx-auto h-24 w-24 flex-none rounded-3xl bg-primary pt-4 pr-2 pl-2 lg:h-60 lg:w-60")[0] != undefined){
        const u = document.getElementsByClassName("mx-auto h-24 w-24 flex-none rounded-3xl bg-primary pt-4 pr-2 pl-2 lg:h-60 lg:w-60")[0];
        u.className = "bg-primary rounded-3xl" 
        u.setAttribute('style','-webkit-user-drag: none')
        u.style.userSelect = "none"

        needtorender.push({
            name:u.src.replace("https://visage.surgeplay.com/front/240/",''),
            img: u,
            pose:"idle"
        })
    }
    elm.addEventListener( 'DOMNodeInserted',async function ( event ) {
  
       
   
    
      if(event.target.className  === "mx-auto h-24 w-24 flex-none rounded-3xl bg-primary pt-4 pr-2 pl-2 lg:h-60 lg:w-60"){
        
        event.target.className = "bg-primary rounded-3xl" 
        event.target.setAttribute('style','-webkit-user-drag: none')
        event.target.style.userSelect = "none"
 
        needtorender.push({
            name:event.target.src.replace("https://visage.surgeplay.com/front/240/",''),
            img: event.target,
            pose:"idle"
        })
     }
     else if(event.target.nodeName === "P" && event.target.parentElement.className.includes("ProseMirror")  && !location.href.includes("groups")){
        loadPOST(event.target)
     }
     else if(event.target.nodeName === "P" && !event.target.parentElement.className.includes("ProseMirror")  &&  event.target.className !== "tag_i"){
     
        if(event.target.textContent === ""){
            event.target.addEventListener( "DOMSubtreeModified" ,function(){
                
                Object.keys(sticker_data).forEach(pose => {
                    checkforemotes1(event,prefix +  sticker_data[pose].symbol,pose)
                    
                });
                //ЕБЕНАЯХУЙНЯ:i_am_eblan
                checkforemotes1(event,"ЕБЕНАЯХУЙНЯ:i_am_eblan","i_am_eblan")
            })
        }
       else{
        Object.keys(sticker_data).forEach(pose => {
            checkforemotes2(event,prefix +  sticker_data[pose].symbol,pose)
        })
        checkforemotes2(event,"ЕБЕНАЯХУЙНЯ:i_am_eblan","i_am_eblan")
       }
     }
     else if(event.target.className == "absolute top-1 left-4 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus-visible:top-1 peer-focus-visible:text-sm"){
        event.target.style.pointerEvents = "none";
        event.target.style.userSelect = "none";
     }
     else if(event.target.className  === "peer w-full border-0 bg-gray-700 text-white caret-primary-lighter outline-none" && event.target.id.length !== 0  && event.target.id.includes("post_comment_input")  ){
       
        event.target.style.display = "none";
        var e = document.createElement("input");
        var b = document.createElement("div");
        
        var b_icon= document.createElement("img");

        b_icon.src= chrome.runtime.getURL("emote_icon.png");
        b_icon.style.filter = "grayscale(1)";
        b_icon.className = "fill-current p-1 h-8 w-8";
        b.style.display = "flex";
        b.style.marginTop = "10px";
        b_icon.style.justifyContent = "center";
        b_icon.style.userSelect = "none";
        b_icon.style.pointerEvents =  "none";
        b.style.cursor = "pointer";
        
        e.className = "peer w-full border-0 bg-gray-700 text-white caret-primary-lighter outline-none";
        e.minlength = "3";
        e.maxLength = "300"
        var p = document.createElement("p");
        var ID = document.createElement("p");
        p.className = "tag_i";
        p.style.paddingRight = "5px"
        p.style.color = "darkgray"
        event.target.parentElement.style.display = "inline-flex"
        event.target.parentElement.appendChild(p);
        event.target.parentElement.appendChild(e);
        b.style.width = "50px";
        
        b.className = "focusable rounded-full pr-3 transition-colors hover:text-white _";
        event.target.parentElement.parentElement.parentElement.parentElement.appendChild(ID);
        event.target.parentElement.parentElement.parentElement.appendChild(b);
      
        b.appendChild(b_icon);
        b.onclick = function(){
            if(s === b){
               emote_box_used.parentElement.removeChild(document.getElementById("emotes_box"));
                s= undefined;
                s_emote = undefined;
                p.textContent = "";
                ID.textContent =  "";
                changevalue(event.target,e)
            }
            else {
                if (emote_box_used !== undefined ){
                    if(typeof emote_box_used.parentElement === Node){
                        emote_box_used = undefined
                        s = undefined
                        
                    }
                    else if(emote_box_used.parentElement  != undefined){
                        emote_box_used.parentElement.removeChild(emote_box_used);
                        s = undefined;
                    }
                    else{
                        emote_box_used = undefined
                        s = undefined
                    }
                }
                var EMOTE_MENU = document.createElement("div");
              
                var list = document.createElement("div");
                list.style.whiteSpace = "nowrap";
                list.style.paddingTop = "25px"
                list.style.margin = "25px";
                list.style.overflowX = "scroll";
                list.style.scrollBehavior = "smooth";
                for(var i = 0; i < default_stickers.length; i++){
                    const obj = document.createElement("div");
                    const img = document.createElement("img");
                    const ii = i;
                    img.setAttribute('style','-webkit-user-drag: none')
                    img.src = chrome.runtime.getURL("./loading_emote.png")
                    img.style.userSelect = "none"
                    img.style.objectFit = "contain"
                    img.height = "118"
                    img.width = "118"
                    img.title =  sticker_data[default_stickers[ii]].title
                    img.style.borderRadius = "15px"
                    needtorender.push({
                        name:document.getElementsByClassName("h-10 w-10 cursor-pointer rounded-lg transition-transform hover:scale-105")[0].src.replace("https://visage.surgeplay.com/face/80/",''),
                        img:img,
                        pose:default_stickers[ii]
                    })
                    obj.appendChild(img)
                    obj.className  = "rounded-2xl  bg-gray-300 p-4 text-white ";
                    EMOTE_MENU.id = "emotes_box";
                    obj.style.display = "inline-block";
                    obj.style.width = "150px";
                    
                    obj.style.height = "150px";
                    obj.style.marginLeft = "15px";
                    obj.onclick = function(){
                        if(s_emote !== undefined){
                            s_emote.style.borderWidth = "0"; 
                        }
                        s_emote = obj;
                        p.textContent = "использываемые символы: " +prefix + sticker_data[default_stickers[ii]].symbol ;
                        ID.textContent = "айди: " + default_stickers[ii]
                        obj.style.borderWidth = "initial";
                      
                        changevalue(event.target,e)
                    }
                  
                    list.append(obj);
                }
                
                
                EMOTE_MENU.append(list);
                EMOTE_MENU.className = "rounded-2xl text-white ";
                EMOTE_MENU.style.backgroundColor = "#5553C3";
                EMOTE_MENU.style.height = "200px"
                changesize(EMOTE_MENU);
                addEventListener('resize', (event) => {
                    if(EMOTE_MENU == undefined){
                        removeEventListener(this);
                    }
                    
                    
                    changesize(EMOTE_MENU)});
                event.target.parentElement.parentElement.parentElement.parentElement.appendChild(EMOTE_MENU);
                emote_box_used = EMOTE_MENU;
                s = b;
            }
        }
        e.oninput = function(){

          
            changevalue(event.target,e);
           
        }
     }
   
    


    })

 
     
 
    
 });