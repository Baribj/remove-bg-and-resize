import os
import subprocess
from rembg import remove
from PIL import Image
import io
import shutil


src_folder = 'src'
no_bg_folder = 'no-bg'

if os.path.exists(no_bg_folder):
    shutil.rmtree(no_bg_folder)  

# Recreate an empty no_bg_folder
os.makedirs(no_bg_folder)

for file_name in os.listdir(src_folder):
        input_path = os.path.join(src_folder, file_name)
      
        output_path = os.path.join(no_bg_folder, os.path.splitext(file_name)[0] + '.png')
        
        with open(input_path, 'rb') as input_file:
            input_data = input_file.read()
            output_data = remove(input_data)
     
        img = Image.open(io.BytesIO(output_data)).convert("RGBA")
        img.save(output_path, 'PNG') 

print("Background removed from all images and saved as PNG!")


try:
    subprocess.run(['node', 'resize.js'], check=True)
    print("JavaScript script executed successfully.")
except subprocess.CalledProcessError as e:
    print(f"Error executing JavaScript script: {e}")
