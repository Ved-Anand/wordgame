const wordlist = require("./wordlist");
let minWordLength = 3;
let maxPermutations = 24;

let gameState = {
    state: "stopped",
    baseWord: null,
    timeRemaining: 120,
    score: 0,
    stats: null
}

exports.minWordLength = minWordLength;

exports.getGameState = function() {
    return gameState;
}

exports.getPermutations = function() {
    return permutations;
}

exports.setTime = function(time) {
    gameState.timeRemaining = time;
}

exports.changePerm = function(idx) {
    gameState.baseWord.perms[idx].guessed = true;
}

exports.setScore = function(score) {
    gameState.score = score;
}

exports.init = function() {
    wordlist.init();

    gameState.stats = {
        threeWord: 0,
        fourWord: 0,
        fiveWord: 0,
        sixWord: 0,
        totalPoints: 0
    }
}

exports.startGame = function() {
    gameState.state = "started";

    gameState.baseWord = new Object();

    let baseWords = wordlist.getBaseWords();

    let word = baseWords[Math.floor(Math.random() * baseWords.length)];
    gameState.baseWord.word = word;
    gameState.baseWord.scrambled = scrambleWord(word);

    let perms = permuteWord(word);
    if (perms.length > maxPermutations) { //just cuz idk how to do this without manual HTML elements and i only have 24 of those 
        let hasFinished = false;
        while (!hasFinished) {
            word = baseWords[Math.floor(Math.random() * baseWords.length)];
            gameState.baseWord.word = word;
            gameState.baseWord.scrambled = scrambleWord(word);
            perms = permuteWord(word);
            if (perms.length <= maxPermutations) hasFinished = true;
        }
    }

    gameState.baseWord.perms = new Array();

    for (let i = 0; i < perms.length; i++) {
        gameState.baseWord.perms.push({
            perm: perms[i],
            guessed: false
        });
    }

}

exports.stopGame = function() {
    gameState = {
        state: "stopped",
        baseWord: null,
        timeRemaining: 120,
        score: 0,
        stats: gameState.stats
    }
}

exports.getScore = function() {
    return gameState.score;
}

function scrambleWord(word) { //TODO: make selection sort somehow
    let wordArray = word.split("");
    let scrambledWord = "";

    while (wordArray.length > 0) {
        let i = wordArray.splice(wordArray.length * Math.random(), 1);
        scrambledWord += i;
    }

    if (scrambledWord == word) {
        scrambleWord(scrambledWord); //in the very unlikely scenario
    }
    return scrambledWord;
}

function permuteWord(word) {
    var perms = new Array();

    for (var subwordLength = minWordLength; 
        subwordLength <= wordlist.baseLength; 
        subwordLength++) {
        permuteWordRecurse(word, new Array(), subwordLength, perms);
    }
    return perms;
}

function permuteWordRecurse(word, indexChoices, count, perms) {
    for (var i = 0; i < word.length; i++) {
        if (indexChoices.indexOf(i) != -1) {
            continue;
        }

        indexChoices.push(i);

        if (indexChoices.length != count) {
            permuteWordRecurse(word, indexChoices, count, perms);
        }
        else {
            var permWord = "";
            for (var j = 0; j < indexChoices.length; j++) {
                permWord = permWord.concat(word[indexChoices[j]]);
            }

            if (wordlist.isWord(permWord)) {
                // legit word
                if (perms.indexOf(permWord) == -1) {
                    // Only add if not already a dupe of something already there.
                    // this can happen in a word like "accept", where there are
                    // two ways to spell "ace".
                    perms.push(permWord);
                }
            }
        }
        indexChoices.pop();
    }
}

