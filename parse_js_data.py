import re
import json

with open('gamewith.html', 'r', encoding='utf-8') as f:
    text = f.read()

# The JS block has {id:'123',idx:123,no:'123',n:'フシギバナ',st:'H-A-B-C-D-S',t1:'xx',t2:'yy',abs:'...'}
# Let's extract all pokemon objects from this JS variable
match = re.search(r'const\s+list\s*=\s*\[(.*?)\];', text, re.DOTALL)
if not match:
    # try another variable assignment
    match = re.search(r'window\.__data\s*=\s*\[(.*?)\];', text, re.DOTALL)

res = re.findall(r'\{([^{}]+)\}', text)
pkmn = []
for r in res:
    if "n:'" in r and "st:'" in r:
        n_match = re.search(r"n:'([^']+)'", r)
        st_match = re.search(r"st:'([\d\-]+)'", r)
        if n_match and st_match:
            name = n_match.group(1)
            stats = st_match.group(1).split('-')
            if len(stats) == 6:
                pkmn.append({
                    "name": name,
                    "hp": int(stats[0]),
                    "atk": int(stats[1]),
                    "def": int(stats[2]),
                    "spa": int(stats[3]),
                    "spd": int(stats[4]),
                    "spe": int(stats[5])
                })

with open("gamewith_parsed.json", "w", encoding="utf-8") as f:
    json.dump(pkmn, f, ensure_ascii=False, indent=2)

print("Saved", len(pkmn), "pokemon to gamewith_parsed.json")
