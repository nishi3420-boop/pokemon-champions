import json, re
with open('gamewith_parsed.json', 'r', encoding='utf-8') as f: site_pkmn = json.load(f)
with open('data/masterData.js', 'r', encoding='utf-8') as f: text = f.read()

site_names = [p['name'].strip() for p in site_pkmn]
matches = re.finditer(r'"name"\s*:\s*"([^"]+)"', text)
master_names = [m.group(1).strip() for m in matches]

alias_map = {
    'ヤドラン (ガラルのすがた)': 'ガラルヤドラン',
    'メガリザードンＹ': 'メガリザードンY',
    'ライチュウ (アローラのすがた)': 'アローラライチュウ',
    'ギルガルド(シールド)': 'ギルガルド(シールドフォルム)',
    'ギルガルド(ブレード)': 'ギルガルド(ブレードフォルム)',
    'キュウコン (アローラのすがた)': 'アローラキュウコン',
    'ウインディ (ヒスイのすがた)': 'ヒスイウインディ',
    'イエッサン(オス)': 'イエッサン(オスのすがた)',
    'ケンタロス (パルデアのすがた・コンバットしゅ)': 'パルデアケンタロス(かくとう)',
    'イエッサン(メス)': 'イエッサン(メスのすがた)',
    'ケンタロス (パルデアのすがた・ブレイズしゅ)': 'パルデアケンタロス(ほのお)',
    'メガリザードンＸ': 'メガリザードンX',
    'ケンタロス (パルデアのすがた・ウォーターしゅ)': 'パルデアケンタロス(みず)',
    'フラエッテ(えいえんのはな)': 'フラエッテ(えいえんのはな)'
}

translated_master = [alias_map.get(n, n) for n in master_names]
s_t = set(translated_master)
s_s = set(site_names)

fakes = s_t - s_s
missing = s_s - s_t

with open('report.txt', 'w', encoding='utf-8') as f:
    f.write(f"Total Site: {len(site_names)}\n")
    f.write(f"Total Master: {len(master_names)}\n")
    f.write(f"Fakes: {fakes}\n")
    f.write(f"Missing: {missing}\n")
