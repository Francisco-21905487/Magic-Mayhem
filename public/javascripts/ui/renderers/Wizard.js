class Wizard {
    static textWidth = 150;
    static textHeight = 200;
    static vRatio = 0.33;
    static space = 20;
    static swaptime = 100;
    

    constructor (title,wizard,x,y,sheight,img,fliped) {
        this.title = title;
        this.wizard = wizard;
        this.x = x;
        this.y = y;
        this.sheight = sheight;
        this.swidth = Wizard.vRatio*sheight
        this.img = img;
        this.time = millis();
        if (fliped) {
            this.textOffset = this.swidth+Wizard.space;
            this.imgOffset = 0;
        } else {
            this.textOffset = 0;
            this.imgOffset = Wizard.textWidth+Wizard.space;
        }
    }
    update(wizard) {
        this.wizard = wizard;
    }
    draw() {
        // the text box
        fill(0,0,0);
        stroke(0);
        //rect(this.textOffset+this.x,this.y,Wizard.textWidth,Wizard.textHeight);
        fill(255);
        textAlign(CENTER,CENTER);
        textSize(18);
        textStyle(BOLD);
        text(this.title,this.textOffset+this.x,this.y,Wizard.textWidth,1*Wizard.textHeight/4);
        text("HP: "+this.wizard.hp,this.textOffset+this.x,this.y+2*Wizard.textHeight/13,Wizard.textWidth,Wizard.textHeight/4);
        text("Mana: "+this.wizard.ap,this.textOffset+this.x,this.y+3*Wizard.textHeight/10,Wizard.textWidth,Wizard.textHeight/4);        
        // the image
        
    }
}