import pandas as pd
import os
import sys

# נתיבים
DATA_DIR = os.path.join(os.getcwd(), "data")
INPUT_FILE = os.path.join(DATA_DIR, "ted_talks_en.csv")
OUTPUT_FILE = os.path.join(DATA_DIR, "ted_talks_cleaned.csv")

def clean_dataset():
    print(f"🧹 Starting Data Cleaning Pipeline...")

    if not os.path.exists(INPUT_FILE):
        print(f"❌ Error: Input file not found at {INPUT_FILE}")
        sys.exit(1)

    # 1. טעינת הקובץ
    try:
        df = pd.read_csv(INPUT_FILE)
        original_count = len(df)
        print(f"   Original Rows: {original_count:,}")
    except Exception as e:
        print(f"❌ Failed to load CSV: {e}")
        sys.exit(1)

    # 2. הסרת שורות ריקות (Missing Transcripts)
    df_clean = df.dropna(subset=['transcript']).copy()
    # וידוא שהטקסט הוא לא רווחים בלבד
    df_clean = df_clean[df_clean['transcript'].astype(str).str.strip() != '']
    
    dropped_empty = original_count - len(df_clean)
    print(f"   Removed {dropped_empty} empty transcripts.")

    # 3. הסרת הרצאות קצרות מידי (פחות מ-50 מילים)
    # אלו בד"כ (Music), (Applause) או סרטונים ללא מילים
    df_clean['word_count'] = df_clean['transcript'].apply(lambda x: len(str(x).split()))
    
    short_talks_count = len(df_clean[df_clean['word_count'] < 50])
    df_clean = df_clean[df_clean['word_count'] >= 50]
    
    print(f"   Removed {short_talks_count} short talks (<50 words).")

    # 4. הסרת כפילויות (לפי URL)
    before_dedup = len(df_clean)
    df_clean = df_clean.drop_duplicates(subset=['url'])
    duplicates_removed = before_dedup - len(df_clean)
    print(f"   Removed {duplicates_removed} duplicates.")

    # 5. שמירת הקובץ החדש
    # אנחנו שומרים רק את העמודות הרלוונטיות כדי להקטין את הקובץ
    columns_to_keep = ['talk_id', 'title', 'speaker_1', 'published_date', 'url', 'transcript']
    # אם יש עמודות שלא קיימות, נשמור את מה שיש
    existing_cols = [c for c in columns_to_keep if c in df_clean.columns]
    
    df_clean[existing_cols].to_csv(OUTPUT_FILE, index=False)
    
    print("-" * 30)
    print(f"✅ Cleaning Complete!")
    print(f"   Output File: {OUTPUT_FILE}")
    print(f"   Final Row Count: {len(df_clean):,} (Removed {original_count - len(df_clean)} rows total)")

if __name__ == "__main__":
    clean_dataset()