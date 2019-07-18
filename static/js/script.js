function preload() {
    this.load.image('bug1', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/physics/bug_1.png');
    this.load.image('bug2', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/physics/bug_2.png');
    this.load.image('bug3', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/physics/bug_3.png');
    this.load.image('platform', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/physics/platform.png');
    this.load.image('codey', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/physics/codey.png');
}

const gameState = {
    score: 0,
    highscore: 0,
    canJump: false
};

function create() {
    gameState.player = this.physics.add.sprite(225, 450, 'codey').setScale(0.5);
    const platforms = this.physics.add.staticGroup();
    platforms.create(225, 490, 'platform').setScale(1, .3).refreshBody();
    gameState.scoreText = this.add.text(195, 484, 'Score: 0', { fontSize: '15px', fill: '#000000', fontWeight: 'bold' });
    gameState.player.setCollideWorldBounds(true);
    this.physics.add.collider(gameState.player, platforms, function () {
        gameState.canJump = true;
    });
    gameState.cursors = this.input.keyboard.createCursorKeys();
    const bugs = this.physics.add.group();
    function bugGen() {
        const xCoord = Math.random() * 450;
        const random = Math.floor(Math.random() * 3);
        if (random === 0) {
            bugs.create(xCoord, 10, 'bug1');
        } else if (random === 1) {
            bugs.create(xCoord, 10, 'bug2');
        } else {
            bugs.create(xCoord, 10, 'bug3');
        }
    }
    const bugGenLoop = this.time.addEvent({
        delay: 100,
        callback: bugGen,
        callbackScope: this,
        loop: true,
    });
    this.physics.add.collider(bugs, platforms, function (bug) {
        bug.destroy();
        gameState.score += 10;
        gameState.scoreText.setText(`Score: ${gameState.score}`);
    })
    this.physics.add.collider(gameState.player, bugs, () => {
        bugGenLoop.destroy();
        this.physics.pause();
        if (gameState.score > gameState.highscore) {
            gameState.highscore = gameState.score;
        }
        this.add.rectangle(225, 250, 400, 400, 0xffffff);
        this.add.text(120, 200, `Highscore: ${gameState.highscore}`, { fontSize: '30px', fill: '#000000', textDecoration: 'underline' });
        this.add.text(180, 250, 'Game Over', { fontSize: '15px', fill: '#000000' });
        this.add.text(152, 270, 'Click to Restart', { fontSize: '15px', fill: '#000000' });
        this.input.on('pointerup', () => {
            gameState.score = 0;
            this.scene.restart();
        });
    });
    gameState.cursors.up.on('down', function () {
        if (gameState.canJump === true) {
            gameState.player.setVelocityY(-160);
            setTimeout(function () {
                gameState.player.setVelocityY(0);
            }, 400)
            gameState.canJump = false;
        }
    })
    gameState.cursors.space.on('down', function () {
        if (gameState.canJump === true) {
            gameState.player.setVelocityY(-160);
            setTimeout(function () {
                gameState.player.setVelocityY(0);
            }, 400)
            gameState.canJump = false;
        }
    })
}

function update() {
    if (gameState.cursors.left.isDown) {
        gameState.player.setVelocityX(-160);
    } else if (gameState.cursors.right.isDown) {
        gameState.player.setVelocityX(160);
    } else {
        gameState.player.setVelocityX(0);
    }
}

const config = {
    type: Phaser.AUTO,
    width: 450,
    height: 500,
    backgroundColor: "b9eaff",
    parent: "game",
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 },
            enableBody: true,
        }
    },
    scene: {
        preload,
        create,
        update
    }
};

const game = new Phaser.Game(config);
