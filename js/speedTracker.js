document.addEventListener('DOMContentLoaded', () => {

    // Ensure tab switching works for the new speed tab smoothly
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = btn.getAttribute('data-tab');
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            const pnl = document.getElementById(targetId);
            if(pnl) pnl.classList.add('active');
        });
    });

    // Restore Speed Entities
    let speedEntities = JSON.parse(localStorage.getItem('pokemon_champions_speed_entities') || '[]');
    let idCounter = speedEntities.length > 0 ? Math.max(...speedEntities.map(e => e._id || 0)) + 1 : 1;

    // Restore field conditions
    const savedField = JSON.parse(localStorage.getItem('pokemon_champions_speed_field') || '{"weather":"none", "tailwind":false, "trickroom":false}');
    document.getElementById('speed-weather').value = savedField.weather;
    document.getElementById('speed-tailwind').checked = savedField.tailwind;
    document.getElementById('speed-trickroom').checked = savedField.trickroom;

    const saveFieldSettings = () => {
        localStorage.setItem('pokemon_champions_speed_field', JSON.stringify({
            weather: document.getElementById('speed-weather').value,
            tailwind: document.getElementById('speed-tailwind').checked,
            trickroom: document.getElementById('speed-trickroom').checked
        }));
    };

    const saveSpeedData = () => {
        localStorage.setItem('pokemon_champions_speed_entities', JSON.stringify(speedEntities));
        renderLadder();
    };

    // Fixed Benchmarks for reference
    const BENCHMARKS = [
        { name: "最速130族 (プテラ, クロバット等)", speed: 200, isBenchmark: true },
        { name: "最速110族 (ゲンガー等)", speed: 178, isBenchmark: true },
        { name: "最速100族 (リザードン, ガルーラ等)", speed: 167, isBenchmark: true },
        { name: "準速100族 / 最速85族", speed: 152, isBenchmark: true }
    ];

    const getNatVal = (natureStr) => {
        if(!natureStr) return 1.0;
        if(["ようき", "おくびょう", "むじゃき", "せっかち"].includes(natureStr)) return 1.1;
        if(["ゆうかん", "れいせい", "のんき", "なまいき"].includes(natureStr)) return 0.9;
        return 1.0;
    };

    const calcFinalSpeed = (entity) => {
        let apVal = parseInt(entity.ap) || 0; 
        let raw = Math.floor((Math.floor((entity.baseSpe * 2 + 31 + apVal * 4) / 2) + 5) * entity.natureVal);

        // ランク
        let rank = parseInt(entity.rank) || 0;
        let rankMult = rank >= 0 ? (2 + rank) / 2 : 2 / (2 - rank);
        raw = Math.floor(raw * rankMult);

        // アイテム・状態
        if (entity.item === "こだわりスカーフ") raw = Math.floor(raw * 1.5);
        if (entity.item === "くろいてっきゅう" || entity.item === "まひ") raw = Math.floor(raw * 0.5);

        // 特性 (天候による2倍など)
        if (entity.ability === "true") raw = Math.floor(raw * 2);

        // 全体補正
        if (document.getElementById('speed-tailwind').checked) raw = Math.floor(raw * 2);

        return raw;
    };

    const renderLadder = () => {
        const ladder = document.getElementById('speed-ladder');
        if(!ladder) return;

        let allEntries = [];
        
        // Push actual Pokémon
        speedEntities.forEach(ent => {
            allEntries.push({ ...ent, finalSpeed: calcFinalSpeed(ent) });
        });

        // Push benchmarks
        BENCHMARKS.forEach(b => {
             allEntries.push({ ...b, finalSpeed: b.speed });
        });

        const isTrickRoom = document.getElementById('speed-trickroom').checked;
        allEntries.sort((a, b) => isTrickRoom ? (a.finalSpeed - b.finalSpeed) : (b.finalSpeed - a.finalSpeed));

        ladder.innerHTML = "";
        if(allEntries.length === BENCHMARKS.length) {
            ladder.innerHTML = `<div style="color:var(--text-muted); font-size:0.85rem; text-align:center;">「チームからインポート」または下部の「手動追加」でポケモンを配置してください</div>`;
            return;
        }

        allEntries.forEach((ent, idx) => {
            const div = document.createElement('div');
            
            if(ent.isBenchmark) {
                div.style.cssText = "display:flex; justify-content:space-between; padding:0.4rem 1rem; color:rgba(255,255,255,0.4); border-bottom:1px dashed rgba(255,255,255,0.1); font-size:0.8rem;";
                div.innerHTML = `<span>📏 ${ent.name}</span><span style="font-family:monospace; font-size:0.9rem;">${ent.finalSpeed}</span>`;
            } else {
                let badgeStyle = ent.isTeam ? 'background:rgba(34,193,195,0.2); border-left:4px solid #22c1c3;' : 'background:rgba(226,75,75,0.15); border-left:4px solid #e24b4b;';
                div.style.cssText = `display:flex; justify-content:space-between; align-items:center; padding:0.6rem 1rem; border-radius:4px; margin:0.15rem 0; ${badgeStyle}`;
                
                let details = `<span style="font-size:0.7rem; color:var(--text-muted); margin-left:0.5rem;"><span style="color:#a2db80; font-weight:bold;">S種族値:${ent.baseSpe}</span> | ${ent.natureStr} | AP:${ent.ap} | ${ent.item} ${ent.rank !== 0 ? '| ランク:'+(ent.rank>0?'+':'')+ent.rank : ''}</span>`;
                
                div.innerHTML = `
                    <div style="display:flex; align-items:center; gap:0.6rem;">
                        <img src="${ent.img}" style="width:32px; height:32px; object-fit:contain;">
                        <div>
                            <div style="font-weight:bold; color:var(--text-main); font-size:0.95rem;">${ent.name}</div>
                            ${details}
                        </div>
                    </div>
                    <div style="display:flex; align-items:center; gap:1rem;">
                        <span style="font-size:1.3rem; font-weight:900; color:white; font-family:monospace;">${ent.finalSpeed}</span>
                        <button class="sp-del-btn" data-id="${ent._id}" style="background:transparent; border:none; color:#ff5959; font-size:1.2rem; cursor:pointer;" title="削除">✕</button>
                    </div>
                `;
            }
            ladder.appendChild(div);
        });

        // Delegate deletes
        ladder.querySelectorAll('.sp-del-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const trgId = parseInt(e.target.getAttribute('data-id'));
                speedEntities = speedEntities.filter(x => x._id !== trgId);
                saveSpeedData();
            });
        });
    };

    // Attach listeners for switches
    ['speed-weather', 'speed-tailwind', 'speed-trickroom'].forEach(id => {
        document.getElementById(id).addEventListener('change', () => {
            saveFieldSettings();
            renderLadder();
        });
    });

    // Import from Team Logic
    document.getElementById('speed-import-team').addEventListener('click', () => {
        let currentTeamStr = localStorage.getItem('pokemon_champions_team') || '[]';
        let currentTeam = JSON.parse(currentTeamStr);
        
        // Extract raw data leveraging POKEMON_DATA from app.js globally
        let newTeamEntities = [];
        currentTeam.forEach(slot => {
            if(slot && slot.id && typeof POKEMON_DATA !== 'undefined') {
                let p = POKEMON_DATA.find(x => String(x.id) === String(slot.id));
                if(p) {
                    newTeamEntities.push({
                        _id: idCounter++,
                        name: p.name,
                        img: p.imageUrl,
                        baseSpe: p.stats.spe,
                        ap: (slot.spe || 0), 
                        natureStr: slot.nature || "1.0",
                        natureVal: getNatVal(slot.nature),
                        item: slot.item || "1.0",
                        rank: 0,
                        ability: "false",
                        isTeam: true
                    });
                }
            }
        });

        if(newTeamEntities.length > 0) {
            speedEntities = speedEntities.filter(e => !e.isTeam); // clear previous team imports
            speedEntities.push(...newTeamEntities);
            saveSpeedData();
        } else {
            alert("チームビルダーに登録されているポケモンがいません。先にチームを作成してください！");
        }
    });

    // Add Manual Pokemon Logic
    document.getElementById('speed-add-btn').addEventListener('click', () => {
        const nameVal = document.getElementById('speed-add-input').value;
        const evVal = parseInt(document.getElementById('speed-add-ev').value) || 0;
        const natureStr = document.getElementById('speed-add-nature').value;
        const itemVal = document.getElementById('speed-add-item').value;
        const rankVal = parseInt(document.getElementById('speed-add-rank').value) || 0;
        const abilityVal = document.getElementById('speed-add-ability').value;

        if(!nameVal) return alert('ポケモン名を入力してください。');
        
        const p = POKEMON_DATA.find(x => x.name === nameVal);
        if(!p) return alert('ポケモンが見つかりませんでした。正しい名前で検索してください。');

        speedEntities.push({
            _id: idCounter++,
            name: p.name,
            img: p.imageUrl,
            baseSpe: p.stats.spe,
            ap: evVal, // Using mapped AP val variable dynamically 
            natureStr: document.getElementById('speed-add-nature').options[document.getElementById('speed-add-nature').selectedIndex].text.split(' ')[0],
            natureVal: getNatVal(natureStr),
            item: itemVal,
            rank: rankVal,
            ability: abilityVal,
            isTeam: false
        });

        saveSpeedData();
        document.getElementById('speed-add-input').value = ""; // clear
    });

    // Initial render
    renderLadder();
});
