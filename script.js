// ==================================================
// EMOJI LINES
// SIN LÍNEA BLANCA
// TEXTO LUGAR TÁCTIL SEGÚN CANTIDAD DE EMOJIS
// ==================================================

const canvas =
    document.getElementById("canvas");

const ctx =
    canvas.getContext("2d", {
        alpha: false
    });

const drawButton =
    document.getElementById("drawButton");

const saveButton =
    document.getElementById("saveButton");

const clearButton =
    document.getElementById("clearButton");

const centerMessage =
    document.getElementById("centerMessage");


const emojiList = [
    "😀",
    "😎",
    "😊",
    "😍",
    "🤩",
    "😮",
    "🥳",
    "🌈",
    "⭐",
    "✨",
    "🔥",
    "💫",
    "🌸",
    "🌱",
    "🚀",
    "💥"
];


const EMOJI_SPACING = 70;

const MAX_EMOJIS = 120;


let lines = [];

let currentLine = null;

let drawing = false;

let drawMode = true;

let previousX = 0;

let previousY = 0;

let previousTime = 0;

let currentLineDistance = 0;

let distanceSinceEmoji = 0;

let animationRequested = false;


// ==================================================
// REDIMENSIONAR CANVAS
// ==================================================

function resizeCanvas() {

    const rect =
        canvas.getBoundingClientRect();

    canvas.width =
        Math.floor(rect.width);

    canvas.height =
        Math.floor(rect.height);

    redrawCanvas();

    updateCenterMessage();
}


window.addEventListener(
    "resize",
    resizeCanvas
);


// ==================================================
// POSICIÓN DEL MOUSE / DEDO
// ==================================================

function getCanvasPosition(event) {

    const rect =
        canvas.getBoundingClientRect();

    return {

        x:
            event.clientX -
            rect.left,

        y:
            event.clientY -
            rect.top

    };
}


// ==================================================
// INICIAR DIBUJO
// ==================================================

function startDrawing(x, y) {

    if (!drawMode) {
        return;
    }

    drawing = true;

    document.body.classList.add(
        "drawing"
    );

    currentLineDistance = 0;

    distanceSinceEmoji = 0;

    currentLine = {

        emojis: []

    };

    lines.push(
        currentLine
    );

    previousX = x;

    previousY = y;

    previousTime =
        performance.now();

    requestRedraw();
}


// ==================================================
// PROCESAR MOVIMIENTO
// ==================================================

function processMovement(x, y) {

    if (
        !drawing ||
        !currentLine ||
        !drawMode
    ) {
        return;
    }

    const now =
        performance.now();

    const dx =
        x -
        previousX;

    const dy =
        y -
        previousY;

    const distance =
        Math.hypot(
            dx,
            dy
        );

    if (distance < 3) {
        return;
    }

    currentLineDistance +=
        distance;

    distanceSinceEmoji +=
        distance;


    if (
        distanceSinceEmoji >=
        EMOJI_SPACING
    ) {

        createEmoji(
            x,
            y
        );

        distanceSinceEmoji = 0;

    }


    previousX = x;

    previousY = y;

    previousTime = now;

    requestRedraw();
}


// ==================================================
// TAMAÑO DEL EMOJI
// CORTO = PEQUEÑO
// LARGO = GRANDE
// ==================================================

function getEmojiSize(distance) {

    if (distance < 150) {
        return 18;
    }

    if (distance < 350) {
        return 26;
    }

    if (distance < 600) {
        return 36;
    }

    if (distance < 900) {
        return 48;
    }

    if (distance < 1300) {
        return 60;
    }

    return 72;
}


// ==================================================
// EMOJI ALEATORIO
// ==================================================

function getRandomEmoji() {

    return emojiList[
        Math.floor(
            Math.random() *
            emojiList.length
        )
    ];
}


// ==================================================
// CREAR EMOJI
// ==================================================

function createEmoji(x, y) {

    if (!currentLine) {
        return;
    }


    currentLine.emojis.push({

        character:
            getRandomEmoji(),

        x:
            x,

        y:
            y,

        size:
            getEmojiSize(
                currentLineDistance
            ),

        rotation:
            (
                Math.random() * 20
            ) - 10

    });


    limitEmojis();


    // ==============================================
    // SI HAY AL MENOS UN EMOJI,
    // DESAPARECE "LUGAR TÁCTIL."
    // ==============================================

    updateCenterMessage();
}


// ==================================================
// LIMITAR CANTIDAD DE EMOJIS
// ==================================================

function limitEmojis() {

    let total = 0;


    for (
        const line of lines
    ) {

        total +=
            line.emojis.length;

    }


    while (
        total >
        MAX_EMOJIS
    ) {

        for (
            const line of lines
        ) {

            if (
                line.emojis.length >
                0
            ) {

                line.emojis.shift();

                total--;

                break;

            }

        }

    }
}


// ==================================================
// MOSTRAR / OCULTAR "LUGAR TÁCTIL."
// ==================================================

function updateCenterMessage() {

    let totalEmojis = 0;


    for (
        const line of lines
    ) {

        totalEmojis +=
            line.emojis.length;

    }


    if (
        totalEmojis > 0
    ) {

        centerMessage.style.opacity =
            "0";

    } else {

        centerMessage.style.opacity =
            "1";

    }
}


// ==================================================
// SOLICITAR REDIBUJADO
// ==================================================

function requestRedraw() {

    if (
        animationRequested
    ) {
        return;
    }


    animationRequested = true;


    requestAnimationFrame(
        function() {

            animationRequested =
                false;

            redrawCanvas();

        }
    );
}


// ==================================================
// FONDO DEGRADADO
// ==================================================

function drawBackground() {

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            canvas.width,
            canvas.height
        );


    gradient.addColorStop(
        0,
        "#8138ff"
    );


    gradient.addColorStop(
        0.18,
        "#f21da1"
    );


    gradient.addColorStop(
        0.42,
        "#ff286d"
    );


    gradient.addColorStop(
        0.62,
        "#c20fc7"
    );


    gradient.addColorStop(
        0.82,
        "#8d19e9"
    );


    gradient.addColorStop(
        1,
        "#ff744d"
    );


    ctx.fillStyle =
        gradient;


    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
}


// ==================================================
// DIBUJAR EMOJIS
// ==================================================

function drawEmojis() {

    ctx.textAlign =
        "center";

    ctx.textBaseline =
        "middle";


    for (
        const line of lines
    ) {

        for (
            const emoji of line.emojis
        ) {

            ctx.save();


            ctx.translate(
                emoji.x,
                emoji.y
            );


            ctx.rotate(
                emoji.rotation *
                Math.PI /
                180
            );


            ctx.font =
                `${emoji.size}px Arial`;


            ctx.fillText(
                emoji.character,
                0,
                0
            );


            ctx.restore();

        }

    }
}


// ==================================================
// REDIBUJAR TODO
// ==================================================

function redrawCanvas() {

    drawBackground();

    drawEmojis();

}


// ==================================================
// PRESIONAR MOUSE / DEDO
// ==================================================

canvas.addEventListener(
    "pointerdown",
    function(event) {

        if (!drawMode) {
            return;
        }


        event.preventDefault();


        canvas.setPointerCapture(
            event.pointerId
        );


        const position =
            getCanvasPosition(
                event
            );


        startDrawing(
            position.x,
            position.y
        );

    }
);


// ==================================================
// MOVER MOUSE / DEDO
// ==================================================

canvas.addEventListener(
    "pointermove",
    function(event) {

        if (
            !drawing ||
            !drawMode
        ) {
            return;
        }


        event.preventDefault();


        const position =
            getCanvasPosition(
                event
            );


        processMovement(
            position.x,
            position.y
        );

    }
);


// ==================================================
// SOLTAR MOUSE / DEDO
// ==================================================

canvas.addEventListener(
    "pointerup",
    function(event) {

        event.preventDefault();


        stopDrawing();


        if (
            canvas.hasPointerCapture(
                event.pointerId
            )
        ) {

            canvas.releasePointerCapture(
                event.pointerId
            );

        }

    }
);


// ==================================================
// CANCELAR DIBUJO
// ==================================================

canvas.addEventListener(
    "pointercancel",
    function() {

        stopDrawing();

    }
);


// ==================================================
// SALIR DEL CANVAS
// ==================================================

canvas.addEventListener(
    "pointerleave",
    function() {

        if (drawing) {

            stopDrawing();

        }

    }
);


// ==================================================
// DETENER DIBUJO
// ==================================================

function stopDrawing() {

    drawing = false;

    currentLine = null;

    document.body.classList.remove(
        "drawing"
    );
}


// ==================================================
// BOTÓN MODO DIBUJAR
// ==================================================

drawButton.addEventListener(
    "click",
    function(event) {

        event.stopPropagation();


        drawMode =
            !drawMode;


        if (drawMode) {

            drawButton.innerHTML =
                `
                <span class="button-icon">▶</span>
                <span>Modo: Dibujar</span>
                `;

        } else {

            drawButton.innerHTML =
                `
                <span class="button-icon">Ⅱ</span>
                <span>Modo: Pausa</span>
                `;


            stopDrawing();

        }

    }
);


// ==================================================
// BOTÓN LIMPIAR
// ==================================================

clearButton.addEventListener(
    "click",
    function(event) {

        event.stopPropagation();


        lines = [];

        currentLine = null;

        drawing = false;


        currentLineDistance = 0;

        distanceSinceEmoji = 0;


        document.body.classList.remove(
            "drawing"
        );


        // ==========================================
        // YA NO HAY EMOJIS
        // ENTONCES VUELVE "LUGAR TÁCTIL."
        // ==========================================

        updateCenterMessage();


        requestRedraw();

    }
);


// ==================================================
// BOTÓN GUARDAR
// ==================================================

saveButton.addEventListener(
    "click",
    function(event) {

        event.stopPropagation();


        redrawCanvas();


        const link =
            document.createElement(
                "a"
            );


        link.download =
            "emoji-lines.png";


        link.href =
            canvas.toDataURL(
                "image/png"
            );


        link.click();

    }
);


// ==================================================
// INICIAR
// ==================================================

resizeCanvas();

updateCenterMessage();