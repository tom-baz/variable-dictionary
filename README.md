# Variable Dictionary

Interactive browser for research variable definitions, source tables, construction logic, and Python code.
Built for the CBS Income & Wages research project.

## Quick Start (run locally)

**Prerequisites:** You need [Node.js](https://nodejs.org/) installed (download the LTS version).

```bash
# 1. Open a terminal in this folder, then install dependencies (one-time only):
npm install

# 2. Start the app:
npm run dev
```

This opens the app at `http://localhost:5173/variable-dictionary/`.

## Deploy to GitHub Pages (so colleagues can access it via a URL)

### One-time setup

1. **Create a GitHub account** if you don't have one: https://github.com/signup

2. **Create a new repository** on GitHub:
   - Go to https://github.com/new
   - Name it `variable-dictionary`
   - Keep it **Public** (required for free GitHub Pages)
   - Do NOT initialize with README (we already have one)
   - Click "Create repository"

3. **Edit two things in the code** (use any text editor):

   In **`package.json`**, replace `YOUR_GITHUB_USERNAME`:
   ```json
   "homepage": "https://YOUR_GITHUB_USERNAME.github.io/variable-dictionary"
   ```

   In **`vite.config.js`**, if your repo name is different from `variable-dictionary`, update the base:
   ```js
   base: '/your-repo-name/',
   ```

4. **Push the code to GitHub** (run these commands in your terminal, inside this folder):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/variable-dictionary.git
   git push -u origin main
   ```

5. **Deploy:**
   ```bash
   npm run deploy
   ```

6. **Enable GitHub Pages:**
   - Go to your repo on GitHub → Settings → Pages
   - Under "Source", select the `gh-pages` branch
   - Click Save
   - Wait 1-2 minutes, then your site is live at:
     `https://YOUR_GITHUB_USERNAME.github.io/variable-dictionary/`

### Updating after changes

Whenever you edit variables or code, just run:
```bash
git add .
git commit -m "Updated variables"
git push
npm run deploy
```

## How to Add or Edit Variables

All variable data lives in one file: **`src/data/variables.json`**

Open it in any text editor. The structure is:

```json
{
  "Strategy 2": [
    {
      "name": "wages_s2",
      "definition": "Annual wage income",
      "type": "wage",
      "source": "tbl_hahnsotpratt87_21",
      "notebook": "compute_income_variables.ipynb",
      "logic": "Renamed from HahnasaSahar. Missing values replaced with 0.",
      "inputs": ["HahnasaSahar"],
      "code": "df['wages_s2'] = df['HahnasaSahar'].fillna(0)"
    }
  ],
  "Strategy 4": [ ... ]
}
```

### To add a new variable

Copy an existing entry and fill in the fields:

| Field        | Required | Description |
|-------------|----------|-------------|
| name        | Yes | Variable name (e.g., "wages_s2") |
| definition  | Yes | Human-readable description |
| type        | Yes | One of: "wage", "capital", "benefits", "demographics", "wage, capital" |
| source      | Yes | Source table(s), comma-separated |
| notebook    | No  | Which .ipynb file has the code (use null if none) |
| logic       | Yes | Plain-English explanation of construction |
| inputs      | Yes | Array of input variable names (use [] if none) |
| code        | Yes | Python code snippet (use \n for newlines) |
| tag         | No  | Optional badge (e.g., "CBS source") |

### To add a new strategy

Add a new key at the top level of the JSON — it automatically appears as a tab:

```json
{
  "Strategy 2": [...],
  "Strategy 4": [...],
  "Strategy 5": [...]
}
```

## Project Structure

```
variable-dictionary/
├── src/
│   ├── data/
│   │   └── variables.json   ← Edit this to add/change variables
│   ├── App.jsx              ← The app code
│   └── main.jsx             ← Entry point
├── index.html
├── package.json
├── vite.config.js
└── README.md
```
