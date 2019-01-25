//UWAGA! po otworzeniu konsoli w chromie do sterowania sesnorami trzeba przeładowac strone bo sie rozjeżdż (nie wiem czemu)

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

    //restartowanie gry
    restart: function () {
        this.menuElement.style.display = "none";
        if (this.firstLoose) {
            this.firstLoose = false;
            this.menuElement.querySelector("#add").style.display = "none";
        }

        let wallsGroup = this.element.querySelector("#walls");
        while (wallsGroup.firstChild) {
            wallsGroup.removeChild(wallsGroup.firstChild);
        }
        this.mainPlayer.element.remove();

        this.setGame();
        this.setMove(true);

        document.addEventListener("keydown", keyHandler);
    },

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
    },

    //sprawdzanie czy gracz i meta kolidują ze sobą
    checkForWin: function () {
        let dx = this.mainPlayer.x - this.winPoint.x;
        let dy = this.mainPlayer.y - this.winPoint.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (this.mainPlayer.r + this.winPoint.r > distance)
            this.win();
        else
            requestAnimationFrame(() => {
                this.checkForWin()
            });
    },

    //wyświetlanie strony "wygrana"
    win: function () {
        this.menuElement.querySelector("#info").innerHTML = "Wygrana";
        this.showMenu();
    },

    //wyświetlanie strony "porażka"
    gameOver: function () {
        this.menuElement.querySelector("#info").innerHTML = "Porażka";
        if (this.firstLoose) this.menuElement.querySelector("#add").style.display = "inline";
        this.showMenu();
    },

    //wyswietlanie panelu przegranej/wygranej
    showMenu: function () {
        this.menuElement.style.display = "flex";
        document.removeEventListener("keydown", keyHandler);
        this.setMove(false);
    },

    //przy rozpoczeciu gry
    setMove: function (val) {
        this.mainPlayer.ableToMove = val;
        this.antiPlayer.ableToMove = val;

        //zerowanie przyspieszenia
        this.mainPlayer.acc = {
            x: 0,
            y: 0
        };
        if (val) {
            this.mainPlayer.move();
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

// zwiekszanie predkosci na osi x
Player.prototype.addVelocityX = function (val) {
    this.acc.x += val;
    if (Math.abs(this.acc.x) > this.acc.max) this.acc.x = this.acc.max * Math.sign(this.acc.x);
}

// zwiekszanie predkosci na osi y
Player.prototype.addVelocityY = function (val) {
    this.acc.y += val;
    if (Math.abs(this.acc.y) > this.acc.max) this.acc.y = this.acc.max * Math.sign(this.acc.y);
}

//poruszanie graczem + testy kolizyjne
Player.prototype.move = function () {
    this.x += this.acc.x;
    this.y += this.acc.y;

    this.bouncing();

    this.pPos.x = parseInt(this.x / 10);
    this.pPos.y = parseInt(this.y / 10);

    this.isFloorLava();

    this.element.setAttributeNS(null, "cx", this.x * Game.scale);
    this.element.setAttributeNS(null, "cy", this.y * Game.scale);

    this.acc.x -= Math.sign(this.acc.x) * Game.friction;
    this.acc.y -= Math.sign(this.acc.y) * Game.friction;


    if (this.ableToMove) requestAnimationFrame(() => {
        this.move()
    });
}

// sprawdzanie czy gracz wpadł w "lawę"
Player.prototype.isFloorLava = function () {
    if (Game.map[this.pPos.y][this.pPos.x] == 2)
        Game.gameOver();
}

//sprawdzanie czy gracz dotyka sciany
Player.prototype.bouncing = function () {

    if (Game.map[this.pPos.y][this.pPos.x + 1] == 1) {
        if (this.x + this.r > (this.pPos.x + 1) * 10) {
            this.acc.x = Math.abs(this.acc.x) * -Game.bounciness;
            this.x = (this.pPos.x + 1) * 10 - this.r - 0.1;
        }
    }
    if (Game.map[this.pPos.y][this.pPos.x - 1] == 1) {
        if (this.x - this.r < (this.pPos.x) * 10) {
            this.acc.x = Math.abs(this.acc.x) * Game.bounciness;
            this.x = (this.pPos.x) * 10 + this.r + 0.1;
        }
    }

    if (Game.map[this.pPos.y + 1][this.pPos.x] == 1) {
        if (this.y + this.r > (this.pPos.y + 1) * 10) {
            this.acc.y = Math.abs(this.acc.y) * -Game.bounciness;
            this.y = (this.pPos.y + 1) * 10 - this.r - 0.1;
        }
    }

    if (Game.map[this.pPos.y - 1][this.pPos.x] == 1) {
        if (this.y - this.r < (this.pPos.y) * 10) {
            this.acc.y = Math.abs(this.acc.y) * Game.bounciness;
            this.y = (this.pPos.y) * 10 + this.r + 0.1;
        }
    }
}

//sterowanie sensorami
function orientationChange(e) {
    Game.mainPlayer.addVelocityX(e.alpha * Game.gravity);

    Game.mainPlayer.addVelocityY((e.beta - 90) * Game.gravity);
}