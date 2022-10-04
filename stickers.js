
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
                    await load_player_p(needtorender[0].name , needtorender[0].img,needtorender[0].pose,needtorender[0].bg)
                }
                else{
                    await load_player_p(needtorender[0].name , needtorender[0].img,needtorender[0].pose,needtorender[0].bg,needtorender[0].test)
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
    
    var light = new THREE.AmbientLight(0x404040,2);
    scene.add(light);
    const drl = new THREE.DirectionalLight(0xffffff,0.55);
    drl.position.x = 0;
    drl.position.z = -2;
    drl.position.y = 1;
    drl.rotation.x = THREE.MathUtils.degToRad(90);
    drl.rotation.y = THREE.MathUtils.degToRad(-180);
    drl.castShadow = true;
    scene.add(drl);
    drl.target.position.set(0, -1, 0);
    scene.add(drl.target);
    camera.position.x = 0;
    camera.position.z = 1.1;
    camera.position.y = 1.5;

}

async function load_player_p(name,image,pose,backgraund  = undefined,test = false){
    

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
                object.scene.castShadow = true;
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
                else{
                    if(backgraund !== undefined){
                        var bg =   await loader.loadAsync(chrome.runtime.getURL("./avatar_backgraund/bg_default.gltf" ))
                        bg.scene.name = "bg";
                        
                        scene.add(bg.scene);
                        let bg_skybox = await new THREE.TextureLoader().loadAsync(chrome.runtime.getURL("./avatar_backgraund/skybox.png"));
                        scene.background = bg_skybox;
                    }
                    
                }
               
                
                
                
                b = scene.getObjectByName( e.id );
            
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
       
        b.className = "focusable rounded-full pr-3 transition-colors hover:text-white _";
        target.parentElement.parentElement.style.display = "inline-flex";
        
        target.parentElement.parentElement.parentElement.appendChild(b);
       
        b.appendChild(b_icon);
        b.onclick = async function(){
            
            var pp = target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
            
            show_emotes_list( pp,target,e,b,p,true);
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
function choose_backgraund(){

}
function show_emotes_list(parent,d_input,c_input,button,symbol_log,post){
    var id_log = document.createElement("p");
    if(s === button){
        emote_box_used.parentElement.removeChild(document.getElementById("emotes_box"));
         s= undefined;
         s_emote = undefined;
         symbol_log.textContent = "";
         id_log.textContent =  "";
         if(!post){
            changevalue(d_input,c_input)
         }
         else{
            changevalue_post(d_input,c_input);
         }
        
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
         list.style.margin = "15px";
         list.style.marginTop = "0px";
         list.style.overflowX = "scroll";
         

         id_log.className = "tag_i";
         id_log.style.paddingRight = "5px"
         id_log.style.color = "darkgray";
         id_log.style.padding = "15px";
         id_log.style.color = 'white';
         list.style.scrollBehavior = "smooth";
         EMOTE_MENU.id = "emotes_box";
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
             img.style.filter  = "drop-shadow(0 2px white) drop-shadow(0 -2px white) drop-shadow(2px 0 white) drop-shadow(-2px 0 white)";
             needtorender.push({
                 name:document.getElementsByClassName("h-10 w-10 cursor-pointer rounded-lg transition-transform hover:scale-105")[0].src.replace("https://visage.surgeplay.com/face/80/",''),
                 img:img,
                 pose:default_stickers[ii]
             })
             obj.appendChild(img)
             obj.className  = "rounded-2xl  bg-gray-300 p-4 text-white ";
             
             obj.style.display = "inline-block";
             obj.style.width = "150px";
             obj.style.backgroundColor = "rgba(0, 0, 0,0.1)";
             obj.style.height = "150px";
             obj.style.cursor = "pointer";
             obj.style.marginLeft = "15px";
             obj.onclick = function(){
                 if(s_emote !== undefined){
                     s_emote.style.borderWidth = "0"; 
                 }
                 s_emote = obj;
                 symbol_log.textContent = "использываемые символы: " +prefix + sticker_data[default_stickers[ii]].symbol ;
                 id_log.textContent = "айди: " + default_stickers[ii]
                 obj.style.borderWidth = "initial";
               
                if(!post){
                    changevalue(d_input,c_input)
                }
                else{
                    changevalue_post(d_input,c_input);
                }
             }
           
             list.append(obj);
         }
         
         var list2 = document.createElement("div");
         list2.style.whiteSpace = "nowrap";
         list2.style.paddingTop = "5px"
         list2.style.margin = "25px";
         list2.style.overflowX = "scroll";
         list2.style.scrollBehavior = "smooth";
         const empty = document.createElement("div");
         empty.className = "backgraund_choose";
         const default_bg = document.createElement("div");
         default_bg.className = "backgraund_choose";
        
         list2.appendChild(empty)
         list2.appendChild(default_bg)
         EMOTE_MENU.appendChild(id_log);
         EMOTE_MENU.append(list);
         EMOTE_MENU.append(list2);
         EMOTE_MENU.className = "rounded-2xl text-white ";
         EMOTE_MENU.style.backgroundColor = "#5553C3";
         
         changesize(EMOTE_MENU);
         addEventListener('resize', (event) => {
             if(EMOTE_MENU == undefined){
                 removeEventListener(this);
             }
             
             

             changesize(EMOTE_MENU)});
             parent.appendChild(EMOTE_MENU);
             if(post)
                parent.insertBefore(EMOTE_MENU, d_input.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.nextElementSibling);
             
            
        
         emote_box_used = EMOTE_MENU;
         s = button;
     }
}



function checkforemotes1(event,data,pose){
    if(event.target.textContent.includes(data)){
        const emote = pose;
        //
        var backgraund = undefined;
        if(event.target.textContent.split(data)[1][0] == "" ){
            backgraund = event.target.textContent.split(data)[1][1] ;
        }
         
        
       
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
            img.height = "118";
            img.style.marginTop = "25px";
            img.style.borderRadius = "15px"
            img.title =  sticker_data[emote].title
            img.width = "118"
            
            needtorender.push({
                name:event.target.parentElement.firstChild.href.replace("https://spworlds.ru/sp/users/",""),
                img:img,
                bg:backgraund,
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
        img.style.marginTop = "25px";
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
    var link = document.createElement("link");
    link.href = chrome.extension.getURL("./styles/sptweaks_default_style.css");
    link.type = "text/css";
    link.rel = "stylesheet";
    document.getElementsByTagName("head")[0].appendChild(link);
    let bg_i = document.createElement("div");
    //bg_i.style.backgroundImage = "url("+chrome.runtime.getURL("./backgraund/19a27b959db7c85cff4506708e21be13.jpg")+")";
    bg_i.style.position = "fixed";
    bg_i.style.height = "100vh";
    bg_i.style.backgroundRepeat = "no-repeat";
    bg_i.style.backgroundSize = "cover";
    bg_i.style.width = "100vw";
    bg_i.style.zIndex = "-1";
   
    document.body.appendChild(bg_i);
    document.body.insertBefore(bg_i,document.body.firstChild);
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
        b_icon.style.margin = "auto";
        b_icon.style.justifyContent = "center";
        b_icon.style.objectFit = "scale-down";
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
        event.target.parentElement.style.display = "inline-flex"
        event.target.parentElement.appendChild(p);
        event.target.parentElement.appendChild(e);
        b.style.width = "50px";
        b.style.height = "auto";
        b.style.alignContent = "center";
        b.className = "focusable rounded-full pr-3 transition-colors hover:text-white _";
     
        event.target.parentElement.parentElement.parentElement.appendChild(b);
      
        b.appendChild(b_icon);
        b.onclick = function(){
           show_emotes_list( event.target.parentElement.parentElement.parentElement.parentElement,event.target,e,b,p,false);
        }
        e.oninput = function(){

          
            changevalue(event.target,e);
           
        }
     }
   
    


    })

 
     
 
    
 });