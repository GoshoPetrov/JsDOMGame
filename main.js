function Game() {
    let game = document.getElementById('game');

    let scoreHtml = document.getElementById('score');

    let player = document.getElementById('player');
    let positionY = 250;
    let positionX = 250;
    let playerSize = 40;

    let bullets = [];
    let bulletSpeed = 20;
    let bulletSize = 8;

    let score = 0;

    function spawnEnemy() {
        let div = document.createElement('div');
        div.classList.add('enemy');
        game.appendChild(div);

        enemies.push({
            el: div,
            x: Math.random() * (game.clientWidth - enemySize),
            y: Math.random() * (game.clientHeight - enemySize),
            speedX: enemySpeedX,
            speedY: enemySpeedY
        });
    }

    setInterval(() => {
        spawnEnemy();
    }, 2000);

    game.addEventListener('click', (e) => {
        //debugger;
        let rect = game.getBoundingClientRect();

        let mouseX = e.clientX - rect.left;
        let mouseY = e.clientY - rect.top;

        let playerCenterX = positionX + 20;
        let playerCenterY = positionY + 20;

        let dx = mouseX - playerCenterX;
        let dy = mouseY - playerCenterY;

        let length = Math.hypot(dx, dy);

        let dirX = dx / length;
        let dirY = dy / length;

        let div = document.createElement('div');
        div.classList.add('bullet');
        game.appendChild(div);

        bullets.push({
            el: div,
            x: playerCenterX,
            y: playerCenterY,
            dx: dirX,
            dy: dirY,
            speed: bulletSpeed
        });
    });



    let enemies = [];
    let enemiesCount = 5;
    let enemySpeedX = 2;
    let enemySpeedY = 2;
    let enemySize = 40;

    for (let i = 0; i < enemiesCount; i++) {
        let div = document.createElement('div');
        div.classList.add('enemy');
        game.appendChild(div);

        enemies.push({
            el: div,
            x: Math.random() * (game.clientWidth - 40),
            y: Math.random() * (game.clientHeight - 40),
            speedX: enemySpeedX,
            speedY: enemySpeedY
        })
    }
    //debugger;
    let playerSpeed = 10;

    const keysPressed = {};

    let moveInterval = setInterval(() => {
        if (keysPressed['w']) positionY -= playerSpeed;
        if (keysPressed['s']) positionY += playerSpeed;
        if (keysPressed['a']) positionX -= playerSpeed;
        if (keysPressed['d']) positionX += playerSpeed;

        bullets.forEach((p, index) => {
            p.x += p.dx * p.speed;
            p.y += p.dy * p.speed;

            p.el.style.left = p.x + 'px';
            p.el.style.top = p.y + 'px';

            if (p.x < 0 || p.x > game.clientWidth || p.y < 0 || p.y > game.clientHeight
            ) {
                p.el.remove();
                bullets.splice(index, 1);
            }
        });

        enemies.forEach(enemy => {
            let dx = positionX - enemy.x;
            let dy = positionY - enemy.y;

            let length = Math.hypot(dx, dy);
            if (length === 0) return;

            let dirX = dx / length;
            let dirY = dy / length;

            enemy.x += dirX * enemy.speedX;
            enemy.y += dirY * enemy.speedY;

            enemy.el.style.left = enemy.x + 'px';
            enemy.el.style.top = enemy.y + 'px';
        });

        for (let bIndex = bullets.length - 1; bIndex >= 0; bIndex--) {
            for (let eIndex = enemies.length - 1; eIndex >= 0; eIndex--) {

                if (IsColliding(bullets[bIndex], bulletSize, enemies[eIndex], enemySize - 20)) {

                    bullets[bIndex].el.remove();
                    bullets.splice(bIndex, 1);

                    enemies[eIndex].el.remove();
                    enemies.splice(eIndex, 1);
                    score++;
                    scoreHtml.textContent = `Score: ${score}`;
                    break;
                }
            }
        }


        let clamped = IsPlayerOutOfBounds(positionX, positionY, game, playerSize);
        positionX = clamped.x;
        positionY = clamped.y;


        player.style.top = positionY + 'px';
        player.style.left = positionX + 'px';
    }, 16);

    document.addEventListener('keydown', (event) => {
        keysPressed[event.key.toLowerCase()] = true;
    });

    document.addEventListener('keyup', (event) => {
        keysPressed[event.key.toLowerCase()] = false;
    });
}

function IsPlayerOutOfBounds(positionX, positionY, game, playerSize) {
    if (positionX < 0) positionX = 0;
    if (positionX > game.clientWidth - playerSize) {
        positionX = game.clientWidth - playerSize;
    }

    if (positionY < 0) positionY = 0;
    if (positionY > game.clientHeight - playerSize) {
        positionY = game.clientHeight - playerSize;
    }

    return { x: positionX, y: positionY };

}

function IsColliding(a, aSize, b, bSize) {
    return (
        a.x < b.x + bSize &&
        a.x + aSize > b.x &&
        a.y < b.y + bSize &&
        a.y + aSize > b.y
    );
}





