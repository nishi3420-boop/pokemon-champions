import json
import re

with open('data/masterData.js', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Names: メディチャム -> チャーレム
text = text.replace('"name": "メディチャム"', '"name": "チャーレム"')
text = text.replace('"name": "メガメディチャム"', '"name": "メガチャーレム"')
text = text.replace('メディチャム.png', 'チャーレム.png')
text = text.replace('メガメディチャム.png', 'メガチャーレム.png')

# 2. Image URL patches:
# Mapping of name OR bad imageURL substring to the exact correct filename
patches = {
    # Name mappings to exact filenames
    '"name": "バクフーン(ヒスイのすがた)"': 'imageUrl": "assets/zukan_official/バクフーン (ヒスイのすがた).png"',
    '"name": "ヒスイバクフーン"': 'imageUrl": "assets/zukan_official/バクフーン (ヒスイのすがた).png"',
    '"name": "ガラルヤドキング"': 'imageUrl": "assets/zukan_official/ヤドキング (ガラルのすがた).png"',
    '"name": "ヤドキング(ガラルのすがた)"': 'imageUrl": "assets/zukan_official/ヤドキング (ガラルのすがた).png"',
    
    '"name": "ロトム"': 'imageUrl": "assets/zukan_official/ロトム (ロトムのすがた).png"',
    '"name": "ヒートロトム"': 'imageUrl": "assets/zukan_official/ロトム (ヒートロトム).png"',
    '"name": "フロストロトム"': 'imageUrl": "assets/zukan_official/ロトム (フロストロトム).png"',
    '"name": "ウォッシュロトム"': 'imageUrl": "assets/zukan_official/ロトム (ウォッシュロトム).png"',
    '"name": "スピンロトム"': 'imageUrl": "assets/zukan_official/ロトム (スピンロトム).png"',
    '"name": "カットロトム"': 'imageUrl": "assets/zukan_official/ロトム (カットロトム).png"',
    
    '"name": "ダイケンキ(ヒスイのすがた)"': 'imageUrl": "assets/zukan_official/ダイケンキ (ヒスイのすがた).png"',
    '"name": "ヒスイダイケンキ"': 'imageUrl": "assets/zukan_official/ダイケンキ (ヒスイのすがた).png"',
    
    '"name": "ゾロアーク(ヒスイのすがた)"': 'imageUrl": "assets/zukan_official/ゾロアーク (ヒスイのすがた).png"',
    '"name": "ヒスイゾロアーク"': 'imageUrl": "assets/zukan_official/ゾロアーク (ヒスイのすがた).png"',
    
    '"name": "マッギョ(ガラルのすがた)"': 'imageUrl": "assets/zukan_official/マッギョ (ガラルのすがた).png"',
    '"name": "ガラルマッギョ"': 'imageUrl": "assets/zukan_official/マッギョ (ガラルのすがた).png"',
    
    '"name": "フラエッテ(えいえんのはな)"': 'imageUrl": "assets/zukan_official/フラエッテ (えいえんのはな).png"',
    
    '"name": "ニャオニクス(オス)"': 'imageUrl": "assets/zukan_official/ニャオニクス (オスのすがた).png"',
    '"name": "ニャオニクス(メス)"': 'imageUrl": "assets/zukan_official/ニャオニクス (メスのすがた).png"',
    '"name": "メガニャオニクス(オス)"': 'imageUrl": "assets/zukan_official/メガニャオニクス.png"',
    '"name": "メガニャオニクス(メス)"': 'imageUrl": "assets/zukan_official/メガニャオニクス.png"',
    
    '"name": "ギルガルド(シールド)"': 'imageUrl": "assets/zukan_official/ギルガルド (シールドフォルム).png"',
    '"name": "ギルガルド(ブレード)"': 'imageUrl": "assets/zukan_official/ギルガルド (ブレードフォルム).png"',
    
    '"name": "メガヌメルゴン"': 'imageUrl": "assets/zukan_official/メガヌメルゴン.png"',
    
    '"name": "ヤバソチャ"': 'imageUrl": "assets/zukan_official/ヤバソチャ (ケッサクのすがた).png"'
}

lines = text.split('\n')
for i, line in enumerate(lines):
    for key, correct_url in patches.items():
        if key in line:
            # regex replace the imageUrl part
            lines[i] = re.sub(r'imageUrl":\s*"[^"]+"', correct_url, lines[i])

new_text = '\n'.join(lines)

with open('data/masterData.js', 'w', encoding='utf-8') as f:
    f.write(new_text)

print("Patching complete!")
