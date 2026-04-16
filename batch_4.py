import json

batch_4_raw = [
  { "name": "バオッキー", "hp": 75, "atk": 98, "def": 63, "spa": 98, "spd": 63, "spe": 101, "types": ["ほのお"], "abilities": ["くいしんぼう", "もうか"] },
  { "name": "ヒヤッキー", "hp": 75, "atk": 98, "def": 63, "spa": 98, "spd": 63, "spe": 101, "types": ["みず"], "abilities": ["くいしんぼう", "げきりゅう"] },
  { "name": "ドリュウズ", "hp": 110, "atk": 135, "def": 60, "spa": 50, "spd": 65, "spe": 88, "types": ["じめん", "はがね"], "abilities": ["すなかき", "すなのちから", "かたやぶり"] },
  { "name": "メガドリュウズ", "hp": 110, "atk": 165, "def": 100, "spa": 65, "spd": 65, "spe": 103, "types": ["じめん", "はがね"], "abilities": ["かんつうドリル"] },
  { "name": "タブンネ", "hp": 103, "atk": 60, "def": 86, "spa": 60, "spd": 86, "spe": 50, "types": ["ノーマル"], "abilities": ["いやしのこころ", "さいせいりょく", "ぶきよう"] },
  { "name": "メガタブンネ", "hp": 103, "atk": 60, "def": 126, "spa": 80, "spd": 126, "spe": 50, "types": ["ノーマル", "フェアリー"], "abilities": ["いやしのこころ"] },
  { "name": "ローブシン", "hp": 105, "atk": 140, "def": 95, "spa": 55, "spd": 65, "spe": 45, "types": ["かくとう"], "abilities": ["こんじょう", "ちからずく", "てつのこぶし"] },
  { "name": "エルフーン", "hp": 60, "atk": 67, "def": 85, "spa": 77, "spd": 75, "spe": 116, "types": ["くさ", "フェアリー"], "abilities": ["いたずらごころ", "すりぬけ", "ようりょくそ"] },
  { "name": "ワルビアル", "hp": 95, "atk": 117, "def": 80, "spa": 65, "spd": 70, "spe": 92, "types": ["じめん", "あく"], "abilities": ["いかく", "じしんかじょう", "いかりのつぼ"] },
  { "name": "デスカーン", "hp": 58, "atk": 50, "def": 145, "spa": 95, "spd": 105, "spe": 30, "types": ["ゴースト"], "abilities": ["ミイラ"] },
  { "name": "ダストダス", "hp": 80, "atk": 95, "def": 82, "spa": 60, "spd": 82, "spe": 75, "types": ["どく"], "abilities": ["あくしゅう", "くだけるよろい", "ゆうばく"] },
  { "name": "ゾロアーク", "hp": 60, "atk": 105, "def": 60, "spa": 120, "spd": 60, "spe": 105, "types": ["あく"], "abilities": ["イリュージョン"] },
  { "name": "ヒスイゾロアーク", "hp": 55, "atk": 100, "def": 60, "spa": 125, "spd": 60, "spe": 110, "types": ["ノーマル", "ゴースト"], "abilities": ["イリュージョン"] },
  { "name": "ランクルス", "hp": 110, "atk": 65, "def": 75, "spa": 125, "spd": 85, "spe": 30, "types": ["エスパー"], "abilities": ["ぼうじん", "マジックガード", "さいせいりょく"] },
  { "name": "バイバニラ", "hp": 71, "atk": 95, "def": 85, "spa": 110, "spd": 95, "spe": 79, "types": ["こおり"], "abilities": ["アイスボディ", "ゆきふらし", "くだけるよろい"] },
  { "name": "エモンガ", "hp": 55, "atk": 75, "def": 60, "spa": 75, "spd": 60, "spe": 103, "types": ["でんき", "ひこう"], "abilities": ["せいでんき", "でんきエンジン"] },
  { "name": "シャンデラ", "hp": 60, "atk": 55, "def": 90, "spa": 145, "spd": 90, "spe": 80, "types": ["ゴースト", "ほのお"], "abilities": ["もらいび", "ほのおのからだ", "すりぬけ"] },
  { "name": "メガシャンデラ", "hp": 60, "atk": 55, "def": 90, "spa": 195, "spd": 110, "spe": 110, "types": ["ゴースト", "ほのお"], "abilities": ["マジックガード"] },
  { "name": "ツンベアー", "hp": 95, "atk": 130, "def": 80, "spa": 70, "spd": 80, "spe": 50, "types": ["こおり"], "abilities": ["ゆきがくれ", "ゆきかき", "びびり"] },
  { "name": "マッギョ", "hp": 109, "atk": 66, "def": 84, "spa": 81, "spd": 99, "spe": 32, "types": ["じめん", "でんき"], "abilities": ["せいでんき", "じなんき", "すながくれ"] },
  { "name": "ガラルマッギョ", "hp": 109, "atk": 81, "def": 99, "spa": 66, "spd": 84, "spe": 32, "types": ["じめん", "はがね"], "abilities": ["ぎじたい"] },
  { "name": "ゴルーグ", "hp": 89, "atk": 124, "def": 80, "spa": 55, "spd": 80, "spe": 55, "types": ["じめん", "ゴースト"], "abilities": ["てつのこぶし", "ぶきよう", "ノーガード"] },
  { "name": "メガゴルーグ", "hp": 89, "atk": 154, "def": 110, "spa": 55, "spd": 110, "spe": 65, "types": ["じめん", "ゴースト"], "abilities": ["せいしんりょく"] },
  { "name": "サザンドラ", "hp": 92, "atk": 105, "def": 90, "spa": 125, "spd": 90, "spe": 98, "types": ["あく", "ドラゴン"], "abilities": ["ふゆう"] },
  { "name": "ウルガモス", "hp": 85, "atk": 60, "def": 65, "spa": 135, "spd": 105, "spe": 100, "types": ["むし", "ほのお"], "abilities": ["ほのおのからだ", "むしのしらせ"] },
  { "name": "ブリガロン", "hp": 88, "atk": 107, "def": 122, "spa": 74, "spd": 75, "spe": 64, "types": ["くさ", "かくとう"], "abilities": ["しんりょく", "ぼうだん"] },
  { "name": "メガブリガロン", "hp": 88, "atk": 137, "def": 172, "spa": 74, "spd": 115, "spe": 44, "types": ["くさ", "かくとう"], "abilities": ["ぼうだん"] },
  { "name": "マフォクシー", "hp": 75, "atk": 69, "def": 72, "spa": 114, "spd": 100, "spe": 104, "types": ["ほのお", "エスパー"], "abilities": ["もうか", "マジシャン"] },
  { "name": "メガマフォクシー", "hp": 75, "atk": 69, "def": 72, "spa": 159, "spd": 125, "spe": 134, "types": ["ほのお", "エスパー"], "abilities": ["ふゆう"] },
  { "name": "ゲッコウガ", "hp": 72, "atk": 95, "def": 67, "spa": 103, "spd": 71, "spe": 122, "types": ["みず", "あく"], "abilities": ["げきりゅう", "へんげんじざい"] },
  { "name": "メガゲッコウガ", "hp": 72, "atk": 125, "def": 77, "spa": 133, "spd": 81, "spe": 142, "types": ["みず", "あく"], "abilities": ["へんげんじざい"] },
  { "name": "ホルード", "hp": 85, "atk": 56, "def": 77, "spa": 50, "spd": 77, "spe": 78, "types": ["ノーマル", "じめん"], "abilities": ["ものひろい", "ほおぶくろ", "ちからもち"] },
  { "name": "ファイアロー", "hp": 78, "atk": 81, "def": 71, "spa": 74, "spd": 69, "spe": 126, "types": ["ほのお", "ひこう"], "abilities": ["ほのおのからだ", "はやてのつばさ"] },
  { "name": "ビビヨン", "hp": 80, "atk": 52, "def": 50, "spa": 90, "spd": 50, "spe": 89, "types": ["むし", "ひこう"], "abilities": ["りんぷん", "ふくがん", "フレンドガード"] },
  { "name": "フラエッテ(えいえんのはな)", "hp": 74, "atk": 65, "def": 67, "spa": 125, "spd": 128, "spe": 92, "types": ["フェアリー"], "abilities": ["フラワーベール", "きょうせい"] },
  { "name": "ゴーゴート", "hp": 123, "atk": 100, "def": 62, "spa": 97, "spd": 81, "spe": 68, "types": ["くさ"], "abilities": ["そうしょく", "くさのけがわ"] },
  { "name": "ガメノデス", "hp": 72, "atk": 105, "def": 115, "spa": 54, "spd": 86, "spe": 68, "types": ["みず", "いわ"], "abilities": ["かたいツメ", "スナイパー", "わるいてぐせ"] },
  { "name": "ニャオニクス(オス)", "hp": 74, "atk": 48, "def": 76, "spa": 83, "spd": 81, "spe": 104, "types": ["エスパー"], "abilities": ["するどいめ", "すりぬけ", "いたずらごころ"] },
  { "name": "ニャオニクス(メス)", "hp": 74, "atk": 48, "def": 76, "spa": 83, "spd": 81, "spe": 104, "types": ["エスパー"], "abilities": ["するどいめ", "すりぬけ", "かちき"] },
  { "name": "メガニャオニクス(オス)", "hp": 74, "atk": 48, "def": 106, "spa": 113, "spd": 111, "spe": 124, "types": ["エスパー"], "abilities": ["いたずらごころ"] },
  { "name": "メガニャオニクス(メス)", "hp": 74, "atk": 48, "def": 106, "spa": 113, "spd": 111, "spe": 124, "types": ["エスパー"], "abilities": ["かちき"] },
  { "name": "ギルガルド(シールド)", "hp": 60, "atk": 50, "def": 140, "spa": 50, "spd": 140, "spe": 60, "types": ["はがね", "ゴースト"], "abilities": ["バトルスイッチ"] },
  { "name": "ギルガルド(ブレード)", "hp": 60, "atk": 140, "def": 50, "spa": 140, "spd": 50, "spe": 60, "types": ["はがね", "ゴースト"], "abilities": ["バトルスイッチ"] },
  { "name": "フレフワン", "hp": 101, "atk": 72, "def": 72, "spa": 99, "spd": 89, "spe": 29, "types": ["フェアリー"], "abilities": ["いやしのこころ", "アロマベール"] },
  { "name": "ペロリーム", "hp": 82, "atk": 80, "def": 86, "spa": 85, "spd": 75, "spe": 72, "types": ["フェアリー"], "abilities": ["スイートベール", "かるわざ"] },
  { "name": "ブロスター", "hp": 71, "atk": 73, "def": 88, "spa": 120, "spd": 89, "spe": 59, "types": ["みず"], "abilities": ["メガランチャー"] },
  { "name": "エレザード", "hp": 62, "atk": 55, "def": 52, "spa": 109, "spd": 94, "spe": 109, "types": ["でんき", "ノーマル"], "abilities": ["かんそうはだ", "すながくれ", "サンパワー"] },
  { "name": "ガチゴラス", "hp": 82, "atk": 121, "def": 119, "spa": 69, "spd": 59, "spe": 71, "types": ["いわ", "ドラゴン"], "abilities": ["がんじょうあご", "いしあたま"] },
  { "name": "アマルルガ", "hp": 123, "atk": 77, "def": 72, "spa": 99, "spd": 92, "spe": 58, "types": ["いわ", "こおり"], "abilities": ["フリーズスキン", "ゆきふらし"] },
  { "name": "ニンフィア", "hp": 95, "atk": 65, "def": 65, "spa": 110, "spd": 130, "spe": 60, "types": ["フェアリー"], "abilities": ["メロメロボディ", "フェアリースキン"] }
]

mapped_batch = []
for i, p in enumerate(batch_4_raw):
    entry = {
        "id": i + 151,
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

with open("batch_4.js", "w", encoding="utf-8") as f:
    f.write(js_output)
