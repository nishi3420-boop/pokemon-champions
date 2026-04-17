const fs = require('fs');

const movesDataContent = fs.readFileSync('c:/Users/nishi/Desktop/pokemon_champions/data/movesData.js', 'utf8');
const pMatch = movesDataContent.match(/const MOVES_DICT = (\{[\s\S]*?\});\s*const POKEMON_MOVES = (\{[\s\S]*?\});/);
const MOVES_DICT = JSON.parse(pMatch[1]);
const POKEMON_MOVES = JSON.parse(pMatch[2]);

const tMapGlobal = {'ノ':'ノーマル','炎':'ほのお','水':'みず','草':'くさ','電':'でんき','氷':'こおり','格':'かくとう','毒':'どく','地':'じめん','飛':'ひこう','エ':'エスパー','虫':'むし','岩':'いわ','ゴ':'ゴースト','ド':'ドラゴン','悪':'あく','鋼':'はがね','妖':'フェアリー'};
const groups = {};
const registeredMids = ['78'];
let allMoveIds = Array.from(new Set(registeredMids));

allMoveIds.forEach(rawMid => {
    const mid = String(rawMid);
    const move = MOVES_DICT[mid];
    const isRegistered = registeredMids.includes(mid);

    if (move.category === '変化') return;

    if (isRegistered || (move.power !== '-')) {
        const type = tMapGlobal[move.type] || move.type;
        if (!groups[type]) groups[type] = [];
        if (isRegistered) {
            groups[type].unshift(mid);
        } else {
            groups[type].push(mid);
        }
    }
});
console.log("Filtered Groups:");
console.dir(groups);

const sortedTypes = Object.keys(groups).sort((a,b) => {
    const attackerTypes = ["こおり", "ゴースト"]; // Froslass
    const aIsP = attackerTypes.includes(a);
    const bIsP = attackerTypes.includes(b);
    if(aIsP && !bIsP) return -1;
    if(!aIsP && bIsP) return 1;
    return a.localeCompare(b);
});
console.log("Sorted Types:", sortedTypes);

sortedTypes.forEach(type => {
    console.log("Type:", type);
    groups[type].sort((a,b) => {
        const getP = (p) => (!p || p === '-') ? 0 : parseInt(p);
        return getP(MOVES_DICT[b].power) - getP(MOVES_DICT[a].power);
    }).forEach(mid => {
        console.log(" - Move:", MOVES_DICT[mid].name);
    });
});
