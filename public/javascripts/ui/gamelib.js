
async function refresh() {
    if (GameInfo.game.player.state == "Waiting") { 
        // Every time we are waiting
        await getGameInfo();   
        await getDecksInfo();  
        await getWizardsInfo();  
        if (GameInfo.game.player.state != "Waiting") {
            // The moment we pass from waiting to play
            GameInfo.prepareUI();
        }
    } 
    // Nothing to do when we are playing since we control all that happens 
    // so no update is needed from the server
}

function preload() {
    GameInfo.images.card = loadImage('/assets/Magic_Mayhem_Card.png');
    GameInfo.images.board = loadImage('/assets/Magic_Mayhem_table.png');
    GameInfo.images.win = loadImage('/assets/youwon.png');
    GameInfo.images.lose = loadImage('/assets/youlose.png');
}

// Play the background music
function playBackgroundMusic() {
    const backgroundMusic = document.getElementById('backgroundMusic');
    backgroundMusic.play();
  }


async function setup() {
    let canvas = createCanvas(GameInfo.width, GameInfo.height);
    canvas.parent('game');
    // preload  images
    
    await  getGameInfo();
    setInterval(refresh,1000);

    //buttons (create a separated function if they are many)
    GameInfo.endturnButton = createButton('End Turn');
    GameInfo.endturnButton.parent('game');
    GameInfo.endturnButton.position(1255, GameInfo.height-50);
    GameInfo.endturnButton.mousePressed(endturnAction);
    GameInfo.endturnButton.addClass('game')

    await getDecksInfo();
    await getWizardsInfo();

    GameInfo.prepareUI();
    

    GameInfo.loading = false;
}

function draw() {
    
    if (GameInfo.loading) {
        textAlign(CENTER, CENTER);
        textSize(40);
        fill('black');
        text('Loading...', GameInfo.width/2, GameInfo.height/2);

    } else if (GameInfo.game.player.wizard.hp <= 0 || GameInfo.game.opponents[0].wizard.hp <= 0) {
        if (GameInfo.game.player.wizard.hp <= 0) {
          background(GameInfo.images.lose);
        } else {
          background(GameInfo.images.win);
        }
    } else {
        background(GameInfo.images.board);
        GameInfo.scoreBoard.draw();
        
        if (GameInfo.playerDeck) {
            GameInfo.playerDeck.draw();
        }
        if (GameInfo.oppDeck) {
            GameInfo.oppDeck.draw();
        }
        if (GameInfo.playerWizard) {
            GameInfo.playerWizard.draw();
        }
        if (GameInfo.oppWizard) {
            GameInfo.oppWizard.draw();
        }
    }
    
}

async function mouseClicked() {
    if ( GameInfo.playerDeck) {
        GameInfo.playerDeck.click();
    }
}

