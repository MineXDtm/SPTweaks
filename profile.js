
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
function init(){
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera( 75,1, 0.1, 1000 );
    renderer  = new THREE.WebGLRenderer({preserveDrawingBuffer:true,  alpha: true });
    renderer.setClearColor( 0x000000, 0 );
    renderer.setSize( 512, 512);
    (async function main(counter){
     
        if(needtorender.length > 0){
            console.log(needtorender[0])
            if(needtorender[0].img === undefined){
               needtorender.shift();

            }
            else{
               await load_player_p(needtorender[0].name , needtorender[0].img,needtorender[0].pose)
               needtorender.shift();
            }
       }
        setTimeout(main,0,counter+1);
    })(0);
    
}
function reload_scene(){
    scene.clear()

    const drl = new THREE.DirectionalLight(0xffffff,0.5);
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

async function load_player_p(name,image,pose){
    

    var pn = await getplayer2(name);
   
    let loader = new THREE.GLTFLoader();
    
    let object;
      
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
                let pose_json = await getText(pose);
             console.log(pose_json);
             camera.position.x = pose_json.camera.position.x;
             camera.position.z = pose_json.camera.position.z;
             camera.position.y = pose_json.camera.position.y;
             camera.rotation.x =THREE.MathUtils.degToRad( pose_json.camera.rotation.x);
             camera.rotation.z = THREE.MathUtils.degToRad(pose_json.camera.rotation.z);
             camera.rotation.y = THREE.MathUtils.degToRad(pose_json.camera.rotation.y);
                pose_json.moves.forEach(function(e){



                    let b = scene.getObjectByName( e.id );
       
                    if(e["rotate"] !== undefined ){
                       
                        b.rotation.x  = THREE.MathUtils.degToRad(e["rotate"][0] ) ;
                        b.rotation.y =  THREE.MathUtils.degToRad(e["rotate"][1] );
                        b.rotation.z = THREE.MathUtils.degToRad(e["rotate"][2] ) ;
                    }

                 
                    b.position.x =  e["translate"][0]/-16;
                    b.position.y =  e["translate"][1]/-16;
                    b.position.z =  e["translate"][2]/-16;
                      
                });
                renderer.render(scene,camera);
              
                image.src = renderer.domElement.toDataURL();
               

       
        
    
}

function getText(pose) {
    var h = new Headers();
    return fetch(chrome.runtime.getURL("./poses/" +pose+".json"))
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
var emotes = ["idle","hello","think",'sad',"facepalm","steven_armstrong","cry"]
function changevalue(d_input,input){
    if( s_emote !== undefined){
        var parent = s_emote.parentNode;
        
            var index = Array.prototype.indexOf.call(parent.children, s_emote);
            d_input.value = "<SpTweaks:" + emotes[index] + "> " + input.value
            var event = new Event('input', {
                bubbles: true,
                cancelable: true,
            });
              
            d_input.dispatchEvent(event);
    }
    else{
        d_input.value = input.value
        var event = new Event('input', {
            bubbles: true,
            cancelable: true,
        });
          
        d_input.dispatchEvent(event);
    }
    console.log(d_input.value);
   
}
function changevalue_post(d_input,input){
    if( s_emote !== undefined){
        var parent = s_emote.parentNode;
        
            var index = Array.prototype.indexOf.call(parent.children, s_emote);
            d_input.textContent = "<SpTweaks:" + emotes[index] + "> " + input.value
            var event = new Event('input', {
                bubbles: true,
                cancelable: true,
            });
              
            d_input.dispatchEvent(event);
    }
    else{
        d_input.textContent = input.value
        var event = new Event('input', {
            bubbles: true,
            cancelable: true,
        });
          
        d_input.dispatchEvent(event);
    }
    console.log(d_input.textContent);
    console.log(d_input);
}

var emote_box_used = undefined

waitForElm('#content').then(async (elm) => {
 
    init()
    elm.addEventListener( 'DOMNodeInserted',async function ( event ) {
      
     if(event.target.className  === "mx-auto h-24 w-24 flex-none rounded-3xl bg-primary pt-4 pr-2 pl-2 lg:h-60 lg:w-60"){
        needtorender.push({
            name:event.target.src.replace("https://visage.surgeplay.com/front/240/",''),
            img: event.target,
            pose:"idle"
        })
     }
     else if(event.target.nodeName === "P" && event.target.parentElement.className.includes("ProseMirror")  && !location.href.includes("groups")){
        event.target.parentElement.style.display = "none"
       
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
        event.target.parentElement.parentNode.appendChild(e);
        b.style.width = "50px";
     
        b.className = "focusable rounded-full pr-3 transition-colors hover:text-white _";
        
        event.target.parentElement.parentElement.parentElement.appendChild(b);
      
        b.appendChild(b_icon);
        b.onclick = async function(){
            if(s === b){
                emote_box_used.parentElement.removeChild(document.getElementById("emotes_box"));
                s= undefined;
                s_emote = undefined;
                changevalue_post(event.target,e)
            }
            else {
                if (emote_box_used !== undefined  ){
                    if(typeof emote_box_used.parentElement === Node){
                        emote_box_used = undefined
                        s = undefined
                        
                    }
                    else{
                        emote_box_used.parentElement.removeChild(emote_box_used);
                        s = undefined;
                    }
                    
                }
                var EMOTE_MENU = document.createElement("div");
              
                var list = document.createElement("div");
                list.style.whiteSpace = "nowrap";
                list.style.paddingTop = "25px"
                list.style.margin = "25px";
                list.style.overflowX = "scroll";
                list.style.scrollBehavior = "smooth";
                for(var i = 0; i < emotes.length; i++){
                    const obj = document.createElement("div");
                    const img = document.createElement("img");
                    img.setAttribute('style','-webkit-user-drag: none')
                    img.src = chrome.runtime.getURL("./loading_emote.png")
                    img.style.userSelect = "none"
                    needtorender.push({
                        name:document.getElementsByClassName("h-10 w-10 cursor-pointer rounded-lg transition-transform hover:scale-105")[0].src.replace("https://visage.surgeplay.com/face/80/",''),
                        img:img,
                        pose:emotes[i]
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
                       
                        
                        obj.style.borderWidth = "initial";
                        changevalue_post(event.target,e)
                       
                     
                       
                    }
                    list.append(obj);
                    
                    
                }
                
                
                EMOTE_MENU.append(list);
                EMOTE_MENU.className = "rounded-2xl text-white ";
                EMOTE_MENU.style.backgroundColor = "#990099";
                EMOTE_MENU.style.height = "200px"
                changesize(EMOTE_MENU);
                addEventListener('resize', (event) => {
                    if(EMOTE_MENU == undefined){
                        removeEventListener(this);
                    }
                    
                    
                    changesize(EMOTE_MENU)});
                event.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.appendChild(EMOTE_MENU);
                emote_box_used = EMOTE_MENU;
                s = b;
            }
        }
        e.oninput = function(){

          
            changevalue_post(event.target,e);
           
        }
     }
     else if(event.target.nodeName === "P" && !event.target.parentElement.className.includes("ProseMirror") ){
        if(event.target.textContent === ""){
            event.target.addEventListener( "DOMSubtreeModified" ,function(){
                if(event.target.textContent.includes("<SpTweaks:")){
                    const emote = event.target.textContent.split("<SpTweaks:")[1].split(">")[0];
                    if(!emotes.includes(emote))return;
                    
                   
                    if(event.target.parentElement.className.includes("grow lg:hidden")){
                        event.target.textContent =  ""
                        return;
                    }
                    else{
                        event.target.textContent =  event.target.textContent.split("<SpTweaks:")[1].split(">")[1]
                    }
                    const img = document.createElement("img");
                    img.setAttribute('style','-webkit-user-drag: none')
                    img.style.width = "200px";
                    img.style.userSelect = "none"
                    img.style.height = "200px"
                    if( event.target.parentElement.className.includes("space-y-4 px-4")){
                        
                        needtorender.push({
                            name:document.getElementsByClassName("hidden text-6xl text-white lg:block")[0].textContent,
                            img:img,
                            pose:emote
                        })
                    }
                    else {
                    
                        needtorender.push({
                            name:event.target.parentElement.firstChild.href.replace("https://spworlds.ru/sp/users/",""),
                            img:img,
                            pose:emote
                        })
                       
                    }
                    
                    event.target.parentElement.append(img);
                }
              
                
            })
        }
       else{
        if(event.target.textContent.includes("<SpTweaks:") && !location.href.includes("groups")){
           
            const emote = event.target.textContent.split("<SpTweaks:")[1].split(">")[0];
            if(!emotes.includes(emote))return;
            event.target.textContent =  event.target.textContent.split("<SpTweaks:")[1].split(">")[1]
            const img = document.createElement("img");
            img.setAttribute('style','-webkit-user-drag: none')
            img.style.width = "200px";
            img.style.height = "200px"
            needtorender.push({
                name:event.target.parentElement.parentElement.firstChild.firstChild.href.replace("https://spworlds.ru/sp/users/",""),
                img:img,
                pose:emote
            })
           
            event.target.parentElement.append(img);
        }
      
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
        event.target.parentElement.appendChild(e);
        b.style.width = "50px";
     
        b.className = "focusable rounded-full pr-3 transition-colors hover:text-white _";
        
        event.target.parentElement.parentElement.parentElement.appendChild(b);
      
        b.appendChild(b_icon);
        b.onclick = function(){
            if(s === b){
               emote_box_used.parentElement.removeChild(document.getElementById("emotes_box"));
                s= undefined;
                s_emote = undefined;
                changevalue(event.target,e)
            }
            else {
                if (emote_box_used !== undefined ){
                    if(typeof emote_box_used.parentElement === Node){
                        emote_box_used = undefined
                        s = undefined
                        
                    }
                    else{
                        emote_box_used.parentElement.removeChild(emote_box_used);
                        s = undefined;
                    }
                }
                var EMOTE_MENU = document.createElement("div");
              
                var list = document.createElement("div");
                list.style.whiteSpace = "nowrap";
                list.style.paddingTop = "25px"
                list.style.margin = "25px";
                list.style.overflowX = "scroll";
                list.style.scrollBehavior = "smooth";
                for(var i = 0; i < emotes.length; i++){
                    const obj = document.createElement("div");
                    const img = document.createElement("img");
                    img.setAttribute('style','-webkit-user-drag: none')
                    img.src = chrome.runtime.getURL("./loading_emote.png")
                    img.style.userSelect = "none"
                    needtorender.push({
                        name:document.getElementsByClassName("h-10 w-10 cursor-pointer rounded-lg transition-transform hover:scale-105")[0].src.replace("https://visage.surgeplay.com/face/80/",''),
                        img:img,
                        pose:emotes[i]
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
                        
                        
                        obj.style.borderWidth = "initial";
                      
                        changevalue(event.target,e)
                    }
                  
                    list.append(obj);
                }
                
                
                EMOTE_MENU.append(list);
                EMOTE_MENU.className = "rounded-2xl text-white ";
                EMOTE_MENU.style.backgroundColor = "#990099";
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
     else if(event.target.className === "focusable rounded-full pr-3 transition-colors hover:text-white" ){
        event.target.onclick = function(){
            console.log(event.target.parentElement.firstChild.firstChild.children[1].value.length);
            if(event.target.parentElement.firstChild.firstChild.children[1].value.length >= 3 && event.target.parentElement.firstChild.firstChild.children[1].value.length <= 300){
                event.target.parentElement.firstChild.firstChild.children[1].value = ""
                if (s_emote !== null){
                   
                   
                  
                    s_emote.parentElement.parentElement.parentElement.removeChild(document.getElementById("emotes_box"));
                    s_emote = null;
                }
            }
           
        }
      
        //|| event.target.className === "focusable rounded-full transition-colors hover:text-white"

     }
    })
 
     
 
    
 });