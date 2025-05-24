
const display = document.getElementById('display');


let currentExpression = '';


function updateDisplay() {
    display.textContent = currentExpression;
}


function clearDisplay() {
    currentExpression = '';
    updateDisplay();
}


function backspace() {
    currentExpression = currentExpression.slice(0, -1);
    updateDisplay();
}


function appendToDisplay(value) {
   
    if (value === 'x') {
        currentExpression += '*';
    } else {
        currentExpression += value;
    }
    updateDisplay();
}


function calculate() {
    try {
       
        const result = eval(currentExpression);
        
        
        if (result === undefined || isNaN(result)) {
            display.textContent = 'Erro';
            currentExpression = '';
        } else {
           
            currentExpression = String(Number(result.toFixed(8)));
            updateDisplay();
        }
    } catch (error) {
       
        display.textContent = 'Erro';
        currentExpression = '';
    }
}


document.addEventListener('DOMContentLoaded', function() {
    
    const buttons = document.querySelectorAll('.btn');
    
   
    buttons.forEach(button => {
        const value = button.textContent;
        
       
        if (value === 'C') {
            button.onclick = clearDisplay;
        } else if (value === '<') {
            button.onclick = backspace;
        } else if (value === '=') {
            button.onclick = calculate;
        } else {
    
            button.onclick = function() {
                appendToDisplay(value);
            };
        }
    });
    
    updateDisplay();
});