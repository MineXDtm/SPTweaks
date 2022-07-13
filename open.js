var paras = document.getElementsByClassName('rounded-lg bg-opacity-10 p-1 text-center bg-green text-green');

while(paras[0]) {
    paras[0].parentNode.remove(paras[0]);
}