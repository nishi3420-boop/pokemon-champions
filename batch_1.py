import json
import os

# Data from browser subagent
batch_1_raw = [
  { "name": "フシギバナ", "hp": 80, "atk": 82, "def": 83, "spa": 100, "spd": 100, "spe": 80, "types": ["くさ", "どく"], "abilities": ["しんりょく", "ようりょくそ"] },
  { "name": "メガフシギバナ", "hp": 80, "atk": 100, "def": 123, "spa": 122, "spd": 120, "spe": 80, "types": ["くさ", "どく"], "abilities": ["あついしぼう"] },
  { "name": "リザードン", "hp": 78, "atk": 84, "def": 78, "spa": 109, "spd": 85, "spe": 100, "types": ["ほのお", "ひこう"], "abilities": ["もうか", "サンパワー"] },
  { "name": "メガリザードンＸ", "hp": 78, "atk": 130, "def": 111, "spa": 130, "spd": 85, "spe": 100, "types": ["ほのお", "ドラゴン"], "abilities": ["かたいツメ"] },
  { "name": "メガリザードンＹ", "hp": 78, "atk": 104, "def": 78, "spa": 159, "spd": 115, "spe": 100, "types": ["ほのお", "ひこう"], "abilities": ["ひでり"] },
  { "name": "カメックス", "hp": 79, "atk": 83, "def": 100, "spa": 85, "spd": 105, "spe": 78, "types": ["みず"], "abilities": ["げきりゅう", "あめうけざら"] },
  { "name": "メガカメックス", "hp": 79, "atk": 103, "def": 120, "spa": 135, "spd": 115, "spe": 78, "types": ["みず"], "abilities": ["メガランチャー"] },
  { "name": "スピアー", "hp": 65, "atk": 90, "def": 40, "spa": 45, "spd": 80, "spe": 75, "types": ["むし", "どく"], "abilities": ["むしのしらせ", "スナイパー"] },
  { "name": "メガスピアー", "hp": 65, "atk": 150, "def": 40, "spa": 15, "spd": 80, "spe": 145, "types": ["むし", "どく"], "abilities": ["てきおうりょく"] },
  { "name": "ピジョット", "hp": 83, "atk": 80, "def": 75, "spa": 70, "spd": 70, "spe": 101, "types": ["ノーマル", "ひこう"], "abilities": ["するどいめ", "ちどりあし", "はとむね"] },
  { "name": "メガピジョット", "hp": 83, "atk": 80, "def": 80, "spa": 135, "spd": 80, "spe": 121, "types": ["ノーマル", "ひこう"], "abilities": ["ノーガード"] },
  { "name": "アーボック", "hp": 60, "atk": 95, "def": 69, "spa": 65, "spd": 79, "spe": 80, "types": ["どく"], "abilities": ["いかく", "だっぴ", "きんちょうかん"] },
  { "name": "ピカチュウ", "hp": 35, "atk": 55, "def": 40, "spa": 50, "spd": 50, "spe": 90, "types": ["でんき"], "abilities": ["せいでんき", "ひらいしん"] },
  { "name": "ライチュウ", "hp": 60, "atk": 90, "def": 55, "spa": 90, "spd": 80, "spe": 110, "types": ["でんき"], "abilities": ["せいでんき", "ひらいしん"] },
  { "name": "ライチュウ (アローラのすがた)", "hp": 60, "atk": 85, "def": 50, "spa": 95, "spd": 85, "spe": 110, "types": ["でんき", "エスパー"], "abilities": ["サーフテール"] },
  { "name": "ピクシー", "hp": 95, "atk": 70, "def": 73, "spa": 95, "spd": 90, "spe": 60, "types": ["フェアリー"], "abilities": ["メロメロボディ", "マジックガード", "てんねん"] },
  { "name": "メガピクシー", "hp": 95, "atk": 80, "def": 93, "spa": 135, "spd": 110, "spe": 70, "types": ["フェアリー"], "abilities": ["マジックミラー"] },
  { "name": "キュウコン", "hp": 73, "atk": 76, "def": 75, "spa": 81, "spd": 100, "spe": 100, "types": ["ほのお"], "abilities": ["もらいび", "ひでり"] },
  { "name": "キュウコン (アローラのすがた)", "hp": 73, "atk": 67, "def": 75, "spa": 81, "spd": 100, "spe": 109, "types": ["こおり", "フェアリー"], "abilities": ["ゆきがくれ", "ゆきふらし"] },
  { "name": "ウインディ", "hp": 90, "atk": 110, "def": 80, "spa": 100, "spd": 80, "spe": 95, "types": ["ほのお"], "abilities": ["いかく", "もらいび", "せいぎのこころ"] },
  { "name": "ウインディ (ヒスイのすがた)", "hp": 95, "atk": 115, "def": 80, "spa": 95, "spd": 80, "spe": 90, "types": ["ほのお", "いわ"], "abilities": ["いかく", "もらいび", "いしあたま"] },
  { "name": "フーディン", "hp": 55, "atk": 50, "def": 45, "spa": 135, "spd": 95, "spe": 120, "types": ["エスパー"], "abilities": ["シンクロ", "せいしんりょく", "マジックガード"] },
  { "name": "メガフーディン", "hp": 55, "atk": 50, "def": 65, "spa": 175, "spd": 105, "spe": 150, "types": ["エスパー"], "abilities": ["トレース"] },
  { "name": "カイリキー", "hp": 90, "atk": 130, "def": 80, "spa": 65, "spd": 85, "spe": 55, "types": ["かくとう"], "abilities": ["こんじょう", "ノーガード", "ふくつのこころ"] },
  { "name": "ウツボット", "hp": 80, "atk": 105, "def": 65, "spa": 100, "spd": 70, "spe": 70, "types": ["くさ", "どく"], "abilities": ["ようりょくそ", "くいしんぼう"] },
  { "name": "メガウツボット", "hp": 80, "atk": 125, "def": 85, "spa": 135, "spd": 95, "spe": 70, "types": ["くさ", "どく"], "abilities": ["とびだすなかみ"] },
  { "name": "ヤドラン", "hp": 95, "atk": 75, "def": 110, "spa": 100, "spd": 80, "spe": 30, "types": ["みず", "エスパー"], "abilities": ["どんかん", "マイペース", "さいせいりょく"] },
  { "name": "メガヤドラン", "hp": 95, "atk": 75, "def": 180, "spa": 130, "spd": 80, "spe": 30, "types": ["みず", "エスパー"], "abilities": ["シェルアーマー"] },
  { "name": "ヤドラン (ガラルのすがた)", "hp": 95, "atk": 100, "def": 95, "spa": 100, "spd": 70, "spe": 30, "types": ["どく", "エスパー"], "abilities": ["クイックドロウ", "マイペース", "さいせいりょく"] },
  { "name": "ゲンガー", "hp": 60, "atk": 65, "def": 60, "spa": 130, "spd": 75, "spe": 110, "types": ["ゴースト", "どく"], "abilities": ["のろわれボディ"] },
  { "name": "メガゲンガー", "hp": 60, "atk": 65, "def": 80, "spa": 170, "spd": 95, "spe": 130, "types": ["ゴースト", "どく"], "abilities": ["かげふみ"] },
  { "name": "ガルーラ", "hp": 105, "atk": 95, "def": 80, "spa": 40, "spd": 80, "spe": 90, "types": ["ノーマル"], "abilities": ["はやおき", "きもったま", "せいしんりょく"] },
  { "name": "メガガルーラ", "hp": 105, "atk": 125, "def": 100, "spa": 60, "spd": 100, "spe": 100, "types": ["ノーマル"], "abilities": ["おやこあい"] },
  { "name": "スターミー", "hp": 60, "atk": 75, "def": 85, "spa": 100, "spd": 85, "spe": 115, "types": ["みず", "エスパー"], "abilities": ["はっこう", "しぜんかいふく", "アナライズ"] },
  { "name": "メガスターミー", "hp": 60, "atk": 100, "def": 105, "spa": 130, "spd": 105, "spe": 120, "types": ["みず", "エスパー"], "abilities": ["ちからもち"] },
  { "name": "カイロス", "hp": 65, "atk": 125, "def": 100, "spa": 55, "spd": 70, "spe": 85, "types": ["むし"], "abilities": ["かいりきバサミ", "かたやぶり", "じしんかじょう"] },
  { "name": "メガカイロス", "hp": 65, "atk": 155, "def": 120, "spa": 65, "spd": 90, "spe": 105, "types": ["むし", "ひこう"], "abilities": ["スカイスキン"] },
  { "name": "ケンタロス", "hp": 75, "atk": 100, "def": 95, "spa": 40, "spd": 70, "spe": 110, "types": ["ノーマル"], "abilities": ["いかく", "いかりのつぼ", "ちからずく"] },
  { "name": "ケンタロス (パルデアのすがた・コンバットしゅ)", "hp": 75, "atk": 110, "def": 105, "spa": 30, "spd": 70, "spe": 100, "types": ["かくとう"], "abilities": ["いかく", "いかりのつぼ", "はんすう"] },
  { "name": "ケンタロス (パルデアのすがた・ブレイズしゅ)", "hp": 75, "atk": 110, "def": 105, "spa": 30, "spd": 70, "spe": 100, "types": ["かくとう", "ほのお"], "abilities": ["いかく", "いかりのつぼ", "はんすう"] },
  { "name": "ケンタロス (パルデアのすがた・ウォーターしゅ)", "hp": 75, "atk": 110, "def": 105, "spa": 30, "spd": 70, "spe": 100, "types": ["かくとう", "みず"], "abilities": ["いかく", "いかりのつぼ", "はんすう"] },
  { "name": "ギャラドス", "hp": 95, "atk": 125, "def": 79, "spa": 60, "spd": 100, "spe": 81, "types": ["みず", "ひこう"], "abilities": ["いかく", "じしんかじょう"] },
  { "name": "メガギャラドス", "hp": 95, "atk": 155, "def": 109, "spa": 70, "spd": 130, "spe": 81, "types": ["みず", "あく"], "abilities": ["かたやぶり"] },
  { "name": "メタモン", "hp": 48, "atk": 48, "def": 48, "spa": 48, "spd": 48, "spe": 48, "types": ["ノーマル"], "abilities": ["じゅうなｎ", "かわりもの"] },
  { "name": "シャワーズ", "hp": 130, "atk": 65, "def": 60, "spa": 110, "spd": 95, "spe": 65, "types": ["みず"], "abilities": ["ちょすい", "うるおいボディ"] },
  { "name": "サンダース", "hp": 65, "atk": 65, "def": 60, "spa": 110, "spd": 95, "spe": 130, "types": ["でんき"], "abilities": ["ちくでん", "はやあし"] },
  { "name": "ブースター", "hp": 65, "atk": 130, "def": 60, "spa": 95, "spd": 110, "spe": 65, "types": ["ほのお"], "abilities": ["もらいび", "こんじょう"] },
  { "name": "プテラ", "hp": 80, "atk": 105, "def": 65, "spa": 60, "spd": 75, "spe": 130, "types": ["いわ", "ひこう"], "abilities": ["いしあたま", "プレッシャー", "きんちょうかん"] },
  { "name": "メガプテラ", "hp": 80, "atk": 135, "def": 85, "spa": 70, "spd": 95, "spe": 150, "types": ["いわ", "ひこう"], "abilities": ["かたいツメ"] },
  { "name": "カビゴン", "hp": 160, "atk": 110, "def": 65, "spa": 65, "spd": 110, "spe": 30, "types": ["ノーマル"], "abilities": ["めんえき", "あついしぼう", "くいしんぼう"] }
]

def map_data(raw):
    mapped = []
    for i, p in enumerate(raw):
        # Image path should match exactly the filename in assets/zukan_official
        # Mega forms in files seem to use full-width Ｘ and Ｙ for Charizard, but others might vary.
        # Let's check common patterns.
        img_name = p["name"] + ".png"
        
        entry = {
            "id": i + 1, # Using index for now, will refine
            "name": p["name"],
            "types": p["types"],
            "stats": {
                "hp": p["hp"],
                "atk": p["atk"],
                "def": p["def"],
                "spa": p["spa"],
                "spd": p["spd"],
                "spe": p["spe"]
            },
            "abilities": p["abilities"],
            "imageUrl": f"assets/zukan_official/{p['name']}.png"
        }
        mapped.append(entry)
    return mapped

mapped_batch = map_data(batch_1_raw)

# Constructing the JS content
js_output = "const POKEMON_DATA = [\n"
for entry in mapped_batch:
    js_output += f"    {json.dumps(entry, ensure_ascii=False)},\n"

# Adding the Gen 9 ones we had earlier if not in the list
# マスカーニャ, ソウブレイズ, デカヌチャン, キラフロル, メガキラフロル
# These were already in the file. I should probably merge them or just replace the whole thing with 278 eventually.
# For now, I'll just output the first 50.

# Save to a temporary file for inspection or direct use
with open("batch_1.js", "w", encoding="utf-8") as f:
    f.write(js_output + "];")
