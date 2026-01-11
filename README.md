# TED RAG Assistant

This is a Retrieval-Augmented Generation (RAG) application built with [Next.js](https://nextjs.org), designed to answer questions based on a dataset of TED Talks. It uses Pinecone for vector storage and OpenAI/LLMod for generating answers.

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v18 or higher)
* [Git](https://git-scm.com/)
* [Python](https://www.python.org/) (for data cleaning scripts)

## 🚀 Getting Started

Follow these steps to set up the project locally.

### 1. Clone the Repository
Open your terminal and run the following command to download the code:

```bash
git clone [https://github.com/yuvalmar16/ted-rag-assistant.git](https://github.com/yuvalmar16/ted-rag-assistant.git)
cd ted-rag-assistant
```

### 2. Install Dependencies
Install the required Node.js packages:
```bash
npm install
```
### 3. Configure Environment Variables
This project requires API keys to function.
Create a file named .env.local in the root directory.

Add the following variables (replace with your actual keys):
```bash
LLMOD_API_KEY=your_llmod_api_key_here
LLMOD_BASE_URL=https://api.llmod.ai/
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_INDEX_NAME=ted-rag-index
```

### 4. Data Processing (Optional for new setups)
If you need to build the database from scratch (clean data and upload to Pinecone), run these scripts:

Step A: Clean the Data

```bash

python scripts/clean_data.py
```
Step B: Ingest to Pinecone

```bash
npx tsx scripts/ingest.ts
```

5. Run the Development Server
Once the setup is complete, start the application:


```bash

npm run dev
```
Open http://localhost:3000 with your browser to see the result.


☁️ Deployment
The easiest way to deploy your Next.js app is to use the Vercel Platform.

Check out the Next.js deployment documentation for more details.
