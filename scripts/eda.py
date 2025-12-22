import pandas as pd
import os
import sys

# --- Configuration ---
DATA_DIR = os.path.join(os.getcwd(), "data")
FILENAME = "ted_talks_en.csv"
FILE_PATH = os.path.join(DATA_DIR, FILENAME)

def analyze_data():
    print(f"🔍 Starting EDA on {FILE_PATH}...\n")

    if not os.path.exists(FILE_PATH):
        print(f"❌ Error: File not found at {FILE_PATH}")
        sys.exit(1)

    # 1. Load Data
    try:
        df = pd.read_csv(FILE_PATH)
        print(f"📊 Loaded Dataset. Total Rows: {len(df):,}")
        print("-" * 50)
    except Exception as e:
        print(f"❌ Failed to load CSV: {e}")
        sys.exit(1)

    # 2. Missing Values Analysis
    print("🚨 MISSING DATA CHECK:")
    missing_transcripts = df['transcript'].isnull().sum() + (df['transcript'].astype(str).str.strip() == '').sum()
    missing_titles = df['title'].isnull().sum()
    
    print(f"   - Missing/Empty Transcripts: {missing_transcripts} ({(missing_transcripts/len(df)*100):.2f}%)")
    print(f"   - Missing Titles:            {missing_titles}")

    # 3. Duplicate Analysis
    print("\n👯 DUPLICATE CHECK:")
    # Check duplicates based on URL (most reliable for TED)
    if 'url' in df.columns:
        dupes = df.duplicated(subset=['url']).sum()
        print(f"   - Duplicate URLs found:      {dupes}")
    else:
        print("   - 'url' column missing, checking duplicates by Title...")
        dupes = df.duplicated(subset=['title']).sum()
        print(f"   - Duplicate Titles found:    {dupes}")

    # 4. Content Analysis (Word Counts)
    # Filter out empty transcripts for calculation
    clean_df = df.dropna(subset=['transcript']).copy()
    clean_df = clean_df[clean_df['transcript'].astype(str).str.strip() != '']
    
    # Calculate word count (approximate by splitting spaces)
    clean_df['word_count'] = clean_df['transcript'].apply(lambda x: len(str(x).split()))

    print("\n📏 TRANSCRIPT LENGTH STATISTICS (Words):")
    print(f"   - Average Length:    {int(clean_df['word_count'].mean()):,} words")
    print(f"   - Median Length:     {int(clean_df['word_count'].median()):,} words")
    print(f"   - Min Length:        {clean_df['word_count'].min()} words")
    print(f"   - Max Length:        {clean_df['word_count'].max():,} words")
    print(f"   - 95th Percentile:   {int(clean_df['word_count'].quantile(0.95)):,} words")

    # 5. "Junk" Detection (Talks < 50 words)
    # These are usually "(Music)", "(Applause)", or video placeholders
    SHORT_THRESHOLD = 50
    short_talks = clean_df[clean_df['word_count'] < SHORT_THRESHOLD]

    print(f"\n⚠️  SUSPICIOUSLY SHORT TALKS (< {SHORT_THRESHOLD} words):")
    print(f"   Found {len(short_talks)} talks that might be junk.")
    
    if len(short_talks) > 0:
        print("   Examples:")
        for idx, row in short_talks.head(5).iterrows():
            preview = str(row['transcript'])[:60].replace('\n', ' ')
            print(f"   - ID {row.get('talk_id', 'N/A')}: \"{row.get('title', 'Untitled')}\" -> [Length: {row['word_count']}] content: \"{preview}...\"")

    # 6. Token Estimation (for Cost/Budget)
    # Rough estimate: 1 token ~= 0.75 words
    total_words = clean_df['word_count'].sum()
    estimated_tokens = total_words * 1.33 
    estimated_cost = (estimated_tokens / 1_000_000) * 0.02 # Using $0.02 per 1M tokens (text-embedding-3-small)

    print("\n💰 COST ESTIMATION (text-embedding-3-small):")
    print(f"   - Total Estimated Tokens: {int(estimated_tokens):,}")
    print(f"   - Estimated Cost to Index ALL: ${estimated_cost:.4f}")

    # 7. Action Plan
    print("\n" + "="*50)
    print("✅ RECOMMENDED ACTIONS FOR ingest.ts:")
    
    actions = []
    if missing_transcripts > 0:
        actions.append("Add filter: `if (!transcript) continue;`")
    if len(short_talks) > 0:
        actions.append(f"Add filter: `if (transcript.split(' ').length < {SHORT_THRESHOLD}) continue;` (Removes musical performances)")
    if dupes > 0:
        actions.append("Ensure your manifest logic is active to handle duplicates.")
    
    if not actions:
        print("   Data looks clean! No special filters needed.")
    else:
        for action in actions:
            print(f"   [ ] {action}")
    print("="*50)

if __name__ == "__main__":
    analyze_data()