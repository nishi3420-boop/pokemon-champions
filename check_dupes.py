import re
from collections import Counter

with open('data/masterData.js', 'r', encoding='utf-8') as f:
    text = f.read()

names = re.findall(r'"name"\s*:\s*"([^"]+)"', text)
c = Counter(names)
with open('dupes.utf8', 'w', encoding='utf-8') as f:
    for n, count in c.items():
        if count > 1:
            f.write(f"DUPLICATE: {n} ({count})\n")
