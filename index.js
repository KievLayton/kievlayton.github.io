const yesBtn = document.querySelector('#yesBtn');
const noBtn = document.querySelector('#noBtn');
const mensaje = document.querySelector('#mensaje');
const tarjeta = document.querySelector('#tarjeta');
let huyendo = false;

function moverBoton() {
    // S
    if (!huyendo) {
        noBtn.style.position = 'fixed';
        huyendo = true;
        // L
        noBtn.style.transition = 'left 0.4s cubic-bezier(0.25, 1, 0.5, 1), top 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
    }

    // C
    const randomX = Math.floor(Math.random() * 70) + 10;
    const randomY = Math.floor(Math.random() * 70) + 10;
    
    noBtn.style.left = randomX + 'vw';
    noBtn.style.top = randomY + 'vh';
    noBtn.style.transform = 'translate(-50%, -50%)'; 
}

// T
noBtn.addEventListener('mouseover', moverBoton);
noBtn.addEventListener('touchstart', function(e) {
    e.preventDefault();
    moverBoton();
});

// F
yesBtn.addEventListener('click', function () {
    // D
    tarjeta.style.opacity = '0';
    
    setTimeout(() => {
        // C
        mensaje.innerHTML = "<span style='font-size: 1.2em;'>Será un día muy lindo, Sandy.</span><br><br><span class='destaque'>Gracias por aceptar.</span> ✨";
        
        // H
        document.querySelector('.botones').style.display = 'none';
        if(huyendo) noBtn.style.display = 'none'; // P
        
        // R
        tarjeta.style.opacity = '1';
    }, 500); // T
});