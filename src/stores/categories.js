import { writable ,get} from 'svelte/store';
    
var pages = {
    "posts":import("../pages/posts.svelte"),
    "feed":import("../pages/feed.svelte")
    
};

export const currect_page = writable(null);
 
export var local_history =writable([]);
 
export const next_page = (url,properties={})=>{
    var last_pages = [...get(local_history)]
    last_pages.push({
        url: get(currect_page).url,
        page_title: get(get(currect_page).module.page_title),
        save_properties:get(currect_page).module.save_properties
    });
    local_history.set(last_pages);
    console.log(get(local_history));
    setPage(url,properties);

}
async function setPage(url,properties={}){
 
    if(get(currect_page) != undefined){
        get(currect_page).module.$destroy();
    }
    var pagemodel = await pages[url];
    if(pagemodel == undefined){
        currect_page.set(null);
    }
    else{
      
        currect_page.set({
            url,
            module:new pagemodel.default({target:document.getElementById("content"),props:{...properties}}),

        })
    }
    window.location.hash = url;
}

export const set_currect_page = (url,properties={})=>{
 
    local_history.set([]);
    setPage(url,properties);
  
}

