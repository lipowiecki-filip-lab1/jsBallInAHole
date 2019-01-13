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