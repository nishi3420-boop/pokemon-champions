import urllib.request
import json
import re

req = urllib.request.Request('https://gamewith.jp/pokemon-champions/546414')
req.add_header('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    match = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', html)
    if match:
        data = json.loads(match.group(1))
        with open('gamewith_data.json', 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print('Found NEXT_DATA')
    else:
        with open('gamewith.html', 'w', encoding='utf-8') as f:
            f.write(html)
        print('Saved to gamewith.html')
except Exception as e:
    print('Error:', e)
