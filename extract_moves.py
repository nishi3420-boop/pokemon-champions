import re
import json

with open('gamewith.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Extract moveDatas
# Format: {id:'1',n:'10まんボルト',t:'でんき',c:'特殊',st:'90,100,16',tx:'10%の確率で...',aid:'554182'}
move_pattern = r"\{id:'(\d+)',n:'([^']+)',t:'([^']+)',c:'([^']+)',st:'([^']*)',tx:'([^']*)'[^\}]*\}"
moves_dict = {}

for m in re.finditer(move_pattern, text):
    mid = int(m.group(1))
    name = m.group(2).replace('　', ' ').strip()
    typ = m.group(3)
    cat = m.group(4).replace('', '') # Fix moji-bake if any. 物理, 特殊, 変化
    if '物' in cat: cat = '物理'
    elif '特' in cat: cat = '特殊'
    elif '変' in cat: cat = '変化'
    
    st_parts = m.group(5).split(',')
    power = st_parts[0] if len(st_parts) > 0 and st_parts[0] else '-'
    acc = st_parts[1] if len(st_parts) > 1 and st_parts[1] else '-'
    pp = st_parts[2] if len(st_parts) > 2 and st_parts[2] else '-'
    if power == '0': power = '-'
    if acc == '0': acc = '-'

    desc = m.group(6)
    
    moves_dict[mid] = {
        'name': name,
        'type': typ,
        'category': cat,
        'power': power,
        'acc': acc,
        'pp': pp,
        'desc': desc
    }

# 2. Extract pokemonDatas to map names back to move IDs
# Format: {id:'3',idx:300,aid:'553138',no:'0003',n:'フシギバナ',...,mvs:'156,198,256...'}
poke_pattern = r"\{id:'\d+',[^}]*n:'([^']+)'[^}]*mvs:'([\d,]+)'"

pokemon_moves = {}
for m in re.finditer(poke_pattern, text):
    name = m.group(1).replace('　', ' ').strip()
    mvs_str = m.group(2)
    mvs_list = [int(x) for x in mvs_str.split(',') if x]
    pokemon_moves[name] = mvs_list

# Generate JS module
with open('data/movesData.js', 'w', encoding='utf-8') as f:
    f.write('const MOVES_DICT = ')
    json.dump(moves_dict, f, ensure_ascii=False, indent=4)
    f.write(';\n\n')
    f.write('const POKEMON_MOVES = ')
    json.dump(pokemon_moves, f, ensure_ascii=False, indent=4)
    f.write(';\n')

print(f"Extracted {len(moves_dict)} moves.")
print(f"Mapped moves for {len(pokemon_moves)} pokemon.")
