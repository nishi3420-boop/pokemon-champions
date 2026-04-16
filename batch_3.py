import json

batch_3_raw = [
  {"name": "ジュペッタ", "hp": 64, "atk": 115, "def": 65, "spa": 83, "spd": 63, "spe": 65, "types": ["ゴースト"], "abilities": ["ふみん", "おみとおし", "のろわれボディ"]},
  {"name": "メガジュペッタ", "hp": 64, "atk": 165, "def": 75, "spa": 93, "spd": 83, "spe": 75, "types": ["ゴースト"], "abilities": ["いたずらごころ"]},
  {"name": "チリーン", "hp": 75, "atk": 50, "def": 80, "spa": 95, "spd": 90, "spe": 65, "types": ["エスパー"], "abilities": ["ふゆう"]},
  {"name": "メガチリーン", "hp": 75, "atk": 50, "def": 110, "spa": 135, "spd": 120, "spe": 65, "types": ["エスパー", "はがね"], "abilities": ["ふゆう"]},
  {"name": "アブソル", "hp": 65, "atk": 130, "def": 60, "spa": 75, "spd": 60, "spe": 75, "types": ["あく"], "abilities": ["プレッシャー", "きょううん", "せいぎのこころ"]},
  {"name": "メガアブソル", "hp": 65, "atk": 150, "def": 60, "spa": 115, "spd": 60, "spe": 115, "types": ["あく"], "abilities": ["マジックミラー"]},
  {"name": "オニゴーリ", "hp": 80, "atk": 80, "def": 80, "spa": 80, "spd": 80, "spe": 80, "types": ["こおり"], "abilities": ["せいしんりょく", "アイスボディ", "ムラっけ"]},
  {"name": "メガオニゴーリ", "hp": 80, "atk": 120, "def": 80, "spa": 120, "spd": 80, "spe": 100, "types": ["こおり"], "abilities": ["フリーズスキン"]},
  {"name": "ドダイトス", "hp": 95, "atk": 109, "def": 105, "spa": 75, "spd": 85, "spe": 56, "types": ["くさ", "じめん"], "abilities": ["しんりょく", "シェルアーマー"]},
  {"name": "ゴウカザル", "hp": 76, "atk": 104, "def": 71, "spa": 104, "spd": 71, "spe": 108, "types": ["ほのお", "かくとう"], "abilities": ["もうか", "てつのこぶし"]},
  {"name": "エンペルト", "hp": 84, "atk": 86, "def": 88, "spa": 111, "spd": 101, "spe": 60, "types": ["みず", "はがね"], "abilities": ["げきりゅう", "かちき"]},
  {"name": "レントラー", "hp": 80, "atk": 120, "def": 79, "spa": 95, "spd": 79, "spe": 70, "types": ["でんき"], "abilities": ["とうそうしん", "いかく", "こんじょう"]},
  {"name": "ロズレイド", "hp": 60, "atk": 70, "def": 65, "spa": 125, "spd": 105, "spe": 90, "types": ["くさ", "どく"], "abilities": ["しぜんかいふく", "どくのトゲ", "テクニシャン"]},
  {"name": "ラムパルド", "hp": 97, "atk": 165, "def": 60, "spa": 65, "spd": 50, "spe": 58, "types": ["いわ"], "abilities": ["かたやぶり", "ちからずく"]},
  {"name": "トリデプス", "hp": 60, "atk": 52, "def": 168, "spa": 47, "spd": 138, "spe": 30, "types": ["いわ", "はがね"], "abilities": ["がんじょう", "ぼうおん"]},
  {"name": "ミミロップ", "hp": 65, "atk": 76, "def": 84, "spa": 54, "spd": 96, "spe": 105, "types": ["ノーマル"], "abilities": ["メロメロボディ", "ぶきよう", "じゅうなん"]},
  {"name": "メガミミロップ", "hp": 65, "atk": 136, "def": 94, "spa": 54, "spd": 96, "spe": 135, "types": ["ノーマル", "かくとう"], "abilities": ["きもったま"]},
  {"name": "ミカルゲ", "hp": 50, "atk": 92, "def": 108, "spa": 92, "spd": 108, "spe": 35, "types": ["ゴースト", "あく"], "abilities": ["プレッシャー", "すりぬけ"]},
  {"name": "ガブリアス", "hp": 108, "atk": 130, "def": 95, "spa": 80, "spd": 85, "spe": 102, "types": ["ドラゴン", "じめん"], "abilities": ["すながくれ", "さめはだ"]},
  {"name": "メガガブリアス", "hp": 108, "atk": 170, "def": 115, "spa": 120, "spd": 95, "spe": 92, "types": ["ドラゴン", "じめん"], "abilities": ["すなのちから"]},
  {"name": "ルカリオ", "hp": 70, "atk": 110, "def": 70, "spa": 115, "spd": 70, "spe": 90, "types": ["かくとう", "はがね"], "abilities": ["ふくつのこころ", "せいしんりょく", "せいぎのこころ"]},
  {"name": "メガルカリオ", "hp": 70, "atk": 145, "def": 88, "spa": 140, "spd": 70, "spe": 112, "types": ["かくとう", "はがね"], "abilities": ["てきおうりょく"]},
  {"name": "カバルドン", "hp": 108, "atk": 112, "def": 118, "spa": 68, "spd": 72, "spe": 47, "types": ["じめん"], "abilities": ["すなおこし", "すなのちから"]},
  {"name": "ドクロッグ", "hp": 83, "atk": 106, "def": 65, "spa": 86, "spd": 65, "spe": 85, "types": ["どく", "かくとう"], "abilities": ["きけんよち", "かんそうはだ", "どくしゅ"]},
  {"name": "ユキノオー", "hp": 90, "atk": 92, "def": 75, "spa": 92, "spd": 85, "spe": 60, "types": ["くさ", "こおり"], "abilities": ["ゆきふらし", "ぼうおん"]},
  {"name": "メガユキノオー", "hp": 90, "atk": 132, "def": 105, "spa": 132, "spd": 105, "spe": 30, "types": ["くさ", "こおり"], "abilities": ["ゆきふらし"]},
  {"name": "マニューラ", "hp": 70, "atk": 120, "def": 65, "spa": 45, "spd": 85, "spe": 125, "types": ["あく", "こおり"], "abilities": ["プレッシャー", "わるいてぐせ"]},
  {"name": "ドサイドン", "hp": 115, "atk": 140, "def": 130, "spa": 55, "spd": 55, "spe": 40, "types": ["じめん", "いわ"], "abilities": ["ひらいしん", "ハードロック", "すてみ"]},
  {"name": "リーフィア", "hp": 65, "atk": 110, "def": 130, "spa": 60, "spd": 65, "spe": 95, "types": ["くさ"], "abilities": ["リーフガード", "ようりょくそ"]},
  {"name": "グレイシア", "hp": 65, "atk": 60, "def": 110, "spa": 130, "spd": 95, "spe": 65, "types": ["こおり"], "abilities": ["ゆきがくれ", "アイスボディ"]},
  {"name": "グライオン", "hp": 75, "atk": 95, "def": 125, "spa": 45, "spd": 75, "spe": 95, "types": ["じめん", "ひこう"], "abilities": ["かいりきバサミ", "すながくれ", "ポイズンヒール"]},
  {"name": "マンムー", "hp": 110, "atk": 130, "def": 80, "spa": 70, "spd": 60, "spe": 80, "types": ["こおり", "じめん"], "abilities": ["どんかん", "ゆきがくれ", "あついしぼう"]},
  {"name": "エルレイド", "hp": 68, "atk": 125, "def": 65, "spa": 65, "spd": 115, "spe": 80, "types": ["エスパー", "かくとう"], "abilities": ["ふくつのこころ", "きれあじ", "せいぎのこころ"]},
  {"name": "メガエルレイド", "hp": 68, "atk": 165, "def": 95, "spa": 65, "spd": 115, "spe": 110, "types": ["エスパー", "かくとう"], "abilities": ["せいしんりょく"]},
  {"name": "ユキメノコ", "hp": 70, "atk": 80, "def": 70, "spa": 80, "spd": 70, "spe": 110, "types": ["こおり", "ゴースト"], "abilities": ["ゆきがくれ", "のろわれボディ"]},
  {"name": "メガユキメノコ", "hp": 70, "atk": 120, "def": 70, "spa": 120, "spd": 90, "spe": 110, "types": ["こおり", "ゴースト"], "abilities": ["きらめくころも"]},
  {"name": "ロトム", "hp": 50, "atk": 50, "def": 77, "spa": 95, "spd": 77, "spe": 91, "types": ["でんき", "ゴースト"], "abilities": ["ふゆう"]},
  {"name": "ヒートロトム", "hp": 50, "atk": 65, "def": 107, "spa": 105, "spd": 107, "spe": 86, "types": ["でんき", "ほのお"], "abilities": ["ふゆう"]},
  {"name": "ウォッシュロトム", "hp": 50, "atk": 65, "def": 107, "spa": 105, "spd": 107, "spe": 86, "types": ["でんき", "みず"], "abilities": ["ふゆう"]},
  {"name": "フロストロトム", "hp": 50, "atk": 65, "def": 107, "spa": 105, "spd": 107, "spe": 86, "types": ["でんき", "こおり"], "abilities": ["ふゆう"]},
  {"name": "スピンロトム", "hp": 50, "atk": 65, "def": 107, "spa": 105, "spd": 107, "spe": 86, "types": ["でんき", "ひこう"], "abilities": ["ふゆう"]},
  {"name": "カットロトム", "hp": 50, "atk": 65, "def": 107, "spa": 105, "spd": 107, "spe": 86, "types": ["でんき", "くさ"], "abilities": ["ふゆう"]},
  {"name": "ジャローダ", "hp": 75, "atk": 75, "def": 95, "spa": 75, "spd": 95, "spe": 113, "types": ["くさ"], "abilities": ["しんりょく", "あまのじゃく"]},
  {"name": "エンブオー", "hp": 110, "atk": 123, "def": 65, "spa": 110, "spd": 65, "spe": 65, "types": ["ほのお", "かくとう"], "abilities": ["もうか", "すてみ"]},
  {"name": "メガエンブオー", "hp": 110, "atk": 148, "def": 75, "spa": 110, "spd": 110, "spe": 75, "types": ["ほのお", "かくとう"], "abilities": ["かたやぶり"]},
  {"name": "ダイケンキ", "hp": 95, "atk": 100, "def": 85, "spa": 108, "spd": 70, "spe": 70, "types": ["みず"], "abilities": ["げきりゅう", "シェルアーマー"]},
  {"name": "ヒスイダイケンキ", "hp": 90, "atk": 108, "def": 80, "spa": 100, "spd": 65, "spe": 85, "types": ["みず", "あく"], "abilities": ["げきりゅう", "きれあじ"]},
  {"name": "ミルホッグ", "hp": 60, "atk": 85, "def": 69, "spa": 60, "spd": 69, "spe": 77, "types": ["ノーマル"], "abilities": ["はっこう", "するどいめ", "アナライズ"]},
  {"name": "レパルダス", "hp": 64, "atk": 88, "def": 50, "spa": 88, "spd": 50, "spe": 106, "types": ["あく"], "abilities": ["じゅうなん", "かるわざ", "いたずらごころ"]},
  {"name": "ヤナッキー", "hp": 75, "atk": 98, "def": 63, "spa": 98, "spd": 63, "spe": 101, "types": ["くさ"], "abilities": ["くいしんぼう", "しんりょく"]}
]

mapped_batch = []
for i, p in enumerate(batch_3_raw):
    entry = {
        "id": i + 101,
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

with open("batch_3.js", "w", encoding="utf-8") as f:
    f.write(js_output)
