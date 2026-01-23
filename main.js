function Game(enemySpeedX1, enemySpeedY1, enemySpawnInterval) {
    const game = document.getElementById('game');
    const scoreHtml = document.getElementById('score');
    const player = document.getElementById('player');

    let positionX = 250, positionY = 250;
    const playerSize = 40;
    let playerHealth = 100;
    const maxPlayerHealth = 100;

    const bullets = [];
    const enemies = [];
    const bulletSpeed = 25;
    const bulletSize = 8;
    const enemySize = 40;

    let score = 0;

    const keysPressed = {};

    const keydownHandler = (e) => { keysPressed[e.key.toLowerCase()] = true; };
    const keyupHandler = (e) => { keysPressed[e.key.toLowerCase()] = false; };
    document.addEventListener('keydown', keydownHandler);
    document.addEventListener('keyup', keyupHandler);

    const clickHandler = (e) => {
        const rect = game.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const playerCenterX = positionX + playerSize / 2;
        const playerCenterY = positionY + playerSize / 2;

        const dx = mouseX - playerCenterX;
        const dy = mouseY - playerCenterY;
        const length = Math.hypot(dx, dy);
        const dirX = dx / length;
        const dirY = dy / length;

        const div = document.createElement('div');
        div.classList.add('bullet');
        game.appendChild(div);

        bullets.push({ el: div, x: playerCenterX, y: playerCenterY, dx: dirX, dy: dirY, speed: bulletSpeed });
    };
    game.addEventListener('click', clickHandler);

    const spawnEnemy = () => {
        const div = document.createElement('div');
        div.classList.add('enemy');
        game.appendChild(div);

        const hpBar = document.createElement('div');
        hpBar.classList.add('enemy-health');
        div.appendChild(hpBar);

        enemies.push({
            el: div,
            x: Math.random() * (game.clientWidth - enemySize),
            y: Math.random() * (game.clientHeight - enemySize),
            speedX: enemySpeedX1,
            speedY: enemySpeedY1,
            health: 30,
            maxHealth: 30
        });
    };

    const spawnInterval = setInterval(spawnEnemy, enemySpawnInterval);

    const loopInterval = setInterval(() => {
        const playerSpeed = 10;

        if (keysPressed['w']) positionY -= playerSpeed;
        if (keysPressed['s']) positionY += playerSpeed;
        if (keysPressed['a']) positionX -= playerSpeed;
        if (keysPressed['d']) positionX += playerSpeed;

        positionX = Math.max(0, Math.min(game.clientWidth - playerSize, positionX));
        positionY = Math.max(0, Math.min(game.clientHeight - playerSize, positionY));

        player.style.left = positionX + 'px';
        player.style.top = positionY + 'px';

        for (let i = bullets.length - 1; i >= 0; i--) {
            const b = bullets[i];
            b.x += b.dx * b.speed;
            b.y += b.dy * b.speed;

            b.el.style.left = b.x + 'px';
            b.el.style.top = b.y + 'px';

            if (b.x < 0 || b.x > game.clientWidth || b.y < 0 || b.y > game.clientHeight) {
                b.el.remove();
                bullets.splice(i, 1);
            }
        }

        for (let i = enemies.length - 1; i >= 0; i--) {
            const e = enemies[i];

            const dx = positionX - e.x;
            const dy = positionY - e.y;
            const length = Math.hypot(dx, dy);
            const dirX = dx / length;
            const dirY = dy / length;

            e.x += dirX * e.speedX;
            e.y += dirY * e.speedY;

            e.el.style.left = e.x + 'px';
            e.el.style.top = e.y + 'px';

            // Player collision
            if (IsColliding({ x: positionX, y: positionY }, playerSize, e, enemySize)) {
                playerHealth -= 1;
                document.getElementById('player-health').style.width = (playerHealth / maxPlayerHealth) * 100 + '%';
                if (playerHealth <= 0) {
                    stop(); // stop intervals
                    showEndScreen(score);
                    return;
                }
            }
        }

        // Bullet vs enemy collision
        for (let b = bullets.length - 1; b >= 0; b--) {
            const bullet = bullets[b];
            for (let e = enemies.length - 1; e >= 0; e--) {
                const enemy = enemies[e];
                if (IsColliding(bullet, bulletSize, enemy, enemySize)) {
                    enemy.health -= 10;
                    const hpBar = enemy.el.querySelector('.enemy-health');
                    if (hpBar) hpBar.style.width = (enemy.health / enemy.maxHealth) * 100 + '%';

                    bullet.el.remove();
                    bullets.splice(b, 1);

                    if (enemy.health <= 0) {
                        enemy.el.remove();
                        enemies.splice(e, 1);
                        score++;
                        scoreHtml.textContent = `Score: ${score}`;
                    }
                    break;
                }
            }
        }

    }, 16);

    function stop() {
        clearInterval(loopInterval);
        clearInterval(spawnInterval);

        bullets.forEach(b => b.el.remove());
        enemies.forEach(e => e.el.remove());

        bullets.length = 0;
        enemies.length = 0;

        document.removeEventListener('keydown', keydownHandler);
        document.removeEventListener('keyup', keyupHandler);
        game.removeEventListener('click', clickHandler);
    }

    return { stop };
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

function updatePlayerHealthBar(playerHealth, maxPlayerHealth) {
    let bar = document.getElementById('player-health');
    bar.style.width = (playerHealth / maxPlayerHealth) * 100 + '%';

    if (playerHealth <= 0) {
        alert('Game Over!');
        location.reload();
    }
}



function StartScreen() {
    const startScreen = document.getElementById('start-screen');
    const buttons = document.querySelectorAll('#difficulty-buttons button');
    const dragBox = document.getElementById('drag-box');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const difficulty = btn.dataset.difficulty;
            startScreen.style.display = 'none';
            document.getElementById('game').style.display = 'block';
            document.getElementById('hud').style.display = 'flex';

            switch (difficulty) {
                case 'easy':
                    window.enemySpeedX = 2;
                    window.enemySpeedY = 2;
                    window.enemySpawnInterval = 2000;
                    break;
                case 'hard':
                    window.enemySpeedX = 5;
                    window.enemySpeedY = 5;
                    window.enemySpawnInterval = 800;
                    break;
                case 'impossible':
                    window.enemySpeedX = 9;
                    window.enemySpeedY = 9;
                    window.enemySpawnInterval = 450;
                    break;
            }

            Game(window.enemySpeedX, window.enemySpeedY, window.enemySpawnInterval);
        });
    });

    let offsetX, offsetY, dragging = false;

    dragBox.addEventListener('mousedown', (e) => {
        dragging = true;
        dragBox.classList.add('dragging');
        offsetX = e.offsetX;
        offsetY = e.offsetY;
    });

    document.addEventListener('mousemove', (e) => {
        if (!dragging) return;
        dragBox.style.left = `${e.clientX - offsetX}px`;
        dragBox.style.top = `${e.clientY - offsetY}px`;
    });

    document.addEventListener('mouseup', () => {
        dragging = false;
        dragBox.classList.remove('dragging');
    });
}


window.onload = StartScreen;


function updatePlayerHealthBar(playerHealth, maxPlayerHealth, score) {
    const bar = document.getElementById('player-health');
    bar.style.width = (playerHealth / maxPlayerHealth) * 100 + '%';

    if (playerHealth <= 0) {
        playerHealth = 100;
        enemiesCount = 0;
        showEndScreen(score);
    }
}


function setupEndScreen() {
    const endScreen = document.getElementById('end-screen');
    const tryAgainBtn = document.getElementById('try-again');
    const finalScore = document.getElementById('final-score');
    const bestScore = document.getElementById('best-score');

    window.showEndScreen = function(score) {

        finalScore.textContent = `Score: ${score}`;

        const best = localStorage.getItem('bestScore') || 0;
        if (score > best) localStorage.setItem('bestScore', score);

        bestScore.textContent = `Best: ${localStorage.getItem('bestScore')}`;

        endScreen.style.display = 'flex';

        document.getElementById('game').style.display = 'none';
        document.getElementById('hud').style.display = 'none';
    };

    tryAgainBtn.addEventListener('click', () => {

        endScreen.style.display = 'none';

        if (window.gameInstance && window.gameInstance.stop) {
            window.gameInstance.stop(); 
        }

        document.getElementById('score').textContent = 'Score: 0';
        document.getElementById('player-health').style.width = '100%';

        document.getElementById('start-screen').style.display = 'flex';
    });
}


document.addEventListener('DOMContentLoaded', setupEndScreen);



