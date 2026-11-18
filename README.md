# CodeAlpha App Development Internship Portfolio 📱

[![React Native](https://img.shields.io/badge/React%20Native-0.88-blue.svg)](https://reactnative.dev)
[![Expo](https://img.shields.io/badge/Expo%20SDK-58-black.svg)](https://expo.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Internship: CodeAlpha](https://img.shields.io/badge/CodeAlpha-Internship%20Verified-indigo.svg)](https://www.codealpha.tech)

Welcome to the **CodeAlpha App Development Internship Project Suite**. This repository contains a production-ready, beautifully designed cross-platform mobile application that implements **all 4 tasks** outlined in the CodeAlpha internship curriculum (exceeding the 2–3 required tasks).

---

## 🚀 Projects Overview

| Task # | Project Name | Domain | Status | Key Features |
| :--- | :--- | :--- | :---: | :--- |
| **Task 1** | **Flashcard Quiz App** | Education | ✅ Complete | Flip animation, Previous/Next navigation, Add/Edit/Delete cards, Category filtering |
| **Task 2** | **Random Quote Generator** | Lifestyle | ✅ Complete | Random quote generator, 50+ quotes, Copy to clipboard, Native share, Favorites list |
| **Task 3** | **Fitness Tracker App** | Health & Wellness | ✅ Complete | Step/Calorie/Workout progress bars, Water hydration log, Weekly activity bar chart, Activity logger |
| **Task 4** | **Language Learning App** | Education & EdTech | ✅ Complete | 5 Languages (ES, FR, DE, JA, IT), Audio pronunciation synthesis, Interactive quizzes, Streak & XP |

---

## 🌟 Feature Deep-Dive by Task

### 🗂️ Task 1: Flashcard Quiz App
- **Interactive Flashcards**: Displays questions on the front and answers on the back with a seamless `Show Answer` / `Show Question` toggle.
- **Deck Navigation**: Intuitive `Previous` and `Next` buttons with dynamic index tracking (`Card X of Y`).
- **Complete CRUD Customization**:
  - **Add Card**: Create new flashcards with customizable categories, questions, and answers.
  - **Edit Card**: In-place editing of questions and answers.
  - **Delete Card**: Confirmation dialog with instant card removal.
- **Categories & Decks**: Filter flashcards by React Native, JavaScript, Computer Science, and Science.
- **Deck Controls**: Quick shuffle mode and deck reset to default study cards.
- **Study Mastery Tracker**: Mark cards as "Mastered" to track learning retention.

### 💬 Task 2: Random Quote Generator
- **Instant Randomization**: Generates an inspiring quote on app startup and on every click of the `✨ New Quote` button.
- **Clear Typography**: High-contrast, clean layout emphasizing quotation text and author attribution.
- **Category Filter**: Filter quotes by Technology, Motivation, Philosophy, Wisdom, and Success.
- **Speech Synthesis**: Built-in voice speaker that reads the quote aloud using Text-to-Speech (TTS).
- **Clipboard & Share**: One-tap copy to clipboard with toast notification, and native OS share sheet integration.
- **Favorites & Bookmarks**: Save favorite quotes to a persistent local drawer to revisit anytime.
- **Dynamic Themes**: Minimal Light, Dark Mode, Sunset Warmth, and Indigo Night themes.

### 🏃 Task 3: Fitness Tracker App
- **Daily Dashboard**: Real-time progress bars for:
  - **Steps**: Goal tracking with quick "+ Add Steps" logging.
  - **Active Calories**: Calculated expenditure toward daily target.
  - **Workout Duration**: Track active minutes.
  - **Hydration Tracker**: Interactive `+` and `-` glass counter for water intake.
- **Visual Progress Chart**: Responsive weekly bar chart (Mon–Sun) visualizing daily calorie expenditure.
- **Workout Logger**:
  - Choose exercise types: Running, Cycling, Walking, Strength Training, HIIT, Yoga, Swimming.
  - Automatic calorie calculation based on workout duration and MET intensity rate.
- **Activity History**: Feed of logged sessions with exercise icon, duration, calories, timestamp, and delete actions.

### 🌐 Task 4: Language Learning App
- **Multi-Language Support**: Learn Spanish (🇪🇸), French (🇫🇷), German (🇩🇪), Japanese (🇯🇵), or Italian (🇮🇹).
- **Daily Vocabulary Lessons**:
  - Detailed word/phrase cards with translations, phonetic guides, and example sentences in context.
  - **Voice Pronunciation**: Listen to native pronunciations using speech synthesis.
  - Category filters: Greetings & Basics, Travel & Dining, Numbers & Time, Grammar Insights.
  - "Mark as Learned" mastery checklist.
- **Interactive Practice Quizzes**:
  - Multiple-choice questions testing vocabulary comprehension.
  - Real-time feedback highlighting correct (green) and incorrect (red) answers with detailed explanations.
  - Score summary, streak counter (🔥 5 Days), and XP point tracking.

---

## 🛠️ Architecture & Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) (v0.88)
- **Tooling**: [Expo](https://expo.dev/) (SDK 58)
- **Navigation**: Dual-mode navigation:
  - Bottom Tab Navigation for seamless switching between all 4 tasks.
  - Fullscreen / Standalone view mode for individual task testing.
- **Persistence**: Resilient storage layer (`src/utils/storage.js`) supporting `@react-native-async-storage/async-storage`, Web `localStorage`, and in-memory cache.
- **Audio/Speech**: Cross-platform speech utility (`src/utils/speech.js`) integrating Expo Speech and Web SpeechSynthesis API.

---

## 📂 Project Directory Structure

```
Tasks/
├── src/
│   ├── components/
│   │   ├── Header.js           # Top branding bar with task badges
│   │   └── TabBar.js           # Bottom tab navigation bar
│   ├── data/
│   │   ├── initialFlashcards.js # Task 1 preloaded flashcard decks
│   │   ├── quotesData.js       # Task 2 curated quotes collection
│   │   ├── fitnessData.js      # Task 3 workouts and weekly metrics
│   │   └── languageData.js     # Task 4 vocabulary, phonetics, quizzes
│   ├── screens/
│   │   ├── HubScreen.js        # Overview suite & direct project launcher
│   │   ├── FlashcardScreen.js  # TASK 1: Flashcard Quiz App
│   │   ├── QuoteScreen.js      # TASK 2: Random Quote Generator
│   │   ├── FitnessScreen.js    # TASK 3: Fitness Tracker App
│   │   └── LanguageScreen.js   # TASK 4: Language Learning App
│   ├── styles/
│   │   └── theme.js            # Design tokens & color system
│   └── utils/
│       ├── speech.js           # Cross-platform TTS engine
│       └── storage.js          # Resilient storage manager
├── App.js                      # Main App Entry & Navigation Container
├── app.json                    # Expo configuration
├── package.json                # Project dependencies and scripts
└── README.md                   # Documentation & submission guide
```

---

## ⚡ How to Run the Application

### 1. Prerequisites
- **Node.js** (v18 or newer recommended, v26 LTS installed)
- **npm** or **bun**

### 2. Install Dependencies
```bash
npm install
```

### 3. Run on Web (Browser Preview)
```bash
npm run web
# Or: npx expo start --web
```
Open your browser at `http://localhost:8081` to interact with all 4 apps immediately!

### 4. Run on Mobile (iOS / Android)
```bash
npx expo start
```
Scan the displayed QR code with the **Expo Go** app on your phone (available on App Store and Google Play).

---

## 📤 CodeAlpha Submission Guide

According to the CodeAlpha internship instructions:
1. **Repository Name**: Create a GitHub repository named `CodeAlpha_ProjectName` (e.g., `CodeAlpha_AppDevelopmentTasks` or separate repositories for individual tasks).
2. **Push Code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: complete all 4 CodeAlpha app development internship tasks"
   git branch -M main
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/CodeAlpha_AppDevelopmentTasks.git
   git push -u origin main
   ```
3. **LinkedIn Video & Post**:
   - Record a 1-2 minute video walkthrough showcasing the 4 tasks.
   - Tag `@CodeAlpha` and share your GitHub repository link.
4. **Form Submission**:
   - Submit your GitHub repository link in the CodeAlpha submission form shared in your WhatsApp group.

---

## 📜 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
