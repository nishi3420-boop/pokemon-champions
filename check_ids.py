import re

with open("data/masterData.js", "r", encoding="utf-8") as f:
    text = f.read()

ids = [int(i) for i in re.findall(r'"id"\s*:\s*(\d+)', text)]

print("Total registered length:", len(ids))
if ids:
    print("Max ID:", max(ids))
    missing = [i for i in range(1, 279) if i not in ids]
    print("Missing IDs:", missing)

    counts = {}
    for i in ids:
        counts[i] = counts.get(i, 0) + 1
    duplicates = [i for i, c in counts.items() if c > 1]
    if duplicates:
        print("Duplicate IDs:", duplicates)
