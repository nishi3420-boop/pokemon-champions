const fs = require('fs');

const movesDataContent = fs.readFileSync('c:/Users/nishi/Desktop/pokemon_champions/data/movesData.js', 'utf8');
const pMatch = movesDataContent.match(/const MOVES_DICT = (\{[\s\S]*?\});\s*const POKEMON_MOVES = (\{[\s\S]*?\});/);
const MOVES_DICT = JSON.parse(pMatch[1]);
const POKEMON_MOVES = JSON.parse(pMatch[2]);
const tMapGlobal = {'ノ':'ノーマル','炎':'ほのお','水':'みず','草':'くさ','電':'でんき','氷':'こおり','格':'かくとう','毒':'どく','地':'じめん','飛':'ひこう','エ':'エスパー','虫':'むし','岩':'いわ','ゴ':'ゴースト','ド':'ドラゴン','悪':'あく','鋼':'はがね','妖':'フェアリー'};

const mIds = POKEMON_MOVES['ユキメノコ'];
const mappedMoves = mIds.map(id => MOVES_DICT[id]?MOVES_DICT[id]:undefined).filter(x=>x);

const groups = {};
mappedMoves.forEach(mv => {
    const type = tMapGlobal[mv.type] || mv.type;
    if(!groups[type]) groups[type]=[];
    groups[type].push(mv);
});

try {
    Object.keys(groups).forEach(type => {
        groups[type].sort((a,b) => {
            const getP = (p) => (!p || p === '-') ? 0 : parseInt(p);
            return getP(b.power) - getP(a.power);
        }).forEach(mv => {
            let catBg = mv.category === '物理' ? '#e24b4b' : (mv.category === '特殊' ? '#4068e0' : '#8899a6');
        });
    });
    console.log("No crash. OK.");
} catch(e) {
    console.log("CRASH:", e);
}
