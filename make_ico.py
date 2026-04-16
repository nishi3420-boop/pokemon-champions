from PIL import Image
import os

png_path = r"C:\Users\nishi\Desktop\pokemon_champions\assets\logo.png"
ico_path = r"C:\Users\nishi\Desktop\pokemon_champions\assets\app_icon_fixed.ico"

try:
    if os.path.exists(ico_path):
        os.remove(ico_path)

    img = Image.open(png_path)
    img.save(ico_path, format="ICO", sizes=[(256, 256), (128, 128), (64, 64), (32, 32), (16, 16)])
    print("Success: ICO created at " + ico_path)
except Exception as e:
    print("Error:", e)
