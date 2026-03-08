import exiftool
import json
import os
import sys

PHOTO_DIR = "/Users/johnglen.siy/Downloads/disneyguessr_photos"  # folder of your apple photos

def extract_gps(filepath):
    with exiftool.ExifToolHelper() as et:
        meta = et.get_metadata(filepath)[0]

    lat     = meta.get("EXIF:GPSLatitude")
    lng     = meta.get("EXIF:GPSLongitude")
    lat_ref = meta.get("EXIF:GPSLatitudeRef")   # N or S
    lng_ref = meta.get("EXIF:GPSLongitudeRef")  # E or W
    heading = meta.get("EXIF:GPSImgDirection")
    alt     = meta.get("EXIF:GPSAltitude")
    ts      = meta.get("EXIF:DateTimeOriginal")

    if lat is None or lng is None:
        return None

    # flip sign for S/W
    if lat_ref == "S":
        lat = -lat
    if lng_ref == "W":
        lng = -lng

    return {
        "file":    os.path.basename(filepath),
        "lat":     lat,
        "lng":     lng,
        "heading": heading,
        "alt":     alt,
        "time":    ts
    }

def process_folder(folder):
    results = []
    exts = {".jpg", ".jpeg", ".heic", ".png"}

    files = [
        os.path.join(folder, f)
        for f in os.listdir(folder)
        if os.path.splitext(f)[1].lower() in exts
    ]

    print(f"found {len(files)} photos")

    for filepath in files:
        data = extract_gps(filepath)
        if data:
            results.append(data)
            print(f"✓ {data['file']} → {data['lat']}, {data['lng']} heading={data['heading']}°")
        else:
            print(f"✗ {os.path.basename(filepath)} — no GPS data")

    return results

if __name__ == "__main__":
    folder = sys.argv[1] if len(sys.argv) > 1 else PHOTO_DIR
    results = process_folder(folder)

    with open("gps_data.json", "w") as f:
        json.dump(results, f, indent=2)

    print(f"\n{len(results)} photos with GPS saved to gps_data.json")