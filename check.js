const fs = require('fs');
const content = fs.readFileSync('c:/Users/nishi/Desktop/pokemon_champions/data/movesData.js', 'utf8');

const dictMatch = content.match(/const MOVES_DICT = (\{.*?\});\s*const POKEMON_MOVES = (\{.*?\});/s);
if (dictMatch) {
    const moves = JSON.parse(dictMatch[1]);
    const pokeMoves = JSON.parse(dictMatch[2]);
    console.log("Froslass moves:", pokeMoves['ユキメノコ'].includes(78));
} else {
    console.log("Regex failed.");
}
