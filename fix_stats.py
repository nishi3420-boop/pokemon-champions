import json
import re

with open('gamewith_parsed.json', 'r', encoding='utf-8') as f:
    site_pkmn = json.load(f)

# Normalize names to match our internal representation to perform valid lookups
site_map = {}
for p in site_pkmn:
    # Handle the aliases we discovered
    n = p['name'].strip()
    if n == 'ガラルヤドラン': n = 'ヤドラン (ガラルのすがた)'
    elif n == 'メガリザードンY': n = 'メガリザードンＹ'
    elif n == 'アローラライチュウ': n = 'ライチュウ (アローラのすがた)'
    elif n == 'ギルガルド(シールドフォルム)': n = 'ギルガルド(シールド)'
    elif n == 'ギルガルド(ブレードフォルム)': n = 'ギルガルド(ブレード)'
    elif n == 'アローラキュウコン': n = 'キュウコン (アローラのすがた)'
    elif n == 'ヒスイウインディ': n = 'ウインディ (ヒスイのすがた)'
    elif n == 'イエッサン(オスのすがた)': n = 'イエッサン(オス)'
    elif n == 'イエッサン(メスのすがた)': n = 'イエッサン(メス)'
    elif n == 'パルデアケンタロス(かくとう)': n = 'ケンタロス (パルデアのすがた・コンバットしゅ)'
    elif n == 'パルデアケンタロス(ほのお)': n = 'ケンタロス (パルデアのすがた・ブレイズしゅ)'
    elif n == 'パルデアケンタロス(みず)': n = 'ケンタロス (パルデアのすがた・ウォーターしゅ)'
    elif n == 'メガリザードンX': n = 'メガリザードンＸ'
    
    site_map[n] = p

with open('data/masterData.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

mismatch_count = 0
for i, line in enumerate(lines):
    match = re.search(r'"name": "([^"]+)"', line)
    if not match: continue
    name = match.group(1)
    
    if name in site_map:
        sp = site_map[name]
        # Build the exact stats string that SHOULD exist from site data
        correct_stats = f'{{"hp": {sp["hp"]}, "atk": {sp["atk"]}, "def": {sp["def"]}, "spa": {sp["spa"]}, "spd": {sp["spd"]}, "spe": {sp["spe"]}}}'
        
        # Check current stats in line
        stats_match = re.search(r'"stats": (\{[^\}]+\})', line)
        if stats_match:
            current_stats = stats_match.group(1)
            # Remove spaces to compare effectively
            if current_stats.replace(' ', '') != correct_stats.replace(' ', ''):
                # Replace with correct stats
                new_line = line.replace(current_stats, correct_stats)
                lines[i] = new_line
                mismatch_count += 1

with open('data/masterData.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print(f"Fixed stats for {mismatch_count} Pokemon to perfectly match the official site!")
