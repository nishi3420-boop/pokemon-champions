import os
import json
import re
import urllib.request

# The current list of Pokemon in masterData.js mapped to their official IDs
pokemon_targets = {
    "リザードン": 6,
    "メガリザードンX": 10034,
    "メガリザードンY": 10035,
    "ゲンガー": 94,
    "メガゲンガー": 10038,
    "マスカーニャ": 906,
    "ソウブレイズ": 937,
    "デカヌチャン": 959,
    "キラフロル": 970,
    "メガキラフロル": "custom" # Since it doesn't exist, we will use the generated image
}

zukan_dir = r"C:\Users\nishi\Desktop\pokemon_champions\assets\zukan"
os.makedirs(zukan_dir, exist_ok=True)

print("Starting to fetch official images into zukan folder...")

# Copy over custom Mega Glimmora
import shutil
custom_mega = r"C:\Users\nishi\Desktop\pokemon_champions\assets\mega_glimmora.png"
if os.path.exists(custom_mega):
    shutil.copy(custom_mega, os.path.join(zukan_dir, "メガキラフロル.png"))
    print("Copied メガキラフロル.png (Custom)")

for jp_name, pid in pokemon_targets.items():
    if pid == "custom":
        continue
    
    # Use PokeAPI official artwork for standard Pokemon
    url = f"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{pid}.png"
    
    # Save as Japanese Name
    save_path = os.path.join(zukan_dir, f"{jp_name}.png")
    
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            with open(save_path, 'wb') as f:
                f.write(response.read())
        print(f"Downloaded: {jp_name}.png")
    except Exception as e:
        print(f"Failed to fetch {jp_name}: {e}")

print("Download complete. Modifying masterData.js...")

# Update masterData.js to point to these new local zukan images
js_path = r"C:\Users\nishi\Desktop\pokemon_champions\data\masterData.js"
with open(js_path, 'r', encoding='utf-8') as f:
    js_content = f.read()

# Replace all imageUrl lines with the local format
def replacer(match):
    # match.group(1) is the whitespace before imageUrl
    # match.group(2) is the quote content
    name_search = re.search(r'name:\s*"([^"]+)"', match.string[:match.start()])
    if not name_search:
        return match.group(0) # fallback
    
    # The last found name before this imageUrl
    names_found = re.findall(r'name:\s*"([^"]+)"', match.string[:match.start()])
    jp_name = names_found[-1]
    
    return f'{match.group(1)}imageUrl: "assets/zukan/{jp_name}.png"'

# Find imageUrl: "..." and replace
new_content = re.sub(r'(\s+)imageUrl:\s*"[^"]+"', replacer, js_content)

with open(js_path, 'w', encoding='utf-8') as f:
    f.write(new_content)
    
print("masterData.js updated successfully to use local Zukan images.")
