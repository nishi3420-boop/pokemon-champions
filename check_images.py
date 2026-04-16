import os
import re

files = os.listdir('assets/zukan_official')

queries = ['バクフーン', 'ヤドキング', 'チャーレム', 'ロトム', 'ダイケンキ', 'ゾロアーク', 'マッギョ', 'フラエッテ', 'ニャオニクス', 'ギルガルド', 'ヌメルゴン', 'ヤバソチャ']

with open('image_names.utf8', 'w', encoding='utf-8') as f:
    for q in queries:
        matches = [m for m in files if q in m]
        f.write(f"{q} matches: {matches}\n")
