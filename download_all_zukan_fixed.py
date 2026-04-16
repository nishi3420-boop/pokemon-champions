import urllib.request
import json
import os
import time

def fetch_all_zukan():
    print("Fetching Pokemon list from Official Zukan API...")
    url = "https://zukan.pokemon.co.jp/zukan-api/api/search/?limit=2000&page=1"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode('utf-8'))
    except Exception as e:
        print("Failed to fetch list:", e)
        return
        
    results = data.get('results', [])
    print(f"Found {len(results)} Pokemon entries.")
    
    zukan_dir = r"C:\Users\nishi\Desktop\pokemon_champions\assets\zukan_official"
    os.makedirs(zukan_dir, exist_ok=True)

    count = 0
    for pkmn in results:
        name = pkmn.get('name')
        sub_name = pkmn.get('sub_name')
        img_url = pkmn.get('image_m')
        
        if not img_url or not name:
            continue
            
        full_name = name
        if sub_name:
            full_name = f"{name} ({sub_name})"
            
        file_name_clean = full_name.replace("?", "？").replace("/", "／").replace(":", "：") + ".png"
        save_path = os.path.join(zukan_dir, file_name_clean)
        
        if os.path.exists(save_path):
            continue

        try:
            img_req = urllib.request.Request(img_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(img_req) as img_resp:
                with open(save_path, 'wb') as f:
                    f.write(img_resp.read())
            count += 1
            if count % 100 == 0:
                print(f"Downloaded {count} images...")
            time.sleep(0.05)
        except Exception as e:
            print(f"Failed {full_name}: {e}")
            
    print(f"Successfully downloaded {count} new images. Process complete.")

if __name__ == "__main__":
    fetch_all_zukan()
