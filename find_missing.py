import json
import re

with open('gamewith_parsed.json', 'r', encoding='utf-8') as f:
    site_pkmn = json.load(f)
site_names = [p['name'].strip() for p in site_pkmn]

with open('data/masterData.js', 'r', encoding='utf-8') as f:
    text = f.read()

matches = re.finditer(r'"name"\s*:\s*"([^"]+)"', text)
master_names = [m.group(1).strip() for m in matches]

s1 = set(site_names)
s2 = set(master_names)

missing = s1 - s2

# Output nicely to text file
with open('missing_final.utf8', 'w', encoding='utf-8') as f:
    f.write('Missing from masterData but in site:\n')
    for m in missing:
        f.write(m + '\n')
