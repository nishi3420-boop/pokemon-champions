import json

batch_2_raw = [
  {"name": "カイリュー", "hp": 91, "atk": 134, "def": 95, "spa": 100, "spd": 100, "spe": 80, "types": ["ドラゴン", "ひこう"], "abilities": ["せいしんりょく", "マルチスケイル"]},
  {"name": "メガカイリュー", "hp": 91, "atk": 124, "def": 115, "spa": 145, "spd": 125, "spe": 100, "types": ["ドラゴン", "ひこう"], "abilities": ["マルチスケイル"]},
  {"name": "メガニウム", "hp": 80, "atk": 82, "def": 100, "spa": 83, "spd": 100, "spe": 80, "types": ["くさ"], "abilities": ["しんりょく", "リーフガード"]},
  {"name": "メガメガニウム", "hp": 80, "atk": 92, "def": 115, "spa": 143, "spd": 115, "spe": 80, "types": ["くさ", "フェアリー"], "abilities": ["メガソーラー"]},
  {"name": "バクフーン", "hp": 78, "atk": 84, "def": 78, "spa": 109, "spd": 85, "spe": 100, "types": ["ほのお"], "abilities": ["もうか", "もらいび"]},
  {"name": "ヒスイバクフーン", "hp": 73, "atk": 84, "def": 78, "spa": 119, "spd": 85, "spe": 95, "types": ["ほのお", "ゴースト"], "abilities": ["もうか", "おみとおし"]},
  {"name": "オーダイル", "hp": 85, "atk": 105, "def": 100, "spa": 79, "spd": 83, "spe": 78, "types": ["みず"], "abilities": ["げきりゅう", "ちからずく"]},
  {"name": "メガオーダイル", "hp": 85, "atk": 160, "def": 125, "spa": 89, "spd": 93, "spe": 78, "types": ["みず", "ドラゴン"], "abilities": ["ドラゴンスキン"]},
  {"name": "アリアドス", "hp": 70, "atk": 90, "def": 70, "spa": 60, "spd": 70, "spe": 40, "types": ["むし", "どく"], "abilities": ["むしのしらせ", "ふみん", "スナイパー"]},
  {"name": "デンリュウ", "hp": 90, "atk": 75, "def": 85, "spa": 115, "spd": 90, "spe": 55, "types": ["でんき"], "abilities": ["せいでんき", "プラス"]},
  {"name": "メガデンリュウ", "hp": 90, "atk": 95, "def": 105, "spa": 165, "spd": 110, "spe": 45, "types": ["でんき", "ドラゴン"], "abilities": ["かたやぶり"]},
  {"name": "マリルリ", "hp": 100, "atk": 50, "def": 80, "spa": 60, "spd": 80, "spe": 50, "types": ["みず", "フェアリー"], "abilities": ["あついしぼう", "ちからもち", "そうしょく"]},
  {"name": "ニョロトノ", "hp": 90, "atk": 75, "def": 75, "spa": 90, "spd": 100, "spe": 70, "types": ["みず"], "abilities": ["ちょすい", "しめりけ", "あめふらし"]},
  {"name": "エーフィ", "hp": 65, "atk": 65, "def": 60, "spa": 130, "spd": 95, "spe": 110, "types": ["エスパー"], "abilities": ["シンクロ", "マジックミラー"]},
  {"name": "ブラッキー", "hp": 95, "atk": 65, "def": 110, "spa": 60, "spd": 130, "spe": 65, "types": ["あく"], "abilities": ["シンクロ", "せいしんりょく"]},
  {"name": "ヤドキング", "hp": 95, "atk": 75, "def": 80, "spa": 100, "spd": 110, "spe": 30, "types": ["みず", "エスパー"], "abilities": ["どんかん", "マイペース", "さいせいりょく"]},
  {"name": "ガラルヤドキング", "hp": 95, "atk": 65, "def": 80, "spa": 110, "spd": 110, "spe": 30, "types": ["どく", "エスパー"], "abilities": ["きみょうなくすり", "マイペース", "さいせいりょく"]},
  {"name": "フォレトス", "hp": 75, "atk": 90, "def": 140, "spa": 60, "spd": 60, "spe": 40, "types": ["むし", "はがね"], "abilities": ["がんじょう", "ぼうじん"]},
  {"name": "ハガネール", "hp": 75, "atk": 85, "def": 200, "spa": 55, "spd": 65, "spe": 30, "types": ["はがね", "じめん"], "abilities": ["いしあたま", "がんじょう", "ちからずく"]},
  {"name": "メガハガネール", "hp": 75, "atk": 125, "def": 230, "spa": 55, "spd": 95, "spe": 30, "types": ["はがね", "じめん"], "abilities": ["すなのちから"]},
  {"name": "ハッサム", "hp": 70, "atk": 130, "def": 100, "spa": 55, "spd": 80, "spe": 65, "types": ["むし", "はがね"], "abilities": ["むしのしらせ", "テクニシャン", "ライトメタル"]},
  {"name": "メガハッサム", "hp": 70, "atk": 150, "def": 140, "spa": 65, "spd": 100, "spe": 75, "types": ["むし", "はがね"], "abilities": ["テクニシャン"]},
  {"name": "ヘラクロス", "hp": 80, "atk": 125, "def": 75, "spa": 40, "spd": 95, "spe": 85, "types": ["むし", "かくとう"], "abilities": ["むしのしらせ", "こんじょう", "じしんかじょう"]},
  {"name": "メガヘラクロス", "hp": 80, "atk": 185, "def": 115, "spa": 40, "spd": 105, "spe": 75, "types": ["むし", "かくとう"], "abilities": ["スキルリンク"]},
  {"name": "エアームド", "hp": 65, "atk": 80, "def": 140, "spa": 40, "spd": 70, "spe": 70, "types": ["はがね", "ひこう"], "abilities": ["するどいめ", "がんじょう", "くだけるよろい"]},
  {"name": "メガエアームド", "hp": 65, "atk": 140, "def": 110, "spa": 40, "spd": 100, "spe": 110, "types": ["はがね", "ひこう"], "abilities": ["すじがねいり"]},
  {"name": "ヘルガー", "hp": 75, "atk": 90, "def": 50, "spa": 110, "spd": 80, "spe": 95, "types": ["あく", "ほのお"], "abilities": ["はやおき", "もらいび", "きんちょうかん"]},
  {"name": "メガヘルガー", "hp": 75, "atk": 90, "def": 90, "spa": 140, "spd": 90, "spe": 115, "types": ["あく", "ほのお"], "abilities": ["サンパワー"]},
  {"name": "バンギラス", "hp": 100, "atk": 134, "def": 110, "spa": 95, "spd": 100, "spe": 61, "types": ["いわ", "あく"], "abilities": ["すなおこし", "きんちょうかん"]},
  {"name": "メガバンギラス", "hp": 100, "atk": 164, "def": 150, "spa": 95, "spd": 120, "spe": 71, "types": ["いわ", "あく"], "abilities": ["すなおこし"]},
  {"name": "ペリッパー", "hp": 60, "atk": 50, "def": 100, "spa": 95, "spd": 70, "spe": 65, "types": ["みず", "ひこう"], "abilities": ["するどいめ", "あめふらし", "あめうけざら"]},
  {"name": "サーナイト", "hp": 68, "atk": 65, "def": 65, "spa": 125, "spd": 115, "spe": 80, "types": ["エスパー", "フェアリー"], "abilities": ["シンクロ", "トレース", "テレパシー"]},
  {"name": "メガサーナイト", "hp": 68, "atk": 85, "def": 65, "spa": 165, "spd": 135, "spe": 100, "types": ["エスパー", "フェアリー"], "abilities": ["フェアリースキン"]},
  {"name": "ヤミラミ", "hp": 50, "atk": 75, "def": 75, "spa": 65, "spd": 65, "spe": 50, "types": ["あく", "ゴースト"], "abilities": ["するどいめ", "あとだし", "いたずらごころ"]},
  {"name": "メガヤミラミ", "hp": 50, "atk": 85, "def": 125, "spa": 85, "spd": 115, "spe": 20, "types": ["あく", "ゴースト"], "abilities": ["マジックミラー"]},
  {"name": "クチート", "hp": 50, "atk": 85, "def": 85, "spa": 55, "spd": 55, "spe": 50, "types": ["はがね", "フェアリー"], "abilities": ["かいりきばさみ", "いかく", "ちからずく"]},
  {"name": "メガクチート", "hp": 50, "atk": 105, "def": 125, "spa": 55, "spd": 95, "spe": 50, "types": ["はがね", "フェアリー"], "abilities": ["ちからもち"]},
  {"name": "ボスゴドラ", "hp": 70, "atk": 110, "def": 180, "spa": 60, "spd": 60, "spe": 50, "types": ["はがね", "いわ"], "abilities": ["いしあたま", "がんじょう", "ヘヴィメタル"]},
  {"name": "メガボスゴドラ", "hp": 70, "atk": 140, "def": 230, "spa": 60, "spd": 80, "spe": 50, "types": ["はがね"], "abilities": ["フィルター"]},
  {"name": "メディチャム", "hp": 60, "atk": 60, "def": 75, "spa": 60, "spd": 75, "spe": 80, "types": ["かくとう", "エスパー"], "abilities": ["ヨガパワー", "テレパシー"]},
  {"name": "メガメディチャム", "hp": 60, "atk": 100, "def": 85, "spa": 100, "spd": 85, "spe": 100, "types": ["かくとう", "エスパー"], "abilities": ["ヨガパワー"]},
  {"name": "サメハダー", "hp": 70, "atk": 120, "def": 40, "spa": 95, "spd": 40, "spe": 95, "types": ["みず", "あく"], "abilities": ["さめはだ", "かそく"]},
  {"name": "メガサメハダー", "hp": 70, "atk": 140, "def": 70, "spa": 110, "spd": 65, "spe": 105, "types": ["みず", "あく"], "abilities": ["がんじょうあご"]},
  {"name": "バクーダ", "hp": 70, "atk": 100, "def": 70, "spa": 105, "spd": 75, "spe": 40, "types": ["ほのお", "じめん"], "abilities": ["マグマのよろい", "ハードロック", "いかりのつぼ"]},
  {"name": "メガバクーダ", "hp": 70, "atk": 120, "def": 100, "spa": 145, "spd": 105, "spe": 20, "types": ["ほのお", "じめん"], "abilities": ["ちからずく"]},
  {"name": "コータス", "hp": 70, "atk": 85, "def": 140, "spa": 85, "spd": 70, "spe": 20, "types": ["ほのお"], "abilities": ["しろいけむり", "ひでり", "シェルアーマー"]},
  {"name": "チルタリス", "hp": 75, "atk": 70, "def": 90, "spa": 70, "spd": 105, "spe": 80, "types": ["ドラゴン", "ひこう"], "abilities": ["しぜんかいふく", "ノーてんき"]},
  {"name": "メガチルタリス", "hp": 75, "atk": 110, "def": 110, "spa": 110, "spd": 105, "spe": 80, "types": ["ドラゴン", "フェアリー"], "abilities": ["フェアリースキン"]},
  {"name": "ミロカロス", "hp": 95, "atk": 60, "def": 79, "spa": 100, "spd": 125, "spe": 81, "types": ["みず"], "abilities": ["ふしぎなうろこ", "かちき", "メロメロボディ"]},
  {"name": "ポワルン", "hp": 70, "atk": 70, "def": 70, "spa": 70, "spd": 70, "spe": 70, "types": ["ノーマル"], "abilities": ["てんきや"]}
]

mapped_batch = []
for i, p in enumerate(batch_2_raw):
    entry = {
        "id": i + 51,
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
    mapped_batch.append(entry)

js_output = ""
for entry in mapped_batch:
    js_output += f"    {json.dumps(entry, ensure_ascii=False)},\n"

with open("batch_2.js", "w", encoding="utf-8") as f:
    f.write(js_output)
