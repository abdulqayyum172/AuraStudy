# AuraStudy - Product Guide & Usage Manual

AuraStudy is an intelligent, integrated educational workspace designed to combine active recall, spaced repetition scheduling, the Pomodoro focus technique, and AI-assisted study tools into a unified environment.

---

## 🎯 1. The Problems AuraStudy Solves

Traditional learning methods suffer from several inefficiencies. AuraStudy addresses these directly:

* **Passive Learning Bias**: Most students study by re-reading notes or highlighting text, which creates an illusion of competence but low retention. AuraStudy solves this by forcing **Active Recall** through interactive, flippable flashcards.
* **The Forgetting Curve**: Without structured review, students forget 70% of new information within 24 hours. AuraStudy solves this by integrating the **SuperMemo-2 (SM-2) Spaced Repetition** algorithm, which dynamically schedules reviews right before memory decay occurs.
* **Context Fragmentation**: Students often use separate apps for notes (Notion/Docs), task tracking (Trello), timers (phone clocks), and flashcards (Anki). This fragmentation increases friction. AuraStudy solves this by **linking all three**: Pomodoro timers feed directly into your Kanban tasks, and Notes can be scanned to automatically generate Flashcards.
* **Distraction & Drift**: Finding focus is difficult. AuraStudy's Pomodoro logger tracks exact minutes spent on specific tasks, giving students concrete feedback on their attention span.

---

## 📖 2. System Usage Guide

### 📊 Dashboard
* View your focused study time, flashcard inventory, created notes, and task progress.
* Review high-priority tasks and complete them directly using the checkmarks.

### 🗂️ Flashcard Deck & Study Mode
* **Create Decks**: Separate cards by topic (e.g. *Biology*, *JavaScript*).
* **Add Cards**: Set a front question and a back answer.
* **Review Mode**:
  1. Click **Smart Study Mode**. Read the question on the card.
  2. Click the card to flip it and reveal the answer.
  3. Select your recall score from **0 (Forgot)** to **5 (Perfect)** to schedule the card's next review date automatically.

### ⏱️ Pomodoro Timer
* Choose **Focus** (25m), **Short Break** (5m), or **Long Break** (15m).
* Use the drop-down selector to link your focus session to an active Kanban task.
* Press **Start (▶)**. The circular progress ring counts down.
* Upon completion, a synthesized alarm sounds, and study minutes are automatically logged to the dashboard.

### 📝 Study Notes
* Edit text on the left using standard Markdown. The formatted preview displays on the right.
* **AI Summarize**: Generate key bullet points with one click and append them to your notes.
* **AI Flashcard Generator**: Scan your note, select a deck, and let the AI generate active recall cards automatically.

### 📅 Kanban Planner
* Organize tasks across columns: **Backlog**, **In Progress**, and **Completed**.
* Update task stages using the action buttons on the task cards.

### 🤖 AI Chatbot
* Type questions directly (e.g., *"Explain scopes in JS"* or *"Quiz me on photosynthesis"*) to receive formatted explanations, code examples, and study guide recommendations.

---

## ⚡ 3. Key Advantages

| Advantage | Description | Educational Benefit |
| :--- | :--- | :--- |
| **Mathematical Recall (SM-2)** | Review schedules dynamically adapt to individual recall quality score (0-5). | Decreases study time by eliminating over-review of easy cards. |
| **Direct Feature Linking** | Flashcards are created directly from notes, and focus timers directly update planner tasks. | Eliminates tool-switching friction and integrates workflow. |
| **Zero-Configuration Setup** | Pure JS JSON database file storage requires no external service configurations. | Maximum portability; starts instantly on any machine. |
| **Hybrid AI Engine** | Simulated local sandbox is active by default. Can connect to Gemini 1.5 with an API key. | 100% operational offline, with opt-in API integration. |
| **Synthesized Audio System** | Sounds beeps using the browser Web Audio API. | Zero external asset dependency; never fails to load audio files. |
