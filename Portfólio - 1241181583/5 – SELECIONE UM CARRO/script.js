var result = document.getElementById("result");
var container = document.getElementsByClassName("container")[0];
var hc = parseInt(window.getComputedStyle(container).height);
var p = parseInt(window.getComputedStyle(container).padding);
var nav = document.getElementsByTagName("nav");
var btnWhite = document.getElementsByClassName("btn_circle_1")[0];
var btnRed = document.getElementsByClassName("btn_circle_2")[0];
var reset = document.getElementById("resetar"); 
var acelerar = document.getElementById("acelerar");
var desacelerar = document.getElementById("desacelerar");
var whiteCar = document.getElementById("white");
var redCar = document.getElementById("red");
var selectCar; 

btnVisible();

whiteCar.addEventListener('click', function(){
    selectWhite();
});

redCar.addEventListener('click', function(){
    selectRed();
});

function speedUp(el){
    if(el === null || el === undefined){
        alert("Selecione um dos carros!")
    }else{
        var h = parseInt(window.getComputedStyle(el).height);
        var w = parseInt(window.getComputedStyle(el).width);
        var t = parseInt(window.getComputedStyle(el).top);
        var l = parseInt(window.getComputedStyle(el).left);
        var r = parseInt(window.getComputedStyle(el).right);

        if(h > 20 && w > 20){
            el.style.height = (h - 2) + "px";
            el.style.width = (w - 2) + "px";
            
            if(el === whiteCar){
                el.style.left = (l + 1) + "px";
                el.style.top = (t + 1) + "px";
            }else{
                el.style.right = (r + 1) + "px";
                el.style.top = (t + 1) + "px";
            }
        }
    }
}

function slowDown(el){
    if(el === null || el === undefined){
        alert("Selecione um dos carros!")
    }else{
        var h = parseInt(window.getComputedStyle(el).height);
        var w = parseInt(window.getComputedStyle(el).width);
        var t = parseInt(window.getComputedStyle(el).top);
        var l = parseInt(window.getComputedStyle(el).left);
        var r = parseInt(window.getComputedStyle(el).right);
    
        if(h < 80 && w < 80){
            el.style.height = (h + 2) + "px";
            el.style.width = (w + 2) + "px";
            
            if(el === whiteCar){
                el.style.left = (l - 1) + "px";
                el.style.top = (t - 1) + "px";
            }else{
                el.style.right = (r - 1) + "px";
                el.style.top = (t - 1) + "px";
            }
        }
    }
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowUp') {
        event.preventDefault();
        speedUp(selectCar);
    } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        slowDown(selectCar);
    }
});

reset.addEventListener('click', function(){
    location.reload();
});

acelerar.addEventListener('mousedown', function(){
    speedUp(selectCar);
    this.intervalo = setInterval(function() {speedUp(selectCar);}, 100);
});

desacelerar.addEventListener('mousedown', function(){
    slowDown(selectCar);
    this.intervalo = setInterval(function() {slowDown(selectCar);}, 100);
});

acelerar.addEventListener('mouseup', function() {
    clearInterval(this.intervalo);
});

acelerar.addEventListener('mouseleave', function() {
    clearInterval(this.intervalo);
});

desacelerar.addEventListener('mouseup', function() {
    clearInterval(this.intervalo);
});

desacelerar.addEventListener('mouseleave', function() {
    clearInterval(this.intervalo);
});

btnWhite.addEventListener('click', function(){
    selectWhite();
});

btnRed.addEventListener('click', function(){
    selectRed();
});

function btnVisible(){
    for (var i = 0; i < nav[0].children.length; i++) {
        if(selectCar === null || selectCar === undefined){
            if(nav[0].children[i].className === 'btn'){
                nav[0].children[i].style.display = "none";
            }
        }else{
            if(nav[0].children[i].className === 'btn'){
                nav[0].children[i].style.display = "block";
            }
        }
    }
}

function selectWhite(){
    result.textContent = "Lotus Branco";
    document.body.style.backgroundColor = "#f0f0f0";
    document.body.style.color = "black";
    container.style.border = "1px solid black";
    reset.style.border = "1px solid black";
    acelerar.style.border = "1px solid black";
    desacelerar.style.border = "1px solid black";
    
    whiteCar.style.border = "3px solid #007bff";
    whiteCar.style.boxShadow = "0 0 10px #007bff";
    redCar.style.border = "none";
    redCar.style.boxShadow = "none";
    
    selectCar = whiteCar;
    btnVisible();
}

function selectRed(){
    result.textContent = "Jaguar Vermelho";
    document.body.style.backgroundColor = "#8B0000";
    document.body.style.color = "white";
    container.style.border = "1px solid white";
    reset.style.border = "1px solid white";
    acelerar.style.border = "1px solid white";
    desacelerar.style.border = "1px solid white";
    
    redCar.style.border = "3px solid #ff6b35";
    redCar.style.boxShadow = "0 0 10px #ff6b35";
    whiteCar.style.border = "none";
    whiteCar.style.boxShadow = "none";
    
    selectCar = redCar;
    btnVisible();
}