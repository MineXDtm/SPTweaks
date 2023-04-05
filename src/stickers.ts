import browser from "webextension-polyfill";

import { default_check, sendcors, waitForElm } from "./SPTCore/utilities";

import sticker from "./components/stickers/sticker.svelte";
import sticker_menu from "./components/stickers/stickers_menu.svelte";
import * as THREE from "three";
import { type GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type Sticker from "./components/stickers/sticker.svelte";
browser.runtime.onMessage.addListener((request) => {
    return default_check(request, "stickers")

});


let scene;
let camera;



let renderer;
var obj;
async function serverdata_r() {
    const server_data = await fetch(`https://api.mcsrvstat.us/2/sp.spworlds.ru`)
        .then(response => response.json())
        .then(data => data);

    const splash = document.getElementsByClassName("hidden md:block")[1].textContent
    if (server_data.players !== undefined) {
        const o = server_data.players.online;
        const v = server_data.version;
        if (o !== undefined && v !== undefined) {
            document.getElementsByClassName("hidden md:block")[1].textContent = "Онлайн: " + o + " - Версия: " + v + " //  " + splash;
        }

    }
    (async function main(counter) {
        if (document.getElementsByClassName("hidden md:block")[1] == undefined) return;
        if (counter > 1500) {

            counter = 0;
            const server_data = await fetch(`https://api.mcsrvstat.us/2/sp.spworlds.ru`)
                .then(response => response.json())
                .then(data => data);
            if (server_data.players !== undefined) {
                const o = server_data.players.online;
                const v = server_data.version;
                if (o !== undefined && v !== undefined) {
                    document.getElementsByClassName("hidden md:block")[1].textContent = "Онлайн: " + o + " - Версия: " + v + " //  " + splash;
                }

            }
        }

        setTimeout(main, 0, counter + 1);
    })(0);


}

var scenebg = new THREE.Scene();
var skyb;

type render_request = {
    img: sticker | HTMLImageElement,
    name: string,
    pose: string,
    bg?: any,
    test?: any
}
var needtorender = [] as Array<render_request>
async function init() {
    scene = new THREE.Scene()
    skyb = await new GLTFLoader().loadAsync(browser.runtime.getURL("src/assets/skybox.gltf"));
    scenebg.add(skyb.scene);
    var light = new THREE.AmbientLight(0xffffff, 1);
    scenebg.add(light);

    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true, alpha: true, antialias: true });
    renderer.setClearColor(0xffffff, 0);
    renderer.setSize(512, 512);


    renderer.autoClear = false;
    serverdata_r();
    (async function main() {

        if (needtorender.length > 0) {


            if (needtorender[0].img === undefined) {
                needtorender.shift();
                setTimeout(main, 0);
                return;
            }
            if (needtorender[0].img instanceof sticker == false) {
                var elm = needtorender[0].img as HTMLElement;

                if (elm.parentElement == null || elm.parentElement == null ||
                    elm.parentElement.parentElement == null) {

                    needtorender.shift();
                    setTimeout(main, 0);
                    return;
                }
            }
            if (needtorender[0].img instanceof sticker == true) {

                var s = needtorender[0].img as sticker;
                if (s.$$.root.parentElement instanceof Node == false) {

                    needtorender.shift();
                    setTimeout(main, 0);
                    return;
                }


            }


            if (needtorender[0].test == undefined) {
                await load_player_p(needtorender[0].name, needtorender[0].img, needtorender[0].pose, { backgraund: needtorender[0].bg, issticker: needtorender[0].img instanceof sticker } as load_player_options)
            }
            else {
                await load_player_p(needtorender[0].name, needtorender[0].img, needtorender[0].pose, { backgraund: needtorender[0].bg, test: needtorender[0].test, issticker: needtorender[0].img instanceof sticker } as load_player_options)
            }


            needtorender.shift();

        }
        setTimeout(main, 0);
    })();

}
var light = new THREE.AmbientLight(0xffffff, 0.3);
let drl = new THREE.DirectionalLight(0xffffff, 1);
function reload_scene() {
    scene.clear()

    renderer.clear()
    renderer.setSize(512, 512)
    scene.background = null;
    scene.fog = null;

    drl = new THREE.DirectionalLight(0xffffff, 1);
    scene.add(light);

}
var playerbuffer = {}
var posebuffer = {}
let alex;
let steve;
(async () => {

    alex = await new GLTFLoader().loadAsync(browser.runtime.getURL("src/assets/alex.gltf"));
    steve = await new GLTFLoader().loadAsync(browser.runtime.getURL("src/assets/steve.gltf"));

})();
type load_player_options = {
    backgraund: any, test: any, issticker: boolean
}
async function load_player_p(name: string, image: sticker | HTMLImageElement, pose, options: load_player_options) {

    let object;
    const test = options.test;
    const backgraund = options.backgraund;
    let texture;
    if (playerbuffer[name] === undefined) {
        var pn = await getplayer2(name);



        if (pn.textures == undefined) {
            return;
        };
        if (pn.textures.slim) {
            object = alex.scene.clone();
        }
        else {
            object = steve.scene.clone();
        }

        obj = object;
        texture = await new THREE.TextureLoader().loadAsync("data:image/png;base64, " + pn.textures.skin.data);
        texture.minFilter = THREE.NearestFilter;
        texture.magFilter = THREE.NearestFilter;
        texture.generateMipmaps = false;
        texture.type = THREE.UnsignedByteType;

        texture.format = THREE.RGBAFormat;
        playerbuffer[name] = {
            "slim": pn.textures.slim,
            "nick": pn.username,
            "texture": texture
        }
    }
    else {
        if (playerbuffer[name].slim) {
            object = alex.scene.clone();
        }
        else {
            object = steve.scene.clone();
        }
        texture = playerbuffer[name].texture
    }


    object.traverse(function (child) {

        if (child instanceof THREE.Mesh) {

            if (child.name.includes("_Layer")) {
                child.material = new THREE.MeshStandardMaterial({

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
            else {
                child.material.map = texture;
                child.material.side = THREE.FrontSide;

            }


        }

    });




    reload_scene()






    object.name = "p";

    scene.add(object);
    let pose_json

    if (test === undefined) {
        if (sticker_data[pose] === undefined) return;
        if (posebuffer[pose] == undefined) {
            pose_json = await sendcors("https://pastebin.com/raw/" + sticker_data[pose].link_id);
            posebuffer[pose] = pose_json;
        }
        else {
            pose_json = posebuffer[pose];
        }
    }
    else if (test.includes("pose")) {
        pose_json = await TEST(pose);
    }

    camera.position.x = pose_json.camera.position.x;
    camera.position.z = pose_json.camera.position.z;
    camera.position.y = pose_json.camera.position.y;
    camera.rotation.order = 'YXZ';
    camera.rotation.x = THREE.MathUtils.degToRad(pose_json.camera.rotation.x);
    camera.rotation.z = THREE.MathUtils.degToRad(pose_json.camera.rotation.z);
    camera.rotation.y = THREE.MathUtils.degToRad(pose_json.camera.rotation.y);
    for (var i = 0; i < pose_json.moves.length; i++) {
        var e = pose_json.moves[i]


        let b = scene.getObjectByName(e.id);

        if (b === undefined) {
            var model_json = await sendcors("http://localhost:4000/assets/models/" + e.id + ".gltf");
            if (model_json === undefined) return;
            var s = await load_model_from_string(JSON.stringify(model_json)) as GLTF;
            if (s === undefined) return;
            s.scene.name = "d";

            scene.add(s.scene);
            b = scene.getObjectByName(e.id);


        }
        b.rotation.order = 'YXZ';
        if (e["rotate"] !== undefined) {

            b.rotation.x = THREE.MathUtils.degToRad(e["rotate"][0]);
            b.rotation.y = THREE.MathUtils.degToRad(e["rotate"][1]);
            b.rotation.z = THREE.MathUtils.degToRad(e["rotate"][2]);
        }


        b.position.x = e["translate"][0] / -16;
        b.position.y = e["translate"][1] / -16;
        b.position.z = e["translate"][2] / -16;

    }

    if (test == undefined && sticker_data[pose].render_size != undefined) {
        renderer.setSize(sticker_data[pose].render_size[0], sticker_data[pose].render_size[1])
    }

    if (backgraund !== undefined || test !== undefined && backgraund != undefined || test === undefined && sticker_data[pose].backgraund != undefined) {

        var bgs;

        if (test != undefined && test.includes("bg")) {
            bgs = backgraund
        }

        for (var i = 0; i < backgraunds.length; i++) {
            const bg = backgraunds[i] as any;
            if (test === undefined && sticker_data[pose].backgraund != undefined) {
                if (bg.id === sticker_data[pose].backgraund) {
                    bgs = bg;
                }
            }
            else if (bg.symbol === backgraund) {
                bgs = bg;
            }

        }




        if (bgs.model !== false) {

            var bg;
            if (bg_buffer[bgs.id] == undefined) {

                var bgg = await sendcors("http://localhost:4000/assets/backgraund/" + bgs.id + ".gltf");

                bg = await load_model_from_string(JSON.stringify(bgg));
                bg_buffer[bgs.id] = bg;
            }
            else {
                bg = bg_buffer[bgs.id];
            }
            bg.scene.name = "bg";


            bg.scene.traverse(function (child) {

                if (child instanceof THREE.Mesh) {


                    child.material.transparent = true
                    child.renderOrder = -1;
                }

            });
            scene.add(bg.scene);
        }




        if (bgs.skybox != undefined) {
            if (bgs.skybox.type == 0) {

                var bg_skybox;

                if (skybox_buffer[bgs.id] === undefined) {

                    skybox_buffer[bgs.id] = await new THREE.TextureLoader().loadAsync("https://i.imgur.com/" + bgs.skybox.url + ".png")
                    bg_skybox = skybox_buffer[bgs.id]

                }
                else {
                    bg_skybox = skybox_buffer[bgs.id];

                }
                scene.background = bg_skybox;


            }
            else if (bgs.skybox.type == 1) {

                var t = await new THREE.TextureLoader().loadAsync("https://i.imgur.com/" + bgs.skybox.url + ".png");
                t.minFilter = THREE.NearestFilter;
                t.magFilter = THREE.NearestFilter;

                skyb.scene.traverse(function (child) {

                    if (child instanceof THREE.Mesh) {



                        child.material.side = THREE.BackSide;
                        child.material.map = t;
                    }

                });

                skyb.scene.position.x = camera.position.x;
                skyb.scene.position.y = camera.position.y;
                skyb.scene.position.z = camera.position.z;
                renderer.render(scenebg, camera);
            }

        }


        if (bgs.lightpoint != undefined) {


            const point_l = new THREE.PointLight(bgs.lightpoint.color, bgs.lightpoint.a, bgs.lightpoint.d);

            point_l.position.set(bgs.lightpoint.position[0], bgs.lightpoint.position[1], bgs.lightpoint.position[2]);

            scene.add(point_l);


        }

        if (bgs.ambient != undefined) {
            drl = new THREE.DirectionalLight(bgs.ambient[0], bgs.ambient[1])

        }

        if (bgs.fog !== undefined) {
            scene.fog = new THREE.Fog(bgs.fog.color, bgs.fog.near, bgs.fog.far);
        }

    }








    drl.position.x = 0;
    drl.position.z = -2;

    drl.position.y = 1;

    drl.rotation.x = THREE.MathUtils.degToRad(90);
    drl.rotation.y = THREE.MathUtils.degToRad(-180);

    drl.target.position.set(0, -1, 0);
    scene.add(drl);
    scene.add(drl.target);


    renderer.render(scene, camera);

    image.title = image.title.replace("сюда_ник", playerbuffer[name].nick);
    if (options.issticker == false) {
        image.style.backgroundColor = "";
    }


    image.src = renderer.domElement.toDataURL();

}
var bg_buffer = {}
var skybox_buffer = {}
function load_model_from_string(string: string) {
    return new Promise((resolve, reject) => {

        new GLTFLoader().parse(string, "", function (loaded) {
            resolve(loaded);
        });
    });
}

function TEST(pose) {
    return fetch(browser.runtime.getURL("src/assets/poses/" + pose + ".json"))
        .then(response => response.json())
        .then(data => data);
}

function getplayer2(playername) {
    return fetch(`https://api.ashcon.app/mojang/v2/user/${playername}`)
        .then(response => response.json())
        .then(data => data);
}

var s = undefined;
var s_emote: any;

function changesize(obj, post = true) {
    if (post) {
        if (window.innerWidth >= 1280) {
            obj.style.width = "656px";
        }
        else if (window.innerWidth >= 1020) {
            obj.style.width = "400px";
        }
        else if (window.innerWidth >= 500) {
            obj.style.width = "448px";
        }
        else {
            obj.style.width = "364px";
        }
    }
    else {
        if (window.innerWidth >= 1280) {
            obj.style.width = "624px";
        }
        else if (window.innerWidth >= 1025) {
            obj.style.width = "368px";
        }
        else {
            obj.style.width = "416px";
        }

    }

}
var prefix;

var default_stickers = []
var sticker_data = {

}
var backgraunds = []
var default_backgraunds = []

function changevalue(d_input, input: HTMLInputElement, symbol_log) {

    if (s_emote !== undefined) {




        symbolinfo_update(symbol_log, s_emote_id);
        if (input.value.length < 3) {
            d_input.textContent = "_";
            return;
        };
        if (bg_c != undefined) {
            d_input.value = prefix + sticker_data[s_emote_id].symbol + "" + bg_c + " " + input.value;
            input.maxLength = 300 - (prefix + sticker_data[s_emote_id].symbol + "" + bg_c + " ").length

        }
        else {
            d_input.value = prefix + sticker_data[s_emote_id].symbol + " " + input.value;
            input.maxLength = 300 - (prefix + sticker_data[s_emote_id].symbol + " ").length

        }

        var event = new Event('input', {
            bubbles: true,
            cancelable: true,
        });


        if (input.value.length > input.maxLength) {


            input.value = input.value.replace(input.value.substring(input.maxLength), "")

        }

        d_input.dispatchEvent(event);
    }
    else {
        if (input.value.length < 3) {
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
        input.focus();

    }


}
function symbolinfo_update(symbol_log, sticker) {
    if (bg_c != undefined) {
        symbol_log.textContent = "Используемые символы: " + prefix + sticker_data[sticker].symbol + "" + bg_c;
    }
    else {
        symbol_log.textContent = "Используемые символы: " + prefix + sticker_data[sticker].symbol;
    }
}
function changevalue_post(d_input, input, symbol_log) {
    if (s_emote !== undefined) {


        symbolinfo_update(symbol_log, s_emote_id);
        if (input.value.length < 3) {
            d_input.textContent = "_"
            return
        };


        if (bg_c != undefined) {
            d_input.textContent = prefix + sticker_data[s_emote_id].symbol + "" + bg_c + " " + input.value;
            input.maxLength = 300 - (prefix + sticker_data[s_emote_id].symbol + "" + bg_c + " ").length
        }
        else {
            d_input.textContent = prefix + sticker_data[s_emote_id].symbol + " " + input.value;
            input.maxLength = 300 - (prefix + sticker_data[s_emote_id].symbol + " ").length

        }
        var event = new Event('input', {
            bubbles: true,
            cancelable: true,
        });

        if (input.value.length > input.maxLength) {


            input.value = input.value.replace(input.value.substring(input.maxLength), "")

        }
        d_input.dispatchEvent(event);
    }
    else {
        if (input.value.length < 3) {
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

var emote_box_used: sticker_menu;
function loadPOST(target) {
    target.parentElement.style.display = "none"

    var e = document.createElement("input");
    var b = document.createElement("div");


    var b_icon = document.createElement("img");

    b_icon.src = browser.runtime.getURL("src/assets/emote_icon.png");
    b_icon.style.filter = "grayscale(1)";
    b_icon.className = "fill-current p-1 h-8 w-8";
    b.style.display = "flex";
    b.style.marginTop = "10px";
    b_icon.style.justifyContent = "center";
    b_icon.style.userSelect = "none";
    b_icon.style.pointerEvents = "none";
    b.style.cursor = "pointer";

    e.className = "peer w-full border-0 bg-gray-700 text-white caret-primary-lighter outline-none";
    e.minLength = 3;
    e.maxLength = 300
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
    b.onclick = async function (ev: MouseEvent) {

        var pp = target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;

        show_emotes_list(pp, target, e, b, p, true, [ev.clientX, ev.clientY]);
    }
    e.oninput = function () {


        changevalue_post(target, e, p);

    }
}





var bg_c = undefined;
var bg_b: any;
function choose_backgraund(backgraund, b) {

    if (bg_b != undefined) {

        bg_b.style.borderColor = "transparent";
        bg_b = undefined;
    }
    b.style.borderColor = "rgba(255,255,255,0.5)";

    bg_c = backgraund;
    bg_b = b;


}
var s_emote_id;



// function show_emotes_list(parent, d_input, c_input, button, symbol_log, post) {
//     var id_log = document.createElement("p");
//     function update_i() {
//         if (!post) {
//             changevalue(d_input, c_input, symbol_log)
//         }
//         else {
//             changevalue_post(d_input, c_input, symbol_log);
//         }
//     }
//     if (s === button) {
//         var child = document.getElementById("emotelist")?.lastElementChild;

//         while (child) {
//             document.getElementById("emotelist")?.removeChild(child);
//             child = document.getElementById("emotelist")?.lastElementChild;
//         }
//         emote_box_used.parentElement.removeChild(document.getElementById("emotes_box"));
//         s = undefined;
//         s_emote = undefined;
//         symbol_log.textContent = "";
//         id_log.textContent = "";
//         bg_b = undefined;
//         bg_c = undefined;
//         s_emote_id = undefined;
//         update_i()

//     }
//     else {
//         if (emote_box_used !== undefined) {
//             if (typeof emote_box_used.parentElement === typeof Node) {
//                 emote_box_used = undefined
//                 s = undefined
//                 bg_b = undefined;
//                 bg_c = undefined;

//             }
//             else if (emote_box_used.parentElement != undefined) {
//                 emote_box_used.parentElement.removeChild(emote_box_used);
//                 s = undefined;
//                 bg_b = undefined;
//                 bg_c = undefined;
//             }
//             else {
//                 emote_box_used = undefined
//                 s = undefined
//             }
//         }
//         var EMOTE_MENU = document.createElement("div");

//         var list = document.createElement("div");
//         list.style.whiteSpace = "nowrap";

//         list.style.paddingTop = "25px"
//         list.style.margin = "15px";
//         list.style.marginTop = "0px";
//         list.style.overflowX = "scroll";
//         list.style.height = "205px"
//         list.style.display = "flow-root";
//         list.id = "emotelist";

//         id_log.className = "tag_i";
//         id_log.style.paddingRight = "5px"
//         id_log.style.padding = "5px";
//         id_log.style.paddingLeft = "25px";
//         id_log.style.paddingTop = "25px";
//         id_log.style.color = 'white';
//         list.style.scrollBehavior = "smooth";
//         EMOTE_MENU.id = "emotes_box";
//         EMOTE_MENU.style.paddingBottom = "5px";
//         function loadstickers() {
//             list.innerHTML = "";
//             for (var i = 0; i < default_stickers.length; i++) {
//                 const obj = document.createElement("div");


//                 const ii = i;







//                 obj.className = "rounded-2xl  bg-gray-300 text-white ";

//                 obj.style.display = "inline-flex";
//                 obj.style.width = "150px";
//                 obj.style.backgroundColor = "rgba(0, 0, 0,0.1)";
//                 obj.style.height = "150px";
//                 obj.style.cursor = "pointer";
//                 obj.style.marginLeft = "15px";
//                 obj.style.borderColor = "transparent";
//                 obj.style.verticalAlign = "bottom";
//                 obj.style.borderWidth = "initial";

//                 obj.onclick = function () {
//                     if (s_emote !== undefined) {
//                         s_emote.style.borderColor = "transparent";
//                     }
//                     s_emote = obj;
//                     s_emote_id = default_stickers[ii];
//                     id_log.textContent = "ID: " + default_stickers[ii]
//                     obj.style.borderColor = "white";
//                     c_input
//                     update_i()
//                 }

//                 if (s_emote_id === default_stickers[ii]) {
//                     s_emote = obj;

//                     id_log.textContent = "ID: " + default_stickers[ii]
//                     obj.style.borderColor = "white";
//                     update_i()

//                 }
//                 list.append(obj);
//                 var sticker_i = new sticker({
//                     target: obj,
//                     props: {
//                         title: sticker_data[default_stickers[ii]].title,
//                         height: 118,
//                         width: 118,
//                         outline_size: 3
//                     }

//                 });
//                 var el = sticker_i.$$.root.lastChild as HTMLElement;
//                 el.style.margin = "auto";

//                 var imgg = document.getElementsByClassName("h-10 w-10 cursor-pointer rounded-lg transition-transform hover:scale-105")[0] as HTMLImageElement;
//                 needtorender.push({
//                     name: imgg.src.replace("https://visage.surgeplay.com/face/80/", ''),
//                     img: sticker_i,
//                     bg: bg_c,
//                     pose: default_stickers[ii]
//                 })

//             }
//         }
//         loadstickers();
//         var list2 = document.createElement("div");
//         list2.style.whiteSpace = "nowrap";
//         list2.style.paddingTop = "5px"
//         list2.style.margin = "15px";
//         list2.style.marginLeft = "25px";
//         list2.style.marginTop = "0px";
//         list2.style.overflowX = "scroll";
//         list2.style.display = "flex";
//         list2.style.display = "flow-root"
//         list2.style.overflowY = "hidden";
//         list2.style.scrollBehavior = "smooth";
//         list2.style.height = "75px"
//         const title2 = document.createElement("p");
//         title2.textContent = "Фон";
//         title2.style.margin = "30px";
//         title2.style.marginBottom = "0px";

//         function bginfo(b, title_, icon) {
//             const title = document.createElement("p");
//             title.style.display = "inline-flex";
//             title.textContent = title_.charAt(0).toUpperCase() + title_.slice(1);
//             title.style.margin = "5px";
//             title.style.userSelect = "none";

//             if (icon != undefined) {
//                 const icon_ = document.createElement("img");
//                 icon_.src = icon;
//                 icon_.style.display = "inline-flex";
//                 icon_.style.height = "36px";

//                 icon_.style.borderRadius = "25px";
//                 icon_.style.userSelect = "none";
//                 icon_.style.width = icon_.style.height;
//                 b.appendChild(icon_);
//             }
//             b.appendChild(title);
//         }

//         const empty = document.createElement("div");

//         empty.className = "backgraund_choose";
//         bginfo(empty, "без фона", undefined);
//         empty.onclick = async function () {
//             if (bg_b === empty) return;
//             choose_backgraund(undefined, empty)

//             await loadstickers();
//             update_i()
//         };
//         list2.appendChild(empty)
//         choose_backgraund(undefined, empty)
//         for (var i = 0; i < backgraunds.length; i++) {
//             if (!default_backgraunds.includes(backgraunds[i].id)) continue;
//             const bg = backgraunds[i];
//             const bg_obg = document.createElement("div");
//             bg_obg.className = "backgraund_choose";

//             bginfo(bg_obg, bg.title, "https://i.imgur.com/" + bg.icon + ".png");

//             bg_obg.onclick = async function () {
//                 if (bg_b === bg_obg) return;
//                 choose_backgraund(bg.symbol, bg_obg)

//                 await loadstickers();
//                 update_i()
//             };
//             list2.appendChild(bg_obg)
//         }





//         EMOTE_MENU.appendChild(id_log);
//         EMOTE_MENU.append(list);
//         EMOTE_MENU.appendChild(title2);
//         EMOTE_MENU.append(list2);
//         EMOTE_MENU.className = "rounded-2xl text-white bg-gray-500";


//         changesize(EMOTE_MENU, post);
//         var f = (event: Event) => {
//             if (EMOTE_MENU == undefined) {
//                 removeEventListener("resize", f);
//             }



//             changesize(EMOTE_MENU, post)
//         }
//         addEventListener('resize', f);
//         parent.appendChild(EMOTE_MENU);
//         if (post)
//             parent.insertBefore(EMOTE_MENU, d_input.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.nextElementSibling);



//         emote_box_used = EMOTE_MENU;
//         s = button;
//     }
// }


function show_emotes_list(parent: HTMLElement, d_input, c_input, button, symbol_log, post, position) {
    var id_log = document.createElement("p");
    function update_i() {
        if (!post) {
            changevalue(d_input, c_input, symbol_log)
        }
        else {
            changevalue_post(d_input, c_input, symbol_log);
        }
    }
    if (emote_box_used != undefined) {
        var child = document.getElementById("emotelist")?.lastElementChild;

        while (child) {
            document.getElementById("emotelist")?.removeChild(child);
            child = document.getElementById("emotelist")?.lastElementChild;
        }
        emote_box_used.root.parentElement.removeChild(emote_box_used.root);
        emote_box_used = undefined;
        s = undefined;
        s_emote = undefined;
        symbol_log.textContent = "";
        id_log.textContent = "";
        bg_b = undefined;
        bg_c = undefined;
        s_emote_id = undefined;
        update_i()

    }
    else {
        var imgg = document.getElementsByClassName("h-10 w-10 cursor-pointer rounded-lg transition-transform hover:scale-105")[0] as HTMLImageElement;
        var renderhandler = (sticker: Sticker, stickerid) => {

            needtorender.push({
                name: imgg.src.replace("https://visage.surgeplay.com/face/80/", ''),
                img: sticker,
                bg: bg_c,
                pose: stickerid
            })
        }
        var emote_menu = new sticker_menu({ target: document.body, props: { position: position, sticker_list: default_stickers, stickers_data: sticker_data, renderhandler: renderhandler } });


        emote_box_used = emote_menu;
        s = button;

    }
}


function checkforemotes1(event, data, pose) {
    if (event.target.textContent.includes(data)) {
        const emote = pose;
        //
        var backgraund = undefined;
        if (event.target.textContent.split(data)[1][0] == "") {
            backgraund = event.target.textContent.split("")[1].split(" ")[0];
        }



        if (event.target.parentElement.className.includes("grow lg:hidden")) {
            event.target.textContent = ""
            return;
        }
        else {

            if (backgraund != undefined) {



                event.target.textContent = event.target.textContent.replace(data + "" + event.target.textContent.split(event.target.textContent.split(data)[1][0])[1].split(" ")[0], "")
            }
            else {
                event.target.textContent = event.target.textContent.replace(data, "")
            }
        }

        if (event.target.parentElement.className.includes("space-y-4 px-4")) {

            needtorender.push({
                name: document.getElementsByClassName("hidden text-6xl text-white lg:block")[0].textContent,
                img: document.getElementsByClassName("bg-primary rounded-3xl")[0] as HTMLImageElement,
                bg: backgraund,
                pose: emote
            })
        }
        else {


            var sticker_i = new sticker({
                target: event.target.parentElement,
                props: {
                    title: sticker_data[emote].title,
                    height: 200,
                    width: 200,
                    outline_size: 5
                }

            });

            needtorender.push({
                name: event.target.parentElement.firstChild.href.replace("https://spworlds.ru/sp/users/", ""),
                img: sticker_i,
                bg: backgraund,
                pose: emote
            })

        }


    }
}
function checkforemotes2(event, data, pose) {
    if (event.target.textContent.includes(data) && !location.href.includes("groups")) {

        const emote = pose;
        var backgraund = undefined;
        if (event.target.textContent.split(data)[1][0] == "") {
            backgraund = event.target.textContent.split("")[1].split(" ")[0];
        }
        if (backgraund != undefined) {



            event.target.textContent = event.target.textContent.replace(data + "" + event.target.textContent.split(event.target.textContent.split(data)[1][0])[1].split(" ")[0], "")
        }
        else {
            event.target.textContent = event.target.textContent.replace(data, "")
        }
        var sticker_i = new sticker({
            target: event.target.parentElement.parentElement,
            props: {
                title: sticker_data[emote].title,
                height: 200,
                width: 200,
                outline_size: 5
            }

        });


        needtorender.push({
            name: event.target.parentElement.parentElement.firstChild.firstChild.href.replace("https://spworlds.ru/sp/users/", ""),
            img: sticker_i,
            bg: backgraund,
            pose: emote
        })

    }
}


// const originalFetch = window.fetch;

// window.fetch = function () {
//     return originalFetch.apply(this, arguments)
//         .then(response => {
//             return response.json()
//                 .then(json => {
//                     console.log(json);
//                     return Promise.resolve(response);
//                 });
//         });
// };

async function enable() {

    // const targetNode = document.getElementById("content");
    // targetNode.children[0].innerHTML = '';
    // // Options for the observer (which mutations to observe)
    // const config = { attributes: true, childList: true, subtree: true };

    // // Callback function to execute when mutations are observed
    // const callback = (mutationList, observer) => {
    //   for (const mutation of mutationList) {
    //     if (mutation.attributeName === "class") {
    //         targetNode.children[0].innerHTML = '';
    //     } 
    //   }
    // };
    // const observer = new MutationObserver(callback);
    // observer.observe(targetNode, config);




    var link = document.createElement("link");
    link.href = browser.runtime.getURL("sptweaks.css");
    link.type = "text/css";
    link.rel = "stylesheet";
    document.getElementsByTagName("head")[0].appendChild(link);

    var Maininfo = await sendcors(`https://pastebin.com/raw/y4VEvKse`) as any;
    default_stickers = Maininfo.default_stickers;
    sticker_data = Maininfo.sticker_data;
    prefix = Maininfo.prefix;

    backgraunds = Maininfo.backgraunds;

    default_backgraunds = Maininfo.default_backgraunds;

    init()
    if (document.getElementsByClassName("ProseMirror").length > 0 && !location.href.includes("campaigns")) {
        loadPOST(document.getElementsByClassName("ProseMirror")[0].firstChild)
    }
    if (document.getElementsByClassName("mx-auto h-24 w-24 flex-none rounded-3xl bg-primary pt-4 pr-2 pl-2 lg:h-60 lg:w-60")[0] != undefined) {
        const u = document.getElementsByClassName("mx-auto h-24 w-24 flex-none rounded-3xl bg-primary pt-4 pr-2 pl-2 lg:h-60 lg:w-60")[0] as HTMLImageElement;
        u.className = "bg-primary rounded-3xl"
        u.setAttribute('style', '-webkit-user-drag: none')
        u.style.userSelect = "none"

        needtorender.push({
            name: u.src.replace("https://visage.surgeplay.com/front/240/", ''),
            img: u,
            pose: Maininfo.default_profile_icon
        })
    }

    document.addEventListener('DOMNodeInserted', async function (event) {


        var element = event.target as any;
        if (element.className === "mx-auto h-24 w-24 flex-none rounded-3xl bg-primary pt-4 pr-2 pl-2 lg:h-60 lg:w-60") {

            element.className = "bg-primary rounded-3xl"
            element.setAttribute('style', '-webkit-user-drag: none')
            element.style.userSelect = "none"

            needtorender.push({
                name: element.src.replace("https://visage.surgeplay.com/front/240/", ''),
                img: element,
                pose: Maininfo.default_profile_icon
            })
        }
        else if (element.className === "mx-auto max-h-96 cursor-pointer rounded-xl") {
            if (element.parentElement.parentElement.getElementsByClassName("sticker")[0] != undefined) {

                element.parentElement.parentElement.insertBefore(element.parentElement, element.parentElement.parentElement.getElementsByClassName("sticker")[0])
            }
        }
        else if (element.nodeName === "P" && element.parentElement.className.includes("ProseMirror") && !location.href.includes("groups") && !location.href.includes("campaigns")) {
            loadPOST(element)
        }
        else if (element.nodeName === "P" && !element.parentElement.className.includes("ProseMirror") && element.className !== "tag_i") {

            if (element.textContent === "") {
                element.addEventListener("DOMSubtreeModified", function () {

                    Object.keys(sticker_data).forEach(pose => {
                        checkforemotes1(event, prefix + sticker_data[pose].symbol, pose)

                    });
                    //ЕБЕНАЯХУЙНЯ:i_am_eblan
                    checkforemotes1(event, "ЕБЕНАЯХУЙНЯ:i_am_eblan", "i_am_eblan")
                })
            }
            else {
                Object.keys(sticker_data).forEach(pose => {
                    checkforemotes2(event, prefix + sticker_data[pose].symbol, pose)
                })
                //ЕБЕНАЯХУЙНЯ:i_am_eblan
                checkforemotes2(event, "ЕБЕНАЯХУЙНЯ:i_am_eblan", "i_am_eblan")
            }
        }
        else if (element.className == "absolute top-1 left-4 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus-visible:top-1 peer-focus-visible:text-sm") {
            element.style.pointerEvents = "none";
            element.style.userSelect = "none";
        }
        else if (element.className === "peer w-full border-0 bg-gray-700 text-white caret-primary-lighter outline-none" && element.id.length !== 0 && element.id.includes("post_comment_input")) {

            element.style.display = "none";
            var e = document.createElement("input");
            var b = document.createElement("div");

            var b_icon = document.createElement("img");

            b_icon.src = browser.runtime.getURL("src/assets/emote_icon.png");
            b_icon.style.filter = "grayscale(1)";
            b_icon.className = "fill-current p-1 h-8 w-8";
            b.style.display = "flex";
            b_icon.style.margin = "auto";
            b_icon.style.justifyContent = "center";
            b_icon.style.objectFit = "scale-down";
            b_icon.style.userSelect = "none";
            b_icon.style.pointerEvents = "none";
            b.style.cursor = "pointer";

            e.className = "peer w-full border-0 bg-gray-700 text-white caret-primary-lighter outline-none";
            e.minLength = 3;
            e.maxLength = 300
            var p = document.createElement("p");

            p.className = "tag_i";
            p.style.paddingRight = "5px"
            p.style.color = "darkgray"
            element.parentElement.style.display = "inline-flex"
            element.parentElement.appendChild(p);
            element.parentElement.appendChild(e);
            b.style.width = "50px";
            b.style.height = "auto";
            b.style.alignContent = "center";
            b.className = "focusable rounded-full pr-3 transition-colors hover:text-white _";

            element.parentElement.parentElement.parentElement.appendChild(b);

            b.appendChild(b_icon);
            b.addEventListener("click", (ev: MouseEvent) => {

                show_emotes_list(element.parentElement.parentElement.parentElement.parentElement, element, e, b, p, false, [ev.clientX, ev.clientY]);

            })
            e.oninput = function () {


                changevalue(element, e, p);

            }
        }




    })
}

if (document.getElementById("content") != undefined) {
    enable()

}
else {
    waitForElm('#content').then(async (elm) => {

        enable()




    });
}
