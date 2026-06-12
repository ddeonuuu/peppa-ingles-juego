document.addEventListener("DOMContentLoaded", () => {
    // Generador integrado de audio retro-arcade
    window.playSound = function(frequency, type, duration) {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.type = type;
            oscillator.frequency.value = frequency;
            
            gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.start();
            oscillator.stop(audioCtx.currentTime + duration);
        } catch(e) { console.log("Audio no soportado aún."); }
    };

    // Agregar sonidos automáticos en el Menú Principal
    const botonesMenu = document.querySelectorAll(".nivel-card");
    botonesMenu.forEach(btn => {
        btn.addEventListener("mouseenter", () => playSound(280, "sine", 0.06));
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            playSound(580, "square", 0.1);
            setTimeout(() => playSound(750, "square", 0.15), 60);
            setTimeout(() => { window.location.href = btn.getAttribute("href"); }, 220);
        });
    });
});

// Estructuras de control del estado global del jugador
let juegoVidas = 3;
let juegoPuntaje = 0;
let juegoNivel = 1;
const maxNiveles = 5;

function actualizarMarcadoresGlobales() {
    if(document.getElementById("vidas")) document.getElementById("vidas").textContent = juegoVidas;
    if(document.getElementById("puntaje")) document.getElementById("puntaje").textContent = juegoPuntaje;
    if(document.getElementById("nivel")) document.getElementById("nivel").textContent = juegoNivel;
}

function mostrarFeedback(esCorrecto, texto) {
    const msg = document.getElementById("mensaje");
    if(!msg) return;
    msg.textContent = texto;
    msg.style.color = esCorrecto ? "#10b981" : "#ef4444";
    msg.style.transform = "scale(1.1)";
    setTimeout(() => { msg.style.transform = "scale(1)"; }, 200);

    if(esCorrecto) {
        playSound(600, "sine", 0.1);
        setTimeout(() => playSound(900, "sine", 0.15), 50);
        confetti({ particleCount: 60, spread: 60 });
    } else {
        playSound(180, "sawtooth", 0.3);
    }
}

function manejarFinDelJuego(titulo, desc) {
    const container = document.querySelector(".contenedor-juego");
    if(!container) return;
    container.innerHTML = `
        <h1 style="color:#ef4444;">${titulo}</h1>
        <p class="subtitulo">${desc}</p>
        <h2 style="font-size:2rem; margin:20px 0;">⭐ Puntaje: ${juegoPuntaje}</h2>
        <button onclick="location.reload()" style="background:linear-gradient(145deg, #f59e0b, #d97706); border-bottom:5px solid #b45309;">🔄 Jugar de nuevo</button>
        <button onclick="location.href='basico4.html'" style="margin-left:15px; background:linear-gradient(145deg, #475569, #334155); border-bottom:5px solid #1e293b;">🏠 Menú Principal</button>
    `;
}

// ==========================================
// LÓGICA JUEGO 1: DETECTIVE MATEMÁTICO
// ==========================================
let respuestaDetective = 0;

function iniciarDetective() {
    actualizarMarcadoresGlobales();
    const contenedor = document.getElementById("contenedorNumeros");
    if(!contenedor) return;
    contenedor.innerHTML = "";
    document.getElementById("mensaje").textContent = "";

    // Crear un patrón (ej: de 10 en 10, de 5 en 5, etc.)
    let base = Math.floor(Math.random() * 200) + 50;
    let patron = [5, 10, 20, 50, 100][Math.floor(Math.random() * 5)];
    let arrNumeros = [];

    for(let i=0; i<4; i++) {
        arrNumeros.push(base + (i * patron));
    }

    // Insertar un intruso desordenado que rompa el patrón matemático
    let indiceIntruso = Math.floor(Math.random() * 4);
    respuestaDetective = arrNumeros[indiceIntruso] + (Math.random() > 0.5 ? 12 : -7);
    arrNumeros[indiceIntruso] = respuestaDetective;

    arrNumeros.forEach(num => {
        const btn = document.createElement("button");
        btn.className = "btn-numero-detective";
        btn.textContent = num;
        btn.onclick = () => verificarDetective(num);
        contenedor.appendChild(btn);
    });
}

function verificarDetective(elegido) {
    if(elegido === respuestaDetective) {
        juegoPuntaje += 15;
        juegoNivel++;
        mostrarFeedback(true, "🕵️ ¡Buen trabajo, Detective! Encontraste al intruso.");
        if(juegoNivel > maxNiveles) {
            setTimeout(() => {
                confetti({ particleCount: 200, spread: 100 });
                manejarFinDelJuego("🏆 ¡Caso Cerrado!", "¡Eres el mejor detective de números de 4to Básico!");
            }, 1200);
        } else {
            setTimeout(iniciarDetective, 1400);
        }
    } else {
        juegoVidas--;
        actualizarMarcadoresGlobales();
        mostrarFeedback(false, "❌ ¡Ese número sigue el patrón lógico! Busca bien.");
        if(juegoVidas <= 0) manejarFinDelJuego("💔 Caso Fallido", "Te has quedado sin pistas y el intruso escapó.");
    }
}

// ==========================================
// LÓGICA JUEGO 2: CARRERA DE COHETES
// ==========================================
let n1Cohete = 0, n2Cohete = 0, signoCorrectoCohete = "";

function iniciarCohetes() {
    actualizarMarcadoresGlobales();
    document.getElementById("mensaje").textContent = "";
    
    // Progresión por niveles para niños de 4to básico
    if(juegoNivel <= 2) {
        n1Cohete = Math.floor(Math.random() * 90) + 10;
        n2Cohete = Math.floor(Math.random() * 90) + 10;
    } else {
        n1Cohete = Math.floor(Math.random() * 900) + 100;
        n2Cohete = Math.floor(Math.random() * 900) + 100;
    }
    if(Math.random() < 0.25) n2Cohete = n1Cohete;

    document.getElementById("numero1").textContent = n1Cohete;
    document.getElementById("numero2").textContent = n2Cohete;

    if(n1Cohete > n2Cohete) signoCorrectoCohete = ">";
    else if(n1Cohete < n2Cohete) signoCorrectoCohete = "<";
    else signoCorrectoCohete = "=";

    // Actualizar posición visual del cohete en la pantalla
    let porcentajeAvance = ((juegoNivel - 1) / maxNiveles) * 85;
    document.getElementById("cohete").style.left = porcentajeAvance + "%";
}

function verificarCohete(signoElegido) {
    if(signoElegido === signoCorrectoCohete) {
        juegoPuntaje += 10;
        juegoNivel++;
        mostrarFeedback(true, "🚀 ¡Propulsión activada! Respuesta correcta.");
        
        let porcentajeAvance = ((juegoNivel - 1) / maxNiveles) * 85;
        document.getElementById("cohete").style.left = porcentajeAvance + "%";

        if(juegoNivel > maxNiveles) {
            setTimeout(() => {
                confetti({ particleCount: 200, spread: 100 });
                manejarFinDelJuego("🏁 ¡Llegaste a la Meta!", "¡Felicidades! Llevaste tu cohete al espacio.");
            }, 1200);
        } else {
            setTimeout(iniciarCohetes, 1400);
        }
    } else {
        juegoVidas--;
        actualizarMarcadoresGlobales();
        mostrarFeedback(false, "❌ ¡Cuidado! El signo es incorrecto, perdimos potencia.");
        if(juegoVidas <= 0) manejarFinDelJuego("💥 Cohete Averiado", "Te has quedado sin combustible en el espacio.");
    }
}

// ==========================================
// LÓGICA JUEGO 3: EL TESORO ORDENADO (Drag & Drop)
// ==========================================
let ordenCorrectoTesoros = [];

function iniciarTesoro() {
    actualizarMarcadoresGlobales();
    document.getElementById("mensaje").textContent = "";
    
    const contenedor = document.getElementById("contenedorTesoros");
    const zonaOrden = document.getElementById("zonaOrden");
    if(!contenedor || !zonaOrden) return;

    contenedor.innerHTML = "";
    zonaOrden.innerHTML = "";

    // Generar 3 números aleatorios únicos para ordenar
    let numeros = [];
    while(numeros.length < 3) {
        let n = Math.floor(Math.random() * 899) + 100;
        if(!numeros.includes(n)) numeros.push(n);
    }

    // Guardar el orden de menor a mayor esperado
    ordenCorrectoTesoros = [...numeros].sort((a,b) => a-b);

    // Desordenar para que el niño resuelva el puzzle
    numeros.sort(() => Math.random() - 0.5);

    // Crear tarjetas arrastrables
    numeros.forEach((num, index) => {
        const div = document.createElement("div");
        div.className = "tesoro-card";
        div.id = "tesoro-" + index;
        div.draggable = true;
        div.innerHTML = `💎 <span>${num}</span>`;
        
        // Eventos nativos Drag & Drop para PC
        div.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", e.target.id);
            playSound(350, "sine", 0.05);
        });

        contenedor.appendChild(div);
    });

    // Crear casillas de recepción de destino
    for(let i=0; i<3; i++) {
        const casilla = document.createElement("div");
        casilla.className = "casilla-vacia";
        casilla.dataset.index = i;
        
        casilla.addEventListener("dragover", (e) => e.preventDefault());
        casilla.addEventListener("drop", (e) => {
            e.preventDefault();
            const idData = e.dataTransfer.getData("text/plain");
            const elementoArrastrado = document.getElementById(idData);
            if(elementoArrastrado && casilla.children.length === 0) {
                casilla.appendChild(elementoArrastrado);
                playSound(450, "sine", 0.05);
            }
        });
        zonaOrden.appendChild(casilla);
    }

    // Permitir regresar los elementos al baúl de origen si el niño se arrepiente
    contenedor.addEventListener("dragover", (e) => e.preventDefault());
    contenedor.addEventListener("drop", (e) => {
        e.preventDefault();
        const idData = e.dataTransfer.getData("text/plain");
        const elementoArrastrado = document.getElementById(idData);
        if(elementoArrastrado) {
            contenedor.appendChild(elementoArrastrado);
        }
    });
}

function comprobarTesoro() {
    const casillas = document.querySelectorAll(".casilla-vacia");
    let numerosUsuario = [];
    let todoLleno = true;

    casillas.forEach(casilla => {
        if(casilla.children.length > 0) {
            let valorText = casilla.querySelector("span").textContent;
            numerosUsuario.push(parseInt(valorText));
        } else {
            todoLleno = false;
        }
    });

    if(!todoLleno) {
        mostrarFeedback(false, "⚠️ ¡Debes colocar todos los tesoros en las casillas primero!");
        return;
    }

    // Validar coincidencia de vectores
    let esCorrecto = true;
    for(let i=0; i<3; i++) {
        if(numerosUsuario[i] !== ordenCorrectoTesoros[i]) esCorrecto = false;
    }

    if(esCorrecto) {
        juegoPuntaje += 20;
        juegoNivel++;
        mostrarFeedback(true, "👑 ¡Excelente! El cofre se abrió y reclamaste el oro.");
        if(juegoNivel > maxNiveles) {
            setTimeout(() => {
                confetti({ particleCount: 200, spread: 100 });
                manejarFinDelJuego("🏆 ¡Rey del Tesoro!", "Has desbloqueado todas las riquezas ordenando números.");
            }, 1200);
        } else {
            setTimeout(iniciarTesoro, 1400);
        }
    } else {
        juegoVidas--;
        actualizarMarcadoresGlobales();
        mostrarFeedback(false, "❌ ¡Las trampas se activaron! Ese no es el orden de menor a mayor.");
        if(juegoVidas <= 0) {
            manejarFinDelJuego("☠️ Trampa Activada", "Te has quedado sin intentos en el calabozo.");
        } else {
            setTimeout(iniciarTesoro, 1500); // Reiniciar el nivel automáticamente
        }
    }
}