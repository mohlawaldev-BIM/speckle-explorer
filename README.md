# Speckle Explorer

A Vite + React + Tailwind app to browse Speckle model data and export it to Excel.

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev

# 3. Open in browser
# http://localhost:5173
```

## Usage

1. Paste a Speckle model URL into the input field
2. (Optional) Click **token** to add a Personal Access Token for private models
3. Click **Load Model**
4. Select a category from the left sidebar to view its properties
5. Click **Export as Excel** to download the selected category, or **Export All** for every category

## Project Structure

```
src/
├── components/
│   ├── Header.jsx          # Top navigation bar
│   ├── UrlInput.jsx        # URL + token input + load button
│   ├── ErrorBanner.jsx     # Error display with fix guidance
│   ├── ModelInfo.jsx       # Project/model stats bar
│   ├── CategoryList.jsx    # Left sidebar category cards
│   ├── PropertiesPanel.jsx # Properties table + export button
│   └── EmptyHero.jsx       # Idle placeholder
├── hooks/
│   └── useSpeckleModel.js  # All data-fetching logic
├── lib/
│   ├── speckle.js          # GraphQL queries + fetch helper
│   └── utils.js            # Flatten objects + Excel export
├── App.jsx                 # Root component
├── main.jsx                # Entry point
└── index.css               # Tailwind + custom styles
```

## Personal Access Token

For private Speckle models, generate a token at:
**app.speckle.systems → Profile → Developer → Access Tokens → New token →**
Choose "streams:read" in the scope options

## Build for production

```bash
npm run build
# Output is in the /dist folder
```
