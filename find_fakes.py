import json
import re

with open('gamewith_parsed.json', 'r', encoding='utf-8') as f:
    site_pkmn = json.load(f)
site_names = [p['name'].strip() for p in site_pkmn]

with open('data/masterData.js', 'r', encoding='utf-8') as f:
    text = f.read()

matches = re.finditer(r'\{"id":\s*(\d+),\s*"name":\s*"([^"]+)"', text)
master = [(int(m.group(1)), m.group(2)) for m in matches]

fake = []
for id_val, n in master:
    n_clean = n.replace('のすがた', '').replace(' ', '')
    found = False
    for sn in site_names:
        sn_clean = sn.replace('のすがた', '').replace(' ', '')
        if n_clean == sn_clean or n_clean in sn_clean or sn_clean in n_clean:
            found = True
            break
    if not found:
        fake.append(f"{id_val}: {n}")

with open('fake_out.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(fake))
