
document.addEventListener('DOMContentLoaded', function() {
    
    const lamp = document.getElementById('lamp');
    const body = document.body;
    
   
    let isLampOn = false;
    
   
    lamp.addEventListener('click', function() {
       
        isLampOn = !isLampOn;
        
        if (isLampOn) {
            
            lamp.src = 'assets/lamp_on.png';
            body.style.background = 'radial-gradient(circle, yellow 8%, white 100%)';
        } else {
            
            lamp.src = 'assets/lamp_off.png';
            body.style.background = 'radial-gradient(circle, white 8%, black 100%)';
        }
    });
});