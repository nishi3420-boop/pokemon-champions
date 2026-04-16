import urllib.request, re

urls = [
    ("Meowscarada", "https://gamewith.jp/pokemon-champions/553397", "906"),
    ("Mega Glimmora", "https://gamewith.jp/pokemon-champions/554211", "970")
]

for name, url, pid in urls:
    try:
        html = urllib.request.urlopen(url).read().decode('utf-8')
        images = set(re.findall(r'<img[^>]+src="([^"]+)"', html))
        found = [img for img in images if pid in img or 'mega' in img.lower() or 'article_tools' in img]
        print(f"{name}:")
        for f in found:
            print(" -", f)
    except Exception as e:
        print(f"Failed {name}: {e}")
