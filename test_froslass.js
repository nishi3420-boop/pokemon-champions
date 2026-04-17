const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const code = fs.readFileSync('c:/Users/nishi/Desktop/pokemon_champions/js/app.js', 'utf8');
const html = fs.readFileSync('c:/Users/nishi/Desktop/pokemon_champions/index.html', 'utf8');
const movesData = fs.readFileSync('c:/Users/nishi/Desktop/pokemon_champions/data/movesData.js', 'utf8');
const pData = fs.readFileSync('c:/Users/nishi/Desktop/pokemon_champions/data/masterData.js', 'utf8');

const tDom = new JSDOM(html, { runScripts: "outside-only" });
const window = tDom.window;
const document = window.document;

function run() {
    window.eval(movesData);
    window.eval(`
        const POKEMON_DATA = [
            { id: 478, name: "ユキメノコ", types: ["こおり", "ゴースト"] }
        ];
    `);
    try {
        window.eval(code);    
    } catch(e) {}
    
    try {
        // Mock team editor overlay opening
        const currentTeam = [{ id: 478, name: 'ユキメノコ' }];
        window.currentTeam = currentTeam;
        
        // This is to find where the error happens.
        const mappedMoves = window.POKEMON_MOVES['ユキメノコ'].map(id => window.MOVES_DICT[id]?window.MOVES_DICT[id]:undefined).filter(x=>x);
        
        const groups = {};
        mappedMoves.forEach(mv => {
            const tMapGlobal = {'ノ':'ノーマル','炎':'ほのお','水':'みず','草':'くさ','電':'でんき','氷':'こおり'};
            const type = tMapGlobal[mv.type] || mv.type;
            if(!groups[type]) groups[type]=[];
            groups[type].push(mv);
        });
        
        groups['こおり'].sort((a,b) => {
            const getP = (p) => (!p || p === '-') ? 0 : parseInt(p);
            return getP(b.power) - getP(a.power);
        }).forEach(mv => {
            // inside loop
            let catBg = mv.category === '物理' ? '#e24b4b' : (mv.category === '特殊' ? '#4068e0' : '#8899a6');
        });
        console.log("No crash inside sort logic.");
    } catch(e) {
        console.log("CRASH INSIDE SORT:", e);
    }
}
run();
