<script lang="typescript">
    export let left = 0;
    import VoteButtons from "../actions/vote_buttons.svelte";
    export let selected = false;
    export let image = "";
    export let limit = 0;
    export let sideslided = "left";
    export let font_size = 14;
    export let padding_text = 5 ;
    export var onclick = ()=>{}
    let content_element;

    var can_hover = false;
    $:{
        if(selected){
   
            setTimeout(()=>{
                if(selected== false) return;
                can_hover = true;
            },300);
        }
        else{
            can_hover = false;
        }
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
    on:click={onclick}
    class="{selected? '' : 'spt-cursor-pointer'} spt-h-[400px] spt-w-[434px] spt-flex spt-items-center spt-justify-center spt-absolute {left == 0 && sideslided == "left" || left >= limit && sideslided == "right"
        ? ''
        : 'spt-transition-all spt-duration-500'}"
    style="left: {left + 'px'};"
>
    <div
        class=" spt-absolute spt-transition-all spt-duration-300 spt-rounded-[15px] spt-shadow-md {selected
            ? 'spt-z-10 spt-w-[728px]  spt-h-full'
            : 'spt-w-full spt-h-[253px] spt-z-0  '}"
        
    >
        <div class="spt-absolute spt-overflow-hidden spt-rounded-[15px] spt-w-full spt-h-full spt-flex spt-justify-center spt-items-center">
            <div
                class=" spt-absolute spt-w-[110%]  spt-h-[110%] spt-blur-[10px]"
                style="background: conic-gradient(from 224.85deg at 75.71% 23.9%, #967CE0 -106.88deg, #B8B8B8 31.88deg, #C68FF3 153.75deg, #967CE0 253.13deg, #B8B8B8 391.87deg);"
            />
            <div
                class=" spt-absolute spt-w-full spt-h-full spt-bg-black/10"
               
            />
            {#if image == ''}
                <img draggable="false"  class=" spt-transition-opacity spt-duration-300 spt-rounded-[15px] spt-pointer-events-none spt-absolute spt-h-[90%] spt-w-auto  spt-rounded-[15px]   " style="image-rendering: pixelated; opacity: {selected? 0:100};" src="https://api.mineatar.io/face/Andreu333XD"  />
            {/if}
           
        </div>
        {#if image}
            <img
                alt="taasd"
                class=" spt-select-none spt-absolute spt-w-full spt-h-full spt-rounded-[15px] spt-object-cover spt-shadow-md"
                draggable="false"
                src={image}
            />
        {/if}
        
   
            <div
              
                
                class="spt-absolute spt-overflow-hidden {selected? '': 'spt-hidden'}  {image != ''? "spt-h-[110px]" : ' spt-h-[90%] '} {can_hover && image != ''? 'hover:spt-h-[90%]': '' } spt-transition-all spt-flex spt-space-x-[35px] spt-left-3 spt-bottom-3 spt-bg-black/90 spt-w-fit spt-p-[25px] spt-pt-[20px] spt-pb-[25px] spt-rounded-[15px] spt-backdrop-blur-[20px]"
            >
                <div class="spt-flex spt-items-end spt-grow">
                    <!-- svelte-ignore a11y-missing-attribute -->
                    <img draggable="false" class="spt-rounded-[12px] spt-select-none" src='https://visage.surgeplay.com/face/80/X-Steve.png' height="54" width="54" />
                </div>
                <div
                    class="spt-flex spt-flex-col spt-w-[230px] spt-h-full spt-text-white"
                >
                    <!-- <p
                        class="spt-w-full spt-grow-0 spt-text-ellipsis spt-font-bold spt-text-[20px]"
                    >
                        Andreu333XD
                    </p> -->
                    <div
                        bind:clientHeight={content_element}
                        class="spt-w-full spt-h-full spt-grow"
                    >
                     
               
                            <p
                                
                                class="spt-w-full spt-overflow-hidden spt-text-ellipsis" 
                                style="font-size:{font_size +"px"}; -webkit-line-clamp:{content_element
                                    ? ~~(content_element / (font_size + padding_text))
                                    : 1}; -webkit-box-orient: vertical;  display: -webkit-box; "
                            >
                                Приглашаю вас на долгожданное торжество в честь открытия нового проекта Дом Искусств х ТФ Искусств!
                                - Вечер чтения и музыки
                                - Выставка артов
                                =Ждём вас уже в эту пятницу, 24 марта, в 19:00!=
                                =МЕСТО: СПАВН ПО КОВРИКАМ (Там где музей артов и Дом Искусств)=
                                Заходите в дискорд, чтобы поучавствовать в ивенте!
                                - https://discord.gg/czG3pJK8
                            </p>
                     
                    </div>
                    
                </div>
                <div class="spt-flex  spt-items-end spt-grow">
                        <div class="spt-flex spt-flex-row spt-space-x-[10px] spt-items-center">
                            <p>45</p>
                            <VoteButtons/>
                        </div>
                
              
                </div>
            </div>
     
        
            <div
                
                class="{selected? 'spt-hidden': ''} spt-absolute spt-bg-black/[0.30] spt-w-full spt-h-full spt-rounded-[15px]"
            />

  
       
    
    </div>
</div>
