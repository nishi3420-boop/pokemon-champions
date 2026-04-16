import re
import json

with open('gamewith.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Match something like: {id:'59',n:'しんりょく',tx:'HPが最大HPの...',aid:'555118'}
pattern = r"\{id:'\d+',n:'([^']+)',tx:'([^']+)'[^}]*\}"

matches = re.finditer(pattern, text)

ability_dict = {}
for m in matches:
    name = m.group(1).replace('　', ' ').strip()
    desc = m.group(2).replace('<br>', '').replace('。', '。<br>')  # nice formatting
    ability_dict[name] = desc

# Write to a js file to be included
with open('data/abilityData.js', 'w', encoding='utf-8') as f:
    f.write("const ABILITY_DATA = ")
    json.dump(ability_dict, f, ensure_ascii=False, indent=4)
    f.write(";")
