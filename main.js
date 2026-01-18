function Game() {
    let game = document.getElementById('game');

    let player = document.getElementById('player');
    let positionY = 250;
    let positionX = 250;

    let bullets = [];
    let bulletSpeed = 20;
    let bulletSize = 8;

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

        bullets.forEach((bullet, bIndex) => {
            enemies.forEach((enemy, eIndex) => {
                if (isColliding(bullet, bulletSize, enemy, enemySize)) {
                    bullet.el.remove();
                    bullets.splice(bIndex, 1);

                    enemy.el.remove();
                    enemies.splice(eIndex, 1);
                }
            })
        });

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

function isColliding(a, aSize, b, bSize) {
    return (
        a.x < b.x + bSize &&
        a.x + aSize > b.x &&
        a.y < b.y + bSize &&
        a.y + aSize > b.y
    );
}