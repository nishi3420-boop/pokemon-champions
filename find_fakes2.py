import json
import re

with open('gamewith_parsed.json', 'r', encoding='utf-8') as f:
    site_pkmn = json.load(f)
site_names = set([p['name'].strip() for p in site_pkmn])

with open('data/masterData.js', 'r', encoding='utf-8') as f:
    text = f.read()

matches = re.finditer(r'"name"\s*:\s*"([^"]+)"', text)
master_names = set([m.group(1).strip() for m in matches])

fakes = master_names - site_names

with open('fakes_out.utf8', 'w', encoding='utf-8') as f:
    for fk in fakes:
        f.write(fk + '\n')
