import re

with open("data/masterData.js", "r", encoding="utf-8") as f:
    text = f.read()

master_names = re.findall(r'"name"\s*:\s*"([^"]+)"', text)

with open('site_pokemon.txt', 'r', encoding='utf-8') as f:
    site_names = [line.strip() for line in f if line.strip()]

site_names = [n for n in site_names if re.search(r'[ァ-ヶ]', n)]

master_set = set(master_names)
site_set = set(site_names)

missing = []
for n in site_names:
    if n not in master_set and n.split('(')[0] not in master_set and n.replace('のすがた', '') not in master_set:
        missing.append(n)

fake = []
for n in master_names:
    if n not in site_set and n.split('(')[0] not in site_set and n.replace('のすがた', '') not in site_set:
        fake.append(n)

with open('diff_out.txt', 'w', encoding='utf-8') as f:
    f.write('Missing:\n')
    f.write('\n'.join(missing[:50]) + '\n\n')
    f.write('Fake:\n')
    f.write('\n'.join(fake[:50]) + '\n')
