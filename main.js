function Game() {
    let game = document.getElementById('game');

    let player = document.getElementById('player');
    let positionY = 250;
    let positionX = 250;

    let bullets = [];
    let bulletSpeedX = 20;
    let bulletSpeedY = 20;

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
            speed: 8
        });
    });



    let enemy = document.getElementById('enemy');
    let enemies = [];
    let enemiesCount = 5;
    let enemyX = 100;
    let enemyY = 100;
    let enemySpeedX = 2;
    let enemySpeedY = 2;

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
            enemy.x += enemy.speedX;
            enemy.y += enemy.speedY;
            //debugger;
            if (enemy.x <= 0 || enemy.x >= game.clientWidth * 1.9 - enemy.x) {
                enemy.speedX *= -1;
            }

            if (enemy.y <= 0 || enemy.y >= game.clientHeight * 1.9 - enemy.y) {
                enemy.speedY *= -1;
            }

            enemy.el.style.top = enemy.y + 'px';
            enemy.el.style.left = enemy.x + 'px';
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