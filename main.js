function movement(){
    let player = document.getElementById('player');
    let positionY = 250;
    let positionX = 250;
    
    let playerSpeed = 10;

    const keysPressed = {};

    let moveInterval = setInterval(() => {
        if (keysPressed['w']) positionY -= playerSpeed;
        if (keysPressed['s']) positionY += playerSpeed;
        if (keysPressed['a']) positionX -= playerSpeed;
        if (keysPressed['d']) positionX += playerSpeed;

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