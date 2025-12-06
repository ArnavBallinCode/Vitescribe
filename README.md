# Vitescribe

Lightweight web app for ingesting clinical documents, extracting key metrics, and interacting with an LLM-backed assistant.

**Quick overview:** upload clinical documents from `assets/` or your local machine, the app extracts vitals and metrics and presents them in a dashboard and chat interface.

## Demo

### Screenshot
![App Screenshot](./assets/Screenshot%202025-12-06%20at%2012.07.14%20PM.png)

### Screen Recording (click to download)
[Screen Recording](./assets/Screen%20Recording%202025-12-06%20at%2012.05.42%20PM.mov)

### PDF Sample
[Sample Clinical PDF](./assets/health%20centre%20(1).pdf)


## Test Document

- The document referenced in tests was reported as `halth_centre` by you. The actual file in `assets/` is named `health centre (1).pdf`.
- If you want the canonical test filename to be `halth_centre.pdf` (or `health_centre.pdf`), tell me which exact spelling to use and I will rename it in `assets/` and update the tests.

## Run Locally

**Prerequisites:** `Node.js` (LTS recommended)

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in `.env.local` to your Gemini API key
3. Run the app:
   `npm run dev`

## Brief Architecture

- **Entry points:** `index.tsx` and `App.tsx` initialize the React app and mount the top-level UI.
- **UI Components:**
  - `components/FileUpload.tsx`: handle file selection and upload (local or from `assets/`).
  - `components/ChatInterface.tsx`: chat UI for interacting with the LLM and exploring results.
  - `components/Dashboard.tsx`: shows extracted metrics and health cards.
  - `components/MetricCard.tsx`: reusable card for individual metrics.
  - `components/ReasoningView.tsx`: optional view to surface LLM reasoning or provenance.
- **Services:**
  - `services/geminiService.ts`: wraps calls to the Gemini API (LLM) and centralizes prompt management.
- **Data flow:**
  1. User uploads/selects a document via `FileUpload`.
  2. The app extracts text (with OCR when needed) and builds a payload.
  3. `geminiService` is called to parse, extract metrics, and produce explanations.
  4. Extracted results are displayed in `Dashboard`/`MetricCard` components and can be explored in `ChatInterface`.

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

```markdown


/Users/arnavangarkar/Downloads/vitalscribe/assets/Screen Recording 2025-12-06 at 12.05.42 PM.mov

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

```