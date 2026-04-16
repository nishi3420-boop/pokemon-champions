import re

with open('gamewith.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Extract potential names from <td class="...">NAME</td> or alt="NAME"
# Let's extract everything inside <td>...</td>
tds = re.findall(r'<td[^>]*>(.*?)</td>', html)
alts = re.findall(r'alt="(.*?)"', html)
links = re.findall(r'<a[^>]*>(.*?)</a>', html)

names = []
def add_name(n):
    # clean tags
    n = re.sub(r'<[^>]+>', '', n).strip()
    if n and len(n) <= 15:
        names.append(n)

for t in tds: add_name(t)
for a in alts: add_name(a)
for l in links: add_name(l)

with open('extracted_names.txt', 'w', encoding='utf-8') as f:
    seen = set()
    for n in names:
        if n not in seen:
            f.write(n + '\n')
            seen.add(n)
