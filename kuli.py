import os
from openai import OpenAI

client = OpenAI(
    api_key="gk-0916485bd9e91353827e6dd0b88153b49915ff6ab3edc977",
    base_url="https://ai.geraikita.com/v1/claude"
)

def kuli(prompt, filename):
    print(f"--- Kuli lagi kerja bikin: {filename} ---")
    try:
        response = client.chat.completions.create(
            model="gpt-5.6-sol",
            messages=[
                {"role": "system", "content": "Lu adalah kuli coding. Output lu HANYA kode saja tanpa basa-basi."},
                {"role": "user", "content": prompt}
            ]
        )
        code = response.choices[0].message.content.replace("```javascript", "").replace("```html", "").replace("```", "").strip()
        with open(filename, "w") as f:
            f.write(code)
        print(f"✅ Selesai! Cek file {filename}")
    except Exception as e:
        print(f"❌ Kuli error bos: {e}")

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 3:
        print("Cara pakai: python3 kuli.py 'perintah lu' namafile.ekstensi")
    else:
        kuli(sys.argv[1], sys.argv[2])
