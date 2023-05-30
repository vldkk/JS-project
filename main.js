const startGameButton = document.getElementById('start-game-btn');
const muteButton = document.getElementById('mute-btn');
const unmuteButton = document.getElementById('unmute-btn');
const canvas = document.querySelector('canvas');
const backgroundMusic = new Audio('./music/background-level.mp3');
import * as images from './img/index.js';
startGameButton.addEventListener('click', startGame);
muteButton.addEventListener('click', muteSound);
unmuteButton.addEventListener('click', unmuteSound);
canvas.style.display = 'none';

function startGame() {
    canvas.style.display = 'block';
    canvas.focus();
    backgroundMusic.loop = true;
    backgroundMusic.play();
    hideMenu();
    const ctx = canvas.getContext('2d');
    canvas.width = 1024;
    canvas.height = 576;
    const gravity = .4;

    class Player {
        constructor() {
            this.position = {
                x: 100,
                y: 100
            }
            this.width = 30
            this.height = 30
            this.velocity = {
                x: 0,
                y: 0
            }
        }

        draw() {
            ctx.fillStyle = 'black';
            ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
        }
        update() {
            this.draw();
            isCollidingWithPlatform = false;
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
            if (this.position.y + this.height + this.velocity.y <= canvas.height) {
                this.velocity.y += gravity;
            }
        }
    }

    class Platform {
        constructor({ x, y, image }) {
            this.position = {
                x,
                y
            }

            this.image = new Image()
            this.image.src = image
            this.width = this.image.width
            this.height = this.image.height

        }
        draw() {
            ctx.drawImage(this.image, this.position.x, this.position.y)
        }

    }

    class Decoration {
        constructor({ x, y, image }) {
            this.position = {
                x,
                y
            }

            this.image = new Image();
            this.image.src = image;

        }
        draw() {
            ctx.drawImage(this.image, this.position.x, this.position.y);
        }

    }
    let player = new Player();
    let platforms = [
        new Platform({ x: 0, y: 450, image: images.tileGrassLeft }),
        new Platform({ x: 128, y: 450, image: images.tileGrass }),
        new Platform({ x: 510, y: 450, image: images.tileGrassRight }),
        new Platform({ x: 640, y: 250, image: images.tileJumpLeft }),
        new Platform({ x: 704, y: 250, image: images.tileJump }),
        new Platform({ x: 900, y: 450, image: images.tileGrassLeft }),
        new Platform({ x: 1028, y: 450, image: images.tileGrass })];

    let isCollidingWithPlatform = false;
    const keys = {
        right: {
            pressed: false
        },
        left: {
            pressed: false
        },
    }
    let scrollOffset = 0;
    function init() {
        player = new Player();
        platforms = [
            new Platform({ x: 0, y: 450, image: images.tileGrassLeft }),
            new Platform({ x: 128, y: 450, image: images.tileGrass }),
            new Platform({ x: 510, y: 450, image: images.tileGrassRight }),
            new Platform({ x: 640, y: 250, image: images.tileJumpLeft }),
            new Platform({ x: 704, y: 250, image: images.tileJump }),
            new Platform({ x: 900, y: 450, image: images.tileGrassLeft }),
            new Platform({ x: 1200, y: 200, image: images.tileJump }),
            new Platform({ x: 1500, y: 450, image: images.tileGrass }),
            new Platform({ x: 2000, y: 300, image: images.tileJumpRight }),
            new Platform({ x: 2200, y: 200, image: images.tileJump }),
            new Platform({ x: 2400, y: 450, image: images.tileGrass })];

        let isCollidingWithPlatform = false;
        scrollOffset = 0;
    }


    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // decorations.forEach(decoration => {
        //     decoration.draw();
        // })
        console.log(scrollOffset);
        platforms.forEach(platform => {
            platform.draw();
        });
        player.update();
        //scroll
        if (keys.right.pressed && player.position.x < 400) {
            player.velocity.x = 5;
        } else if (keys.left.pressed && player.position.x > 100) {
            player.velocity.x = -5;
        } else {
            player.velocity.x = 0; //player.velocity.x *= 0.9;
            if (keys.right.pressed) {
                scrollOffset += 5;
                platforms.forEach(platform => {
                    platform.position.x -= 5;
                });

            } else if (keys.left.pressed) {
                scrollOffset -= 5;
                platforms.forEach(platform => {
                    platform.position.x += 5;
                });
            }

        }

        //collision with platforms
        platforms.forEach(platform => {
            if (
                player.position.y + player.height <= platform.position.y && // Check if player is above the platform
                player.position.y + player.height + player.velocity.y >= platform.position.y && // Check if player will be below the platform after updating the position
                player.position.x + player.width > platform.position.x && // Check right side collision
                player.position.x < platform.position.x + platform.width // Check left side collision
            ) {
                player.position.y = platform.position.y - player.height;
                player.velocity.y = 0;
                isCollidingWithPlatform = true;
            }
        });

        // Apply gravity only if not colliding with a platform
        if (!isCollidingWithPlatform) {
            player.velocity.y += gravity;
        }

        if (scrollOffset > 2300) {
            player.velocity.x = 0;
            console.log('you win');
        }
        if (player.position.y > canvas.height) {
            console.log('you lose');
            init();
        }

    }
    animate();
    //player go
    addEventListener('keydown', ({ keyCode }) => {
        switch (keyCode) {
            case 65:
            case 37:
                keys.left.pressed = true;
                break;
            case 83:
            case 40:
                break;
            case 68:
            case 39:
                keys.right.pressed = true;
                break;
            case 87:
            case 38:
                player.velocity.y -= 5;
                break;
            default:
                break;
        }
    })
    //player stop
    addEventListener('keyup', ({ keyCode }) => {
        switch (keyCode) {
            case 65:
            case 37:
                keys.left.pressed = false;
                break;
            case 83:
            case 40:
                break;
            case 68:
            case 39:
                keys.right.pressed = false;
                break;
            case 87:
            case 38:
                player.velocity.y -= 5;
                break;
            default:
                break;
        }
    })
}
function muteSound() {
    backgroundMusic.muted = true;
    muteButton.style.display = 'none';
    unmuteButton.style.display = 'inline-block';
}

function unmuteSound() {
    backgroundMusic.muted = false;
    unmuteButton.style.display = 'none';
    muteButton.style.display = 'inline-block';
}

function hideMenu() {
    const menuContainer = document.querySelector('.menu-container');
    menuContainer.style.display = 'none';
}