import re

file_path = r"C:\Users\nishi\Desktop\pokemon_champions\data\masterData.js"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update image paths to point to zukan_official
content = content.replace('assets/zukan/', 'assets/zukan_official/')

# 2. Type translation map
type_map = {
    "Normal": "ノーマル",
    "Fire": "ほのお",
    "Water": "みず",
    "Electric": "でんき",
    "Grass": "くさ",
    "Ice": "こおり",
    "Fighting": "かくとう",
    "Poison": "どく",
    "Ground": "じめん",
    "Flying": "ひこう",
    "Psychic": "エスパー",
    "Bug": "むし",
    "Rock": "いわ",
    "Ghost": "ゴースト",
    "Dragon": "ドラゴン",
    "Dark": "あく",
    "Steel": "はがね",
    "Fairy": "フェアリー"
}

# Translate types array in POKEMON_DATA
# e.g., types: ["Fire", "Flying"] -> types: ["ほのお", "ひこう"]
for en, jp in type_map.items():
    content = re.sub(rf'"{en}"', rf'"{jp}"', content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated masterData.js with Japanese types and official image paths.")
