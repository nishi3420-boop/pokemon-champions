import json

# Replace logic details
replacements = {
    'ゴロンダ': {'types': '["かくとう", "あく"]', 'abilities': '["てつのこぶし", "かたやぶり", "きもったま"]', 'img': 'ゴロンダ.png'},
    'ポワルン(ゆきぐものすがた)': {'types': '["こおり"]', 'abilities': '["てんきや"]', 'img': 'ポワルン (ゆきぐものすがた).png'},
    'ポワルン(あまみずのすがた)': {'types': '["みず"]', 'abilities': '["てんきや"]', 'img': 'ポワルン (あまみずのすがた).png'},
    'ポワルン(たいようのすがた)': {'types': '["ほのお"]', 'abilities': '["てんきや"]', 'img': 'ポワルン (たいようのすがた).png'},
    'トリミアン': {'types': '["ノーマル"]', 'abilities': '["ファーコート"]', 'img': 'トリミアン.png'},
    'フラージェス': {'types': '["フェアリー"]', 'abilities': '["フラワーベール", "きょうせい"]', 'img': 'フラージェス.png'}
}

with open('gamewith_parsed.json', 'r', encoding='utf-8') as f:
    site_pkmn = json.load(f)

# Extract stats
missing_objs = []
for p in site_pkmn:
    name = p['name'].strip()
    if name in replacements:
        obj = dict(replacements[name])
        obj['name'] = name
        obj['stats'] = f'{{"hp": {p["hp"]}, "atk": {p["atk"]}, "def": {p["def"]}, "spa": {p["spa"]}, "spd": {p["spd"]}, "spe": {p["spe"]}}}'
        missing_objs.append(obj)

fakes = ['クチート', 'メガクチート', 'イエッサン(オス)', 'イエッサン(メス)', 'タイレーツ']

with open('data/masterData.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
inserted_count = 0

for line in lines:
    is_fake = False
    for fake in fakes:
        if f'"name": "{fake}"' in line:
            is_fake = True
            break
    
    if is_fake:
        # One fake line can be replaced by 1 or more missing objects
        while inserted_count < len(missing_objs):
            obj = missing_objs[inserted_count]
            inserted_count += 1
            line_str = f'    {{"id": 999, "name": "{obj["name"]}", "types": {obj["types"]}, "stats": {obj["stats"]}, "abilities": {obj["abilities"]}, "imageUrl": "assets/zukan_official/{obj["img"]}"}},\n'
            new_lines.append(line_str)
            
            # If we haven't exhausted everything, but we reached the last Fake
            # we dump the remaining missing pokemon right here!
            if inserted_count < len(missing_objs) and is_fake and 'タイレーツ' in line:
                continue
            else:
                break
    else:
        new_lines.append(line)

# Re-index all IDs sequentially so they are perfectly 1-N mapped.
final_lines = []
current_id = 1
for line in new_lines:
    if '{"id":' in line:
        import re
        line = re.sub(r'"id": \d+', f'"id": {current_id}', line)
        current_id += 1
    final_lines.append(line)

with open('data/masterData.js', 'w', encoding='utf-8') as f:
    f.writelines(final_lines)
