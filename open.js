var paras = document.getElementsByClassName('rounded-lg bg-opacity-10 p-1 text-center bg-green text-green');

for(let item of paras) {
    item.parentNode.style.display = "none";
}

document.getElementsByClassName('grid')[1].firstChild.addEventListener( 'DOMNodeInserted', function ( event ) {

    if(event.target.className == "focusable space-y-1 rounded-3xl border border-white border-opacity-5 bg-gray-500 p-6 font-medium") {
        event.target.addEventListener( 'DOMNodeInserted', async function ( event2 ) {
            
            if(event2.target.className == "rounded-lg bg-opacity-10 p-1 text-center bg-green text-green") {
                const delay = ms => new Promise(res => setTimeout(res, ms));
                await delay(0.1);
                event2.target.parentNode.style.display = "none";
            };
           
        });
    };
   

}, false );