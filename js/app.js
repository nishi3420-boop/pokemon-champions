// Data is loaded globally from masterData.js in index.html

document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.panel');
    const attackerInput = document.getElementById('attacker-input');
    const defenderInput = document.getElementById('defender-input');
    const moveSelect = document.getElementById('move-select');
    
    // --- Runtime Data Hotfixes ---
    if (typeof POKEMON_DATA !== 'undefined') {
        // Pokemon-specific hotfixes can go here if needed in the future
    }

    window.getMovesForPokemon = (name) => {
        if (typeof POKEMON_MOVES === 'undefined') return null;
        if (POKEMON_MOVES[name]) return POKEMON_MOVES[name];
        let baseName = name.replace(/^(メガ|ゲンシ)/, '').replace(/[ＸＹXY]$/, '');
        baseName = baseName.replace(/\s*\(.*?\)/, '');
        if (POKEMON_MOVES[baseName]) return POKEMON_MOVES[baseName];
        return null; // Implicitly returns empty array behaviors dynamically if null.
    };

    // --- Team Builder State and Logic ---
    let storageKey = 'pokemon_champions_team';
    let currentTeamArray = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    // Ensure 30 slots (Expand if less)
    while (currentTeamArray.length < 30) {
        currentTeamArray.push(null);
    }
    
    let currentTeam = currentTeamArray.map(t => {
        if (!t || t.id === "" || t.id == null || typeof t.id === "undefined") return null;
        if (!POKEMON_DATA.find(x => String(x.id) === String(t.id || t))) return null; // Slot sanitizer explicitly blocking corruption
        if (typeof t === 'string' || typeof t === 'number') {
            return { id: String(t), hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0, nature: 'まじめ', ability: '', item: 'なし', m1:'', m2:'', m3:'', m4:'' };
        }
        return t;
    });
    // Migration: reset old default-32 EVs to 0
    currentTeam.forEach(t => {
        if (t && t.hp === 32 && t.atk === 32 && t.def === 32 && t.spa === 32 && t.spd === 32 && t.spe === 32) {
            t.hp = 0; t.atk = 0; t.def = 0; t.spa = 0; t.spd = 0; t.spe = 0;
        }
    });
    window.saveTeam = () => { localStorage.setItem('pokemon_champions_team', JSON.stringify(currentTeam)); };
    window.saveTeam(); // persist migration
    
    window.openTeamEditor = (index) => {
        const slotData = currentTeam[index];
        if (!slotData) return;
        const p = POKEMON_DATA.find(x => String(x.id) === String(slotData.id));
        if (!p) return;
        const rawBaseName = p.name.replace(/^(メガ|ゲンシ)/, '').replace(/[ＸＹXY]$/, '').replace(/\s*\(.*?\)/, '');
        const forms = POKEMON_DATA.filter(x => {
            const rx = x.name.replace(/^(メガ|ゲンシ)/, '').replace(/[ＸＹXY]$/, '').replace(/\s*\(.*?\)/, '');
            return rx === rawBaseName;
        });
        
        let moveOptions = `<option value="">-- 技を選択 --</option>`;
        if(typeof window.getMovesForPokemon === 'function') {
            const mList = window.getMovesForPokemon(p.name) || [];
            mList.forEach(mid => {
                const mv = (typeof MOVES_DICT !== 'undefined' && MOVES_DICT[mid]) ? MOVES_DICT[mid].name : mid;
                moveOptions += `<option value="${mid}">${mv}</option>`;
            });
        }
        
        const genMoveSel = (id, val) => {
            return `<div style="display:flex; gap:4px; align-items:center;"><select id="${id}" style="flex:1; padding:0.4rem; background:rgba(0,0,0,0.3); color:white; border:1px solid var(--glass-border); border-radius:4px;">
                ${moveOptions.replace(`value="${val}"`, `value="${val}" selected`)}
            </select><button class="te-move-info-btn" data-sel="${id}" style="padding:0.3rem 0.5rem; background:rgba(0,210,255,0.2); border:1px solid var(--neon-blue); border-radius:4px; color:var(--neon-blue); cursor:pointer; font-size:0.75rem; white-space:nowrap;">詳細</button></div>`;
        };

        const innerContent = `
                <div style="background:var(--card-bg); border: 1px solid var(--glass-border); border-radius:12px; padding:1.5rem; width:90%; max-width:550px; color:white; display:flex; flex-direction:column; gap:1rem; max-height:90vh; overflow-y:auto;">
                    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--glass-border); padding-bottom:0.5rem;">
                        <h3 style="margin:0; font-size:1.3rem;">⚙️ ${rawBaseName} の構成カスタマイズ</h3>
                        <div id="ev-tracker" style="font-weight:bold; font-size:0.9rem; color:#ff5959; background:rgba(255,89,89,0.1); padding:0.3rem 0.8rem; border-radius:20px; border:1px solid #ff5959;">
                            能力残り: 66/66
                        </div>
                    </div>
                    
                    <div style="display:flex; gap:1rem; align-items:center;">
                        <img src="${p.imageUrl}" style="width:70px;height:70px;object-fit:contain;" />
                        <div style="flex:1;">
                            <label style="font-size:0.8rem; color:var(--text-muted);">フォルム切替</label>
                            <div style="display:flex; gap:0.5rem; width:100%;">
                                <select id="te-form" style="flex:1; padding:0.4rem; background:rgba(0,0,0,0.3); color:white; border:1px solid var(--glass-border); border-radius:4px;">
                                    ${forms.map(f => `<option value="${f.id}" ${String(f.id) === String(slotData.id) ? 'selected' : ''}>${f.name}</option>`).join('')}
                                </select>
                                <button id="te-mega-btn" style="display:none; padding:0 8px; font-size:0.75rem; background:linear-gradient(145deg, #bbaa66, #998844); border:1px solid #eedd99; border-radius:4px; color:white; cursor:pointer;" title="メガシンカする">ﾒｶﾞｼﾝｶ ✨</button>
                            </div>
                        </div>
                    </div>

                    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:0.8rem; margin-top:0.5rem;">
                        <div><div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:2px;"><label style="font-size:0.9rem;color:#ff5959;font-weight:bold;margin:0;">HP</label><div style="font-size:0.8rem;color:#8899a6;">種:<span style="font-size:0.9rem;">${p.stats.hp}</span> | 実:<span id="val-real-hp" style="color:var(--accent-primary);font-weight:bold;font-size:1rem;"></span></div></div><input class="te-ev-input" id="te-hp" type="number" min="0" max="32" value="${slotData.hp||0}" style="width:100%; padding:0.4rem; background:rgba(0,0,0,0.3); color:white; border:1px solid var(--glass-border); border-radius:4px;"></div>
                        <div><div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:2px;"><label style="font-size:0.9rem;color:#f5ac78;font-weight:bold;margin:0;">攻撃</label><div style="font-size:0.8rem;color:#8899a6;">種:<span style="font-size:0.9rem;">${p.stats.atk}</span> | 実:<span id="val-real-atk" style="color:var(--accent-primary);font-weight:bold;font-size:1rem;"></span></div></div><input class="te-ev-input" id="te-atk" type="number" min="0" max="32" value="${slotData.atk||0}" style="width:100%; padding:0.4rem; background:rgba(0,0,0,0.3); color:white; border:1px solid var(--glass-border); border-radius:4px;"></div>
                        <div><div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:2px;"><label style="font-size:0.9rem;color:#fae078;font-weight:bold;margin:0;">防御</label><div style="font-size:0.8rem;color:#8899a6;">種:<span style="font-size:0.9rem;">${p.stats.def}</span> | 実:<span id="val-real-def" style="color:var(--accent-primary);font-weight:bold;font-size:1rem;"></span></div></div><input class="te-ev-input" id="te-def" type="number" min="0" max="32" value="${slotData.def||0}" style="width:100%; padding:0.4rem; background:rgba(0,0,0,0.3); color:white; border:1px solid var(--glass-border); border-radius:4px;"></div>
                        <div><div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:2px;"><label style="font-size:0.9rem;color:#9db7f5;font-weight:bold;margin:0;">特攻</label><div style="font-size:0.8rem;color:#8899a6;">種:<span style="font-size:0.9rem;">${p.stats.spa}</span> | 実:<span id="val-real-spa" style="color:var(--accent-primary);font-weight:bold;font-size:1rem;"></span></div></div><input class="te-ev-input" id="te-spa" type="number" min="0" max="32" value="${slotData.spa||0}" style="width:100%; padding:0.4rem; background:rgba(0,0,0,0.3); color:white; border:1px solid var(--glass-border); border-radius:4px;"></div>
                        <div><div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:2px;"><label style="font-size:0.9rem;color:#a2db80;font-weight:bold;margin:0;">特防</label><div style="font-size:0.8rem;color:#8899a6;">種:<span style="font-size:0.9rem;">${p.stats.spd}</span> | 実:<span id="val-real-spd" style="color:var(--accent-primary);font-weight:bold;font-size:1rem;"></span></div></div><input class="te-ev-input" id="te-spd" type="number" min="0" max="32" value="${slotData.spd||0}" style="width:100%; padding:0.4rem; background:rgba(0,0,0,0.3); color:white; border:1px solid var(--glass-border); border-radius:4px;"></div>
                        <div><div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:2px;"><label style="font-size:0.9rem;color:#fa92b2;font-weight:bold;margin:0;">素早</label><div style="font-size:0.8rem;color:#8899a6;">種:<span style="font-size:0.9rem;">${p.stats.spe}</span> | 実:<span id="val-real-spe" style="color:var(--accent-primary);font-weight:bold;font-size:1rem;"></span></div></div><input class="te-ev-input" id="te-spe" type="number" min="0" max="32" value="${slotData.spe||0}" style="width:100%; padding:0.4rem; background:rgba(0,0,0,0.3); color:white; border:1px solid var(--glass-border); border-radius:4px;"></div>
                    </div>

                    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:0.8rem; margin-top:0.5rem;">
                        <div>
                            <label style="font-size:0.8rem; color:var(--text-muted);">特性 (Ability)</label>
                            <div style="display:flex; gap:4px; align-items:center;">
                                <select id="te-ability" style="flex:1; padding:0.4rem; background:rgba(0,0,0,0.3); color:white; border:1px solid var(--glass-border); border-radius:4px;">
                                    ${(p.abilities && p.abilities.length > 0 ? p.abilities : ['（特性なし）']).map(a => `<option value="${a}" ${slotData.ability===a?'selected':''}>${a}</option>`).join('')}
                                </select>
                                <button id="te-ability-info" style="padding:0.3rem 0.5rem; background:rgba(0,210,255,0.2); border:1px solid var(--neon-blue); border-radius:4px; color:var(--neon-blue); cursor:pointer; font-size:0.75rem; white-space:nowrap;">詳細</button>
                            </div>
                        </div>
                        <div>
                            <label style="font-size:0.8rem; color:var(--text-muted);">性格補正(得意ステータス)</label>
                            <select id="te-nature" style="width:100%; padding:0.4rem; background:rgba(0,0,0,0.3); color:white; border:1px solid var(--glass-border); border-radius:4px;">
                                <option value="1.0" ${slotData.nature==='1.0'?'selected':''}>無補正 (上昇等なし)</option>
                                <option value="いじっぱり" ${slotData.nature==='いじっぱり'?'selected':''}>いじっぱり (攻撃↑ / 特攻↓)</option>
                                <option value="さみしがり" ${slotData.nature==='さみしがり'?'selected':''}>さみしがり (攻撃↑ / 防御↓)</option>
                                <option value="ゆうかん" ${slotData.nature==='ゆうかん'?'selected':''}>ゆうかん (攻撃↑ / 素早↓)</option>
                                <option value="やんちゃ" ${slotData.nature==='やんちゃ'?'selected':''}>やんちゃ (攻撃↑ / 特防↓)</option>
                                <option value="ずぶとい" ${slotData.nature==='ずぶとい'?'selected':''}>ずぶとい (防御↑ / 攻撃↓)</option>
                                <option value="わんぱく" ${slotData.nature==='わんぱく'?'selected':''}>わんぱく (防御↑ / 特攻↓)</option>
                                <option value="のんき" ${slotData.nature==='のんき'?'selected':''}>のんき (防御↑ / 素早↓)</option>
                                <option value="おだやか" ${slotData.nature==='おだやか'?'selected':''}>おだやか (特防↑ / 攻撃↓)</option>
                                <option value="しんちょう" ${slotData.nature==='しんちょう'?'selected':''}>しんちょう (特防↑ / 特攻↓)</option>
                                <option value="なまいき" ${slotData.nature==='なまいき'?'selected':''}>なまいき (特防↑ / 素早↓)</option>
                                <option value="ひかえめ" ${slotData.nature==='ひかえめ'?'selected':''}>ひかえめ (特攻↑ / 攻撃↓)</option>
                                <option value="れいせい" ${slotData.nature==='れいせい'?'selected':''}>れいせい (特攻↑ / 素早↓)</option>
                                <option value="うっかりや" ${slotData.nature==='うっかりや'?'selected':''}>うっかりや (特攻↑ / 特防↓)</option>
                                <option value="おくびょう" ${slotData.nature==='おくびょう'?'selected':''}>おくびょう (素早↑ / 攻撃↓)</option>
                                <option value="せっかち" ${slotData.nature==='せっかち'?'selected':''}>せっかち (素早↑ / 防御↓)</option>
                                <option value="ようき" ${slotData.nature==='ようき'?'selected':''}>ようき (素早↑ / 特攻↓)</option>
                                <option value="むじゃき" ${slotData.nature==='むじゃき'?'selected':''}>むじゃき (素早↑ / 特防↓)</option>
                            </select>
                        </div>
                        <div>
                            <label style="font-size:0.8rem; color:var(--text-muted);">持ち物 (Item)</label>
                            <div style="display:flex; gap:4px; align-items:center;">
                                <select id="te-item" style="flex:1; padding:0.4rem; background:rgba(0,0,0,0.3); color:white; border:1px solid var(--glass-border); border-radius:4px;">
                                    <option value="なし" ${slotData.item==='なし'?'selected':''}>なし</option>
                                    <option value="メガナイト" ${slotData.item==='メガナイト'?'selected':''}>メガナイト</option>
                                    <option value="こだわりハチマキ" ${slotData.item==='こだわりハチマキ'?'selected':''}>こだわりハチマキ (物理火力1.5倍)</option>
                                    <option value="こだわりメガネ" ${slotData.item==='こだわりメガネ'?'selected':''}>こだわりメガネ (特殊火力1.5倍)</option>
                                    <option value="こだわりスカーフ" ${slotData.item==='こだわりスカーフ'?'selected':''}>こだわりスカーフ</option>
                                    <option value="いのちのたま" ${slotData.item==='いのちのたま'?'selected':''}>いのちのたま (全火力1.3倍)</option>
                                    <option value="タイプ強化アイテム" ${slotData.item==='タイプ強化アイテム'?'selected':''}>タイプ強化アイテム/達人の帯 (1.2倍)</option>
                                    <option value="とつげきチョッキ" ${slotData.item==='とつげきチョッキ'?'selected':''}>とつげきチョッキ (特殊防御1.5倍)</option>
                                    <option value="しんかのきせき" ${slotData.item==='しんかのきせき'?'selected':''}>しんかのきせき (防御/特防1.5倍)</option>
                                    <option value="半減実" ${slotData.item==='半減実'?'selected':''}>半減実 (抜群被ダメ半減)</option>
                                    <option value="きあいのタスキ" ${slotData.item==='きあいのタスキ'?'selected':''}>きあいのタスキ</option>
                                    <option value="たべのこし" ${slotData.item==='たべのこし'?'selected':''}>たべのこし</option>
                                    <option value="かいがらのすず" ${slotData.item==='かいがらのすず'?'selected':''}>かいがらのすず</option>
                                    <option value="ひかりのこな" ${slotData.item==='ひかりのこな'?'selected':''}>ひかりのこな</option>
                                    <option value="せんせいのツメ" ${slotData.item==='せんせいのツメ'?'selected':''}>せんせいのツメ</option>
                                    <option value="ピントレンズ" ${slotData.item==='ピントレンズ'?'selected':''}>ピントレンズ</option>
                                    <option value="おうじゃのしるし" ${slotData.item==='おうじゃのしるし'?'selected':''}>おうじゃのしるし</option>
                                    <option value="オボンのみ" ${slotData.item==='オボンのみ'?'selected':''}>オボンのみ</option>
                                    <option value="ラムのみ" ${slotData.item==='ラムのみ'?'selected':''}>ラムのみ</option>
                                </select>
                                <button id="te-item-info" style="padding:0.3rem 0.5rem; background:rgba(0,210,255,0.2); border:1px solid var(--neon-blue); border-radius:4px; color:var(--neon-blue); cursor:pointer; font-size:0.75rem; white-space:nowrap;">詳細</button>
                            </div>
                        </div>
                    </div>
                    
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; margin-top:0.2rem;">
                        <div><label style="font-size:0.8rem; color:var(--text-muted);">技1</label>${genMoveSel('te-m1', slotData.m1)}</div>
                        <div><label style="font-size:0.8rem; color:var(--text-muted);">技2</label>${genMoveSel('te-m2', slotData.m2)}</div>
                        <div><label style="font-size:0.8rem; color:var(--text-muted);">技3</label>${genMoveSel('te-m3', slotData.m3)}</div>
                        <div><label style="font-size:0.8rem; color:var(--text-muted);">技4</label>${genMoveSel('te-m4', slotData.m4)}</div>
                    </div>
                    
                    <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:0.5rem;">
                        <button onclick="document.getElementById('team-editor-overlay').remove()" style="padding:0.5rem 1rem; background:rgba(255,255,255,0.1); border:1px solid var(--glass-border); color:white; border-radius:4px; cursor:pointer;">キャンセル</button>
                        <button id="te-save" style="padding:0.5rem 1rem; background:var(--accent-primary); border:none; color:white; border-radius:4px; font-weight:bold; cursor:pointer; box-shadow:0 0 10px rgba(0,210,255,0.3);">設定を保存</button>
                    </div>
                </div>
                </div>
        `;
        let overlay = document.getElementById('team-editor-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'team-editor-overlay';
            overlay.style.cssText = "position:fixed; top:0;left:0;right:0;bottom:0; background:rgba(0,0,0,0.8); z-index:9999; display:flex; justify-content:center; align-items:center;";
            document.body.appendChild(overlay);
        }
        overlay.innerHTML = innerContent;
        
        // Mega Evolution Quick Toggle
        // Mega Evolution Quick Toggle
        const activeFormId = String(currentTeam[index].id);
        const teMegaBtn = document.getElementById('te-mega-btn');
        
        const baseF = forms.find(f => !f.name.includes('メガ') && !f.name.includes('ゲンシ')) || forms[0];
        const megaFs = forms.filter(f => f.name.includes('メガ') || f.name.includes('ゲンシ'));
        
        if (megaFs.length > 0) {
            teMegaBtn.style.display = 'block';
            const cycle = [baseF, ...megaFs].filter(x => x);
            const cIdx = cycle.findIndex(c => String(c.id) === activeFormId);
            const nextIdx = (cIdx + 1) % cycle.length;
            const targetForm = cycle[nextIdx];
            
            if (cIdx === 0) {
                teMegaBtn.innerText = 'ﾒｶﾞｼﾝｶ ✨';
                teMegaBtn.style.background = 'linear-gradient(145deg, #bbaa66, #998844)';
                teMegaBtn.style.borderColor = '#eedd99';
            } else if (nextIdx === 0) {
                teMegaBtn.innerText = '元に戻す ↩️';
                teMegaBtn.style.background = 'linear-gradient(145deg, #556677, #445566)';
                teMegaBtn.style.borderColor = '#8899aa';
            } else {
                teMegaBtn.innerText = '別の形態 🔄';
                teMegaBtn.style.background = 'linear-gradient(145deg, #a666bb, #8a4499)';
                teMegaBtn.style.borderColor = '#cc99dd';
            }
            teMegaBtn.title = `次は ${targetForm.name} に変更します`;
            teMegaBtn.onclick = () => {
                currentTeam[index].id = targetForm.id;
                currentTeam[index].hp = parseInt(document.getElementById('te-hp').value) || 0;
                currentTeam[index].atk = parseInt(document.getElementById('te-atk').value) || 0;
                currentTeam[index].def = parseInt(document.getElementById('te-def').value) || 0;
                currentTeam[index].spa = parseInt(document.getElementById('te-spa').value) || 0;
                currentTeam[index].spd = parseInt(document.getElementById('te-spd').value) || 0;
                currentTeam[index].spe = parseInt(document.getElementById('te-spe').value) || 0;
                currentTeam[index].ability = document.getElementById('te-ability') ? document.getElementById('te-ability').value : '';
                currentTeam[index].nature = document.getElementById('te-nature').value;
                currentTeam[index].item = document.getElementById('te-item').value;
                currentTeam[index].m1 = document.getElementById('te-m1').value;
                currentTeam[index].m2 = document.getElementById('te-m2').value;
                currentTeam[index].m3 = document.getElementById('te-m3').value;
                currentTeam[index].m4 = document.getElementById('te-m4').value;
                openTeamEditor(index);
            };
        }
        
        // EV Constraints Logic Max 66
        const evInputs = Array.from(document.querySelectorAll('.te-ev-input'));
        const tracker = document.getElementById('ev-tracker');
        
        const updateEVTracker = () => {
            let sum = 0;
            evInputs.forEach(i => sum += (parseInt(i.value) || 0));
            if (sum > 66) {
                tracker.style.color = '#ff5959';
                tracker.style.borderColor = '#ff5959';
                tracker.style.background = 'rgba(255,89,89,0.1)';
            } else if (sum === 66) {
                tracker.style.color = '#a2db80';
                tracker.style.borderColor = '#a2db80';
                tracker.style.background = 'rgba(162,219,128,0.1)';
            } else {
                tracker.style.color = 'white';
                tracker.style.borderColor = 'var(--glass-border)';
                tracker.style.background = 'rgba(255,255,255,0.05)';
            }
            tracker.innerText = `能力残り: ${Math.max(0, 66 - sum)}/66`;
            return sum;
        };
        
        evInputs.forEach(inp => {
            inp.addEventListener('input', (e) => {
                let currentVal = parseInt(e.target.value) || 0;
                if (currentVal < 0) e.target.value = 0;
                if (currentVal > 32) e.target.value = 32;
                
                let sum = updateEVTracker();
                if (sum > 66) {
                    let diff = sum - 66;
                    e.target.value = Math.max(0, parseInt(e.target.value) - diff);
                    updateEVTracker();
                }
            });
        });
        
        const updateRealStats = () => {
            const getNatMod = (natureVal, statKey) => {
                 const NATS = {
                     "いじっぱり": {up:"atk",down:"spa"}, "ひかえめ":{up:"spa",down:"atk"},
                     "ようき":{up:"spe",down:"spa"}, "おくびょう":{up:"spe",down:"atk"},
                     "わんぱく":{up:"def",down:"spa"}, "ずぶとい":{up:"def",down:"atk"},
                     "しんちょう":{up:"spd",down:"spa"}, "おだやか":{up:"spd",down:"atk"},
                     "ゆうかん":{up:"atk",down:"spe"}, "れいせい":{up:"spa",down:"spe"},
                     "のんき":{up:"def",down:"spe"}, "なまいき":{up:"spd",down:"spe"},
                     "むじゃき":{up:"spe",down:"spd"}, "せっかち":{up:"spe",down:"def"},
                     "やんちゃ":{up:"atk",down:"spd"}, "さみしがり":{up:"atk",down:"def"},
                     "うっかりや":{up:"spa",down:"spd"}
                 };
                 const n = NATS[natureVal];
                 if(!n) return 1.0;
                 if(n.up === statKey) return 1.1;
                 if(n.down === statKey) return 0.9;
                 return 1.0;
            };
            const nature = document.getElementById('te-nature').value;
            const makeReal = (base, id, statKey) => Math.floor((Math.floor((base * 2 + 31 + (parseInt(document.getElementById(id).value)||0)*4)/2)+5)*getNatMod(nature, statKey));
            
            document.getElementById('val-real-hp').innerText = Math.floor((p.stats.hp*2 + 31 + (parseInt(document.getElementById('te-hp').value)||0)*4)/2)+60;
            document.getElementById('val-real-atk').innerText = makeReal(p.stats.atk, 'te-atk', 'atk');
            document.getElementById('val-real-def').innerText = makeReal(p.stats.def, 'te-def', 'def');
            document.getElementById('val-real-spa').innerText = makeReal(p.stats.spa, 'te-spa', 'spa');
            document.getElementById('val-real-spd').innerText = makeReal(p.stats.spd, 'te-spd', 'spd');
            document.getElementById('val-real-spe').innerText = makeReal(p.stats.spe, 'te-spe', 'spe');
        };

        evInputs.forEach(i => i.addEventListener('input', updateRealStats));
        document.getElementById('te-nature').addEventListener('change', updateRealStats);
        
        const moveSelectorsList = ['te-m1', 'te-m2', 'te-m3', 'te-m4'].map(id => document.getElementById(id));
        
        const updateMoveVisibilities = () => {
            const selectedVals = moveSelectorsList.map(s => s?.value).filter(v => v && v !== 'なし' && v !== '技を選択');
            moveSelectorsList.forEach(sel => {
                if(!sel) return;
                const currentVal = sel.value;
                Array.from(sel.options).forEach(opt => {
                    if (!opt.value || opt.value === 'なし' || opt.value === '技を選択') {
                         opt.style.display = '';
                         opt.disabled = false;
                         return;
                    }
                    if (selectedVals.includes(opt.value) && opt.value !== currentVal) {
                        opt.style.display = 'none';
                        opt.disabled = true;
                    } else {
                        opt.style.display = '';
                        opt.disabled = false;
                    }
                });
            });
        };

        moveSelectorsList.forEach(sel => {
            if(!sel) return;
            sel.addEventListener('change', updateMoveVisibilities);
        });
        updateMoveVisibilities();

        updateEVTracker();
        updateRealStats();

        // --- Info button helpers (moves, abilities, items) ---
        const ITEM_DESC = {
            'なし': '持ち物なし',
            'メガナイト': 'メガシンカに必要な石。対応するポケモンのみ使用可能。',
            'こだわりハチマキ': '物理技の威力が1.5倍になる。ただし同じ技しか出せなくなる。',
            'こだわりメガネ': '特殊技の威力が1.5倍になる。ただし同じ技しか出せなくなる。',
            'こだわりスカーフ': '素早さが1.5倍になる。ただし同じ技しか出せなくなる。',
            'いのちのたま': '技の威力が1.3倍になるが、攻撃する度にHPが減る。',
            'タイプ強化アイテム': '特定タイプの技威力が1.2倍。達人の帯は弱点技が1.2倍。',
            'とつげきチョッキ': '特防が1.5倍になる。ただし変化技が使えなくなる。',
            'しんかのきせき': '進化前ポケモンの防御と特防が1.5倍になる。',
            '半減実': '弱点タイプの技を受けた場合、ダメージを半減する（1回のみ）。',
            'きあいのタスキ': 'HP満タンの時、一撃で倒される攻撃を受けてもHP1で耐える。',
            'たべのこし': '毎ターン最大HPの1/16を回復する。',
            'かいがらのすず': '与えたダメージの1/8だけHPを回復する。',
            'ひかりのこな': '相手の技の命中率が0.9倍になる。',
            'せんせいのツメ': '20%の確率で先制攻撃できる。',
            'ピントレンズ': '技の急所率が1段階上がる。',
            'おうじゃのしるし': '攻撃技を当てると10%の確率で相手がひるむ。',
            'オボンのみ': 'HPが半分以下になると最大HPの1/4を回復する。',
            'ラムのみ': '状態異常になった時、自動で回復する。'
        };

        const showInfoPopup = (title, desc) => {
            let popup = document.getElementById('te-info-popup');
            if (popup) popup.remove();
            popup = document.createElement('div');
            popup.id = 'te-info-popup';
            popup.style.cssText = 'position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); background:rgba(18,22,31,0.98); border:1px solid var(--neon-blue); border-radius:10px; padding:1.2rem; max-width:350px; z-index:99999; box-shadow:0 10px 30px rgba(0,0,0,0.8); color:white;';
            popup.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.8rem;">
                    <h4 style="margin:0; color:var(--neon-blue); font-size:1.1rem;">${title}</h4>
                    <button onclick="this.parentElement.parentElement.remove()" style="background:none; border:none; color:#a8b8d0; font-size:1.3rem; cursor:pointer;">×</button>
                </div>
                <p style="margin:0; font-size:0.9rem; color:var(--text-muted); line-height:1.5;">${desc || '説明データなし'}</p>
            `;
            document.body.appendChild(popup);
        };

        // Move info buttons
        document.querySelectorAll('.te-move-info-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const selId = btn.dataset.sel;
                const sel = document.getElementById(selId);
                if (!sel || !sel.value || sel.value === '-- 技を選択 --') { showInfoPopup('技', '技が選択されていません'); return; }
                const mv = typeof MOVES_DICT !== 'undefined' ? MOVES_DICT[sel.value] : null;
                if (mv) {
                    const tMap = {'ノ':'ノーマル','炎':'ほのお','水':'みず','草':'くさ','電':'でんき','氷':'こおり','格':'かくとう','毒':'どく','地':'じめん','飛':'ひこう','エ':'エスパー','虫':'むし','岩':'いわ','ゴ':'ゴースト','ド':'ドラゴン','悪':'あく','鋼':'はがね','妖':'フェアリー'};
                    const fullType = tMap[mv.type] || mv.type;
                    showInfoPopup(mv.name, `タイプ: ${fullType} ｜ 分類: ${mv.category}<br>威力: ${mv.power} ｜ 命中: ${mv.acc} ｜ PP: ${mv.pp}<br><br>${mv.desc || '説明なし'}`);
                } else { showInfoPopup('技', '技データが見つかりません'); }
            });
        });

        // Ability info button
        document.getElementById('te-ability-info')?.addEventListener('click', () => {
            const abilityName = document.getElementById('te-ability').value;
            const desc = (typeof ABILITY_DATA !== 'undefined' && ABILITY_DATA[abilityName]) ? ABILITY_DATA[abilityName] : '説明データなし';
            showInfoPopup(abilityName, desc);
        });

        // Item info button
        document.getElementById('te-item-info')?.addEventListener('click', () => {
            const itemName = document.getElementById('te-item').value;
            const desc = ITEM_DESC[itemName] || '説明データなし';
            showInfoPopup(itemName, desc);
        });
        
        document.getElementById('te-save').onclick = () => {
            currentTeam[index].id = document.getElementById('te-form').value;
            currentTeam[index].hp = parseInt(document.getElementById('te-hp').value) || 0;
            currentTeam[index].atk = parseInt(document.getElementById('te-atk').value) || 0;
            currentTeam[index].def = parseInt(document.getElementById('te-def').value) || 0;
            currentTeam[index].spa = parseInt(document.getElementById('te-spa').value) || 0;
            currentTeam[index].spd = parseInt(document.getElementById('te-spd').value) || 0;
            currentTeam[index].spe = parseInt(document.getElementById('te-spe').value) || 0;
            currentTeam[index].ability = document.getElementById('te-ability') ? document.getElementById('te-ability').value : '';
            currentTeam[index].nature = document.getElementById('te-nature').value;
            currentTeam[index].item = document.getElementById('te-item').value;
            currentTeam[index].m1 = document.getElementById('te-m1').value;
            currentTeam[index].m2 = document.getElementById('te-m2').value;
            currentTeam[index].m3 = document.getElementById('te-m3').value;
            currentTeam[index].m4 = document.getElementById('te-m4').value;
            window.saveTeam();
            window.renderTeamBuilder();
            document.getElementById('team-editor-overlay').remove();
        };
    };

    window.renderTeamBuilder = () => {
        const container = document.getElementById('team-grid-container');
        if (!container) return;
        container.innerHTML = '';
        for (let i = 0; i < 30; i++) {
            const slotData = currentTeam[i];
            const p = slotData ? POKEMON_DATA.find(x => String(x.id) === String(slotData.id)) : null;
            
            const slot = document.createElement('div');
            slot.className = 'team-slot';
            slot.style.position = 'relative';
            slot.style.padding = '0.5rem';
            
            if (p) {
                const getNatMod = (natureVal, statKey) => {
                     const NATS = {
                         "いじっぱり": {up:"atk",down:"spa"}, "ひかえめ":{up:"spa",down:"atk"},
                         "ようき":{up:"spe",down:"spa"}, "おくびょう":{up:"spe",down:"atk"},
                         "わんぱく":{up:"def",down:"spa"}, "ずぶとい":{up:"def",down:"atk"},
                         "しんちょう":{up:"spd",down:"spa"}, "おだやか":{up:"spd",down:"atk"},
                         "ゆうかん":{up:"atk",down:"spe"}, "れいせい":{up:"spa",down:"spe"},
                         "のんき":{up:"def",down:"spe"}, "なまいき":{up:"spd",down:"spe"},
                         "むじゃき":{up:"spe",down:"spd"}, "せっかち":{up:"spe",down:"def"},
                         "やんちゃ":{up:"atk",down:"spd"}, "さみしがり":{up:"atk",down:"def"},
                         "うっかりや":{up:"spa",down:"spd"}
                     };
                     const n = NATS[natureVal];
                     if(!n) return 1.0;
                     if(n.up === statKey) return 1.1;
                     if(n.down === statKey) return 0.9;
                     return 1.0;
                }
                const makeReal = (base, ev, statKey) => Math.floor((Math.floor((base * 2 + 31 + (ev||0)*4)/2)+5)*getNatMod(slotData.nature, statKey));
                const realHp = Math.floor((p.stats.hp*2 + 31 + (slotData.hp||0)*4)/2)+60;
                const realAtk = makeReal(p.stats.atk, slotData.atk, 'atk');
                const realDef = makeReal(p.stats.def, slotData.def, 'def');
                const realSpa = makeReal(p.stats.spa, slotData.spa, 'spa');
                const realSpd = makeReal(p.stats.spd, slotData.spd, 'spd');
                const realSpe = makeReal(p.stats.spe, slotData.spe, 'spe');
                
                const getNatColor = k => {
                     const m = getNatMod(slotData.nature, k);
                     if(m > 1.0) return '#ff5959';
                     if(m < 1.0) return '#44aaff';
                     return '#ffffff';
                };
                const getMoveName = m => (!m || m === 'なし') ? '-' : (typeof MOVES_DICT !== 'undefined' && MOVES_DICT[m] ? MOVES_DICT[m].name : m);
                
                slot.innerHTML = `
                    <div title="外す" class="team-remove-btn" data-index="${i}" style="position:absolute; top:-8px; right:-8px; background:#ff4444; width:24px; height:24px; border-radius:50%; font-weight:bold; color:white; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 5px rgba(0,0,0,0.5); z-index:10; transition: transform 0.1s;" onmouseover="this.style.transform='scale(1.1)';" onmouseout="this.style.transform='scale(1)';">✕</div>
                    <img src="${p.imageUrl}" style="width: 84px; height: 84px; object-fit: contain; filter: drop-shadow(0 0 5px rgba(255,255,255,0.2));" />
                    <div style="font-weight:bold; font-size: 1.05rem; margin-top: 0.4rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; width:100%; text-align:center;">${p.name}</div>
                    
                    <div style="display:flex; gap: 0.2rem; margin-top: 0.3rem; justify-content:center; flex-wrap:wrap;">
                        ${p.types.map(t => `<span class="type-badge ${t}" style="font-size:0.6rem; padding: 2px 5px;">${t}</span>`).join('')}
                    </div>
                    
                    <div style="margin-top: 8px; font-size: 0.75rem; color: #a8b8d0; width: 100%; border-top: 1px dashed rgba(255,255,255,0.1); padding-top:6px;">
                        <table style="width:100%; text-align:center; border-collapse:separate; border-spacing: 2px 4px; table-layout:fixed;">
                            <tr style="color:var(--text-muted); font-size:0.8rem; font-weight:bold;"><td style="color:#ff5959">H</td><td style="color:#f5ac78">A</td><td style="color:#fae078">B</td><td style="color:#9db7f5">C</td><td style="color:#a2db80">D</td><td style="color:#fa92b2">S</td></tr>
                            <tr style="font-weight:bold; color:var(--text-muted); font-size:0.75rem;" title="種族値"><td>${p.stats.hp}</td><td>${p.stats.atk}</td><td>${p.stats.def}</td><td>${p.stats.spa}</td><td>${p.stats.spd}</td><td>${p.stats.spe}</td></tr>
                            <tr style="font-weight:bold; font-size:0.7rem; color:#8899a6;" title="能力値(AP)"><td>${slotData.hp||0}</td><td>${slotData.atk||0}</td><td>${slotData.def||0}</td><td>${slotData.spa||0}</td><td>${slotData.spd||0}</td><td>${slotData.spe||0}</td></tr>
                            <tr style="font-weight:bold; font-size:0.95rem; letter-spacing:0px;" title="実数値"><td style="color:#ffffff;">${realHp}</td><td style="color:${getNatColor('atk')};">${realAtk}</td><td style="color:${getNatColor('def')};">${realDef}</td><td style="color:${getNatColor('spa')};">${realSpa}</td><td style="color:${getNatColor('spd')};">${realSpd}</td><td style="color:${getNatColor('spe')};">${realSpe}</td></tr>
                        </table>
                    </div>
                    
                    <div style="margin-top: 6px; padding-top:6px; border-top: 1px dashed rgba(255,255,255,0.1); font-size: 0.8rem; text-align:left; line-height:1.3;">
                         <div style="margin-bottom:2px;"><span style="color:#a8b8d0;">特性:</span> <span style="font-weight:bold; color:#fff; font-size: 0.85rem;">${slotData.ability || '-'}</span></div>
                         <div style="margin-bottom:6px;"><span style="color:#a8b8d0;">持物:</span> <span style="font-weight:bold; color:#f0d050; font-size: 0.85rem;">${slotData.item && slotData.item !== '1.0' && slotData.item !== 'なし' ? slotData.item : '-'}</span></div>
                         <div style="display:grid; grid-template-columns:1fr 1fr; gap:3px; font-size:0.75rem;">
                             <div style="background:rgba(0,0,0,0.3); padding:3px 5px; border-radius:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; color:#fff;">${getMoveName(slotData.m1)}</div>
                             <div style="background:rgba(0,0,0,0.3); padding:3px 5px; border-radius:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; color:#fff;">${getMoveName(slotData.m2)}</div>
                             <div style="background:rgba(0,0,0,0.3); padding:3px 5px; border-radius:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; color:#fff;">${getMoveName(slotData.m3)}</div>
                             <div style="background:rgba(0,0,0,0.3); padding:3px 5px; border-radius:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; color:#fff;">${getMoveName(slotData.m4)}</div>
                         </div>
                    </div>
                    <div style="display:flex; gap: 0.2rem; margin-top: 0.3rem; width:100%;">
                        <button class="team-action-btn" data-action="set-from-team-atk" data-index="${i}" title="攻撃側に設定" style="flex:1; padding:4px 2px; font-size:0.8rem; background:rgba(226, 75, 75, 0.5); border:1px solid #e24b4b; border-radius:3px; color:white; cursor:pointer; transition: background 0.2s;" onmouseover="this.style.background='rgba(226,75,75,0.9)';" onmouseout="this.style.background='rgba(226,75,75,0.5)';">⚔️</button>
                        <button class="team-action-btn" data-action="set-from-team-def" data-index="${i}" title="防御側に設定" style="flex:1; padding:4px 2px; font-size:0.8rem; background:rgba(64, 104, 224, 0.5); border:1px solid #4068e0; border-radius:3px; color:white; cursor:pointer; transition: background 0.2s;" onmouseover="this.style.background='rgba(64,104,224,0.9)';" onmouseout="this.style.background='rgba(64,104,224,0.5)';">🛡️</button>
                        <button class="team-action-btn" onclick="openTeamEditor(${i})" title="ステータス設定" style="flex:1; padding:4px 2px; font-size:0.8rem; background:rgba(34, 193, 195, 0.5); border:1px solid #22c1c3; border-radius:3px; color:white; cursor:pointer; transition: background 0.2s;" onmouseover="this.style.background='rgba(34,193,195,0.9)';" onmouseout="this.style.background='rgba(34,193,195,0.5)';">⚙️設定</button>
                    </div>
                `;
            } else {
                slot.style.cursor = 'pointer';
                slot.innerHTML = `<span class="slot-icon" style="font-size:2rem; opacity:0.5;">+</span><p style="opacity:0.5; font-size:0.8rem; margin-top:0.5rem;">登録枠 ${i+1}</p>`;
                slot.onclick = () => {
                    const dbTab = document.querySelector('.tab-btn[data-tab="database"]');
                    if (dbTab) dbTab.click();
                    const input = document.getElementById('search-input');
                    if (input) input.focus();
                };
            }
            container.appendChild(slot);
        }
    };

    // Load Saved State
    const savedCalcState = JSON.parse(localStorage.getItem('pokemon_champions_calc') || '{}');

    let currentAttackerId = savedCalcState.attackerId || (POKEMON_DATA[0]?.id || 1);
    let currentDefenderId = savedCalcState.defenderId || (POKEMON_DATA.length > 1 ? POKEMON_DATA[1].id : currentAttackerId);
    
    const restoreVal = (id, key) => { 
        if (savedCalcState[key] !== undefined && document.getElementById(id)) {
            document.getElementById(id).value = savedCalcState[key];
        }
    };
    restoreVal('atk-ap', 'atkAp'); restoreVal('atk-nature', 'atkNature'); restoreVal('atk-rank', 'atkRank');
    restoreVal('hp-ap', 'hpAp'); restoreVal('def-ap', 'defAp'); restoreVal('def-nature', 'defNature');
    restoreVal('def-atk-ap', 'defAtkAp'); restoreVal('def-atk-nature', 'defAtkNature'); restoreVal('def-atk-rank', 'defAtkRank');
    
    // Resume new residual damages
    if (savedCalcState.stealthRock !== undefined && document.getElementById('def-stealth-rock')) {
        document.getElementById('def-stealth-rock').checked = savedCalcState.stealthRock;
    }
    restoreVal('atk-item', 'atkItem');
    restoreVal('def-item', 'defItem');
    restoreVal('field-weather', 'fieldWeather');
    restoreVal('field-terrain', 'fieldTerrain');
    restoreVal('def-spikes', 'defSpikes');
    restoreVal('def-status', 'defStatus');
    restoreVal('def-other-dmg', 'defOther');
    
    const atkPk = POKEMON_DATA.find(p=>p.id==currentAttackerId);
    if (attackerInput && atkPk) attackerInput.value = atkPk.name;
    const defPk = POKEMON_DATA.find(p=>p.id==currentDefenderId);
    if (defenderInput && defPk) defenderInput.value = defPk.name;

    // ROMAJI TO KATAKANA MAP
    const rMap = {
        'a':'ア','i':'イ','u':'ウ','e':'エ','o':'オ',
        'ka':'カ','ki':'キ','ku':'ク','ke':'ケ','ko':'コ',
        'sa':'サ','shi':'シ','su':'ス','se':'セ','so':'ソ','si':'シ',
        'ta':'タ','chi':'チ','tsu':'ツ','te':'テ','to':'ト','ti':'チ','tu':'ツ',
        'na':'ナ','ni':'ニ','nu':'ヌ','ne':'ネ','no':'ノ',
        'ha':'ハ','hi':'ヒ','hu':'フ','fu':'フ','he':'ヘ','ho':'ホ',
        'ma':'マ','mi':'ミ','mu':'ム','me':'メ','mo':'モ',
        'ya':'ヤ','yu':'ユ','yo':'ヨ',
        'ra':'ラ','ri':'リ','ru':'ル','re':'レ','ro':'ロ',
        'wa':'ワ','wo':'ヲ','nn':'ン','n ':'ン',
        'ga':'ガ','gi':'ギ','gu':'グ','ge':'ゲ','go':'ゴ',
        'za':'ザ','ji':'ジ','zu':'ズ','ze':'ゼ','zo':'ゾ','zi':'ジ',
        'da':'ダ','di':'ヂ','du':'ヅ','de':'デ','do':'ド',
        'ba':'バ','bi':'ビ','bu':'ブ','be':'ベ','bo':'ボ',
        'pa':'パ','pi':'ピ','pu':'プ','pe':'ペ','po':'ポ',
        'kya':'キャ','kyu':'キュ','kyo':'キョ',
        'sha':'シャ','shu':'シュ','sho':'ショ','sya':'シャ','syu':'シュ','syo':'ショ',
        'cha':'チャ','chu':'チュ','cho':'チョ','tya':'チャ','tyu':'チュ','tyo':'チョ','cya':'チャ','cyu':'チュ','cyo':'チョ',
        'nya':'ニャ','nyu':'ニュ','nyo':'ニョ',
        'hya':'ヒャ','hyu':'ヒュ','hyo':'ヒョ',
        'mya':'ミャ','myu':'ミュ','myo':'ミョ',
        'rya':'リャ','ryu':'リュ','ryo':'リョ',
        'gya':'ギャ','gyu':'ギュ','gyo':'ギョ',
        'ja':'ジャ','ju':'ジュ','jo':'ジョ','zya':'ジャ','zyu':'ジュ','zyo':'ジョ',
        'bya':'ビャ','byu':'ビュ','byo':'ビョ',
        'pya':'ピャ','pyu':'ピュ','pyo':'ピョ',
        'fa':'ファ','fi':'フィ','fe':'フェ','fo':'フォ',
        'va':'ヴァ','vi':'ヴィ','vu':'ヴ','ve':'ヴェ','vo':'ヴォ',
        '-':'ー'
    };

    const convertRomajiToKatakana = (text) => {
        let res = '';
        let i = 0;
        text = text.replace(/([bcdfghjklmnpqrstvwxyz])\1/g, 'ッ$1');
        while (i < text.length) {
            let match = false;
            for (let len = 3; len > 0; len--) {
                if (i + len <= text.length) {
                    let sub = text.substr(i, len);
                    if (rMap[sub]) {
                        res += rMap[sub];
                        i += len;
                        match = true;
                        break;
                    }
                }
            }
            if (!match) {
                if (text[i] === 'n' && (i === text.length - 1 || !/[aeiouy]/.test(text[i+1]))) {
                    res += 'ン';
                } else {
                    res += text[i];
                }
                i++;
            }
        }
        return res;
    };

    const hToK = (str) => str.replace(/[\u3041-\u3096]/g, m => String.fromCharCode(m.charCodeAt(0) + 0x60));

    const setupAutocomplete = (inputId, suggId, onSelectCallback) => {
        const input = document.getElementById(inputId);
        const suggContainer = document.getElementById(suggId);
        if (!input || !suggContainer) return;
        
        input.addEventListener('focus', () => input.dispatchEvent(new Event('input')));
        
        input.addEventListener('input', () => {
            const rawVal = input.value.trim().toLowerCase();
            const val = hToK(rawVal);
            const romajiVal = convertRomajiToKatakana(rawVal);
            
            suggContainer.innerHTML = '';
            
            let matches = POKEMON_DATA;
            if (rawVal) {
                matches = POKEMON_DATA.filter(p => p.name.includes(val) || p.name.includes(romajiVal) || (p.nameEn && p.nameEn.toLowerCase().includes(rawVal)));
            }
            matches = matches.slice(0, 50);
            
            if (matches.length > 0) {
                suggContainer.style.display = 'block';
                matches.forEach(p => {
                    const div = document.createElement('div');
                    div.style.padding = '8px 12px';
                    div.style.cursor = 'pointer';
                    div.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
                    div.style.display = 'flex';
                    div.style.alignItems = 'center';
                    div.style.gap = '8px';
                    div.innerHTML = `<img src="${p.imageUrl}" style="width:32px; height:32px; object-fit:contain;"> <span>${p.name} <small style="color:var(--text-muted);">#${p.id}</small></span>`;
                    
                    div.addEventListener('mouseover', () => div.style.background = 'var(--accent-primary)');
                    div.addEventListener('mouseout', () => div.style.background = 'transparent');
                    
                    div.addEventListener('click', () => {
                        input.value = p.name;
                        suggContainer.style.display = 'none';
                        onSelectCallback(p.id);
                    });
                    suggContainer.appendChild(div);
                });
            } else {
                suggContainer.style.display = 'none';
            }
        });
        
        document.addEventListener('click', (e) => {
            if (e.target !== input && e.target !== suggContainer) {
                suggContainer.style.display = 'none';
            }
        });
    };
    
    // Initialize Search Lists
    const searchList = document.getElementById('pokemon-list');
    if (searchList) {
        POKEMON_DATA.forEach(pkmn => {
            const listOpt = document.createElement('option');
            listOpt.value = pkmn.name;
            searchList.appendChild(listOpt);
        });
    }

    // Type Chart Mapping (Row attacks Column)
    const TYPE_CHART = {
        'ノーマル': { 'いわ': 0.5, 'ゴースト': 0, 'はがね': 0.5 },
        'ほのお': { 'ほのお': 0.5, 'みず': 0.5, 'くさ': 2.0, 'こおり': 2.0, 'むし': 2.0, 'いわ': 0.5, 'ドラゴン': 0.5, 'はがね': 2.0 },
        'みず': { 'ほのお': 2.0, 'みず': 0.5, 'くさ': 0.5, 'じめん': 2.0, 'いわ': 2.0, 'ドラゴン': 0.5 },
        'でんき': { 'みず': 2.0, 'でんき': 0.5, 'くさ': 0.5, 'じめん': 0, 'ひこう': 2.0, 'ドラゴン': 0.5 },
        'くさ': { 'ほのお': 0.5, 'みず': 2.0, 'くさ': 0.5, 'どく': 0.5, 'じめん': 2.0, 'ひこう': 0.5, 'むし': 0.5, 'いわ': 2.0, 'ドラゴン': 0.5, 'はがね': 0.5 },
        'こおり': { 'ほのお': 0.5, 'みず': 0.5, 'くさ': 2.0, 'こおり': 0.5, 'じめん': 2.0, 'ひこう': 2.0, 'ドラゴン': 2.0, 'はがね': 0.5 },
        'かくとう': { 'ノーマル': 2.0, 'こおり': 2.0, 'どく': 0.5, 'ひこう': 0.5, 'エスパー': 0.5, 'むし': 0.5, 'いわ': 2.0, 'ゴースト': 0, 'あく': 2.0, 'はがね': 2.0, 'フェアリー': 0.5 },
        'どく': { 'くさ': 2.0, 'どく': 0.5, 'じめん': 0.5, 'いわ': 0.5, 'ゴースト': 0.5, 'はがね': 0, 'フェアリー': 2.0 },
        'じめん': { 'ほのお': 2.0, 'でんき': 2.0, 'くさ': 0.5, 'どく': 2.0, 'ひこう': 0, 'むし': 0.5, 'いわ': 2.0, 'はがね': 2.0 },
        'ひこう': { 'でんき': 0.5, 'くさ': 2.0, 'かくとう': 2.0, 'むし': 2.0, 'いわ': 0.5, 'はがね': 0.5 },
        'エスパー': { 'かくとう': 2.0, 'どく': 2.0, 'エスパー': 0.5, 'あく': 0, 'はがね': 0.5 },
        'むし': { 'ほのお': 0.5, 'くさ': 2.0, 'かくとう': 0.5, 'どく': 0.5, 'ひこう': 0.5, 'エスパー': 2.0, 'ゴースト': 0.5, 'あく': 2.0, 'はがね': 0.5, 'フェアリー': 0.5 },
        'いわ': { 'ほのお': 2.0, 'こおり': 2.0, 'かくとう': 0.5, 'じめん': 0.5, 'ひこう': 2.0, 'むし': 2.0, 'はがね': 0.5 },
        'ゴースト': { 'ノーマル': 0, 'エスパー': 2.0, 'ゴースト': 2.0, 'あく': 0.5 },
        'ドラゴン': { 'ドラゴン': 2.0, 'はがね': 0.5, 'フェアリー': 0 },
        'あく': { 'かくとう': 0.5, 'エスパー': 2.0, 'ゴースト': 2.0, 'あく': 0.5, 'フェアリー': 0.5 },
        'はがね': { 'ほのお': 0.5, 'みず': 0.5, 'でんき': 0.5, 'こおり': 2.0, 'いわ': 2.0, 'はがね': 0.5, 'フェアリー': 2.0 },
        'フェアリー': { 'ほのお': 0.5, 'かくとう': 2.0, 'どく': 0.5, 'ドラゴン': 2.0, 'あく': 2.0, 'はがね': 0.5 }
    };
    const tMapGlobal = {'ノ':'ノーマル','炎':'ほのお','水':'みず','草':'くさ','電':'でんき','氷':'こおり','格':'かくとう','毒':'どく','地':'じめん','飛':'ひこう','エ':'エスパー','虫':'むし','岩':'いわ','ゴ':'ゴースト','ド':'ドラゴン','悪':'あく','鋼':'はがね','妖':'フェアリー'};
    const TYPE_EMOJI = {'ノーマル':'⚪','ほのお':'🔥','みず':'💧','くさ':'🌿','でんき':'⚡','こおり':'❄️','かくとう':'🥊','どく':'☠️','じめん':'⛰️','ひこう':'🌪️','エスパー':'🔮','むし':'🐛','いわ':'🪨','ゴースト':'👻','ドラゴン':'🐉','あく':'🌙','はがね':'⚙️','フェアリー':'✨'};
    const CAT_EMOJI = { '物理': '💥', '特殊': '☄️' };

    const TYPE_COLOR = {
        'ノーマル': '#aaaa99', 'ほのお': '#ff4422', 'みず': '#3399ff', 'くさ': '#77cc55',
        'でんき': '#ffcc33', 'こおり': '#66ccff', 'かくとう': '#bb5544', 'どく': '#aa5599',
        'じめん': '#ddbb55', 'ひこう': '#8899ff', 'エスパー': '#ff5599', 'むし': '#aabb22',
        'いわ': '#bbaa66', 'ゴースト': '#6666bb', 'ドラゴン': '#7766ee', 'あく': '#775544',
        'はがね': '#aaaabb', 'フェアリー': '#ee99ee'
    };

    // Populate Move Select dynamically based on attacker
    const populateMoves = () => {
        const attackerId = currentAttackerId;
        const attacker = POKEMON_DATA.find(p => p.id == attackerId);
        moveSelect.innerHTML = '';
        if (attacker) {
            const movesProp = window.getMovesForPokemon(attacker.name);
            if (movesProp) {
                movesProp.forEach(mid => {
                const move = MOVES_DICT[mid];
                if (move && move.category !== '変化' && move.power !== '-') {
                    const fullType = tMapGlobal[move.type] || move.type;
                    const powerText = move.name === 'イカサマ' ? '' : ` (威力${move.power})`;
                    const option = new Option(`${move.name}${powerText}`, mid);
                    option.style.color = TYPE_COLOR[fullType] || 'white';
                    option.style.fontWeight = 'bold';
                    moveSelect.add(option);
                }
                });
            }
            if (savedCalcState.moveId) {
                // Try to set it to saved move, if it exists
                moveSelect.value = savedCalcState.moveId;
            }
        }
        calculateDamage();
    };
    setupAutocomplete('attacker-input', 'attacker-suggestions', (id) => { currentAttackerId = id; populateMoves(); });
    setupAutocomplete('defender-input', 'defender-suggestions', (id) => { currentDefenderId = id; calculateDamage(); });
    
    // Initial population for first load
    setTimeout(populateMoves, 100);

    // Tab Switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });

    // Calculation Logic
    const calculateDamage = () => {
        const attackerId = currentAttackerId;
        const defenderId = currentDefenderId;
        const moveId = moveSelect.value;
        
        const setupMegaButton = (btnId, inputId, currentId, setCurrentIdCb) => {
            const btn = document.getElementById(btnId);
            const p = POKEMON_DATA.find(x => String(x.id) === String(currentId));
            if(!p || !btn) return;
            
            const bName = p.name.replace(/^(メガ|ゲンシ)/, '').replace(/[ＸＹXY]$/, '').replace(/\s*\(.*?\)/, '');
            const localForms = POKEMON_DATA.filter(x => {
                 const rx = x.name.replace(/^(メガ|ゲンシ)/, '').replace(/[ＸＹXY]$/, '').replace(/\s*\(.*?\)/, '');
                 return rx === bName && (x.name === bName || x.name.includes('メガ') || x.name.includes('ゲンシ'));
            });
            const megas = localForms.filter(f => f.name.includes('メガ') || f.name.includes('ゲンシ'));
            const baseF = localForms.find(f => !f.name.includes('メガ') && !f.name.includes('ゲンシ')) || localForms[0];
            
            if (megas.length > 0) {
                 btn.style.display = 'block';
                 const cycle = [baseF, ...megas].filter(x => x);
                 const cIdx = cycle.findIndex(c => String(c.id) === String(currentId));
                 const nextIdx = (cIdx + 1) % cycle.length;
                 const nextForm = cycle[nextIdx];
                
                 if (cIdx === 0) {
                     btn.innerText = 'ﾒｶﾞｼﾝｶ ✨';
                     btn.style.background = 'linear-gradient(145deg, #bbaa66, #998844)';
                     btn.style.borderColor = '#eedd99';
                 } else if (nextIdx === 0) {
                     btn.innerText = '元に戻す ↩️';
                     btn.style.background = 'linear-gradient(145deg, #556677, #445566)';
                     btn.style.borderColor = '#8899aa';
                 } else {
                     btn.innerText = '別の形態 🔄';
                     btn.style.background = 'linear-gradient(145deg, #a666bb, #8a4499)';
                     btn.style.borderColor = '#cc99dd';
                 }
                 
                 btn.title = `次は ${nextForm.name} に変更します`;
                 btn.onclick = () => {
                     document.getElementById(inputId).value = nextForm.name;
                     setCurrentIdCb(nextForm.id);
                     if (btnId === 'atk-mega-btn') populateMoves();
                     else calculateDamage();
                 };
            } else {
                 btn.style.display = 'none';
            }
        };

        setupMegaButton('atk-mega-btn', 'attacker-input', attackerId, id => currentAttackerId = id);
        setupMegaButton('def-mega-btn', 'defender-input', defenderId, id => currentDefenderId = id);

        const attacker = POKEMON_DATA.find(p => p.id == attackerId);
        const defender = POKEMON_DATA.find(p => p.id == defenderId);
        
        if (attacker && document.getElementById('atk-ability') && document.getElementById('atk-ability').dataset.lastId !== String(attackerId)) {
            const sel = document.getElementById('atk-ability');
            sel.innerHTML = '';
            (attacker.abilities && attacker.abilities.length > 0 ? attacker.abilities : ['（特性なし）']).forEach(a => sel.add(new Option(a, a)));
            sel.add(new Option('なし', 'なし'));
            sel.dataset.lastId = String(attackerId);
            sel.value = (attacker.abilities && attacker.abilities.length > 0) ? attacker.abilities[0] : 'なし';
        }
        if (defender && document.getElementById('def-ability') && document.getElementById('def-ability').dataset.lastId !== String(defenderId)) {
            const sel = document.getElementById('def-ability');
            sel.innerHTML = '';
            (defender.abilities && defender.abilities.length > 0 ? defender.abilities : ['（特性なし）']).forEach(a => sel.add(new Option(a, a)));
            sel.add(new Option('なし', 'なし'));
            sel.dataset.lastId = String(defenderId);
            sel.value = (defender.abilities && defender.abilities.length > 0) ? defender.abilities[0] : 'なし';
        }

        const atkAbility = document.getElementById('atk-ability') ? document.getElementById('atk-ability').value : '';
        const defAbility = document.getElementById('def-ability') ? document.getElementById('def-ability').value : '';
        
        // Update images and type badges
        const atkImg = document.getElementById('attacker-img');
        const defImg = document.getElementById('defender-img');
        const atkTypesContainer = document.getElementById('attacker-types-container');
        const defTypesContainer = document.getElementById('defender-types-container');

        if (attacker) {
            atkImg.src = attacker.imageUrl;
            atkImg.style.display = 'block';
            if (atkTypesContainer) {
                atkTypesContainer.innerHTML = attacker.types.map(t => `<span class="type-badge ${t}" style="font-size: 0.75rem; padding: 2px 6px;">${t}</span>`).join('');
            }
        }
        if (defender) {
            defImg.src = defender.imageUrl;
            defImg.style.display = 'block';
            if (defTypesContainer) {
                defTypesContainer.innerHTML = defender.types.map(t => `<span class="type-badge ${t}" style="font-size: 0.75rem; padding: 2px 6px;">${t}</span>`).join('');
            }
        }
        const move = MOVES_DICT[moveId];

        if (!attacker || !defender || !move) return;
        
        // Show rich badges for selected move
        const moveDetails = document.getElementById('move-details-container');
        if (moveDetails) {
            const moveType = tMapGlobal[move.type] || move.type;
            const catBg = move.category === '物理' ? '#e24b4b' : (move.category === '特殊' ? '#4068e0' : '#8899a6');
            moveDetails.innerHTML = `
                <span class="type-badge ${moveType}" style="font-size: 0.75rem; padding: 3px 8px;">${moveType}</span>
                <span style="background: ${catBg}; color: white; font-size: 0.75rem; padding: 3px 8px; border-radius: 4px; font-weight: bold;">${move.category}</span>
                <span style="background: rgba(255,255,255,0.1); color: var(--text-main); font-size: 0.75rem; padding: 3px 8px; border-radius: 4px; border: 1px solid var(--glass-border);">威力: <span style="font-weight:bold;">${move.power}</span></span>
                <span style="background: rgba(255,255,255,0.1); color: var(--text-main); font-size: 0.75rem; padding: 3px 8px; border-radius: 4px; border: 1px solid var(--glass-border);">命中: <span style="font-weight:bold;">${move.acc}</span></span>
            `;
        }

        // Nature Parser Helper
        const getNatureMultiplier = (natureName, targetStatKey) => {
            const POKEMON_NATURES = {
                "いじっぱり": { up: "atk", down: "spa" }, "ひかえめ":   { up: "spa", down: "atk" },
                "ようき":     { up: "spe", down: "spa" }, "おくびょう": { up: "spe", down: "atk" },
                "わんぱく":   { up: "def", down: "spa" }, "ずぶとい":   { up: "def", down: "atk" },
                "しんちょう": { up: "spd", down: "spa" }, "おだやか":   { up: "spd", down: "atk" },
                "ゆうかん":   { up: "atk", down: "spe" }, "れいせい":   { up: "spa", down: "spe" },
                "のんき":     { up: "def", down: "spe" }, "なまいき":   { up: "spd", down: "spe" },
                "むじゃき":   { up: "spe", down: "spd" }, "せっかち":   { up: "spe", down: "def" },
                "やんちゃ":   { up: "atk", down: "spd" }, "さみしがり": { up: "atk", down: "def" },
                "うっかりや": { up: "spa", down: "spd" }
            };
            if(!natureName) return 1.0;
            if(natureName === "1.1" || natureName === "1.0" || natureName === "0.9") return parseFloat(natureName);
            const n = POKEMON_NATURES[natureName];
            if(!n) return 1.0;
            if (n.up === targetStatKey) return 1.1;
            if (n.down === targetStatKey) return 0.9;
            return 1.0;
        };

        // Lv 50 is standard
        const lv = 50;
        
        // Attacker Real Stat calculation
        const atkBase = move.category === '物理' ? attacker.stats.atk : attacker.stats.spa;
        const atkStatKey = move.category === '物理' ? 'atk' : 'spa';
        const atkAP = parseInt(document.getElementById('atk-ap').value) || 0;
        const atkNatureVal = document.getElementById('atk-nature').value;
        const atkNature = getNatureMultiplier(atkNatureVal, atkStatKey);
        const atkRank = parseInt(document.getElementById('atk-rank').value);
        
        let atkReal = Math.floor((Math.floor((atkBase * 2 + 31 + (atkAP * 4)) / 2) + 5) * atkNature);
        
        // Defender Real Stat calculation
        const defBase = move.category === '物理' ? defender.stats.def : defender.stats.spd;
        const defStatKey = move.category === '物理' ? 'def' : 'spd';
        const defAP = parseInt(document.getElementById('def-ap').value) || 0;
        const defNatureVal = document.getElementById('def-nature').value;
        const defNature = getNatureMultiplier(defNatureVal, defStatKey);
        let defReal = Math.floor((Math.floor((defBase * 2 + 31 + (defAP * 4)) / 2) + 5) * defNature);
        
        const hpBase = defender.stats.hp;
        const hpAP = parseInt(document.getElementById('hp-ap').value) || 0;
        let hpReal = Math.floor((hpBase * 2 + 31 + (hpAP * 4)) / 2) + 50 + 10;

        const getRankMod = (rank) => {
            if (rank > 0) return (2 + rank) / 2;
            if (rank < 0) return 2 / (2 - Math.abs(rank));
            return 1;
        };
        
        // Type Matchup logic
        let moveType = tMapGlobal[move.type] || move.type;
        const fieldWeather = document.getElementById('field-weather').value || 'none';

        if (move.name === 'ウェザーボール' && fieldWeather !== 'none') {
            if (fieldWeather === 'sun') moveType = 'ほのお';
            else if (fieldWeather === 'rain') moveType = 'みず';
            else if (fieldWeather === 'sand') moveType = 'いわ';
            else if (fieldWeather === 'snow') moveType = 'こおり';
        }
        
        const baseMoveType = moveType; // Keep original for Skin buffs
        
        // --- Ability Type Overrides (Skins) ---
        if (atkAbility === 'ノーマルスキン') {
            moveType = 'ノーマル';
        } else if (moveType === 'ノーマル') {
             if (atkAbility === 'フェアリースキン') moveType = 'フェアリー';
             else if (atkAbility === 'スカイスキン') moveType = 'ひこう';
             else if (atkAbility === 'フリーズスキン') moveType = 'こおり';
             else if (atkAbility === 'エレキスキン') moveType = 'でんき';
        }

        let typeMod = 1.0;
        defender.types.forEach(type => {
            if (TYPE_CHART[moveType] && TYPE_CHART[moveType][type] !== undefined) {
                typeMod *= TYPE_CHART[moveType][type];
            }
        });

        if (defAbility === 'ふゆう' && moveType === 'じめん') typeMod = 0;
        if (defAbility === 'もらいび' && moveType === 'ほのお') typeMod = 0;
        if (defAbility === 'ちょすい' && moveType === 'みず') typeMod = 0;
        if (defAbility === 'ちくでん' && moveType === 'でんき') typeMod = 0;
        if (defAbility === 'ひらいしん' && moveType === 'でんき') typeMod = 0;

        // STAB
        let stab = attacker.types.includes(moveType) ? 1.5 : 1.0;
        if (atkAbility === 'てきおうりょく' && attacker.types.includes(moveType)) {
            stab = 2.0;
        }
        
        const getItemMod = (itemName, isAtkContext, isSuperEffective, moveCategory) => {
            if(!itemName || itemName === "なし" || itemName === "1.0") return 1.0;
            if(itemName === "1.5" || itemName === "1.3" || itemName === "1.2" || itemName === "0.5") return parseFloat(itemName);
            
            if(isAtkContext) {
                if(itemName === "こだわりハチマキ" && moveCategory === "物理") return 1.5;
                if(itemName === "こだわりメガネ" && moveCategory === "特殊") return 1.5;
                if(itemName === "いのちのたま") return 1.3;
                if(itemName === "タイプ強化アイテム") return 1.2;
            } else {
                if(itemName === "とつげきチョッキ" && moveCategory === "特殊") return 1.5;
                if(itemName === "しんかのきせき") return 1.5;
                if(itemName === "半減実" && isSuperEffective) return 0.5;
            }
            return 1.0;
        };

        const isSuperEffective = typeMod > 1.0;
        
        let finalAtk = Math.floor(atkReal * getRankMod(atkRank));
        const atkItemRaw = document.getElementById('atk-item').value;
        const atkItemMod = getItemMod(atkItemRaw, true, isSuperEffective, move.category);
        
        if ((atkAbility === 'ちからもち' || atkAbility === 'ヨガパワー') && move.category === '物理') {
            finalAtk = Math.floor(finalAtk * 2.0);
        } else if (atkAbility === 'はりきり' && move.category === '物理') {
            finalAtk = Math.floor(finalAtk * 1.5);
        }
        
        // Atk Item modification directly affects the final effective attack or power
        finalAtk = Math.floor(finalAtk * atkItemMod);
        
        const defAtkContainer = document.getElementById('defender-atk-container');

        // イカサマ (Foul Play) 特殊処理
        if (move.name === 'イカサマ') {
            defAtkContainer.style.display = 'grid'; // 表示
            
            // 防御側の攻撃種族値と入力を参照
            const defAtkBase = defender.stats.atk;
            const defAtkAP = parseInt(document.getElementById('def-atk-ap').value) || 0;
            const defAtkNatureVal = document.getElementById('def-atk-nature').value;
            const defAtkNature = getNatureMultiplier(defAtkNatureVal, 'atk');
            const defAtkRank = parseInt(document.getElementById('def-atk-rank').value);
            
            let defAtkReal = Math.floor((Math.floor((defAtkBase * 2 + 31 + (defAtkAP * 4)) / 2) + 5) * defAtkNature);
            finalAtk = Math.floor(Math.floor(defAtkReal * getRankMod(defAtkRank)) * atkItemMod);
        } else {
            defAtkContainer.style.display = 'none'; // 非表示
        }
        
        // fieldWeather was moved to the top of calculation logic to support Weather Ball.
        let weatherMoveMod = 1.0;
        if (fieldWeather === 'sun') {
            if (moveType === 'ほのお') weatherMoveMod = 1.5;
            if (moveType === 'みず') weatherMoveMod = 0.5;
        } else if (fieldWeather === 'rain') {
            if (moveType === 'みず') weatherMoveMod = 1.5;
            if (moveType === 'ほのお') weatherMoveMod = 0.5;
        }

        const fieldTerrain = document.getElementById('field-terrain').value || 'none';
        let terrainMoveMod = 1.0;
        const isAtkGrounded = !attacker.types.includes('ひこう');
        const isDefGrounded = !defender.types.includes('ひこう');

        if (isAtkGrounded) {
            if (fieldTerrain === 'psychic' && moveType === 'エスパー') terrainMoveMod = 1.3;
            else if (fieldTerrain === 'electric' && moveType === 'でんき') terrainMoveMod = 1.3;
            else if (fieldTerrain === 'grassy' && moveType === 'くさ') terrainMoveMod = 1.3;
        }

        if (isDefGrounded) {
            if (fieldTerrain === 'misty' && moveType === 'ドラゴン') terrainMoveMod *= 0.5;
            if (fieldTerrain === 'grassy' && move.name === 'じしん') terrainMoveMod *= 0.5;
        }
        
        // Defender Items & Weather State Buffs
        const defItemRaw = document.getElementById('def-item').value;
        const defItemMod = getItemMod(defItemRaw, false, isSuperEffective, move.category);
        let finalDefReal = defReal;
        let damageReductionMod = 1.0;
        
        // Weather Defense buffs
        if (fieldWeather === 'sand' && defender.types.includes('いわ') && move.category === '特殊') {
            finalDefReal = Math.floor(finalDefReal * 1.5);
        } else if (fieldWeather === 'snow' && defender.types.includes('こおり') && move.category === '物理') {
            finalDefReal = Math.floor(finalDefReal * 1.5);
        }

        if (defItemMod === 1.5) {
            finalDefReal = Math.floor(finalDefReal * 1.5); // しんかのきせき 等
        } else if (defItemMod === 0.5) {
            damageReductionMod = 0.5; // 半減実
        }

        // Base Damage Calculation
        let power = parseInt(move.power) || 0;

        let extraPowerUI = document.getElementById('extra-power-ui');
        if (!extraPowerUI) {
            extraPowerUI = document.createElement('div');
            extraPowerUI.id = 'extra-power-ui';
            extraPowerUI.innerHTML = `<label style="font-size:0.8rem; color:#f0d050; margin-left:10px;">ランク上昇合計(能力変化):</label><input type="number" id="extra-power-val" value="0" min="0" max="42" style="width:50px; padding:2px; margin-left:4px; font-size:0.8rem; background:rgba(0,0,0,0.5); color:white; border:1px solid #f0d050; border-radius:3px;">`;
            extraPowerUI.style.display = 'none';
            document.getElementById('move-details-container').appendChild(extraPowerUI);
            document.getElementById('extra-power-val').addEventListener('input', calculateDamage);
        }

        if (move.name === 'アシストパワー' || move.name === 'つけあがる') {
            extraPowerUI.style.display = 'inline-block';
            let ranks = parseInt(document.getElementById('extra-power-val').value) || 0;
            power = 20 + (20 * ranks);
        } else {
            extraPowerUI.style.display = 'none';
        }

        if (move.name === 'ウェザーボール' && fieldWeather !== 'none') {
            power = 100;
        }

        if(power === 0) return; // Cannot calculate damage for status or fixed damage easily
        
        let abilityDmgMod = 1.0;
        if ((atkAbility === 'もうか' && moveType === 'ほのお') ||
            (atkAbility === 'しんりょく' && moveType === 'くさ') ||
            (atkAbility === 'げきりゅう' && moveType === 'みず') ||
            (atkAbility === 'むしのしらせ' && moveType === 'むし') ||
            (atkAbility === 'トランジスタ' && moveType === 'でんき') ||
            (atkAbility === 'りゅうのあぎと' && moveType === 'ドラゴン') ||
            (atkAbility === 'はがねのせいしん' && moveType === 'はがね')) {
            abilityDmgMod = 1.5;
        } else if (atkAbility === 'すいほう' && moveType === 'みず') {
            abilityDmgMod = 2.0;
        } else if (atkAbility === 'かたいツメ' && move.category === '物理') {
            abilityDmgMod = 1.3; // Basic approximation flag for widespread claws
        } else if (atkAbility === 'ノーマルスキン' || 
                   (baseMoveType === 'ノーマル' && ['フェアリースキン', 'スカイスキン', 'フリーズスキン', 'エレキスキン'].includes(atkAbility))) {
            abilityDmgMod = 1.2;
        }

        if (defAbility === 'たいねつ' && moveType === 'ほのお') {
            abilityDmgMod *= 0.5;
        } else if (defAbility === 'すいほう' && moveType === 'ほのお') {
            abilityDmgMod *= 0.5;
        }
        
        const baseDamage = Math.floor(Math.floor(Math.floor(2 * lv / 5 + 2) * power * finalAtk / finalDefReal) / 50 + 2);
        
        // Final modifiers applied sequentially
        // baseDamage * (0.85~1.0) * STAB * TypeMod * WeatherMod * TerrainMod * OtherMods * Ability Mod
        const minDamage = Math.floor(Math.floor(Math.floor(Math.floor(Math.floor(baseDamage * 0.85 * stab * typeMod) * weatherMoveMod) * terrainMoveMod) * abilityDmgMod) * damageReductionMod);
        const maxDamage = Math.floor(Math.floor(Math.floor(Math.floor(Math.floor(baseDamage * 1.0 * stab * typeMod) * weatherMoveMod) * terrainMoveMod) * abilityDmgMod) * damageReductionMod);

        const minPercent = ((minDamage / hpReal) * 100).toFixed(1);
        const maxPercent = ((maxDamage / hpReal) * 100).toFixed(1);
        
        // --- RESIDUAL DAMAGE CALCULATIONS ---
        let stealthRockDamage = 0;
        if (document.getElementById('def-stealth-rock').checked) {
            let rockMod = 1.0;
            defender.types.forEach(type => {
                if (TYPE_CHART['いわ'] && TYPE_CHART['いわ'][type] !== undefined) {
                    rockMod *= TYPE_CHART['いわ'][type];
                }
            });
            stealthRockDamage = Math.floor(hpReal * 0.125 * rockMod);
        }
        let spikesDamage = 0;
        const spikesFrac = parseFloat(document.getElementById('def-spikes').value) || 0;
        if (spikesFrac > 0 && !defender.types.includes('ひこう')) {
            spikesDamage = Math.floor(hpReal * spikesFrac);
        }
        
        let weatherFixedDamage = 0;
        if (fieldWeather === 'sand' && !defender.types.includes('いわ') && !defender.types.includes('じめん') && !defender.types.includes('はがね')) {
            weatherFixedDamage = Math.floor(hpReal * 0.0625);
        } else if (fieldWeather === 'snow' && !defender.types.includes('こおり')) {
            weatherFixedDamage = Math.floor(hpReal * 0.0625);
        }

        let terrainFixedDamage = 0;
        if (fieldTerrain === 'grassy' && isDefGrounded) {
            terrainFixedDamage = -Math.floor(hpReal * 0.0625); // Healing at end of turn
        }

        const statusFrac = parseFloat(document.getElementById('def-status').value) || 0;
        const otherFrac = parseFloat(document.getElementById('def-other-dmg').value) || 0;
        
        const fixedDamage = stealthRockDamage 
            + spikesDamage
            + weatherFixedDamage
            + terrainFixedDamage
            + Math.floor(hpReal * statusFrac) 
            + Math.floor(hpReal * otherFrac);
            
        const fixedDamagePercent = (fixedDamage / hpReal) * 100;
        
        const finalMinPercent = Math.max(0, (parseFloat(minPercent) + fixedDamagePercent)).toFixed(1);
        const finalMaxPercent = Math.max(0, (parseFloat(maxPercent) + fixedDamagePercent)).toFixed(1);

        // Update UI
        const isFoulPlay = move.name === 'イカサマ';
        document.getElementById('attacker-real-stats').innerHTML = `
            <span style="color:var(--text-muted);">▶ 種族値(${move.category}):</span> <strong style="color:white; font-size:1.3em;">${atkBase}</strong> 
            <span style="margin: 0 6px; color: var(--glass-border);">|</span> 
            <span style="color:var(--text-muted);">最終実数${isFoulPlay?'(イカサマ)':''}:</span> <strong style="color:var(--accent-primary); font-size:1.4em;">${finalAtk}</strong>
        `;
        document.getElementById('defender-real-stats').innerHTML = `
            <span style="color:var(--text-muted);">▶ 種族値:</span> <span style="color:#a8b8d0;">[HP]</span> <strong style="color:white; font-size:1.3em;">${defender.stats.hp}</strong> <span style="color:#a8b8d0; margin-left:8px;">[防/特防]</span> <strong style="color:white; font-size:1.3em;">${defBase}</strong> 
            <br> 
            <span style="color:var(--text-muted); display:inline-block; margin-top:8px;">▶ 最終実数:</span> <strong style="color:var(--success); font-size:1.3em; margin-left:4px;">HP ${hpReal}</strong> <span style="color:var(--glass-border); margin: 0 4px;">/</span> <strong style="color:var(--accent-primary); font-size:1.3em;">防 ${defReal}</strong>
        `;

        const damagePercentage = document.getElementById('damage-percentage');
        const damageBar = document.getElementById('damage-bar');
        const damageDesc = document.getElementById('damage-description');

        if (fixedDamage !== 0) {
            damagePercentage.innerHTML = `${finalMinPercent}% - ${finalMaxPercent}% <span style="font-size:1rem; color:var(--text-muted);">(技単体: ${minPercent}%-${maxPercent}%)</span>`;
        } else {
            damagePercentage.innerText = `${finalMinPercent}% - ${finalMaxPercent}%`;
        }
        
        damageBar.style.width = `${Math.min(finalMaxPercent, 100)}%`;
        
        let hitText = '';
        if (parseFloat(finalMinPercent) >= 100) {
            damageBar.style.background = 'var(--danger)';
            hitText = '確定1発';
        } else if (parseFloat(finalMaxPercent) >= 100) {
            damageBar.style.background = 'var(--danger)';
            hitText = '乱数1発 <span style="font-size:0.9rem; color:var(--text-muted);">(確定2発)</span>';
        } else if (parseFloat(finalMinPercent) >= 50) {
            damageBar.style.background = '#ffeb3b';
            hitText = '確定2発';
        } else if (parseFloat(finalMaxPercent) >= 50) {
            damageBar.style.background = '#ffeb3b';
            hitText = '乱数2発 <span style="font-size:0.9rem; color:var(--text-muted);">(確定3発)</span>';
        } else if (parseFloat(finalMinPercent) >= 33.3) {
            damageBar.style.background = 'var(--success)';
            hitText = '確定3発';
        } else if (parseFloat(finalMaxPercent) >= 33.3) {
            damageBar.style.background = 'var(--success)';
            hitText = '乱数3発 <span style="font-size:0.9rem; color:var(--text-muted);">(確定4発)</span>';
        } else {
            damageBar.style.background = 'var(--success)';
            hitText = '乱数4発〜';
        }
        
        damageDesc.innerHTML = `<span style="font-size: 1.3rem; font-weight: bold; color: #fff; text-shadow: 0 0 10px rgba(255,255,255,0.3);">${hitText}</span>`;
        
        // Save state
        const stateToSave = {
            attackerId: currentAttackerId,
            defenderId: currentDefenderId,
            moveId: moveSelect.value,
            atkAp: document.getElementById('atk-ap').value,
            atkNature: document.getElementById('atk-nature').value,
            atkRank: document.getElementById('atk-rank').value,
            hpAp: document.getElementById('hp-ap').value,
            defAp: document.getElementById('def-ap').value,
            defNature: document.getElementById('def-nature').value,
            defAtkAp: document.getElementById('def-atk-ap').value,
            defAtkNature: document.getElementById('def-atk-nature').value,
            defAtkRank: document.getElementById('def-atk-rank').value,
            atkItem: document.getElementById('atk-item').value,
            defItem: document.getElementById('def-item').value,
            fieldWeather: document.getElementById('field-weather').value,
            fieldTerrain: document.getElementById('field-terrain').value,
            stealthRock: document.getElementById('def-stealth-rock').checked,
            defSpikes: document.getElementById('def-spikes').value,
            defStatus: document.getElementById('def-status').value,
            defOther: document.getElementById('def-other-dmg').value
        };
        localStorage.setItem('pokemon_champions_calc', JSON.stringify(stateToSave));
    };

    // Swap Functionality
    const swapBtn = document.getElementById('swap-btn');
    if (swapBtn) {
        swapBtn.addEventListener('click', () => {
            const tempId = currentAttackerId;
            currentAttackerId = currentDefenderId;
            currentDefenderId = tempId;
            
            const attackerIn = document.getElementById('attacker-input');
            const defenderIn = document.getElementById('defender-input');
            const tempName = attackerIn.value;
            attackerIn.value = defenderIn.value;
            defenderIn.value = tempName;
            
            populateMoves(); // This handles recalculation
        });
    }

    // Event Listeners for inputs
    const inputs = [
        'move-select', 
        'atk-ap', 'atk-nature', 'atk-rank', 'atk-item', 'atk-ability',
        'hp-ap', 'def-ap', 'def-nature', 'def-item', 'def-ability',
        'def-atk-ap', 'def-atk-nature', 'def-atk-rank',
        'field-weather', 'field-terrain', 'def-stealth-rock', 'def-spikes', 'def-status', 'def-other-dmg'
    ];
    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('change', calculateDamage);
            el.addEventListener('input', calculateDamage);
        }
    });


    // Database Rendering
    let currentSortColumn = 'id';
    let currentSortDirection = 'asc';

    window.handleSort = (column) => {
        if (currentSortColumn === column) {
            currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            currentSortColumn = column;
            currentSortDirection = column === 'id' ? 'asc' : 'desc';
        }
        renderDatabase(document.getElementById('search-input').value);
    };

    let currentTypeFilter = "";

    const typeButtons = document.querySelectorAll('.type-filter-btn');
    typeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            typeButtons.forEach(b => {
                b.style.opacity = '0.4';
                b.classList.remove('active');
                if(b.dataset.type === "") b.style.color = "var(--text-muted)";
            });
            
            const target = e.currentTarget;
            target.style.opacity = '1';
            target.classList.add('active');
            if(target.dataset.type === "") target.style.color = "var(--text-main)";

            currentTypeFilter = target.dataset.type;
            renderDatabase(document.getElementById('search-input').value);
        });
    });

    let activeType = '';
    let favorites = JSON.parse(localStorage.getItem('pokemon_champions_favorites') || '[]');

    window.toggleFavorite = (id, event) => {
        if (event) event.stopPropagation();
        const strId = String(id);
        const index = favorites.indexOf(strId);
        if (index === -1) {
            favorites.push(strId);
        } else {
            favorites.splice(index, 1);
        }
        localStorage.setItem('pokemon_champions_favorites', JSON.stringify(favorites));
        
        // Automatically re-render database to reflect UI
        renderDatabase(document.getElementById('search-input')?.value || '');
        
        // Update modal star if modal is open
        const modalStar = document.getElementById('modal-star');
        if (modalStar && modalStar.dataset.id === strId) {
            modalStar.innerHTML = favorites.includes(strId) ? '★' : '☆';
            modalStar.style.color = favorites.includes(strId) ? '#ffd700' : 'var(--text-muted)';
        }
    };

    const renderDatabase = (filter = "") => {
        const resultsContainer = document.getElementById('db-results');
        resultsContainer.innerHTML = "";
        
        const typeFilter = currentTypeFilter;
        
        const keywords = filter.toLowerCase().split(/[\s　]+/).filter(k => k);
        
        let filtered = POKEMON_DATA.filter(p => {
            if (typeFilter === 'favorite') {
                if (!favorites.includes(String(p.id))) return false;
            } else if (typeFilter && !p.types.includes(typeFilter)) {
                return false;
            }
            
            if (keywords.length === 0) return true;
            return keywords.every(kw => {
                const kwKatakana = hToK(kw);
                const kwRomaji = convertRomajiToKatakana(kw);
                return p.name.includes(kwKatakana) || p.name.includes(kwRomaji) || (p.nameEn && p.nameEn.toLowerCase().includes(kw));
            });
        });

        // Sorting
        filtered.sort((a, b) => {
            let valA, valB;
            if (currentSortColumn === 'id') { valA = a.id; valB = b.id; }
            else { valA = a.stats[currentSortColumn]; valB = b.stats[currentSortColumn]; }
            
            if (valA < valB) return currentSortDirection === 'asc' ? -1 : 1;
            if (valA > valB) return currentSortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        const getSortIndicator = (col) => {
            if (currentSortColumn === col) return currentSortDirection === 'asc' ? ' ▲' : ' ▼';
            return '<span style="color:var(--glass-border); font-size:0.8rem"> ▼</span>';
        };

        const tableHTML = `
            <div style="overflow-x: auto; width: 100%;">
                <table style="width: 100%; border-collapse: collapse; text-align: center; color: var(--text-main); font-size: 0.95rem;">
                    <thead>
                        <tr style="border-bottom: 2px solid var(--accent-primary);">
                            <th style="padding: 12px; cursor: pointer; text-align: left; user-select: none;" onclick="handleSort('id')">名前 ${getSortIndicator('id')}</th>
                            <th style="padding: 12px; cursor: pointer; user-select: none;" title="HP" onclick="handleSort('hp')">HP ${getSortIndicator('hp')}</th>
                            <th style="padding: 12px; cursor: pointer; user-select: none;" title="攻撃" onclick="handleSort('atk')">攻撃 ${getSortIndicator('atk')}</th>
                            <th style="padding: 12px; cursor: pointer; user-select: none;" title="防御" onclick="handleSort('def')">防御 ${getSortIndicator('def')}</th>
                            <th style="padding: 12px; cursor: pointer; user-select: none;" title="特攻" onclick="handleSort('spa')">特攻 ${getSortIndicator('spa')}</th>
                            <th style="padding: 12px; cursor: pointer; user-select: none;" title="特防" onclick="handleSort('spd')">特防 ${getSortIndicator('spd')}</th>
                            <th style="padding: 12px; cursor: pointer; user-select: none;" title="素早さ" onclick="handleSort('spe')">素早 ${getSortIndicator('spe')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filtered.map(p => `
                            <tr class="db-pokemon-row" data-id="${p.id}" style="border-bottom: 1px solid var(--glass-border); transition: background 0.2s; cursor: pointer;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='transparent'">
                                <td style="padding: 10px; text-align: left; display: flex; align-items: center; gap: 0.8rem;">
                                    <div class="db-favorite-btn" data-id="${p.id}" style="font-size: 1.2rem; cursor: pointer; color: ${favorites.includes(String(p.id)) ? '#ffd700' : 'var(--text-muted)'}; padding: 0.2rem;">
                                        ${favorites.includes(String(p.id)) ? '★' : '☆'}
                                    </div>
                                    <img src="${p.imageUrl}" style="width: 48px; height: 48px; object-fit: contain;">
                                    <div>
                                        <div style="font-weight: 700; white-space: nowrap;">${p.name} <span style="font-size: 0.7rem; color: var(--text-muted); font-weight: normal;">#${p.id}</span></div>
                                        <div style="display: flex; gap: 0.25rem; margin-top: 0.2rem;">
                                            ${p.types.map(t => `<span class="type-badge ${t}" style="font-size: 0.6rem; padding: 2px 6px;">${t}</span>`).join('')}
                                        </div>
                                    </div>
                                </td>
                                <td style="padding: 10px; font-family: monospace; font-size: 1.1rem; ${currentSortColumn === 'hp' ? 'color: var(--accent-primary); font-weight: bold;' : ''}">${p.stats.hp}</td>
                                <td style="padding: 10px; font-family: monospace; font-size: 1.1rem; ${currentSortColumn === 'atk' ? 'color: var(--accent-primary); font-weight: bold;' : ''}">${p.stats.atk}</td>
                                <td style="padding: 10px; font-family: monospace; font-size: 1.1rem; ${currentSortColumn === 'def' ? 'color: var(--accent-primary); font-weight: bold;' : ''}">${p.stats.def}</td>
                                <td style="padding: 10px; font-family: monospace; font-size: 1.1rem; ${currentSortColumn === 'spa' ? 'color: var(--accent-primary); font-weight: bold;' : ''}">${p.stats.spa}</td>
                                <td style="padding: 10px; font-family: monospace; font-size: 1.1rem; ${currentSortColumn === 'spd' ? 'color: var(--accent-primary); font-weight: bold;' : ''}">${p.stats.spd}</td>
                                <td style="padding: 10px; font-family: monospace; font-size: 1.1rem; ${currentSortColumn === 'spe' ? 'color: var(--accent-primary); font-weight: bold;' : ''}">${p.stats.spe}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
        
        const wrapper = document.createElement('div');
        wrapper.className = 'card';
        wrapper.style.padding = '0.5rem';
        wrapper.innerHTML = tableHTML;
        
        // Event Delegation for Table Rows and Favorites
        wrapper.addEventListener('click', (e) => {
            const favBtn = e.target.closest('.db-favorite-btn');
            if (favBtn) {
                e.stopPropagation();
                if (typeof window.toggleFavorite === 'function') {
                    window.toggleFavorite(favBtn.dataset.id, e);
                }
                return;
            }
            
            const row = e.target.closest('.db-pokemon-row');
            if (row) {
                if (typeof window.showModal === 'function') {
                    window.showModal(row.dataset.id);
                }
            }
        });
        
        resultsContainer.appendChild(wrapper);
    };

    document.getElementById('search-input').addEventListener('input', (e) => {
        renderDatabase(e.target.value);
    });

    renderDatabase();

    // Initial calculation and Team display
    calculateDamage();
    window.renderTeamBuilder();

let trackerCardZIndex = 1500;

// Multiple Window Controller Functions (Draggable)
window.showModal = (id, opts) => {
    const prevSize = opts || {};
    const p = POKEMON_DATA.find(poke => String(poke.id) === String(id));
    if (!p) return;
    
    // Calculate total stats
    const total = p.stats.hp + p.stats.atk + p.stats.def + p.stats.spa + p.stats.spd + p.stats.spe;

    const cardId = 'tracker-card-' + Date.now();
    const existingCards = document.querySelectorAll('.floating-tracker-card').length;
    trackerCardZIndex++;

    const card = document.createElement('div');
    card.className = 'floating-tracker-card';
    card.id = cardId;
    
    const isMobile = window.innerWidth <= 768;
    const initTop = prevSize.top != null ? prevSize.top : (isMobile ? 10 : Math.min(100 + (existingCards * 30), window.innerHeight - 400));
    let initLeft = prevSize.left != null ? prevSize.left : (isMobile ? 10 : 250 + (existingCards * 30));
    // basic clamp to avoid going entirely off screen
    if(prevSize.left == null && initLeft > window.innerWidth - (isMobile ? 320 : 450)) initLeft = (isMobile ? 10 : 250);
    const initW = prevSize.width || (isMobile ? window.innerWidth - 20 : 380);
    const initH = prevSize.height || '';

    card.style.cssText = `
        position: fixed;
        top: ${initTop}px;
        left: ${initLeft}px;
        width: ${initW}px;
        ${initH ? 'height: ' + initH + 'px;' : 'max-height: 85vh;'}
        background: rgba(18, 22, 31, 0.96);
        border: 1px solid var(--neon-blue);
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.8);
        backdrop-filter: blur(12px);
        z-index: ${trackerCardZIndex};
        display: flex;
        flex-direction: column;
        overflow-y: hidden;
        overflow-x: hidden;
        min-width: 300px;
        min-height: 200px;
    `;

    // Internal UI building
    card.innerHTML = `
        <div class="drag-handle" style="padding: 10px 15px; background: rgba(0,0,0,0.6); border-bottom: 1px solid var(--glass-border); display: flex; justify-content: space-between; align-items: center; cursor: move;">
            <div style="font-size:0.85rem; color:var(--neon-blue); font-weight:bold;">${p.name} データベース詳細</div>
            <button class="close-card-btn" style="background:none; border:none; color:#a8b8d0; font-size:1.5rem; cursor:pointer; line-height:1; transition:color 0.2s;" onmouseover="this.style.color='#ff5959'" onmouseout="this.style.color='#a8b8d0'">×</button>
        </div>
        <div class="card-content" style="padding: 15px; overflow-y: auto;">
            <div class="modal-header" style="position:relative;">
                <img src="${p.imageUrl}" alt="${p.name}" style="width: 90px; height: 90px; object-fit: contain; filter: drop-shadow(0 0 10px rgba(0,210,255,0.4));">
                <div style="flex: 1;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <h2 style="margin: 0; font-size: 1.6rem; color: white;">${p.name} <span style="font-size: 0.9rem; color: var(--text-muted); font-weight: normal;">#${p.id}</span></h2>
                            <span class="card-star-btn" data-id="${p.id}" style="font-size: 1.4rem; cursor: pointer; color: ${favorites.includes(String(p.id)) ? '#ffd700' : 'var(--text-muted)'};">${favorites.includes(String(p.id)) ? '★' : '☆'}</span>
                        </div>
                        <button class="card-mega-btn" style="display:none; padding:4px 10px; font-size:0.8rem; font-weight:bold; background:linear-gradient(145deg, #bbaa66, #998844); border:1px solid #eedd99; border-radius:4px; color:white; cursor:pointer;" title="形態変化">ﾒｶﾞｼﾝｶ ✨</button>
                    </div>
                    <div style="display: flex; gap: 0.4rem; margin-bottom: 0.5rem;">
                        ${p.types.map(t => `<span class="type-badge ${t}" style="font-size: 0.7rem;">${t}</span>`).join('')}
                    </div>
                    <div style="font-size: 0.85rem; margin-top: 1rem; padding: 0.8rem; background: rgba(0,0,0,0.3); border-radius: 8px; border: 1px solid var(--glass-border);">
                        <div style="font-weight: bold; margin-bottom: 0.5rem; color: var(--text-main);">特性</div>
                        ${p.abilities.map(a => `
                            <div style="margin-bottom: 0.5rem;">
                                <span style="color: var(--accent-primary); font-weight: bold;">${a}</span>
                                <div style="color: var(--text-muted); font-size: 0.75rem; margin-top: 0.2rem; line-height: 1.3;">${typeof ABILITY_DATA !== 'undefined' && ABILITY_DATA[a] ? ABILITY_DATA[a] : '-'}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <div style="display: flex; gap: 0.8rem; margin-top: 1.5rem; margin-bottom: 0.5rem; width: 100%;">
                <button class="card-action-btn" data-action="set-attacker" data-id="${p.id}" style="flex: 1; padding: 0.6rem; background: linear-gradient(135deg, rgba(226, 75, 75, 0.8), rgba(226, 75, 75, 0.4)); border: 1px solid var(--glass-border); border-radius: 6px; color: white; display: flex; align-items: center; justify-content: center; gap: 0.4rem; cursor: pointer; font-weight: bold; font-size: 0.9rem; transition: background 0.2s;" onmouseover="this.style.background='rgba(226,75,75,0.9)';" onmouseout="this.style.background='linear-gradient(135deg, rgba(226, 75, 75, 0.8), rgba(226, 75, 75, 0.4))';">
                    <span>⚔️</span> 攻撃設定
                </button>
                <button class="card-action-btn" data-action="set-defender" data-id="${p.id}" style="flex: 1; padding: 0.6rem; background: linear-gradient(135deg, rgba(64, 104, 224, 0.8), rgba(64, 104, 224, 0.4)); border: 1px solid var(--glass-border); border-radius: 6px; color: white; display: flex; align-items: center; justify-content: center; gap: 0.4rem; cursor: pointer; font-weight: bold; font-size: 0.9rem; transition: background 0.2s;" onmouseover="this.style.background='rgba(64,104,224,0.9)';" onmouseout="this.style.background='linear-gradient(135deg, rgba(64, 104, 224, 0.8), rgba(64, 104, 224, 0.4))';">
                    <span>🛡️</span> 防御設定
                </button>
            </div>
            <div style="display: flex; gap: 0.8rem; margin-bottom: 1.2rem; width: 100%;">
                <button class="card-action-btn" data-action="add-to-team" data-id="${p.id}" style="flex: 1; padding: 0.6rem; background: linear-gradient(135deg, rgba(34, 193, 195, 0.6), rgba(253, 187, 45, 0.3)); border: 1px solid var(--glass-border); border-radius: 6px; color: white; display: flex; align-items: center; justify-content: center; gap: 0.4rem; cursor: pointer; font-weight: bold; font-size: 0.9rem; transition: background 0.2s;" onmouseover="this.style.background='linear-gradient(135deg, rgba(34, 193, 195, 0.9), rgba(253, 187, 45, 0.5))';" onmouseout="this.style.background='linear-gradient(135deg, rgba(34, 193, 195, 0.6), rgba(253, 187, 45, 0.3))';">
                    <span>➕</span> チーム編成に追加
                </button>
            </div>
            
            <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom: 0.8rem;">
                <h3 style="margin:0; font-size: 1rem; color: var(--text-main);">種族値 <span style="font-size:0.85rem; color: var(--accent-primary);">/ 合計: ${total}</span></h3>
                <button class="toggle-radar-btn" style="padding: 3px 8px; font-size: 0.75rem; background: rgba(0, 210, 255, 0.2); border: 1px solid var(--neon-blue); border-radius: 4px; color: var(--neon-blue); cursor: pointer; transition: 0.2s;">グラフ表示 ▼</button>
            </div>
            
            <div style="display: flex; flex-direction: column; align-items: center; background: rgba(0,0,0,0.3); border-radius: 8px; border: 1px solid var(--glass-border); padding: 0.8rem;">
                <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 0.4rem; width: 100%;">
                    <div style="background: rgba(255,255,255,0.05); padding: 0.4rem 0.7rem; border-radius: 4px; display: flex; flex-direction: column; align-items: center;"><span style="font-size: 0.75rem; color: #ff5959;">HP</span><span style="font-weight: bold; color: var(--text-main); font-size: 1.1rem;">${p.stats.hp}</span></div>
                    <div style="background: rgba(255,255,255,0.05); padding: 0.4rem 0.7rem; border-radius: 4px; display: flex; flex-direction: column; align-items: center;"><span style="font-size: 0.75rem; color: #f5ac78;">攻撃</span><span style="font-weight: bold; color: var(--text-main); font-size: 1.1rem;">${p.stats.atk}</span></div>
                    <div style="background: rgba(255,255,255,0.05); padding: 0.4rem 0.7rem; border-radius: 4px; display: flex; flex-direction: column; align-items: center;"><span style="font-size: 0.75rem; color: #fae078;">防御</span><span style="font-weight: bold; color: var(--text-main); font-size: 1.1rem;">${p.stats.def}</span></div>
                    <div style="background: rgba(255,255,255,0.05); padding: 0.4rem 0.7rem; border-radius: 4px; display: flex; flex-direction: column; align-items: center;"><span style="font-size: 0.75rem; color: #9db7f5;">特攻</span><span style="font-weight: bold; color: var(--text-main); font-size: 1.1rem;">${p.stats.spa}</span></div>
                    <div style="background: rgba(255,255,255,0.05); padding: 0.4rem 0.7rem; border-radius: 4px; display: flex; flex-direction: column; align-items: center;"><span style="font-size: 0.75rem; color: #a2db80;">特防</span><span style="font-weight: bold; color: var(--text-main); font-size: 1.1rem;">${p.stats.spd}</span></div>
                    <div style="background: rgba(255,255,255,0.05); padding: 0.4rem 0.7rem; border-radius: 4px; display: flex; flex-direction: column; align-items: center;"><span style="font-size: 0.75rem; color: #fa92b2;">素早</span><span style="font-weight: bold; color: var(--text-main); font-size: 1.1rem;">${p.stats.spe}</span></div>
                </div>
                <div id="radar-wrapper-${cardId}" style="width: 100%; max-width: 250px; height: 250px; display: none; margin-top: 1rem;">
                    <canvas id="radar-${cardId}"></canvas>
                </div>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:1.2rem; margin-bottom:0.6rem;">
                <h3 style="margin:0; font-size: 1rem; color: var(--text-main);">覚える技</h3>
                <div style="display:flex; gap:0.4rem;" class="card-move-filters">
                    <button class="card-mf active" data-filter="all" style="padding:4px 6px; font-size:0.7rem; background:var(--accent-primary); border:none; border-radius:4px; color:white; cursor:pointer; font-weight:bold;">すべて</button>
                    <button class="card-mf" data-filter="物理" style="padding:4px 6px; font-size:0.7rem; background:rgba(0,0,0,0.5); border:1px solid var(--glass-border); border-radius:4px; color:#e24b4b; cursor:pointer;">物理</button>
                    <button class="card-mf" data-filter="特殊" style="padding:4px 6px; font-size:0.7rem; background:rgba(0,0,0,0.5); border:1px solid var(--glass-border); border-radius:4px; color:#4068e0; cursor:pointer;">特殊</button>
                    <button class="card-mf" data-filter="変化" style="padding:4px 6px; font-size:0.7rem; background:rgba(0,0,0,0.5); border:1px solid var(--glass-border); border-radius:4px; color:#8899a6; cursor:pointer;">変化</button>
                </div>
            </div>
            <div style="flex: 1; min-height: 200px; overflow-y: auto; background: rgba(0,0,0,0.3); border-radius: 8px; border: 1px solid var(--glass-border);">
                <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: center;">
                    <thead style="position: sticky; top: 0; background: rgba(23, 27, 38, 0.95); z-index: 10; backdrop-filter: blur(5px);">
                        <tr>
                            <th style="padding: 0.5rem; border-bottom: 1px solid var(--glass-border); text-align: left;">技名</th>
                            <th style="padding: 0.5rem; border-bottom: 1px solid var(--glass-border);">タイプ</th>
                            <th style="padding: 0.5rem; border-bottom: 1px solid var(--glass-border);">威/命/P</th>
                        </tr>
                    </thead>
                    <tbody class="card-moves-tbody">
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    document.body.appendChild(card);

    // Draggable Logic
    const dragHandle = card.querySelector('.drag-handle');
    let isDragging = false;
    let startX, startY, initialX, initialY;

    card.addEventListener('mousedown', () => {
        trackerCardZIndex++;
        card.style.zIndex = trackerCardZIndex;
    });

    const toggleRadarBtn = card.querySelector('.toggle-radar-btn');
    const radarWrapper = card.querySelector(`#radar-wrapper-${cardId}`);
    toggleRadarBtn.addEventListener('click', () => {
        if (radarWrapper.style.display === 'none') {
            radarWrapper.style.display = 'block';
            toggleRadarBtn.innerText = 'グラフ非表示 ▲';
        } else {
            radarWrapper.style.display = 'none';
            toggleRadarBtn.innerText = 'グラフ表示 ▼';
        }
    });

    const startDrag = (e) => {
        isDragging = true;
        startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        startY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        const rect = card.getBoundingClientRect();
        initialX = rect.left;
        initialY = rect.top;
        document.body.style.userSelect = 'none';
        if (e.type === 'touchstart' && e.cancelable) {
            // allows scroll inside, but we disable default on handle to allow drag
        }
    };
    dragHandle.addEventListener('mousedown', startDrag);
    dragHandle.addEventListener('touchstart', startDrag, {passive: true});

    const onMove = (e) => {
        if (!isDragging) return;
        const cx = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const cy = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        const dx = cx - startX;
        const dy = cy - startY;
        card.style.left = `${initialX + dx}px`;
        card.style.top = `${initialY + dy}px`;
        if (e.type === 'touchmove') e.preventDefault(); // prevent scroll
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('touchmove', onMove, {passive: false});

    const onUp = () => {
        isDragging = false;
        isEdgeResizing = false;
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
    };
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchend', onUp);

    // Edge Resize Logic (all edges + corners)
    const EDGE_SIZE = 6;
    let isEdgeResizing = false;
    let resizeEdge = '';
    let resizeStartX, resizeStartY, resizeStartW, resizeStartH, resizeStartLeft, resizeStartTop;

    const onEdgeMoveHover = (e) => {
        if (isEdgeResizing || isDragging || e.type.includes('touch')) return;
        const cx = e.clientX;
        const cy = e.clientY;
        const rect = card.getBoundingClientRect();
        const x = cx - rect.left;
        const y = cy - rect.top;
        const w = rect.width;
        const h = rect.height;
        let cursor = '';
        if (y < EDGE_SIZE && x < EDGE_SIZE) cursor = 'nw-resize';
        else if (y < EDGE_SIZE && x > w - EDGE_SIZE) cursor = 'ne-resize';
        else if (y > h - EDGE_SIZE && x < EDGE_SIZE) cursor = 'sw-resize';
        else if (y > h - EDGE_SIZE && x > w - EDGE_SIZE) cursor = 'se-resize';
        else if (y < EDGE_SIZE) cursor = 'n-resize';
        else if (y > h - EDGE_SIZE) cursor = 's-resize';
        else if (x < EDGE_SIZE) cursor = 'w-resize';
        else if (x > w - EDGE_SIZE) cursor = 'e-resize';
        card.style.cursor = cursor || '';
    };
    card.addEventListener('mousemove', onEdgeMoveHover);

    const onEdgeStart = (e) => {
        const cx = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const cy = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        const rect = card.getBoundingClientRect();
        const x = cx - rect.left;
        const y = cy - rect.top;
        const w = rect.width;
        const h = rect.height;
        let edge = '';
        if (y < EDGE_SIZE && x < EDGE_SIZE) edge = 'nw';
        else if (y < EDGE_SIZE && x > w - EDGE_SIZE) edge = 'ne';
        else if (y > h - EDGE_SIZE && x < EDGE_SIZE) edge = 'sw';
        else if (y > h - EDGE_SIZE && x > w - EDGE_SIZE) edge = 'se';
        else if (y < EDGE_SIZE) edge = 'n';
        else if (y > h - EDGE_SIZE) edge = 's';
        else if (x < EDGE_SIZE) edge = 'w';
        else if (x > w - EDGE_SIZE) edge = 'e';
        if (!edge) return;
        if(e.cancelable) e.preventDefault();
        e.stopPropagation();
        isEdgeResizing = true;
        resizeEdge = edge;
        resizeStartX = cx;
        resizeStartY = cy;
        resizeStartW = rect.width;
        resizeStartH = rect.height;
        resizeStartLeft = rect.left;
        resizeStartTop = rect.top;
        document.body.style.userSelect = 'none';
    };
    card.addEventListener('mousedown', onEdgeStart);
    card.addEventListener('touchstart', onEdgeStart, {passive: false});

    const onEdgeMove = (e) => {
        if (!isEdgeResizing) return;
        const cx = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const cy = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        const dx = cx - resizeStartX;
        const dy = cy - resizeStartY;
        if (resizeEdge.includes('e')) card.style.width = Math.max(300, resizeStartW + dx) + 'px';
        if (resizeEdge.includes('s')) { card.style.height = Math.max(200, resizeStartH + dy) + 'px'; card.style.maxHeight = 'none'; }
        if (resizeEdge.includes('w')) { const nw = Math.max(300, resizeStartW - dx); card.style.width = nw + 'px'; card.style.left = (resizeStartLeft + resizeStartW - nw) + 'px'; }
        if (resizeEdge.includes('n')) { const nh = Math.max(200, resizeStartH - dy); card.style.height = nh + 'px'; card.style.maxHeight = 'none'; card.style.top = (resizeStartTop + resizeStartH - nh) + 'px'; }
        if (e.cancelable) e.preventDefault(); // prevent scroll
    };
    document.addEventListener('mousemove', onEdgeMove);
    document.addEventListener('touchmove', onEdgeMove, {passive: false});

    // Close logic
    card.querySelector('.close-card-btn').addEventListener('click', () => {
        card.remove();
    });

    // Favorite toggle logic matching primary UI
    const starBtn = card.querySelector('.card-star-btn');
    starBtn.addEventListener('click', (e) => {
        const id = Number(e.target.dataset.id);
        if (typeof window.toggleFavorite === 'function') window.toggleFavorite(id, e);
        starBtn.innerText = favorites.includes(String(id)) ? '★' : '☆';
        starBtn.style.color = favorites.includes(String(id)) ? '#ffd700' : 'var(--text-muted)';
    });

    // Setup Action Buttons
    card.querySelectorAll('.card-action-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = e.currentTarget.dataset.action;
            const tId = e.currentTarget.dataset.id;
            const tgtP = POKEMON_DATA.find(x => String(x.id) === String(tId));
            if (!tgtP) return;

            if (action === 'set-attacker') {
                currentAttackerId = tgtP.id;
                document.getElementById('attacker-input').value = tgtP.name;
                if(typeof populateMoves === 'function') populateMoves();
                document.querySelector('.tab-btn[data-tab="calc"]').click();
            } else if (action === 'set-defender') {
                currentDefenderId = tgtP.id;
                document.getElementById('defender-input').value = tgtP.name;
                if(typeof calculateDamage === 'function') calculateDamage();
                document.querySelector('.tab-btn[data-tab="calc"]').click();
            } else if (action === 'add-to-team') {
                const emptyIndex = currentTeam.findIndex(s => s === null);
                if (emptyIndex !== -1) {
                    currentTeam[emptyIndex] = { id: tgtP.id, hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0, nature: 'まじめ', ability: (tgtP.abilities && tgtP.abilities[0]) ? tgtP.abilities[0] : 'なし', item: '1.0', m1: 'なし', m2: 'なし', m3: 'なし', m4: 'なし' };
                    if(typeof window.saveTeam === 'function') window.saveTeam();
                    if(typeof window.renderTeamBuilder === 'function') window.renderTeamBuilder();
                    document.querySelector('.tab-btn[data-tab="builder"]').click();
                } else {
                    alert("チームが満杯です！");
                }
            }
        });
    });

    // Setup Mega Button logic
    const megaBtn = card.querySelector('.card-mega-btn');
    const bName = p.name.replace(/^(メガ|ゲンシ)/, '').replace(/[ＸＹXY]$/, '').replace(/\s*\(.*?\)/, '');
    const localForms = POKEMON_DATA.filter(x => {
         const rx = x.name.replace(/^(メガ|ゲンシ)/, '').replace(/[ＸＹXY]$/, '').replace(/\s*\(.*?\)/, '');
         return rx === bName && (x.name === bName || x.name.includes('メガ') || x.name.includes('ゲンシ'));
    });
    const megas = localForms.filter(f => f.name.includes('メガ') || f.name.includes('ゲンシ'));
    const baseF = localForms.find(f => !f.name.includes('メガ') && !f.name.includes('ゲンシ')) || localForms[0];
    if (megas.length > 0) {
         megaBtn.style.display = 'block';
         const cycle = [baseF, ...megas].filter(x => x);
         const cIdx = cycle.findIndex(c => String(c.id) === String(p.id));
         const nextIdx = (cIdx + 1) % cycle.length;
         const nextForm = cycle[nextIdx];
         if (cIdx === 0) {
             megaBtn.innerText = 'ﾒｶﾞｼﾝｶ ✨';
         } else {
             megaBtn.innerText = nextIdx === 0 ? '元に戻す ↩️' : '別の形態 🔄';
             megaBtn.style.background = nextIdx === 0 ? 'linear-gradient(145deg, #556677, #445566)' : 'linear-gradient(145deg, #a666bb, #8a4499)';
             megaBtn.style.borderColor = nextIdx === 0 ? '#8899aa' : '#cc99dd';
         }
         megaBtn.onclick = () => {
             const rect = card.getBoundingClientRect();
             const savedSize = { width: rect.width, height: rect.height, top: rect.top, left: rect.left };
             card.remove();
             window.showModal(nextForm.id, savedSize);
         };
    }

    // Move List Generation inside Card
    const tbody = card.querySelector('.card-moves-tbody');
    const myMoves = (typeof window.getMovesForPokemon === 'function' && window.getMovesForPokemon(p.name)) ? [...window.getMovesForPokemon(p.name)] : [];
    
    const renderCardMoves = (filterCat) => {
        let mappedMoves = myMoves.map(m => MOVES_DICT[m]).filter(x => x);
        if (filterCat !== 'all') mappedMoves = mappedMoves.filter(x => x.category === filterCat);
        
        mappedMoves.sort((mvA, mvB) => {
            const w = {'物理': 1, '特殊': 2, '変化': 3};
            const catA = w[mvA.category] || 4; const catB = w[mvB.category] || 4;
            if(catA !== catB) return catA - catB;
            return (mvA.name || '').localeCompare(mvB.name || '');
        });
        
        tbody.innerHTML = mappedMoves.length > 0 ? mappedMoves.map(mv => {
            const tMap = {'ノ':'ノーマル','炎':'ほのお','水':'みず','草':'くさ','電':'でんき','氷':'こおり','格':'かくとう','毒':'どく','地':'じめん','飛':'ひこう','エ':'エスパー','虫':'むし','岩':'いわ','ゴ':'ゴースト','ド':'ドラゴン','悪':'あく','鋼':'はがね','妖':'フェアリー'};
            const fullType = tMap[mv.type] || mv.type;
            let catBg = mv.category === '物理' ? '#e24b4b' : (mv.category === '特殊' ? '#4068e0' : '#8899a6');
            let catText = mv.category;
            return `
                <tr style="border-bottom: 1px solid var(--glass-border); transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='transparent'" title="${mv.desc || '説明なし'}">
                    <td style="padding: 0.5rem; text-align: left; font-weight: bold; color: var(--text-main); font-size: 0.9rem; line-height:1.2;">
                        ${mv.name}
                        <div style="font-size:0.7rem; color:#8899a6; margin-top:2px; font-weight:normal;">${mv.desc || ''}</div>
                    </td>
                    <td style="padding: 0.5rem;"><span class="type-badge ${fullType}" style="font-size: 0.7rem; padding: 2px 5px; display: inline-block;">${fullType}</span></td>
                    <td style="padding: 0.5rem; font-size: 0.9rem; color: var(--text-muted); font-weight: bold; white-space: nowrap;">
                        <span style="color:${catBg}; font-size:0.75rem; margin-right: 4px; border: 1px solid ${catBg}; padding: 1px 4px; border-radius: 4px;">${catText}</span>
                        ${mv.power||'-'}/${mv.acc||'-'}/${mv.pp}
                    </td>
                </tr>
            `;
        }).join('') : '<tr><td colspan="3" style="padding: 1rem;">該当する技がありません</td></tr>';
    };
    
    renderCardMoves('all');
    
    card.querySelectorAll('.card-mf').forEach(tab => {
        tab.addEventListener('click', (e) => {
            card.querySelectorAll('.card-mf').forEach(t => {
                t.style.background = 'rgba(0,0,0,0.5)';
                t.style.border = '1px solid var(--glass-border)';
                t.style.fontWeight = 'normal';
            });
            const t = e.currentTarget;
            t.style.background = 'var(--accent-primary)';
            t.style.color = 'white';
            t.style.fontWeight = 'bold';
            t.classList.add('active');
            renderCardMoves(t.dataset.filter);
        });
    });

    // Initialize Card Chart Map
    setTimeout(() => {
        const ctx = document.getElementById(`radar-${cardId}`).getContext('2d');
        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['HP', '攻撃', '防御', '素早さ', '特防', '特攻'],
                datasets: [{
                    label: '種族値',
                    data: [p.stats.hp, p.stats.atk, p.stats.def, p.stats.spe, p.stats.spd, p.stats.spa],
                    backgroundColor: 'rgba(0, 210, 255, 0.2)',
                    borderColor: 'rgba(0, 210, 255, 1)',
                    pointBackgroundColor: 'rgba(0, 210, 255, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(0, 210, 255, 1)',
                    borderWidth: 2,
                }]
            },
            options: {
                scales: {
                    r: {
                        min: 0, max: 200,
                        angleLines: { color: 'rgba(255, 255, 255, 0.2)' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)', lineWidth: 1 },
                        pointLabels: { color: 'rgba(255, 255, 255, 0.8)', font: { size: 10, family: "'Inter', sans-serif" } },
                        ticks: { display: false }
                    }
                },
                plugins: { legend: { display: false } },
                maintainAspectRatio: false
            }
        });
    }, 50);
};

window.closeModal = () => {
    // Keep a stub or remove overlapping instances if any exist in DOM as cleanup
    document.querySelectorAll('.floating-tracker-card').forEach(c => c.remove());
    const oldModal = document.getElementById('pokemon-modal');
    if(oldModal) oldModal.classList.remove('active');
};

// Team Builder Tab Interaction Delegate
document.getElementById('builder').addEventListener('click', (e) => {
    const clearTeamBtn = e.target.closest('#clear-team-btn');
    if (clearTeamBtn) {
        if(confirm("チーム編成を全てクリアしますか？")) {
            currentTeam = [null,null,null,null,null,null];
            window.saveTeam();
            window.renderTeamBuilder();
        }
        return;
    }
    
    const removeBtn = e.target.closest('.team-remove-btn');
    if (removeBtn) {
        if (!confirm("本当にこのポケモンをチームから外しますか？")) return;
        currentTeam[parseInt(removeBtn.dataset.index)] = null;
        window.saveTeam();
        window.renderTeamBuilder();
        return;
    }
    
    const setAtkBtn = e.target.closest('[data-action="set-from-team-atk"]');
    if (setAtkBtn) {
        e.stopPropagation();
        const tbData = currentTeam[parseInt(setAtkBtn.dataset.index)];
        if (tbData) {
            const p = POKEMON_DATA.find(poke => String(poke.id) === String(tbData.id));
            if (p) {
                currentAttackerId = p.id;
                document.getElementById('attacker-input').value = p.name;
                document.getElementById('hp-ap').value = tbData.hp;
                document.getElementById('atk-ap').value = tbData.atk;
                document.getElementById('atk-nature').value = tbData.nature;
                if(tbData.ability){
                    const sel = document.getElementById('atk-ability');
                    if(sel) {
                       sel.innerHTML = '';
                       sel.dataset.lastId = String(p.id);
                       (p.abilities && p.abilities.length > 0 ? p.abilities : ['（特性なし）']).forEach(a => sel.add(new Option(a, a)));
                       sel.add(new Option('なし', 'なし'));
                       sel.value = tbData.ability;
                    }
                }
                document.getElementById('atk-item').value = tbData.item || '1.0';
                // Currently only simple sets are mapped (UI expansion planned)
                if (typeof populateMoves === 'function') populateMoves();
                const calcTab = document.querySelector('.tab-btn[data-tab="calc"]');
                if (calcTab) calcTab.click();
            }
        }
        return;
    }

    const setDefBtn = e.target.closest('[data-action="set-from-team-def"]');
    if (setDefBtn) {
        e.stopPropagation();
        const tbData = currentTeam[parseInt(setDefBtn.dataset.index)];
        if (tbData) {
            const p = POKEMON_DATA.find(poke => String(poke.id) === String(tbData.id));
            if (p) {
                currentDefenderId = p.id;
                document.getElementById('defender-input').value = p.name;
                document.getElementById('def-ap').value = tbData.def; // Defense uses defensive EV usually but mapped as HP mapping in basic structure. HP is actually defAp logic in app! Wait, def-ap is HP AP in legacy? No, def-ap is 防御. HP is hp-ap on attacker side? Defender actually doesn't have an hp-ap slider! It relies solely on `HP` constant for def side currently.
                document.getElementById('def-nature').value = tbData.nature;
                document.getElementById('def-item').value = tbData.item || '1.0';
                if(tbData.ability){
                    const sel = document.getElementById('def-ability');
                    if(sel) {
                       sel.innerHTML = '';
                       sel.dataset.lastId = String(p.id);
                       (p.abilities && p.abilities.length > 0 ? p.abilities : ['（特性なし）']).forEach(a => sel.add(new Option(a, a)));
                       sel.add(new Option('なし', 'なし'));
                       sel.value = tbData.ability;
                    }
                }
                if (typeof calculateDamage === 'function') calculateDamage();
                const calcTab = document.querySelector('.tab-btn[data-tab="calc"]');
                if (calcTab) calcTab.click();
            }
        }
        return;
    }
});

}); // End of DOMContentLoaded listener

