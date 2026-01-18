function Game(){
    let player = document.getElementById('player');
    let positionY = 250;
    let positionX = 250;

    let enemy = document.getElementById('enemy');
    let enemyX = 100;
    let enemyY = 100;
    let enemySpeedX = 10;
    let enemySpeedY = 10;
    
    let playerSpeed = 10;

    const keysPressed = {};

    let moveInterval = setInterval(() => {
        if (keysPressed['w']) positionY -= playerSpeed;
        if (keysPressed['s']) positionY += playerSpeed;
        if (keysPressed['a']) positionX -= playerSpeed;
        if (keysPressed['d']) positionX += playerSpeed;

        enemyX += enemySpeedX;
        enemyY += enemySpeedY;

        if(enemyX <= 0 || enemyX >= window.innerWidth + 100 - enemyX){
            enemySpeedX *= -1;
        }

        if(enemyY <= 0 || enemyY >= window.innerHeight + 2000 - enemyY){
            enemySpeedY *= -1;
        }

        enemy.style.top = enemyX + 'px';
        enemy.style.left = enemyY + 'px';

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