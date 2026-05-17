# InternFind – Internship Search App

A React + Vite web app that replicates the core internship search experience of [Internshala](https://internshala.com/internships/), with real API integration, live filtering, and infinite scroll.

---

## 🚀 Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| Vite 5 | Build tool / dev server |
| Plain CSS (Modular) | Styling — no CSS-in-JS |
| Fetch API | HTTP requests |
| IntersectionObserver | Infinite scroll |

---

## 📁 File Structure

```
src/
├── components/
│   ├── FilterPanel.jsx      # Sidebar with profile/location/duration filters
│   ├── InternshipCard.jsx   # Reusable card for each internship
│   └── InternshipList.jsx   # Grid of cards + skeleton loading
├── styles/
│   ├── App.css
│   ├── FilterPanel.css
│   ├── InternshipCard.css
│   └── InternshipList.css
├── App.jsx                  # Root — state, API fetch, infinite scroll logic
├── main.jsx                 # ReactDOM entry point
└── index.css                # Global CSS variables + reset
```

---

## ⚙️ Setup & Run

### Prerequisites
- Node.js 18+
- npm 9+

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/internship-search.git
cd internship-search

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
# → Open http://localhost:5173
```

### Build for production

```bash
npm run build
npm run preview   # Preview built output locally
```

---

## 🌐 API Integration

The app calls `https://internshala.com/hiring/search` with filter parameters.

> **Note:** Internshala's API does not allow cross-origin requests from browsers (CORS restriction).  
> The app **gracefully falls back** to realistic mock data so the UI is always fully functional.

To connect a real API that supports CORS, update the `fetchInternships` function in `App.jsx`.

---

## 🔍 Features

- **Live text filtering** by profile/role and location
- **Duration dropdown** filter (up to 1–6 months)
- **Quick-select chips** for popular profiles and cities
- **Active filter pills** with individual clear buttons
- **Infinite scroll** via IntersectionObserver (loads 12 more cards on scroll)
- **Skeleton loading** placeholders on initial and subsequent loads
- **Responsive layout** — works on mobile, tablet, and desktop
- **Fully accessible** (label/id pairs, aria attributes)

---

## 🚢 Deployment

### Deploy to Vercel (recommended)

```bash
npm install -g vercel
vercel
# Follow prompts — auto-detects Vite
```

Or connect your GitHub repo at [vercel.com](https://vercel.com) for automatic deploys.

### Deploy to Netlify

```bash
npm run build
# Upload the `dist/` folder at app.netlify.com/drop
```

Or connect via [netlify.com](https://netlify.com) → "Import from Git".

---

## 📸 Component Overview

### `FilterPanel`
- Controlled inputs with live `onChange` callbacks
- Suggestion chips auto-filter based on typed text
- Active filter summary with per-chip remove buttons

### `InternshipCard`
- Deterministic avatar color from company name
- Formatted stipend (`₹15K/month`) and duration
- PPO / WFH / Part-time badges
- Hover lift animation

### `InternshipList`
- Renders `InternshipCard` in a CSS Grid
- Shows 6 skeleton cards on initial load
- Shows 3 skeleton cards at bottom while fetching more

---

## 🙌 Credits

Inspired by [Internshala](https://internshala.com). Built as a frontend exercise.
