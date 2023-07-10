const SB_WIDTH = 300;
const SB_HEIGHT = 100;
const SB_POSX = 10;
const SB_POSY = 10;

class ScoreBoard {
    constructor(game) {
        this.game = game;
    }
    draw() {
        fill(100,100,200);
        stroke(0,0,0);
        fill(255);
        stroke(1);
        strokeWeight(2);
        textAlign(LEFT,CENTER);
        textSize(18);
        textStyle(BOLD);
        text("Turn: "+this.game.turn,SB_POSX+17,SB_POSY+SB_HEIGHT/6)
        if (this.game.state == "Finished"){ 
            fill(200,0,0);
            textSize(24);
            textStyle(BOLD);
            textAlign(CENTER,CENTER);
            text("GAMEOVER",SB_POSX+200,SB_POSY-5+SB_HEIGHT/4)    
        }
    }

    update(game) {
        this.game = game;
    }
}