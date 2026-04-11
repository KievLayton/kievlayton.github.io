document.addEventListener("DOMContentLoaded", () => {
    // ---- AUDIO ----
    const bgAudio = document.getElementById('bg-audio');
    const playAudio = () => {
        if (bgAudio.paused) {
            bgAudio.volume = 0.4;
            bgAudio.play().catch(e => console.log('Audio blocked', e));
        }
    };

    // Reproducir a la primera interacción posible
    const playOnInteraction = () => {
        playAudio();
        document.removeEventListener('click', playOnInteraction);
        document.removeEventListener('touchstart', playOnInteraction);
        document.removeEventListener('mousemove', playOnInteraction);
    };
    document.addEventListener('click', playOnInteraction);
    document.addEventListener('touchstart', playOnInteraction, { passive: true });
    document.addEventListener('mousemove', playOnInteraction);

    // ---- NIVEL 1 ----
    const phase1 = document.getElementById('phase-1');
    const btnYes = document.getElementById('btn-yes');
    const btnNo = document.getElementById('btn-no');

    let evasions = 0;
    const maxEvasions = 4;
    let originalRect = null;
    let isMoving = false; // Flag para evitar múltiples tiros rápidos mientras brinca

    btnNo.addEventListener('mouseover', moveButton);
    btnNo.addEventListener('touchstart', moveButton, { passive: false });

    function moveButton(e) {
        if (evasions >= maxEvasions || isMoving) return;
        if (e) e.preventDefault();

        isMoving = true;

        if (!btnNo.classList.contains('btn-evasive')) {
            originalRect = btnNo.getBoundingClientRect();

            // Movemos el botón al contenedor maestro de fase 1 durante el salto
            // Esto evita que el backdrop-filter de la tarjeta distorsione el sistema de coordenadas.
            document.getElementById('phase-1').appendChild(btnNo);

            btnNo.classList.add('btn-evasive');
            // En móvil dejamos que su tamaño se ajuste al texto (ancho automático) para que no sea del tamaño de la pantalla
            if (window.innerWidth > 480) {
                btnNo.style.width = originalRect.width + 'px';
                btnNo.style.height = originalRect.height + 'px';
            } else {
                btnNo.style.width = 'auto';
            }
            btnNo.style.left = originalRect.left + 'px';
            btnNo.style.top = originalRect.top + 'px';
        }

        // Wait a small cycle to allow CSS `fixed` to apply before transitioning
        setTimeout(() => {
            const currentRect = btnNo.getBoundingClientRect();

            // Generar un salto de entre 50 y 120 pixeles en una dirección al azar
            const angle = Math.random() * Math.PI * 2;
            const distance = 50 + Math.random() * 70;

            let newX = currentRect.left + Math.cos(angle) * distance;
            let newY = currentRect.top + Math.sin(angle) * distance;

            // Mantener dentro de los límites de la pantalla
            const maxX = window.innerWidth - btnNo.offsetWidth - 20;
            const maxY = window.innerHeight - btnNo.offsetHeight - 20;

            newX = Math.max(20, Math.min(newX, maxX));
            newY = Math.max(20, Math.min(newY, maxY));

            btnNo.style.left = `${newX}px`;
            btnNo.style.top = `${newY}px`;

            evasions++;

            // Reactivar evento después de que termine la animación
            setTimeout(() => {
                isMoving = false;
            }, 400);

            if (evasions === maxEvasions) {
                // Return to original
                btnNo.removeEventListener('mouseover', moveButton);
                btnNo.removeEventListener('touchstart', moveButton);

                setTimeout(() => {
                    btnNo.style.left = `${originalRect.left}px`;
                    btnNo.style.top = `${originalRect.top}px`;

                    setTimeout(() => {
                        // Devolver a su contendor original
                        document.querySelector('#phase-1 .buttons-container').appendChild(btnNo);

                        btnNo.classList.remove('btn-evasive');
                        btnNo.style.left = '';
                        btnNo.style.top = '';
                        btnNo.style.width = '';
                        btnNo.style.height = '';
                        btnNo.classList.add('pink-mode');
                        btnNo.textContent = "No puedo esperar más 💕";
                    }, 400); // after slide
                }, 400); // 4th jump transition time before reverting
            }
        }, 50);
    }

    const goToPhase1_5 = () => {
        playAudio();
        phase1.classList.remove('active');
        phase1.classList.add('hidden');

        const phase1_5 = document.getElementById('phase-1-5');
        phase1_5.classList.remove('hidden');
        phase1_5.classList.add('active');
    };

    btnYes.addEventListener('click', goToPhase1_5);
    btnNo.addEventListener('click', () => {
        if (evasions >= maxEvasions) goToPhase1_5();
        else moveButton(null);
    });

    const btnJung = document.getElementById('btn-jung');
    const btnCortazar = document.getElementById('btn-cortazar');

    function enterPhase2(isCortazar) {
        document.getElementById('phase-1-5').classList.remove('active');
        document.getElementById('phase-1-5').classList.add('hidden');

        const phase2 = document.getElementById('phase-2');
        phase2.classList.remove('hidden');
        phase2.classList.add('active');

        const layoutSwitch = document.getElementById('layout-switch');
        layoutSwitch.checked = isCortazar;
        initPhase2(isCortazar);
    }

    btnJung.addEventListener('click', () => enterPhase2(false));
    btnCortazar.addEventListener('click', () => enterPhase2(true));

    // ---- NIVEL 2 y 3 ----
    const deskContainer = document.getElementById('desk-container');
    const layoutSwitch = document.getElementById('layout-switch');
    let highestZ = 100;

    const p_texts = [
        "Con cariño, tomé el atrevimiento de entregarte estos presentes en este día tan importante; la juventud temprana ha llegado a su fin y, con ella, emerge la juventud tardía. Aún no te creas anciana, pues la belleza y la energía ahora la portas en su máximo esplendor.",
        "He visto algunos fotogramas de tu vida desde que te conocí un primero de noviembre del 2022 y puedo decirte que estoy orgulloso de ti, de la valía y valentía que has tenido para salir adelante de la manera en la que lo has hecho. Quizá nunca he tenido una constancia ni una trascendencia ingente en tus días; sin embargo, no me hace falta saber mucho de ti para tener la certeza de que, a donde sea que gustes llegar, tu inteligencia y forma de ser te llevarán sin siquiera dudarlo un poco.",
        "Me da mucha alegría no habernos perdido rastro y coincidir por un momento más de una manera tan particular. Quiero agradecerte por ser condescendiente con mis sentires y haberme brindado un hombro sobre el cual reposar. He tenido ánimos de escribirte algo y, definitivamente, me pareció un buen pretexto hoy.",
        "El cometa Halley pasa cada 75-76 años; es decir que una persona, dos veces máximo con suerte, podría observarle. Hay eventos que uno es muy afortunado de presenciarlos, pero esta es la tercera vez que coincido contigo y aspiro a que dejemos de ser una vil coincidencia antes que el destino nos olvide en algún rincón. Alguna vez te llegué a hablar de Cortázar, «andábamos sin buscarnos pero sabiendo que estábamos para encontrarnos»; te hablé del capítulo 7 de Rayuela.",
        "Me parece fantástico Rayuela, ya que puedes leerlo de corrido, puedes leerlo en un orden específico que suelen mencionar o, incluso, aleatoriamente de la manera en que prefieras. Del mismo modo, no creo que exista un orden único para las cosas: nos descubrimos besándonos en un bar de poca monta y nos conocimos en unas bancas de polakas, en el espacio escultórico jugando bully, en la cineteca, en el metro y en la banca de un cementerio en Inglaterra.",
        "Ni tú ni yo somos personas del todo normales y, si te soy franco, eso es lo que me atrapa de ti. Claro que físicamente eres una flecha que me atraviesa y hace hervir mi sangre, aunque me preocupa sospechar que es por tu parecido a mí; lamento admitir que tal vez Freud tenga un tanto de razón. Y hablando de coincidencias y de Freud, Freud alegaba que las coincidencias muchas eran causadas por nuestra mente, y su amigo Jung decía: «en todo caos hay un cosmos, y en todo desorden un orden secreto»; entonces, así hayan conspirado nuestras mentes o el mundo para volver a vernos, el hecho está consumado aquí.",
        "Me preguntabas qué es el amor; sinceramente, es difícil de plasmar, es difícil describir esa sensación y emoción tan única. Pero sea lo que sea, quisiera en el futuro poder intentar describirlo pensando en ti.",
        "No pretendo mucho; no busco una etiqueta, solo busco expresar y liberar un poco de mi ser."
    ];

    let cardsData = [];
    let keyDragged = false;
    let phase2Init = false;

    function initPhase2(startOrdered) {
        if (phase2Init) return;
        phase2Init = true;

        const lockedCard = document.getElementById('locked-card');
        let allCards = [];

        p_texts.forEach((text, i) => {
            const card = document.createElement('div');
            card.className = 'glass-card story-card';
            let noteNum = i < 6 ? i + 1 : i + 2;
            card.innerHTML = `<h3>Nota ${noteNum}</h3><p>${text}</p>`;
            deskContainer.appendChild(card);
            allCards.push(card);
        });

        allCards.splice(6, 0, lockedCard);

        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;

        // Let's create an array of random zIndices to shuffle reading order 
        let zIndices = [1, 2, 3, 4, 5, 6, 7, 8];
        zIndices.sort(() => Math.random() - 0.5);

        allCards.forEach((card, i) => {
            // Reinsertar tarjeta en DOM para asegurar orden correcto
            deskContainer.appendChild(card);

            const angle = (Math.random() - 0.5) * 30;
            const offsetX = (Math.random() - 0.5) * cx * 0.9;
            let offsetY = (Math.random() - 0.5) * cy * 0.9;

            if (card === lockedCard) {
                offsetY = (Math.random() - 0.5) * cy * 0.3;
                card.style.zIndex = 1; // Locked firmly below other cards natively
            } else {
                let logicalIndex = i >= 6 ? i - 1 : i;
                card.style.zIndex = 10 + zIndices[logicalIndex];
            }

            card.dataset.rotation = angle;

            cardsData.push({
                el: card,
                angle: angle,
                cx: cx, cy: cy,
                offsetX: offsetX, offsetY: offsetY
            });

            makeDraggableFree(card, false);
        });

        // Setup hidden key
        const keyEl = document.getElementById('hidden-key');
        keyEl.style.display = 'none';
        makeDraggableFree(keyEl, true);

        if (startOrdered) {
            applyOrderLayout();
        } else {
            applyCaosLayout();
        }
    }

    layoutSwitch.addEventListener('change', (e) => {
        if (e.target.checked) applyOrderLayout();
        else applyCaosLayout();
    });

    function applyOrderLayout() {
        deskContainer.classList.add('ordered-mode');
        // No necesitamos calcular 'top' porque en css están con flow 'relative'.
        // Pero vaciaremos transformaciones para que no estorben visualmente.
        cardsData.forEach((card) => {
            card.el.style.transition = 'top 0.5s ease, left 0.5s ease, transform 0.5s ease';
            card.el.style.transform = `none`;
            card.el.style.left = `0`;
            card.el.style.top = `auto`;

            setTimeout(() => { card.el.style.transition = 'box-shadow 0.2s ease'; }, 500);
        });
    }

    function applyCaosLayout() {
        deskContainer.classList.remove('ordered-mode');
        cardsData.forEach(card => {
            card.el.style.transition = 'top 0.5s ease, left 0.5s ease, transform 0.5s ease';
            card.el.style.transform = `translate(-50%, -50%) rotate(${card.angle}deg)`;
            card.el.style.left = `${card.cx + card.offsetX}px`;
            card.el.style.top = `${card.cy + card.offsetY}px`;
            setTimeout(() => { card.el.style.transition = 'box-shadow 0.2s ease'; }, 500);
        });
    }

    function makeDraggableFree(elmnt, isKey = false) {
        let startX = 0, startY = 0, initialLeft = 0, initialTop = 0;

        elmnt.onmousedown = dragMouseDown;
        elmnt.ontouchstart = dragTouchStart;

        function bumpZ() {
            highestZ++;
            elmnt.style.zIndex = highestZ;
        }

        function dragMouseDown(e) {
            if (deskContainer.classList.contains('ordered-mode') && !isKey) return;
            e.preventDefault();
            bumpZ();
            startX = e.clientX;
            startY = e.clientY;

            initialLeft = elmnt.offsetLeft;
            initialTop = elmnt.offsetTop;

            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function dragTouchStart(e) {
            if (deskContainer.classList.contains('ordered-mode') && !isKey) return;
            bumpZ();
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;

            initialLeft = elmnt.offsetLeft;
            initialTop = elmnt.offsetTop;

            document.ontouchend = closeDragElement;
            document.ontouchmove = elementDragTouch;
        }

        function elementDrag(e) {
            e.preventDefault();
            let dx = e.clientX - startX;
            let dy = e.clientY - startY;
            updatePosition(elmnt, dx, dy);
            if (isKey) keyDragged = true;
        }

        function elementDragTouch(e) {
            e.preventDefault();
            let dx = e.touches[0].clientX - startX;
            let dy = e.touches[0].clientY - startY;
            updatePosition(elmnt, dx, dy);
            if (isKey) keyDragged = true;
        }

        function updatePosition(elm, dx, dy) {
            elm.style.left = (initialLeft + dx) + "px";
            elm.style.top = (initialTop + dy) + "px";

            if (layoutSwitch && layoutSwitch.checked && !isKey) {
                elm.style.transform = `translate(-50%, 0)`;
            } else {
                let rot = elm.dataset.rotation || 0;
                if (isKey) rot = 0;
                elm.style.transform = `translate(-50%, -50%) rotate(${rot}deg)`;
            }
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
            document.ontouchend = null;
            document.ontouchmove = null;

            if (isKey) {
                checkLockSnap();
            }
        }

        function checkLockSnap() {
            const keyEl = document.getElementById('hidden-key');
            const lockElem = document.getElementById('lock-overlay');
            if (!lockElem || lockElem.style.opacity === '0') return;

            const keyRect = keyEl.getBoundingClientRect();
            const lockRect = lockElem.getBoundingClientRect();

            const keyCX = keyRect.left + keyRect.width / 2;
            const keyCY = keyRect.top + keyRect.height / 2;
            const lockCX = lockRect.left + lockRect.width / 2;
            const lockCY = lockRect.top + lockRect.height / 2;

            const dist = Math.hypot(keyCX - lockCX, keyCY - lockCY);
            if (dist < 70) {
                keyEl.style.display = 'none';
                const lockedCard = document.getElementById('locked-card');
                lockedCard.classList.add('unlocked');
                triggerFinale();
            }
        }
    }

    // ---- JUEGO DE GATO (TIC TAC TOE) ----
    const lockOverlay = document.getElementById('lock-overlay');
    const modalTtt = document.getElementById('modal-tictactoe');
    const btnCloseTtt = document.getElementById('btn-close-ttt');
    const tttCells = document.querySelectorAll('.ttt-cell');
    const tttMessage = document.getElementById('ttt-message');
    let tttBoard = ['', '', '', '', '', '', '', '', ''];
    let gameActive = false;
    let tttWon = false;

    if (lockOverlay) {
        lockOverlay.addEventListener('click', () => {
            if (!tttWon && !document.getElementById('locked-card').classList.contains('unlocked')) {
                modalTtt.classList.remove('hidden');
                resetTtt();
            }
        });
    }

    if (btnCloseTtt) {
        btnCloseTtt.addEventListener('click', () => {
            modalTtt.classList.add('hidden');
        });
    }

    function resetTtt() {
        tttBoard = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        tttMessage.textContent = 'Tu turno (X)';
        tttCells.forEach(cell => {
            cell.textContent = '';
            cell.style.color = 'var(--primary)';
        });
    }

    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    tttCells.forEach(cell => {
        cell.addEventListener('click', () => {
            const index = cell.getAttribute('data-index');
            if (tttBoard[index] !== '' || !gameActive) return;

            // Player move
            tttBoard[index] = 'X';
            cell.textContent = 'X';
            cell.style.color = '#ff4d85';

            if (checkWinner('X')) {
                endGame('¡Ganaste! La llave es tuya.');
                spawnKey();
                return;
            }
            if (!tttBoard.includes('')) {
                endGame('Empate. ¡Inténtalo de nuevo!');
                return;
            }

            // AI Turn
            gameActive = false;
            tttMessage.textContent = 'El guardián está pensando...';

            setTimeout(() => {
                let emptyIndices = [];
                tttBoard.forEach((val, i) => { if (val === '') emptyIndices.push(i); });

                // Extremely simple dumb AI: Random move
                const aiMove = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];

                tttBoard[aiMove] = 'O';
                tttCells[aiMove].textContent = 'O';
                tttCells[aiMove].style.color = '#fff';

                if (checkWinner('O')) {
                    endGame('¡Te ganó el guardián! Repite.');
                    return;
                }
                if (!tttBoard.includes('')) {
                    endGame('Empate. ¡Inténtalo de nuevo!');
                    return;
                }

                gameActive = true;
                tttMessage.textContent = 'Tu turno (X)';
            }, 600);
        });
    });

    function checkWinner(player) {
        return winningConditions.some(cond => {
            return cond.every(idx => tttBoard[idx] === player);
        });
    }

    function endGame(msg) {
        gameActive = false;
        tttMessage.textContent = msg;
    }

    function spawnKey() {
        tttWon = true;
        setTimeout(() => {
            modalTtt.classList.add('hidden');
            const keyEl = document.getElementById('hidden-key');
            keyEl.style.display = 'block';

            // Spawn near the locked card
            const lockedCard = document.getElementById('locked-card');

            // Si está en modo orden, usar scroll-aware positioning (absoluto al contenedor)
            if (document.getElementById('desk-container').classList.contains('ordered-mode')) {
                keyEl.style.position = 'absolute';
                keyEl.style.left = (lockedCard.offsetLeft + lockedCard.offsetWidth / 2) + 'px';
                keyEl.style.top = (lockedCard.offsetTop + lockedCard.offsetHeight / 2 + 100) + 'px';
                keyEl.style.transform = 'translate(-50%, -50%) scale(0)';
            } else {
                // Modo caos: Aparecer en mero en medio de la pantalla para visibilidad perfecta
                keyEl.style.position = 'fixed';
                keyEl.style.left = '50%';
                keyEl.style.top = '50%';
                keyEl.style.transform = 'translate(-50%, -50%) scale(0)';
            }

            // Allow element to render before transitioning
            requestAnimationFrame(() => {
                setTimeout(() => {
                    keyEl.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                    keyEl.style.transform = 'translate(-50%, -50%) scale(1)';
                }, 50);
            });
        }, 1500);
    }

    const btnChapter7 = document.getElementById('btn-chapter-7');
    const modalChapter7 = document.getElementById('modal-chapter-7');
    const btnCloseModal = document.getElementById('btn-close-modal');

    if (btnChapter7) {
        btnChapter7.addEventListener('click', () => {
            modalChapter7.classList.remove('hidden');
        });
    }

    if (btnCloseModal) {
        btnCloseModal.addEventListener('click', () => {
            modalChapter7.classList.add('hidden');
        });
    }

    function triggerFinale() {
        if (btnChapter7) {
            setTimeout(() => {
                btnChapter7.classList.remove('hidden');
            }, 3000);
        }
        if (window.confetti) {
            var duration = 4 * 1000;
            var animationEnd = Date.now() + duration;
            var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 3000 };

            var interval = setInterval(function () {
                var timeLeft = animationEnd - Date.now();
                if (timeLeft <= 0) { return clearInterval(interval); }
                var particleCount = 50 * (timeLeft / duration);

                confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
                confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
            }, 250);
        }
    }

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }
});
