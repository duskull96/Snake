'use strict';

const record = document.querySelector('#record'),
    score = document.querySelector('#score'),
    btnStartGame = document.querySelector('#startgame'),
    canvas = document.querySelector('canvas');

let gzHeight = canvas.height,
    gzWidth = canvas.width;
let snake = canvas.getContext('2d');
let snakeEnd = canvas.getContext('2d');
let bonus = canvas.getContext('2d');
let losed = false;
let recordScore = 0;
let bonusPosX = gzWidth / 2,
    bonusPosY = gzHeight / 2;
let posX = gzWidth / 2;
let posY = gzHeight / 2;
let blockSize = 10;
let snakeSpeed = 100
let snakeSize = [
    {
        x: posX,
        y: posY
    }
]
let bonusPack = [
    {
        x: bonusPosX,
        y: bonusPosY
    }
]
let moveTo = null;
drawBonus()
snake.fillStyle = 'black';
snake.fillRect(posX, posY, blockSize, blockSize)
let dontShift = false

// Рандомное число от min до max+1
function rndInt(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand / 10) * 10;
    return Math.floor(rand);
}
// Отрисовка бонусов
function drawBonus() {
    bonusPack.push(
        {
            x: rndInt(0, gzWidth - blockSize),
            y: rndInt(0, gzHeight - blockSize)
        }
    )
    bonus.fillStyle = 'red'
    bonus.fillRect(bonusPack[0].x, bonusPack[0].y, blockSize, blockSize)
    console.log('Координаты бонуса x y ', bonusPack[0].x, bonusPack[0].y);
}
// Отрисовка змейки
function drawSnake() {
    snake.fillStyle = 'black';
    snake.fillRect(posX, posY, blockSize, blockSize)
    snakeEnd.fillStyle = 'white';
    snakeEnd.fillRect(snakeSize[0].x, snakeSize[0].y, blockSize, blockSize)
    checkHunt()
    checkLose(posX, posY)
    if (dontShift == false) {
        snakeSize.shift()
    } else {
        dontShift = !dontShift
    }
}
// Проверка что змейка съела бонус
function checkHunt() {
    if (snakeSize[snakeSize.length - 1].x == bonusPack[0].x &&
        snakeSize[snakeSize.length - 1].y == bonusPack[0].y) {
        if (snakeSpeed > 60) {
            snakeSpeed -= 1
        }
        dontShift = true
        bonusPack.shift()
        drawBonus();
        score.textContent = snakeSize.length - 1
        console.log('Gotcha! Speed =', snakeSpeed);
    } else {
        dontShift = false
    }

}
function checkLose(x, y) {
    if (x == gzWidth || y == gzHeight || x == 0 - blockSize || y == 0 - blockSize) {
        losed = true
        pausedOrGameOver()
    }
    snakeSize.forEach((cords, id) => {
        if (cords.x == x && cords.y == y && id != snakeSize.length - 1  
            && id != 0) {
            losed = true
            console.log(cords.x, cords.y, posX, posY, id);
            pausedOrGameOver()
        }
    })
}
// Объявление паузы или конца игры
function pausedOrGameOver() {
    clearInterval(moveL)
    clearInterval(moveR)
    clearInterval(moveU)
    clearInterval(moveD)
    if (!losed) {
        switchWay = false
        console.log('Game Paused!');
    } else {
        if (snakeSize.length - 1 > recordScore) {
            recordScore = (snakeSize.length - 2)
            record.textContent = recordScore
        }
        console.log('Game Over!');
        window.removeEventListener('keydown', keyHandler);
    }
}
// Запуск игры
function startGame() {
    $('select').formSelect()
    let gameLevel = [150, 100, 60]
    let gameLevelID = Number($('#gameLevel').formSelect('getSelectedValues').join())
    snakeSpeed = gameLevel[gameLevelID - 1]
    let gzSize = [300, 500, 700]
    let gzSizeID = Number($('#gameSize').formSelect('getSelectedValues').join())
    canvas.width = gzSize[gzSizeID - 1]
    canvas.height = gzSize[gzSizeID - 1]
    gzHeight = canvas.height
    gzWidth = canvas.width
    bonus.clearRect(0, 0, gzWidth, gzHeight)
    score.textContent = 0
    posX = gzWidth / 2;
    posY = gzHeight / 2;
    snakeSize = [
        {
            x: posX,
            y: posY
        }
    ]
    bonusPack = []
    losed = false
    moveTo = null
    drawBonus()
    snake.fillStyle = 'black';
    snake.fillRect(posX, posY, blockSize, blockSize)
    window.addEventListener('keydown', keyHandler);
}
// Джвижение змейки
let switchWay = true;
let moveL;
let moveR;
let moveD;
let moveU;

function moveLeft() {
    if (moveTo != 'Left' && moveTo != 'Right') {
        moveTo = "Left"
        switchWay = false
        clearInterval(moveD)
        clearInterval(moveU)
        console.log(moveTo);
        moveL = setInterval(() => {
            snakeSize.push(
                {
                    x: posX -= blockSize,
                    y: posY
                }
            )
            drawSnake();
            switchWay = true
        }, snakeSpeed)

    } else return
}
function moveRight() {
    if (moveTo != 'Left' && moveTo != 'Right') {
        moveTo = "Right"
        switchWay = false
        clearInterval(moveD)
        clearInterval(moveU)
        console.log(moveTo);
        moveR = setInterval(() => {
            snakeSize.push(
                {
                    x: posX += blockSize,
                    y: posY
                }
            )
            drawSnake();
            switchWay = true
        }, snakeSpeed)
    } else return
}
function moveDown() {
    if (moveTo != 'Down' && moveTo != 'Up') {
        moveTo = "Down"
        switchWay = false
        clearInterval(moveL)
        clearInterval(moveR)
        console.log(moveTo);
        moveD = setInterval(() => {
            snakeSize.push(
                {
                    x: posX,
                    y: posY += blockSize
                }
            )
            drawSnake();
            switchWay = true
        }, snakeSpeed)
    } else return
}
function moveUp() {
    if (moveTo != 'Down' && moveTo != 'Up') {
        moveTo = "Up"
        switchWay = false
        clearInterval(moveL)
        clearInterval(moveR)
        console.log(moveTo);
        moveU = setInterval(() => {
            snakeSize.push(
                {
                    x: posX,
                    y: posY -= blockSize
                }
            )
            drawSnake();
            switchWay = true
        }, snakeSpeed)
    } else return

}

// Слушатель кнопок
function keyHandler(event) {
    if (switchWay) {
        if (event.key == 'ArrowLeft') {
            moveLeft()
        }
        if (event.key == 'ArrowDown') {
            moveDown()
        }
        if (event.key == 'ArrowRight') {
            moveRight()
        }
        if (event.key == 'ArrowUp') {
            moveUp()
        }
    }

    if (event.which == '80') {
        pausedOrGameOver()
    }
    checkHunt();
}


btnStartGame.addEventListener('click', startGame);