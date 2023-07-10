
async function getGameInfo() {
    let result = await requestPlayerGame();
    if (!result.successful) {
        alert("Something is wrong with the game please login again!");
        window.location.pathname = "index.html";
    } else {
        GameInfo.game = result.game;
        if (GameInfo.scoreBoard) GameInfo.scoreBoard.update(GameInfo.game); 
        else GameInfo.scoreBoard = new ScoreBoard(GameInfo.game);
    }
}


async function getDecksInfo() {
    let result = await requestDecks();
    if (!result.successful) {
        alert("Something is wrong with the game please login again!");
        window.location.pathname = "index.html";
    } else {
        GameInfo.matchDecks = result.decks;
        if (GameInfo.playerDeck) GameInfo.playerDeck.update(GameInfo.matchDecks.mycards); 
        else GameInfo.playerDeck = new Deck("",
            GameInfo.matchDecks.mycards,350,350,playCard,GameInfo.images.card);
        if (GameInfo.oppDeck) GameInfo.oppDeck.update(GameInfo.matchDecks.oppcards); 
        else GameInfo.oppDeck = new Deck("",
            GameInfo.matchDecks.oppcards,350,-30,null,GameInfo.images.card);
    }
}


async function getWizardsInfo() {
    if (!result.successful) {
        alert("Something is wrong with the game please login again!");
        window.location.pathname = "index.html";
    } else {
        let playerWizard = GameInfo.game.player.wizard;
        let oppWizard = GameInfo.game.opponents[0].wizard;
    
        if (GameInfo.playerWizard) GameInfo.playerWizard.update(playerWizard); 
        else GameInfo.playerWizard = new Wizard("Your Wizard",
            playerWizard,150,635,300,GameInfo.images.wizard, false);
        if (GameInfo.oppWizard) GameInfo.oppWizard.update(oppWizard); 
        else GameInfo.oppWizard = new Wizard("Enemy Wizard",
            oppWizard,1100,7,300,GameInfo.images.wizard, true);
    }
}



async function playCard(card) {
    if (!card.active) {
        alert("That card was already played");
    } else if (confirm(`Do you want to play the "${card.name}" card?`)) {
        let result = await requestPlayCard(card.deckId);
        if (result.successful) {
            await getGameInfo();
            await getDecksInfo();
            await getWizardsInfo();
        }
        alert(result.msg);
    }
}


async function endturnAction() {
    let result = await requestEndTurn();
    if (result.successful) {
        await  getGameInfo();
        GameInfo.prepareUI();
    } else alert("Something went wrong when ending the turn.")
}