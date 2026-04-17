const fs = require('fs');
const movesData = fs.readFileSync('c:/Users/nishi/Desktop/pokemon_champions/data/movesData.js', 'utf8');

const movesMatch = movesData.match(/const MOVES_DICT = (\{[\s\S]*?\});\s*const POKEMON_MOVES = (\{[\s\S]*?\});/);
if (movesMatch) {
    const MOVES_DICT = JSON.parse(movesMatch[1]);
    const POKEMON_MOVES = JSON.parse(movesMatch[2]);
    const blizzardEntry = Object.entries(MOVES_DICT).find(([k, v]) => v.name === 'ふぶき');
    console.log("Blizzard ID:", blizzardEntry[0]);
    console.log("Froslass has Blizzard?", POKEMON_MOVES['ユキメノコ'].includes(parseInt(blizzardEntry[0])));
} else {
    console.log("Parse missed");
}
