
<script>
    export var comment;
    var nickname;
    var minecraftUUID;
    var content = "Ребята, которые хотели дотащить Кирилла затащили весь ролик, респект 👍💪";
    if(comment){
        content = comment.text;
        minecraftUUID = comment.account.user.minecraftUUID;
        nickname = comment.account.user.username;
    }

</script>
<div
    class="spt-bg-[#EAEAEA] spt-w-full   spt-rounded-[5px] spt-text-black spt-pr-[15px] spt-pl-[15px] spt-pt-[15px] spt-pb-[15px] spt-space-y-[10px]"
>
    <div
        class=" spt-w-full spt-h-fit spt-space-x-[16px] spt-flex spt-items-center"
    >
        <img
            draggable="false"
            class="spt-rounded-[12px] spt-select-none"
            src="https://visage.surgeplay.com/face/80/{minecraftUUID}.png"
            height="32"
            width="32"
        />
        <p class="spt-text-[13px] spt-font-bold">{nickname}</p>
    </div>
    <p class="spt-text-[14px] spt-w-full spt-break-words">{content}</p>
    <div
        class=" spt-w-full spt-h-fit spt-space-x-[10px] spt-flex spt-items-center"
    >
        <p class="spt-text-[13px] spt-font-semibold spt-text-black/20">
            (создан) вчера в 15:32
        </p>
    </div>
</div>
