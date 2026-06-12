// ==========================================
// SISTEMA DE SONIDOS
// ==========================================

const sonidos = {

    click: new Audio("sonidos/click.mp3"),

    error: new Audio("sonidos/error.mp3"),

    bienvenida: new Audio("sonidos/bienvenida.wav"),

    avatar: new Audio("sonidos/avatar_seleccionado.mp3"),

    correcto: new Audio("sonidos/correcto.mp3"),

    boton: new Audio("sonidos/boton.mp3"),

    logro: new Audio("sonidos/logro.mp3")

};

function reproducirSonido(nombre) {

    if (sonidos[nombre]) {

        sonidos[nombre].currentTime = 0;

        sonidos[nombre].play().catch(() => {});

    }

}

// ==========================================
// PUNTAJE
// ==========================================

let puntaje = localStorage.getItem("puntaje") || 0;

function mostrarPuntaje() {

    let marcador = document.getElementById("puntaje");

    if (marcador) {

        marcador.innerHTML = puntaje;

    }

}

function sumarPuntos(valor) {

    puntaje = Number(puntaje) + valor;

    localStorage.setItem("puntaje", puntaje);

    mostrarPuntaje();

}

// ==========================================
// VIDAS
// ==========================================

let vidas = 3;

function mostrarVidas() {

    let vidasHTML = document.getElementById("vidas");

    if (vidasHTML) {

        vidasHTML.innerHTML = vidas;

    }

}

// ==========================================
// TEMPORIZADOR
// ==========================================

let tiempo = 30;

function iniciarTemporizador() {

    let intervalo = setInterval(() => {

        tiempo--;

        let reloj = document.getElementById("tiempo");

        if (reloj) {

            reloj.innerHTML = tiempo;

        }

        if (tiempo <= 0) {

            clearInterval(intervalo);

            reproducirSonido("error");

            alert("⏰ Tiempo terminado");

            location.reload();

        }

    }, 1000);

}

// ==========================================
// LOGIN
// ==========================================

let avatarSeleccionado = localStorage.getItem("avatar") || "";

function seleccionarAvatar(elementoContenedor) {

    let imagen = elementoContenedor.querySelector("img");

    avatarSeleccionado = imagen.src;

    localStorage.setItem("avatar", avatarSeleccionado);

    document.querySelectorAll(".avatar-opcion")
        .forEach(c => c.classList.remove("seleccionado"));

    elementoContenedor.classList.add("seleccionado");

    reproducirSonido("click");

    setTimeout(() => {

        reproducirSonido("avatar");

    }, 150);

}

// ==========================================
// INGRESAR
// ==========================================

function ingresar() {

    let campo = document.getElementById("nombre");

    if (!campo) return;

    let nombre = campo.value.trim();

    if (nombre === "" || avatarSeleccionado === "") {

        reproducirSonido("error");

        alert("Completa tu nombre y selecciona un avatar");

        return;

    }

    localStorage.setItem("nombre", nombre);

    reproducirSonido("bienvenida");

    if (typeof confetti === "function") {

        confetti({
            particleCount: 120,
            spread: 80
        });

    }

    setTimeout(() => {

        window.location.href = "bienvenida.html";

    }, 1800);

}

// ==========================================
// LISTA DE COLORES
// ==========================================

const listaColores = [

    {
        ingles: "RED",
        hex: "#ff4d4d"
    },

    {
        ingles: "BLUE",
        hex: "#4da6ff"
    },

    {
        ingles: "GREEN",
        hex: "#5cd65c"
    },

    {
        ingles: "YELLOW",
        hex: "#ffdb4d"
    },

    {
        ingles: "PINK",
        hex: "#ff94b8"
    }

];

// ==========================================
// VARIABLES ACTIVIDAD
// ==========================================

let indiceColorActual = 0;

// ==========================================
// DOM READY
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    mostrarPuntaje();

    mostrarVidas();

    iniciarTemporizador();

    // ======================================
    // SONIDOS BOTONES
    // ======================================

    let botones = document.querySelectorAll(
        "button, .btn-ui, .opcion-menu"
    );

    botones.forEach(btn => {

        btn.addEventListener("click", () => {

            reproducirSonido("boton");

        });

    });

    // ======================================
    // SONIDO INPUT
    // ======================================

    let input = document.getElementById("nombre");

    if (input) {

        input.addEventListener("keydown", () => {

            reproducirSonido("click");

        });

    }

    // ======================================
    // INICIAR ACTIVIDAD
    // ======================================

    if (document.getElementById("colorTexto")) {

        mostrarColor();

    }

    // ======================================
    // DRAG AND DROP
    // ======================================

    iniciarDragDrop();

});

// ==========================================
// MOSTRAR COLOR
// ==========================================

function mostrarColor() {

    let color = listaColores[indiceColorActual];

    let pizarra = document.getElementById("colorTexto");

    if (!pizarra) return;

    pizarra.innerHTML = color.ingles;

    pizarra.style.backgroundColor = color.hex;

    if (color.ingles === "YELLOW") {

        pizarra.style.color = "#333";

    } else {

        pizarra.style.color = "white";

    }

}

// ==========================================
// ESCUCHAR COLOR
// ==========================================

function reproducirColorActual() {

    let color = listaColores[indiceColorActual];

    let audio = new Audio(
        `sonidos/${color.ingles.toLowerCase()}.mp3`
    );

    audio.play().catch(() => {

        console.log("No se pudo reproducir");

    });

}

// ==========================================
// VERIFICAR RESPUESTA
// ==========================================

function verificarRespuesta(colorSeleccionado) {

    let correcto = listaColores[indiceColorActual].ingles;

    let feedback = document.getElementById("mensajeFeedback");

    if (!feedback) return;

    // ======================================
    // RESPUESTA CORRECTA
    // ======================================

    if (colorSeleccionado === correcto) {

        sumarPuntos(10);

        reproducirSonido("correcto");

        feedback.innerHTML =
            "¡Correcto! 🎉";

        feedback.style.color = "green";

        if (typeof confetti === "function") {

            confetti({
                particleCount: 60,
                spread: 60
            });

        }

    }

    // ======================================
    // RESPUESTA INCORRECTA
    // ======================================

    else {

        vidas--;

        mostrarVidas();

        reproducirSonido("error");

        feedback.innerHTML =
            "Inténtalo otra vez ❌";

        feedback.style.color = "red";

        if (vidas <= 0) {

            alert("💔 Te quedaste sin vidas");

            location.reload();

        }

    }

}

// ==========================================
// SIGUIENTE COLOR
// ==========================================

function siguienteColor() {

    indiceColorActual++;

    // ======================================
    // FINALIZAR ACTIVIDAD
    // ======================================

    if (indiceColorActual >= listaColores.length) {

        reproducirSonido("logro");

        if (typeof confetti === "function") {

            confetti({
                particleCount: 150,
                spread: 120
            });

        }

        setTimeout(() => {

            window.location.href =
                "actividad2.html";

        }, 1500);

        return;

    }

    // ======================================
    // MOSTRAR NUEVO COLOR
    // ======================================

    mostrarColor();

    let feedback =
        document.getElementById("mensajeFeedback");

    if (feedback) {

        feedback.innerHTML = "";

    }

}

// ==========================================
// DRAG AND DROP
// ==========================================

function iniciarDragDrop() {

    const draggables = document.querySelectorAll(".color-draggable");
    const zonas = document.querySelectorAll(".zona-drop");

    draggables.forEach(item => {

        item.addEventListener("dragstart", () => {

            item.classList.add("dragging");

        });

        item.addEventListener("dragend", () => {

            item.classList.remove("dragging");

        });

    });

    zonas.forEach(zona => {

        zona.addEventListener("dragover", e => {

            e.preventDefault();

        });

        zona.addEventListener("drop", e => {

            e.preventDefault();

            const item = document.querySelector(".dragging");

            if (!item) return;

            if (item.id === zona.dataset.color) {

                reproducirSonido("correcto");

                sumarPuntos(10);

                document.getElementById("mensajeFeedback").innerHTML =
                    "🎉 ¡Felicitaciones!";

                document.getElementById("mensajeFeedback").style.color =
                    "green";

                if (typeof confetti === "function") {

                    confetti({
                        particleCount: 80,
                        spread: 70
                    });

                }

                nivelNumeroActual++;

                if (nivelNumeroActual >= nivelesNumeros.length) {

                    document.getElementById("mensajeFeedback").innerHTML =
                        "🏆 ¡Completaste todos los niveles!";

                    if (typeof confetti === "function") {

                        confetti({
                            particleCount: 250,
                            spread: 120
                        });

                    }

                    setTimeout(() => {

                        window.location.href = "4to_basico/juego2.html";

                    }, 3000);

                } else {

                    setTimeout(() => {

                        document.getElementById("mensajeFeedback").innerHTML = "";

                        cargarNivelNumeros();

                    }, 1500);

                }

            } else {

                reproducirSonido("error");

                vidas--;

                mostrarVidas();

                document.getElementById("mensajeFeedback").innerHTML =
                    "❌ Número incorrecto";

                document.getElementById("mensajeFeedback").style.color =
                    "red";

                if (vidas <= 0) {

                    alert("💔 Juego terminado");

                    location.reload();

                }

            }

        });

    });

}

// ==========================================
// PÁGINA FINAL
// ==========================================

function mostrarPantallaFinal() {

    reproducirSonido("logro");

    if (typeof confetti === "function") {

        confetti({
            particleCount: 250,
            spread: 180
        });

    }

    let total = localStorage.getItem("puntaje") || 0;

    let textoFinal =
        document.getElementById("puntajeFinal");

    if (textoFinal) {

        textoFinal.innerHTML = total;

    }

}
document.addEventListener("DOMContentLoaded", () => {

    const titulo = document.querySelector("h1");

    if (titulo && titulo.textContent.includes("Signos")) {

        const voz = new SpeechSynthesisUtterance(
            "Mayor que, Menor que e Igual a"
        );

        voz.lang = "es-ES";

        setTimeout(() => {
            speechSynthesis.speak(voz);
        }, 1000);

    }

});