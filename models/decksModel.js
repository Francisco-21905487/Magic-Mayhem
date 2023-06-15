const pool = require("../config/database");
const Settings = require("./gameSettings");

function fromDBCardToCard(dbCard) {
    return new Card(dbCard.crd_id,dbCard.ugc_id,dbCard.crd_cost,
        dbCard.crd_name, dbCard.crd_effect, dbCard.crd_note,
        new CardType(dbCard.ct_id,dbCard.ct_name),
        dbCard.ugc_active);
}

class CardType {
    constructor (id,name) {
        this.id = id;
        this.name = name;
    }
}

class Card {
    constructor(cardId,deckId,cost,name,effect,note,type, active) {
        this.cardId = cardId;
        this.deckId = deckId;
        this.cost = cost;
        this.name = name;
        this.effect = effect;
        this.note = note;
        this.type = type;
        this.active = active;
    }

    static async genCard(playerId) {
        try {
            let [cards] = await pool.query(`select * from card inner join card_type on crd_type_id = ct_id`);
            let rndCard = fromDBCardToCard(cards[Math.floor(Math.random()*cards.length)]);
            // insert the card
            let [result] = await pool.query(`Insert into user_game_card (ugc_user_game_id,ugc_crd_id,ugc_active)
                  values (?,?,?)`, [playerId,rndCard.cardId,true]);
            return {status:200, result: rndCard};
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }
}


class MatchDecks {
    constructor(mycards,oppcards) {
        this.mycards = mycards;
        this.oppcards = oppcards;
    }

    // No verifications are made since this is consider to be an auxiliary method
    // We consider it will only be called at the right time
    static async genPlayerDeck(playerId) {
        try {
            let cards =[];
            for (let i=0; i < Settings.nCards; i++) {
                let result = await Card.genCard(playerId);
                cards.push(result.result);
            }
            return {status:200, result: cards};
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }

    // No verifications are made since this is consider to be an auxiliary method
    // We consider it will only be called at the right time
    static async resetPlayerDeck(playerId) {
        try {
            let [result] = await pool.query(`delete from user_game_card where ugc_user_game_id = ?`, [playerId]);
            return {status:200, result: {msg:"All cards removed"}};
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }

    static async getMatchDeck(game) {
        try {
            let [dbcards] = await pool.query(`Select * from card
            inner join card_type on crd_type_id = ct_id 
            inner join user_game_card on ugc_crd_id = crd_id
            where ugc_user_game_id = ? or ugc_user_game_id = ?`, 
                [game.player.id, game.opponents[0].id]);
            let playerCards = [];
            let oppCards = [];
            for(let dbcard of dbcards) {
                let card = fromDBCardToCard(dbcard);
                if (dbcard.ugc_user_game_id == game.player.id) {
                    playerCards.push(card);
                } else {
                    oppCards.push(card);
                }
            }
            return {status:200, result: new MatchDecks(playerCards,oppCards)};
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }
    
    static async playDeckCard(game,deckId) {
        try {
            // get the card and check if the card is from the player and it is active
            let [dbDeckCards] = await pool.query(`Select * from card 
            inner join card_type on crd_type_id = ct_id
            inner join user_game_card on ugc_crd_id = crd_id
            where ugc_user_game_id = ? and ugc_id = ? and ugc_active=1`, 
                [game.player.id, deckId]);
            if (dbDeckCards.length == 0) {
                return {status:404, result:{msg:"Card not found for this player or not active"}};
            }   
            let card =  fromDBCardToCard(dbDeckCards[0]);
            let playerWizard = game.player.wizard;
            let oppWizard = game.opponents[0].wizard; 
            
            // verifications
            // Check if we have enough mana
            if (playerWizard.ap < card.cost) {
                return {status:400, result:{msg:"Not enough mana"}};
            }

            // Equilibrium Potion and Cursed Drain Potion can only be played if no other card was played
            if ((card.cardId == 7 || card.cardId == 8 || card.cardId == 9 || card.cardId == 10 || card.cardId == 11 || card.cardId == 12) && playerWizard.state.name != "Ready") {
                return {status:400, result:{msg:"That card cannot be played when another card was already played"}};    
            }
            // verifications done, set card to inactive
            await pool.query("update user_game_card set ugc_active=0 where ugc_id = ?",[deckId]);

            // Change the wizards and then update the database with the resulting wizards
            // Remove the base mana
            playerWizard.ap -= card.cost;
            // Set player state to Acted (since we already made all the state checks)
            playerWizard.state.id = 2;
            // This line should not be necessary since we only use the id to update the DB
            playerWizard.state.name = "Acted";

            switch (card.cardId) {
                case 1: LifedrainPotion1(oppWizard); break;
                case 2: LifedrainPotion2(oppWizard); break;
                case 3: LifedrainPotion3(oppWizard); break;
                case 4: HealingPotion1(playerWizard); break;
                case 5: HealingPotion2(playerWizard); break;
                case 6: HealingPotion3(playerWizard); break;
                case 7: EquilibriumPotion1(playerWizard,oppWizard); break;
                case 8: EquilibriumPotion2(playerWizard,oppWizard); break;
                case 9: EquilibriumPotion3(playerWizard,oppWizard); break;
                case 10: CursedDrainPotion1(playerWizard,oppWizard); break;
                case 11: CursedDrainPotion2(playerWizard,oppWizard); break;
                case 12: CursedDrainPotion3(playerWizard,oppWizard); break;
            }
            let wizardSql = `update wizard set wzd_state_id = ?, wzd_hp = ?, wzd_ap = ?
                           where wzd_id = ?`;
            // Updating player wizard and opponent wizard (same query, different values)
            await pool.query(wizardSql,[playerWizard.state.id, playerWizard.hp,
                playerWizard.ap, playerWizard.id]);
            await pool.query(wizardSql,[oppWizard.state.id, oppWizard.hp,
                oppWizard.ap, oppWizard.id]);

            return {status:200, result: {msg: "Card played!"}};
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }
    
}

// Auxiliary functions to calculate card actions

function LifedrainPotion1(oppWizard) {
    if (oppWizard.state.name!="Defensive") {
        oppWizard.hp -= 10;
    }
}
function LifedrainPotion2(oppWizard) {
        oppWizard.hp -= 20;
}
function LifedrainPotion3(oppWizard) {
        oppWizard.hp -= 30;
}
function HealingPotion1(playerWizard) {
    playerWizard.hp += 10;
    if (playerWizard.hp > Settings.maxWizardHP) playerWizard.hp = Settings.maxWizardHP;
}
function HealingPotion2(playerWizard) {
    playerWizard.hp +=20;
    if (playerWizard.hp > Settings.maxWizardHP) playerWizard.hp = Settings.maxWizardHP;
}
function HealingPotion3(playerWizard) {
    playerWizard.hp += 30;
    if (playerWizard.hp > Settings.maxWizardHP) playerWizard.hp = Settings.maxWizardHP;
}
function EquilibriumPotion1(playerWizard,oppWizard) {
    playerWizard.hp += 20;
    if (playerWizard.hp > Settings.maxWizardHP) playerWizard.hp = Settings.maxWizardHP;
    oppWizard.hp += 20;
    if (oppWizard.hp > Settings.maxWizardHP) oppWizard.hp = Settings.maxWizardHP;
}
function EquilibriumPotion2(playerWizard,oppWizard) {
    playerWizard.hp += 40;
    if (playerWizard.hp > Settings.maxWizardHP) playerWizard.hp = Settings.maxWizardHP;
    oppWizard.hp += 40;
    if (oppWizard.hp > Settings.maxWizardHP) oppWizard.hp = Settings.maxWizardHP;
}
function EquilibriumPotion3(playerWizard,oppWizard) {
    playerWizard.hp += 60;
    if (playerWizard.hp > Settings.maxWizardHP) playerWizard.hp = Settings.maxWizardHP;
    oppWizard.hp += 60;
    if (oppWizard.hp > Settings.maxWizardHP) oppWizard.hp = Settings.maxWizardHP;
}
function CursedDrainPotion1(playerWizard,oppWizard) {
    playerWizard.hp -= 20;
    oppWizard.hp -= 20;
}
function CursedDrainPotion2(playerWizard,oppWizard) {
    playerWizard.hp -= 40;
    oppWizard.hp -= 40;
}
function CursedDrainPotion3(playerWizard,oppWizard) {
    playerWizard.hp -= 60;
    oppWizard.hp -= 60;
}


module.exports = MatchDecks;