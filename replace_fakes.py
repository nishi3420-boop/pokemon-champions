import json
import re

# Load site data
with open('gamewith_parsed.json', 'r', encoding='utf-8') as f:
    site_pkmn = json.load(f)

missing_names = ['ゴロンダ', 'ポワルン(ゆきぐものすがた)', 'フラージェス', 'ポワルン(あまみずのすがた)', 'トリミアン', 'ポワルン(たいようのすがた)']
missing_objs = []
for p in site_pkmn:
    if p['name'].strip() in missing_names:
        missing_objs.append(p)

fakes = ['クチート', 'メガクチート', 'イエッサン(オス)', 'イエッサン(メス)', 'タイレーツ']

# Load masterData
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
        # Replace the fake line with one or more missing objects
        while inserted_count < len(missing_objs):
            obj = missing_objs[inserted_count]
            inserted_count += 1
            # Format object to masterData style
            stats_str = f'{{"hp": {obj["hp"]}, "atk": {obj["atk"]}, "def": {obj["def"]}, "spa": {obj["spa"]}, "spd": {obj["spd"]}, "spe": {obj["spe"]}}}'
            types_str = '["???"]' # We need to give them types and abilities... 
            # Wait, our gamewith_parsed doesn't have types and abilities!
            # We will patch these specifically afterwards
            img_name = obj['name'].replace('(たいようのすがた)', ' (たいようのすがた)')\
                                  .replace('(あまみずのすがた)', ' (あまみずのすがた)')\
                                  .replace('(ゆきぐものすがた)', ' (ゆきぐものすがた)')
            
            line_str = f'    {{"id": 999, "name": "{obj["name"]}", "types": ["ノーマル"], "stats": {stats_str}, "abilities": ["ダミー"], "imageUrl": "assets/zukan_official/{img_name}.png"}},\n'
            new_lines.append(line_str)
            
            # If we replaced all 5 fakes and still have left over missings, we can just output the rest during the 5th replacement
            if inserted_count < len(missing_objs) and is_fake and fake == fakes[-1]:
                continue
            else:
                break
    else:
        new_lines.append(line)

with open('data/masterData.js', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
