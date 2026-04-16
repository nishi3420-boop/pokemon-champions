import json
with open('gamewith_parsed.json', 'r', encoding='utf-8') as f:
    text = json.load(f)
with open('next_goodra.utf8', 'w', encoding='utf-8') as f:
    for i, p in enumerate(text):
        if 'ヌメルゴン' in p['name']:
            f.write(f"{i}: {p['name']}\n")
            if i+1 < len(text):
                f.write(f"Next: {text[i+1]['name']}\n")
