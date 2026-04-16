import urllib.request
import json
import os
import time

def test_zukan_capacity():
    print("Testing Official Zukan API...")
    # The official Pokemon Zukan API for Japan
    req = urllib.request.Request(
        "https://zukan.pokemon.co.jp/zukan-api/api/search/?limit=15&page=1",
        headers={'User-Agent': 'Mozilla/5.0'}
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode('utf-8'))
        
        results = data.get('results', [])
        if not results:
            print("No data found from Zukan API.")
            return

        total_bytes = 0
        count = 0
        test_dir = r"C:\Users\nishi\Desktop\pokemon_champions\assets\test_zukan"
        os.makedirs(test_dir, exist_ok=True)

        for pkmn in results:
            name = pkmn.get('name')
            img_url = pkmn.get('file_name') # Usually the full URL inside 'file_name' for modern Zukan API
            if not img_url:
                continue

            # Handle some quirks in their JSON structure
            file_name_clean = name.replace("?", "？").replace("/", "／") + ".png"
            save_path = os.path.join(test_dir, file_name_clean)

            # Download
            img_req = urllib.request.Request(img_url, headers={'User-Agent': 'Mozilla/5.0'})
            try:
                with urllib.request.urlopen(img_req) as img_resp:
                    img_data = img_resp.read()
                    with open(save_path, 'wb') as f:
                        f.write(img_data)
                    
                    size = len(img_data)
                    total_bytes += size
                    count += 1
                    print(f"Downloaded: {name}.png ({size / 1024:.1f} KB)")
            except Exception as ex:
                print(f"Failed to download {name}: {ex}")
            time.sleep(0.5)

        if count > 0:
            avg_size_kb = (total_bytes / count) / 1024
            print(f"\n--- TEST RESULTS ---")
            print(f"Sample Size: {count} images")
            print(f"Average Image Size: {avg_size_kb:.1f} KB")
            
            # Pokémon has about 1025 species + forms (approx 1200+ images total)
            est_total_mb = (avg_size_kb * 1200) / 1024
            print(f"Estimated total capacity for ~1200 Pokemon: {est_total_mb:.1f} MB")
        
    except Exception as e:
        print("Error accessing Zukan:", e)

if __name__ == "__main__":
    test_zukan_capacity()
