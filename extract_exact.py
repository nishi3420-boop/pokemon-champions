import re

with open('gamewith.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find text inside <a> tags pointing to character pages, or <td> tags.
# GameWith actually lists Pokemon in tables.
td_names = re.findall(r'<td[^>]*>(?:<a[^>]*>)?(.*?)(?:</a>)?</td>', html)
alt_names = re.findall(r'alt="([^"]+)"', html)

names = []
for n in td_names + alt_names:
    n = re.sub(r'<[^>]+>', '', n).strip()
    # GameWith often adds 'アイコン' or 'のアイコン' or uses plain names
    n = n.replace('のアイコン', '').replace('アイコン', '').strip()
    if n and 1 < len(n) <= 15:
        # Ignore common non-pokemon words
        if any(w in n for w in ['ポケモン', 'トップページ', '一覧', 'ランキング', 'おすすめ', 'ダメージ', 'ホーム']):
            continue
        names.append(n)

# Unique preserve order
out = []
seen = set()
for n in names:
    if n not in seen:
        out.append(n)
        seen.add(n)

with open('site_pokemon.txt', 'w', encoding='utf-8') as f:
    for n in out:
        f.write(n + '\n')

print("Saved site_pokemon.txt")
