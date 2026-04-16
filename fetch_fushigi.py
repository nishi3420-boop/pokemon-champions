import urllib.request
import re

url = 'https://gamewith.jp/pokemon-champions/553081'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req).read().decode('utf-8')

print("Fetching Gen 1:")
for match in re.finditer(r'<a[^>]+href="([^"]+)">([^<]+)</a>', html):
    if 'フシギバナ' in match.group(2):
        print(match.group(1), match.group(2))
