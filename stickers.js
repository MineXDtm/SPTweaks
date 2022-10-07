
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
    renderer.shadowMap.enabled = true;
    serverdata_r();
    (async function main(){
     
        if(needtorender.length > 0){
          
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
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
    scene.background = null;
    
    var light = new THREE.AmbientLight(0xffffff,0.5);
   

    scene.add(light);
    const drl = new THREE.DirectionalLight(0xffffff,0.55);
    drl.position.x = 0;
    drl.position.z = -2;
    drl.distance = 2000;
    drl.position.y = 1;
    drl.shadow.mapSize.width = 512; // default
    drl.shadow.mapSize.height = 512; // default
    drl.shadow.camera.near = 0.5; // default
    drl.shadow.camera.far = 1000; 
    drl.rotation.x = THREE.MathUtils.degToRad(90);
    drl.rotation.y = THREE.MathUtils.degToRad(-180);
    drl.castShadow = true;
    scene.add(drl);
    const helper = new THREE.CameraHelper( drl.shadow.camera );
    scene.add( helper );
    drl.target.position.set(0, -1, 0);
    scene.add(drl.target);
    camera.position.x = 0;
    camera.position.z = 1.1;
    camera.position.y = 1.5;

}
var playerbuffer = {}
var posebuffer = {}
let alex;
let steve;

(async () => {
    try {
        alex =   await new THREE.GLTFLoader().loadAsync(chrome.runtime.getURL("./alex.gltf"));
         steve =   await new THREE.GLTFLoader().loadAsync(chrome.runtime.getURL("./steve.gltf"));
    } catch (e) {
        // Deal with the fact the chain failed
    }
})();
async function load_player_p(name,image,pose,backgraund  = undefined,test = undefined){
    
    let object;
    let texture;
    if(playerbuffer[name] === undefined){
        var pn = await getplayer2(name);
   
      
    
        if(pn.textures == undefined) {
            console.log(pn)
            return;
        };
        if(pn.textures.slim){
            object=  alex.scene.clone();
        }
        else {
            console.log("testsss")
            object=  steve.scene.clone();
        }
       
        obj= object;
        texture = await new THREE.TextureLoader().loadAsync("data:image/png;base64, "+pn.textures.skin.data);
        texture.minFilter = THREE.NearestFilter;
        texture.magFilter = THREE.NearestFilter;
        texture.generateMipmaps = false;
        texture.type = THREE.UnsignedByteType;
                
        texture.format = THREE.RGBAFormat;
        playerbuffer[name] = {
            "slim":pn.textures.slim,
            "nick": pn.username,
            "texture":texture
        }
    }
    else{
        if( playerbuffer[name].slim){
            object=  alex.scene.clone();
        }
        else {
            object=  steve.scene.clone();
        }
        texture = playerbuffer[name].texture
    }
    
            
                object.traverse( function ( child ) {
                    child.castShadow = true;
                    if ( child instanceof THREE.Mesh ) {
                        child.receiveShadow =true;
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
                            child.material.side = THREE.FrontSide;
                            
                        }
                        
                        
                    }
        
                } );
                
                



                reload_scene()

              
                
                
                
                object.name = "p";
                object.castShadow = true;
                scene.add(object);
                let pose_json 
            if(test === undefined ){
                if(sticker_data[pose] === undefined) return;
                if(posebuffer[pose]  == undefined){
                    pose_json = await sendcors("https://pastebin.com/raw/" + sticker_data[pose].link_id);
                    posebuffer[pose] = pose_json;
                }
                else{
                    pose_json = posebuffer[pose];
                }
               }
               else if( test.includes("pose")){
                console.log("test")
                pose_json = await TEST(pose);
               }
          
             camera.position.x = pose_json.camera.position.x;
             camera.position.z = pose_json.camera.position.z;
             camera.position.y = pose_json.camera.position.y;
             camera.rotation.order = 'YXZ'; 
             camera.rotation.x = THREE.MathUtils.degToRad( pose_json.camera.rotation.x);
             camera.rotation.z = THREE.MathUtils.degToRad(pose_json.camera.rotation.z);
             camera.rotation.y = THREE.MathUtils.degToRad(pose_json.camera.rotation.y);
                for(var i = 0; i < pose_json.moves.length; i++){
                    var e = pose_json.moves[i]


                    let b = scene.getObjectByName( e.id );
                   
                    if(b === undefined){
                        var model_json =   await sendcors("https://minexdtm.com/models/"+ e.id + ".gltf");
                        console.log(model_json)
                        if(model_json=== undefined)return;
                       var s =   await  load_model_from_string(JSON.stringify(model_json));
                        if(s === undefined)return;
                        s.scene.name = "d";
                
                        scene.add(s.scene);
                        b = scene.getObjectByName( e.id );
                        

                    }
                    b.rotation.order = 'YXZ'; 
                    if(e["rotate"] !== undefined ){
                       
                        b.rotation.x  = THREE.MathUtils.degToRad(e["rotate"][0] ) ;
                        b.rotation.y =  THREE.MathUtils.degToRad(e["rotate"][1] );
                        b.rotation.z = THREE.MathUtils.degToRad(e["rotate"][2] ) ;
                    }

                    
                    b.position.x =  e["translate"][0]/-16;
                    b.position.y =  e["translate"][1]/-16;
                    b.position.z =  e["translate"][2]/-16;
               
                }
                
                   
                    if(backgraund !== undefined || test !== undefined &&backgraund != undefined  ||  test === undefined && sticker_data[pose].backgraund != undefined){
                        var bgs;
                        if(test != undefined && test.includes("bg" )){
                            bgs = backgraund
                        }
                        
                        for(var i  = 0; i < backgraunds.length; i++){
                            const bg = backgraunds[i];
                            if( test === undefined && sticker_data[pose].backgraund  != undefined){
                                if(bg.id === sticker_data[pose].backgraund ){
                                    bgs = bg;
                                }
                            }
                            else if ( bg.symbol === backgraund){
                                bgs = bg;
                            }
                           
                         }
            
                        if(bgs.model !== false) {
                            
                            var bg;
                            if(bg_buffer[bgs.id]  == undefined){
                                var bgg =   await sendcors("https://minexdtm.com/backgraund/"+bgs.id+".gltf");
                                bg= await load_model_from_string(JSON.stringify(bgg));
                                bg_buffer[bgs.id] = bg;
                            }
                            else{
                                bg=bg_buffer[bgs.id] ;
                            }
                            bg.scene.name = "bg";
                           
                           
                            bg.scene.traverse( function ( child ) {

                                if ( child instanceof THREE.Mesh ) {
                               
                                    
                                        child.material.transparent = true
                                        child.receiveShadow =true;
                                        child.castShadow = true;
                                        child.renderOrder = -1;
                                }
                    
                            } );
                            scene.add(bg.scene);
                        }
                        
                       
                        
                        var bg_skybox;
                        
                        if(skybox_buffer[bgs.id] === undefined){
                            if(bgs.skybox.length > 0){
                                
                               
                                if(bgs.skybox.length == 1){
                                   
                                    
                                    skybox_buffer[bgs.id]  =await new THREE.TextureLoader().loadAsync("https://i.imgur.com/"+bgs.skybox[0]+".png")
                                    bg_skybox=  skybox_buffer[bgs.id] 
                                    
                                }
                                else if (bgs.skybox.length === 6){
                                    bg_skybox = await new THREE.CubeTextureLoader().loadAsync(["https://i.imgur.com/"+bgs.skybox[0]+".png","https://i.imgur.com/"+bgs.skybox[1]+".png","https://i.imgur.com/"+bgs.skybox[2]+".png","https://i.imgur.com/"+bgs.skybox[3]+".png","https://i.imgur.com/"+bgs.skybox[4]+".png","https://i.imgur.com/"+bgs.skybox[5]+".png"]);
                                    skybox_buffer[bgs.id] = bg_skybox;
                                }
                                
                            }
                           
                            
                        }
                        else{
                            
                            bg_skybox = skybox_buffer[bgs.id];
                        }
                       
                        scene.background = bg_skybox;
                        
                    }
                    
                
               
                
                
                
                b = scene.getObjectByName( e.id );
                if( test == undefined && sticker_data[pose].render_size != undefined){
                    renderer.setSize(sticker_data[pose].render_size[0],sticker_data[pose].render_size[1])
                   }
                renderer.render(scene,camera);
                image.title = image.title.replace("сюда_ник", playerbuffer[name].nick);
                image.src = renderer.domElement.toDataURL();
               

       
        
    
}
var bg_buffer = {}
var skybox_buffer = {}
function load_model_from_string(string) {
    return new Promise((resolve, reject) => {
        const GLTFLoader = new THREE.GLTFLoader();
        GLTFLoader.parse(string,null,function(loaded){
            resolve(loaded);
        });
    });
}

function TEST(pose) {
    console.log(chrome.runtime.getURL("./poses/"+pose+".json"))
    return fetch(chrome.runtime.getURL("./poses/"+pose+".json"))
    .then(response => response.json())
    .then(data => data);
}

function getplayer2(playername) {
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
var backgraunds = []
var default_backgraunds = []

function changevalue(d_input,input,symbol_log){
   
    if( s_emote !== undefined){
    
       
            
            
            symbolinfo_update(symbol_log,s_emote_id);
            if( input.value.length <3){
                d_input.textContent = "_";
                return;
            };
            if(bg_c != undefined){
                d_input.value  = prefix + sticker_data[s_emote_id].symbol +  "" + bg_c + " " + input.value;
                
               
            }
            else{
                d_input.value = prefix + sticker_data[s_emote_id].symbol+ " "   + input.value;
                
               
            }
           
            var event = new Event('input', {
                bubbles: true,
                cancelable: true,
            });

            input.maxLength = 300 - (prefix + sticker_data[s_emote_id].symbol).length
            console.log((prefix + sticker_data[s_emote_id].symbol).length)
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
function symbolinfo_update(symbol_log,sticker){
    if(bg_c != undefined){
        symbol_log.textContent = "использываемые символы: " +prefix + sticker_data[sticker].symbol+  "" + bg_c;
    }
    else{
        symbol_log.textContent = "использываемые символы: " +prefix + sticker_data[sticker].symbol;
    }
}
function changevalue_post(d_input,input,symbol_log){
    if( s_emote !== undefined){
       
           
            symbolinfo_update(symbol_log,s_emote_id);
            if( input.value.length <3){
                d_input.textContent = "_"
                return
            };

            
            if(bg_c != undefined){
                d_input.textContent = prefix + sticker_data[s_emote_id].symbol+"" + bg_c + " "  + input.value;
               
            }
            else{
                d_input.textContent = prefix + sticker_data[s_emote_id].symbol + " "  + input.value;
               
                
            }
            var event = new Event('input', {
                bubbles: true,
                cancelable: true,
            });
            input.maxLength = 300  - (prefix + sticker_data[s_emote_id].symbol).length
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

          
            changevalue_post(target,e,p);
           
        }
}

function sendcors(url) {
    return new Promise((resolve, reject) => {
        chrome.extension.sendMessage({type:  "CORS_HTTPREQUEST",url:url}, response => {
            if(response) {
                
                resolve(response);
            } else {
                resolve(undefined)
                console.log("no response")
                
            }
        });
    });
}
var bg_c = undefined;
var bg_b = undefined;
function choose_backgraund(backgraund,b ){
   
    if(bg_b != undefined){
       
        bg_b.style.borderColor  = "transparent";
        bg_b = undefined;
    }
    b.style.borderColor  = "white";
   
    bg_c = backgraund;
    bg_b = b;


}
var s_emote_id;
function show_emotes_list(parent,d_input,c_input,button,symbol_log,post){
    var id_log = document.createElement("p");
    function update_i(){
        if(!post){
            changevalue(d_input,c_input,symbol_log)
        }
        else{
            changevalue_post(d_input,c_input,symbol_log);
        }
    }
    if(s === button){
        var child = document.getElementById("emotelist").lastElementChild; 
        
        while (child) {
            document.getElementById("emotelist").removeChild(child);
            child = document.getElementById("emotelist").lastElementChild;
        }
        emote_box_used.parentElement.removeChild(document.getElementById("emotes_box"));
         s= undefined;
         s_emote = undefined;
         symbol_log.textContent = "";
         id_log.textContent =  "";
         bg_b = undefined;
         bg_c = undefined;
         s_emote_id = undefined;
         update_i()
        
     }
     else {
         if (emote_box_used !== undefined ){
             if(typeof emote_box_used.parentElement === Node){
                 emote_box_used = undefined
                 s = undefined
                 bg_b = undefined;
                bg_c = undefined;
                 
             }
             else if(emote_box_used.parentElement  != undefined){
                 emote_box_used.parentElement.removeChild(emote_box_used);
                 s = undefined;
                 bg_b = undefined;
                 bg_c = undefined;
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
         list.id = "emotelist";

         id_log.className = "tag_i";
         id_log.style.paddingRight = "5px"
         id_log.style.color = "darkgray";
         id_log.style.padding = "25px";
         id_log.style.color = 'white';
         list.style.scrollBehavior = "smooth";
         EMOTE_MENU.id = "emotes_box";
         
         function loadstickers(){
            list.innerHTML = "";
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
                    bg:bg_c,
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
                    s_emote_id = default_stickers[ii];
                    id_log.textContent = "айди: " + default_stickers[ii]
                    obj.style.borderWidth = "initial";
                  
                    update_i()
                }
             
                if(s_emote_id === default_stickers[ii]){
                    s_emote = obj;
                    
                    id_log.textContent = "айди: " + default_stickers[ii]
                    obj.style.borderWidth = "initial";
                    update_i()
                    
                }
                list.append(obj);
            }
         }
         loadstickers();
         var list2 = document.createElement("div");
         list2.style.whiteSpace = "nowrap";
         list2.style.paddingTop = "5px"
         list2.style.margin = "25px";
         list2.style.marginTop = "0px";
         list2.style.overflowX = "scroll";
         list2.style.display = "flex";
         list2.style.overflowY = "hidden";
         list2.style.scrollBehavior = "smooth";
         const title2 = document.createElement("p");
         title2.textContent = "Фон";
         title2.style.margin = "30px";
         title2.style.marginBottom = "0px";

         function bginfo(b,title_,icon){
            const title = document.createElement("p");
            title.style.display = "inline-flex";
            title.textContent = title_;
            title.style.margin = "5px";
            title.style.userSelect = "none";
            if(icon != undefined){
                const icon_ = document.createElement("img");
                icon_.style.display = "inline-flex";
                icon_.style.height = "auto";
                icon_.style.width = icon_.style.height;
                icon_.style.borderRadius = "25px";
                icon_.style.userSelect = "none";
                icon_.src =  icon;
                b.appendChild(icon_);
            }
            b.appendChild(title);
         }

         const empty = document.createElement("div");
         
         empty.className = "backgraund_choose";
         bginfo(empty,"без фона",undefined);
         empty.onclick = async function(){
            if(bg_b === empty)return;
            choose_backgraund(undefined,empty)
         
            await loadstickers();
            update_i()
         };
         list2.appendChild(empty)
         choose_backgraund(undefined,empty)
         for(var i  = 0; i < backgraunds.length; i++){
            if(!default_backgraunds.includes(backgraunds[i].id))continue;
            const bg = backgraunds[i];
            const bg_obg = document.createElement("div");
            bg_obg.className = "backgraund_choose";
            bginfo(bg_obg,bg.title, "https://i.imgur.com/"+bg.skybox[0]+".png");
            
            bg_obg.onclick = async function(){
                if(bg_b === bg_obg)return;
                choose_backgraund(bg.symbol,bg_obg)
            
                await loadstickers();
                console.log(s_emote)
                update_i()
            };
            list2.appendChild(bg_obg)
         }
        
         

        
        
         EMOTE_MENU.appendChild(id_log);
         EMOTE_MENU.append(list);
         EMOTE_MENU.appendChild(title2);
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
            backgraund = event.target.textContent.split("")[1].split(" ")[0] ;
        }
         
        
       
        if(event.target.parentElement.className.includes("grow lg:hidden")){
            event.target.textContent =  ""
            return;
        }
        else{
           
            if(backgraund != undefined){
                
                
                
                event.target.textContent =  event.target.textContent.replace(data +  ""  + event.target.textContent.split(event.target.textContent.split(data)[1][0])[1].split(" ")[0],"") 
            }
            else{
                event.target.textContent =  event.target.textContent.replace(data,"")
            }
        }
      
        if( event.target.parentElement.className.includes("space-y-4 px-4")){
           
            needtorender.push({
                name:document.getElementsByClassName("hidden text-6xl text-white lg:block")[0].textContent,
                img: document.getElementsByClassName("bg-primary rounded-3xl")[0],
                bg:backgraund,
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
        var backgraund = undefined;
        if(event.target.textContent.split(data)[1][0] == "" ){
            backgraund = event.target.textContent.split("")[1].split(" ")[0] ;
        }
        if(backgraund != undefined){
                
                
                
            event.target.textContent =  event.target.textContent.replace(data +  ""  + event.target.textContent.split(event.target.textContent.split(data)[1][0])[1].split(" ")[0],"") 
        }
        else{
            event.target.textContent =  event.target.textContent.replace(data,"")
        }
        const img = document.createElement("img");
        img.setAttribute('style','-webkit-user-drag: none')
        img.style.width = "200px";
        img.style.filter  = "drop-shadow(0 2px white) drop-shadow(0 -2px white) drop-shadow(2px 0 white) drop-shadow(-2px 0 white)"
        img.style.height = "200px"
        img.style.objectFit = "contain"
        img.src = chrome.runtime.getURL("./loading_emote.png")
        img.style.borderRadius = "15px"
        img.style.marginTop = "25px";
        img.className = "sticker";
        img.title =  sticker_data[emote].title
        needtorender.push({
            name:event.target.parentElement.parentElement.firstChild.firstChild.href.replace("https://spworlds.ru/sp/users/",""),
            img:img,
            bg:backgraund,
            pose:emote
        })
       
        event.target.parentElement.parentElement.append(img);
        

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
    console.log(Maininfo);
    default_stickers = Maininfo.default_stickers;
    sticker_data = Maininfo.sticker_data;
    prefix = Maininfo.prefix;
    backgraunds = Maininfo.backgraunds;
    default_backgraunds = Maininfo.default_backgraunds;

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
            test:["pose"],
            pose:"trick_or_treat"
        })
     }
     else if(event.target.className  === "mx-auto max-h-96 cursor-pointer rounded-xl"){
        if( event.target.parentElement.parentElement.getElementsByClassName("sticker")[0] != undefined){
            event.target.parentElement.parentElement.insertBefore(event.target.parentElement,event.target.parentElement.parentElement.getElementsByClassName("sticker")[0] )
        }
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

          
            changevalue(event.target,e,p);
           
        }
     }
   
    


    })

 
     
 
    
 });