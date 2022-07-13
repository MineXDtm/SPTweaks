var paras = document.getElementsByClassName('rounded-lg bg-opacity-10 p-1 text-center bg-red text-red');

                while(paras[0]) {
                    paras[0].parentNode.remove(paras[0]);
                }

 document.getElementsByClassName('grid')[0].firstChild.addEventListener( 'DOMNodeInserted', function ( event ) {

            if(event.target.className == "focusable space-y-1 rounded-3xl border border-white border-opacity-5 bg-gray-500 p-6 font-medium") {
                event.target.addEventListener( 'DOMNodeInserted', async function ( event2 ) {
                    
                    if(event2.target.className == "rounded-lg bg-opacity-10 p-1 text-center bg-red text-red") {
                        const delay = ms => new Promise(res => setTimeout(res, ms));
                        await delay(1);
                        event2.target.parentNode.remove();
                    };
                   
                });
            };
           
        
}, false );

