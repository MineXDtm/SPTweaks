var paras = document.getElementsByClassName('rounded-lg bg-opacity-10 p-1 text-center bg-red text-red');

while(paras[0]) {
    console.log("s");
    paras[0].parentNode.remove(paras[0]);
}