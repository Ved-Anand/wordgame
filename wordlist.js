const wordlist = require("wordlist-english");

const baseLength = 6;

let baseWords = new Array();

exports.init = function() {

}

exports.getBaseWords = function() {

    buildBaseWords();
    return baseWords;

}

exports.baseLength = baseLength;

let lists = [
    wordlist['english/10'],
    wordlist['english/20'],
    wordlist['english/35'],

    /* (more uncommon words)
    wordlist['english/40'],
    wordlist['english/50'],
    wordlist['english/55'],
    wordlist['english/60'],
    wordlist['english/70'] 
    */
];

exports.isWord = function(word) {
    for (let i = 0; i < lists.length; i++) {
        if (lists[i].indexOf(word) != -1) {
            return true;
        }
    }
    return false;
}

function buildBaseWords() {

    for (let dict of lists) {
        for (let word of dict) {
            if (word.length == baseLength) baseWords.push(word);
        }
    }

}

