
    // =========================
    // ELEMENTOS
    // =========================

    const bienvenida =
        document.getElementById(
            "pantallaBienvenida"
        );

    const juego =
        document.getElementById(
            "pantallaJuego"
        );

    const final =
        document.getElementById(
            "pantallaFinal"
        );

    const objetivo =
        document.getElementById(
            "objetivo"
        );

    const tiempoTexto =
        document.getElementById(
            "temporizador"
        );

    const puntajeFinal =
        document.getElementById(
            "puntajeFinal"
        );

    const nivelTexto =
        document.getElementById(
            "nivelTexto"
        );

    const rondaTexto =
        document.getElementById(
            "rondaTexto"
        );

    const tituloFinal =
        document.getElementById(
            "tituloFinal"
        );

    const textoFinal =
        document.getElementById(
            "textoFinal"
        );

    const botonFinal =
        document.getElementById(
            "botonFinal"
        );

    // =========================
    // DATOS
    // =========================

    const colores = [

        {
            nombre: "RED",
            color: "#ef4444"
        },

        {
            nombre: "BLUE",
            color: "#3b82f6"
        },

        {
            nombre: "PINK",
            color: "#ec4899"
        },

        {
            nombre: "YELLOW",
            color: "#eab308"
        },

        {
            nombre: "GREEN",
            color: "#22c55e"
        }

    ];

    let colorActual;

    let tiempo = 10;

    let intervalo;

    let nivel = "easy";

    let respuestasUsuario = [];

    let rondaActual = 0;

    let totalRondas = 10;

    // =========================
    // INICIAR
    // =========================

    function iniciarJuego(
        nivelElegido
    ) {

        nivel = nivelElegido;

        bienvenida.style.display =
            "none";

        juego.style.display =
            "block";

        if (nivel === "easy") {

            tiempo = 10;

            nivelTexto.textContent =
                "Easy";

        }

        if (nivel === "medium") {

            tiempo = 7;

            nivelTexto.textContent =
                "Medium";

        }

        if (nivel === "hard") {

            tiempo = 5;

            nivelTexto.textContent =
                "Hard";

        }

        nuevaRonda();

    }

    // =========================
    // NUEVA RONDA
    // =========================

    function nuevaRonda() {

        clearInterval(intervalo);

        if (rondaActual >= totalRondas) {

            terminarJuego();

            return;

        }

        rondaTexto.textContent =
            rondaActual + 1;

        colorActual =
            colores[
                Math.floor(
                    Math.random() *
                    colores.length
                )
            ];

        objetivo.textContent =
            colorActual.nombre;

        objetivo.style.background =
            "white";

        objetivo.style.color =
            "#334155";

        iniciarTemporizador();

        // AUDIO DEL COLOR

        const audioColor =
            new Audio(
                "sonidos/" +
                colorActual.nombre +
                ".mp3"
            );

        audioColor.play();

    }

    // =========================
    // TEMPORIZADOR
    // =========================

    function iniciarTemporizador() {

        let tiempoActual = tiempo;

        tiempoTexto.textContent =
            tiempoActual;

        intervalo = setInterval(() => {

            tiempoActual--;

            tiempoTexto.textContent =
                tiempoActual;

            if (tiempoActual <= 0) {

                clearInterval(intervalo);

                respuestasUsuario.push({

                    correcta: false

                });

                document
                .getElementById(
                    "audioError"
                )
                .play();

                objetivo.classList.add(
                    "error"
                );

                setTimeout(() => {

                    objetivo.classList.remove(
                        "error"
                    );

                    rondaActual++;

                    nuevaRonda();

                }, 800);

            }

        }, 1000);

    }

    // =========================
    // DRAG
    // =========================

    document
    .querySelectorAll(
        ".color-arrastrable"
    )

    .forEach(color => {

        color.addEventListener(

            "dragstart",

            e => {

                e.dataTransfer.setData(

                    "color",

                    color.dataset.color

                );

            }

        );

    });

    // =========================
    // DROP
    // =========================

    objetivo.addEventListener(

        "dragover",

        e => {

            e.preventDefault();

        }

    );

    objetivo.addEventListener(

        "drop",

        e => {

            e.preventDefault();

            const colorSeleccionado =

                e.dataTransfer.getData(
                    "color"
                );

            const correcta =

                colorSeleccionado ===
                colorActual.nombre;

            respuestasUsuario.push({

                correcta: correcta

            });

            clearInterval(intervalo);

            // =========================
            // CORRECTA
            // =========================

            if (correcta) {

                document
                .getElementById(
                    "audioCorrecto"
                )
                .play();

                objetivo.style.background =
                    colorActual.color;

                objetivo.style.color =
                    "white";

                objetivo.classList.add(
                    "correcto"
                );

            }

            // =========================
            // INCORRECTA
            // =========================

            else {

                document
                .getElementById(
                    "audioError"
                )
                .play();

                objetivo.classList.add(
                    "error"
                );

            }

            rondaActual++;

            setTimeout(() => {

                objetivo.classList.remove(
                    "correcto"
                );

                objetivo.classList.remove(
                    "error"
                );

                nuevaRonda();

            }, 800);

        }

    );

    // =========================
    // FINAL
    // =========================

    function terminarJuego() {

        clearInterval(intervalo);

        const puntaje =

            respuestasUsuario.filter(
                r => r.correcta
            ).length;

        juego.style.display =
            "none";

        final.style.display =
            "block";

        puntajeFinal.textContent =

            puntaje +
            " / " +
            totalRondas;

        // AUDIO FINAL

        document
        .getElementById(
            "audioLogro"
        )
        .play();

        // EFECTOS

        lanzarConfetti();

        lanzarEstrellas();

        // =========================
        // TODAS CORRECTAS
        // =========================

        if (puntaje === totalRondas) {

            tituloFinal.textContent =

                "Congratulations 🎉";

            textoFinal.textContent =

                "Perfect score! Continue to the next activity.";

            botonFinal.textContent =

                "Continue ➜";

            botonFinal.onclick =
                continuarActividad;

        }

        // =========================
        // ERRORES
        // =========================

        else {

            tituloFinal.textContent =

                "Try Again 😅";

            textoFinal.textContent =

                "You had incorrect answers. Try again without reloading the page.";

            botonFinal.textContent =

                "Restart 🔄";

            botonFinal.onclick =
                reiniciarJuego;

        }

    }

    // =========================
    // CONFETTI
    // =========================

    function lanzarConfetti() {

        for (let i = 0; i < 120; i++) {

            const confetti =
                document.createElement(
                    "div"
                );

            confetti.classList.add(
                "confetti"
            );

            confetti.style.left =

                Math.random() *
                100 + "vw";

            confetti.style.background =

                colores[
                    Math.floor(
                        Math.random() *
                        colores.length
                    )
                ].color;

            confetti.style.animationDuration =

                (Math.random() * 3 + 2)
                + "s";

            document.body.appendChild(
                confetti
            );

            setTimeout(() => {

                confetti.remove();

            }, 5000);

        }

    }

    // =========================
    // ESTRELLAS
    // =========================

    function lanzarEstrellas() {

        for (let i = 0; i < 40; i++) {

            const estrella =
                document.createElement(
                    "div"
                );

            estrella.classList.add(
                "estrella"
            );

            estrella.innerHTML = "⭐";

            estrella.style.left =

                Math.random() *
                100 + "vw";

            estrella.style.top =

                Math.random() *
                100 + "vh";

            document.body.appendChild(
                estrella
            );

            setTimeout(() => {

                estrella.remove();

            }, 3000);

        }

    }

    // =========================
    // CONTINUAR
    // =========================

    function continuarActividad() {

        window.location.href =
            "actividad3.html";

    }

    // =========================
    // REINICIAR SIN RECARGAR
    // =========================

    function reiniciarJuego() {

        respuestasUsuario = [];

        rondaActual = 0;

        final.style.display =
            "none";

        juego.style.display =
            "block";

        nuevaRonda();

    }
