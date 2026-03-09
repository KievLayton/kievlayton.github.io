const musica = document.getElementById('musicaFondo');
musica.volume = 0.6;
let musicaSonando = false;

function activarMusica() {
    if (!musicaSonando) {
        
        musica.play().then(() => {
            musicaSonando = true;
            
            document.removeEventListener('click', activarMusica);
            document.removeEventListener('touchstart', activarMusica);
        }).catch(e => console.log("Esperando interacción más fuerte del usuario..."));
    }
}

document.addEventListener('click', activarMusica);
document.addEventListener('touchstart', activarMusica);

// -------------------------
const yesBtn = document.querySelector('#yesBtn');
const noBtn = document.querySelector('#noBtn');
const mensaje = document.querySelector('#mensaje');
const tarjeta = document.querySelector('#tarjeta');

let huyendo = false;
let conteoEvasiones = 0;
const limiteEvasiones = Math.floor(Math.random() * 4) + 2; 
let estadoBoton = 0; 

const opcionesTrampa = [
    "No puedo... decirte que no <3",
    "No puedo... perderme el concierto <3",
    "No puedo... esperar más a ir <3"
];

function procesarNo() {
    if (estadoBoton === 0) {
        conteoEvasiones++;
        
        if (!huyendo) {
            noBtn.style.position = 'fixed';
            huyendo = true;
            noBtn.style.transition = 'left 0.4s cubic-bezier(0.25, 1, 0.5, 1), top 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
        }

        if (conteoEvasiones >= limiteEvasiones) {
            estadoBoton = 1;
            noBtn.style.left = '150vw';
            
            setTimeout(() => {
                noBtn.classList.add('pink-mode');
                noBtn.style.position = '';
                noBtn.style.left = '';
                noBtn.style.top = '';
                noBtn.style.transform = '';
                noBtn.style.transition = 'all 0.4s ease';
            }, 600);
            return;
        }

        const randomX = Math.floor(Math.random() * 70) + 10;
        const randomY = Math.floor(Math.random() * 70) + 10;
        noBtn.style.left = randomX + 'vw';
        noBtn.style.top = randomY + 'vh';
        noBtn.style.transform = 'translate(-50%, -50%)';
        
    } else if (estadoBoton === 1) {
        estadoBoton = 2;
        
        const indiceAleatorio = Date.now() % opcionesTrampa.length;
        noBtn.innerText = opcionesTrampa[indiceAleatorio];
        
    } else if (estadoBoton === 2) {
        ejecutarVictoria();
    }
}

noBtn.addEventListener('mouseover', () => {
    if (estadoBoton === 0) procesarNo();
});

noBtn.addEventListener('touchstart', (e) => {
    if (estadoBoton === 0) {
        e.preventDefault();
        procesarNo();
    }
});

noBtn.addEventListener('click', () => {
    if (estadoBoton > 0) procesarNo();
});

yesBtn.addEventListener('click', ejecutarVictoria);

function ejecutarVictoria() {
    tarjeta.style.opacity = '0';
    
    setTimeout(() => {
        mensaje.innerHTML = "Gracias, será un día muy lindo, Sandy.<br><br><span class='destaque'>Sabía que aceptarías.</span> ✨";
        document.querySelector('.botones').style.display = 'none';
        tarjeta.style.opacity = '1';
    }, 500);
}
