document.addEventListener("DOMContentLoaded", onLoad)
// selektory dla elementów dom
function onLoad() {
    document.querySelector("#restartBtn").addEventListener("click", () => {
        Game.restart()
    });
    Game.setGame();
    document.querySelector("#startBtn").addEventListener("click", () => {
        Game.setMove(true);
        document.querySelector("#startInfo").style.display = "none";
    });

    window.addEventListener("deviceorientation", orientationChange);

}

// tablica do obliczeń reprezentująca planszę
let Game = {
    element: document.querySelector("#gameBoard"),
    map: [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],

    //rozmiar planszy
    partsNum: {
        x: 20,
        y: 15
    },
    partSize: 10,
    bounciness: 0.5, //procent prędkości traconej przez kulke przy uderzeniu w sciane

    //wielkość mapy
    width: 200,
    height: 300,
    scale: 0,
    friction: 0.01,
    gravity: 0.005,

    mainPlayer: {},
    antiPlayer: {},

    menuElement: document.querySelector("#menu"),

    // tworzenie gracza i mety
    setGame: function () {
        this.scale = Game.element.getBoundingClientRect().width / Game.width;

        this.renderMap();
        this.mainPlayer = new Player(35, 30, "blue");
        this.winPoint = new Player(150, 130, "black");
        this.checkForWin();
    },

    // rysowanie planszy
    renderMap: function () {
        let wallsGroup = this.element.querySelector("#walls");
        for (let i = 0; i < this.map.length; i++) {
            for (let j = 0; j < this.map[i].length; j++) {
                newEl = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
                newEl.setAttribute("x", j * this.partSize * this.scale + 0.3);
                newEl.setAttribute("y", i * this.partSize * this.scale + 0.3);

                newEl.setAttribute("width", this.partSize * this.scale - 0.6);
                newEl.setAttribute("height", this.partSize * this.scale - 0.6);

                if (this.map[i][j] == 0) newEl.setAttribute("fill", "#aaa");
                else if (this.map[i][j] == 1) newEl.setAttribute("fill", "black");
                else if (this.map[i][j] == 2) newEl.setAttribute("fill", "orange");
                wallsGroup.appendChild(newEl);
            }
        }
    }
}

//konstruktor dla gracza i mety
let Player = function (posX, posY, color) {
    this.element = {};

    //pozycja gracza
    this.x = 0;
    this.y = 0;
    this.r = 4.5;
    this.ableToMove = false;

    //przyspieszenie gracza
    this.acc = {
        x: 0,
        y: 0,
        max: 4
    };

    this.pPos = {
        x: 1,
        y: 1
    };

    this.setPlayer(posX, posY, color);
    this.move();
}

//Osadzanie gracza na planszy
Player.prototype.setPlayer = function (posX, posY, color) {
    this.x = posX;
    this.y = posY;

    this.pPos.x = parseInt(this.x / Game.partSize);
    this.pPos.y = parseInt(this.y / Game.partSize);

    this.element = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    this.element.setAttribute("cx", this.x);
    this.element.setAttribute("cy", this.y);
    this.element.setAttribute("r", Game.partSize * this.r * 0.1 * Game.scale);
    this.element.setAttribute("fill", color);

    Game.element.appendChild(this.element);
}