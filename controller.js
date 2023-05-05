let game = require("./game.js");

function startGame() {
    let gameState = game.getGameState();
    if (gameState.state == "started") return;

    game.startGame();

    gameState = game.getGameState();
    
    document.getElementById("timeremaining").innerHTML = "Time: " + gameState.timeRemaining;    
    document.getElementById("timeremaining").hidden = false;

    document.getElementById("word").innerHTML = gameState.baseWord.scrambled;

    setTimeout(() => {
        tick();
    }, 1000);

    //permutation stuff shenanigans
    document.getElementById("wordperms").hidden = false;

    gameState = game.getGameState(); //we do again bc maybe errors from like not being updated?

    for (let i = 0; i < gameState.baseWord.perms.length; i++) {
        let id = "perm" + (i+1);

        let string = "";
        for (let j = 0; j < gameState.baseWord.perms[i].perm.length; j++) {
            string += "_ "
        } 
        string = string.trim(); //compensate for the extra space at end

        try {

            if (i != 0) {
                //append break
                let brk = document.createElement("br");
                document.getElementById("permutationList").appendChild(brk);
            }
            let span = document.createElement("span");
            let node = document.createTextNode(string);
            span.appendChild(node);
            span.setAttribute("id", id)
            document.getElementById("permutationList").appendChild(span);



        } catch(err) {
            // this shouldn't happen anymore now that there is a cap on word permutations
            // at some point(?): use java appendChild, make element stuff to automate permutation span element. Shouldnt be that difficult? 
            console.error(err);
            process.exit();
        }
    }

    

}

function stopGame() {

    if (game.getGameState().state == "stopped") return; 

    game.stopGame();

    document.getElementById("permutationList").innerHTML = "";

    document.getElementById("word").innerHTML = "Word";
    document.getElementById("scorecount").innerHTML = "Score: 0";
    document.getElementById("wordperms").hidden = true;
    document.getElementById("timeremaining").hidden = true;
    setTimeout(() => {
        document.getElementById("timeremaining").innerHTML + `Time: ${game.timeLimit+1}`
    }, 1000);

}

let listener = document.getElementById("entrytext");
listener.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        addWord();
    }
});

function addWord() {

    let value = document.getElementById("entrytext").value;

    document.getElementById("entrytext").value = "";

    if (value.length < game.minWordLength) return;
    if (game.getGameState().state == "stopped") return;

    let hasFound = false;
    let temp;

    for (let i = 0; i < game.getGameState().baseWord.perms.length; i++) {
        if (game.getGameState().baseWord.perms[i].perm == value.trim().toLowerCase()) {
            hasFound = true;
            temp = i;
            break;
        }
    }
    
    if (!hasFound) return;
    if (game.getGameState().baseWord.perms[temp].guessed == true) return; // already guessed

    game.changePerm(temp);

    game.setScore(game.getScore() + value.length);
    document.getElementById("scorecount").innerHTML = "Score: " + game.getGameState().score;

    //permutation stuff part 2:
    // make this alphabetical in the future or something randomized rn just picks first available thing which might look weird (?)

    for (let k = 1; k <= game.getGameState().baseWord.perms.length; k++) {
        let id = "perm" + k;
        let itm = document.getElementById(id).innerHTML;
        
        let expectedLength = value.length + (value.length - 1); //_ _ _ (length is 5) which is 3+(3-1)
        if (itm.length == expectedLength) {
            document.getElementById(id).innerHTML = value;
            break;
        }
    }

    // are all permutations done(?) end game if yes bc u win
    for (let perm of game.getGameState().baseWord.perms) {
        if (perm.guessed == false) return // stop if at least 1 element remains unchecked
    }

    // if no return then we are done
    stopGame();
    // make something saying congrats at some point


}

function tick() {
    let gameState = game.getGameState();
    game.setTime(gameState.timeRemaining - 1);
    document.getElementById("timeremaining").innerHTML = "Time: " + gameState.timeRemaining;

    if (game.getGameState().timeRemaining == 0) stopGame(); // no time

    if (gameState.state == "started") {
        setTimeout(() => {
            tick();
        }, 1000);
    }
}