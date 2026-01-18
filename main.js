function Game() {
    let game = document.getElementById('game');
    
    let player = document.getElementById('player');
    let positionY = 250;
    let positionX = 250;

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
    }, 1);

    document.addEventListener('keydown', (event) => {
        keysPressed[event.key.toLowerCase()] = true;
    });

    document.addEventListener('keyup', (event) => {
        keysPressed[event.key.toLowerCase()] = false;
    });
}