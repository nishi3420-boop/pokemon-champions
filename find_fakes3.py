import json, re

with open('gamewith_parsed.json', 'r', encoding='utf-8') as f: text = json.load(f)
site_names = [p['name'].strip() for p in text]

with open('data/masterData.js', 'r', encoding='utf-8') as f: mtext = f.read()
matches = re.finditer(r'"name"\s*:\s*"([^"]+)"', mtext)
master_names = [m.group(1).strip() for m in matches]

with open('fakes_fuzzy.utf8', 'w', encoding='utf-8') as f:
    for n in master_names:
        found = False
        # Do a lax match (e.g., if any of the site names contains the first 3 chars or vice versa)
        for s in site_names:
            clean_n = n.replace('メガ', '').replace('(オスのすがた)', '').replace('(メスのすがた)', '')
            clean_s = s.replace('メガ', '')
            if clean_n[:3] in clean_s or clean_s[:3] in clean_n:
                found = True
                break
        if not found:
            f.write(n + '\n')
