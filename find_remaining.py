import json

with open('gamewith_parsed.json', 'r', encoding='utf-8') as f:
    site_pkmn = json.load(f)

# read master file first 200 names
import re
with open("data/masterData.js", "r", encoding="utf-8") as f:
    text = f.read()

# match first 200 ids
matches = re.finditer(r'\{"id": (\d+), "name": "([^"]+)",([^}]+)\}', text)
master_first_200 = {}
for m in matches:
    id_val = int(m.group(1))
    if id_val <= 200:
        master_first_200[m.group(2)] = id_val

# find out who is missing from first 200.
missing = []
for p in site_pkmn:
    # try normalization
    n = p['name']
    if n not in master_first_200 and n.replace('アローラのすがた', 'アローラのすがた').replace('ー', 'ー') not in master_first_200:
        # Check if any variation is there
        found = False
        for mn in master_first_200.keys():
            if mn.replace(' ', '') == n.replace(' ', ''): found = True
        if not found:
            missing.append(n)

print("Remaining to add:", len(missing))

with open('missing_from_200.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(missing))
