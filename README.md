# AuraStudy - Premium Intelligent Study Assistance Suite

AuraStudy is a state-of-the-art study assistance web application designed to optimize your learning using active recall, spaced repetition, the Pomodoro focus technique, and AI-powered study assistance.

---

## 🎨 Features & Capabilities

1. **Intelligent Dashboard**: Displays focused study time, created flashcards, notes, and task progress alongside a real-time study log.
2. **Flashcards with Spaced Repetition (SM-2)**: Rate your recall difficulty (0-5) to schedule cards for future review using the SuperMemo-2 algorithm.
3. **Focus Pomodoro Timer**: Custom focus/break timer with a radial countdown ring and synthesized audio alert beeps. Can be linked directly to tasks to log progress.
4. **Interactive Planner (Kanban)**: Organize study tasks across Backlog, In Progress, and Completed stages.
5. **Study Notes with Markdown Preview**: A text organizer featuring a side-by-side formatted preview.
6. **Gemini AI Integration**:
   - **Note Summaries**: Generate study key-takeaways with one click.
   - **Flashcard Generator**: Generate active recall card decks directly from note contents.
   - **Study Companion Chat**: Interact, ask explanations, or query code and theory inside a conversational chatbot.
   - *Runs in a simulated offline sandbox by default — add your own key to get full Gemini power!*

---

## 🚀 Running the Project

To start both the frontend and backend servers instantly, double-click the launcher script in the root directory:
* **[run-project.bat](file:///C:/Users/USER/OneDrive/Desktop/study%20assistance/run-project.bat)**

This launches:
- **Backend Server**: running on [http://localhost:5000](http://localhost:5000)
- **Frontend App**: running on [http://localhost:5173](http://localhost:5173)

---

## 🛠️ Adding Your Gemini API Key (Optional)

To enable real Gemini 1.5 Flash AI generation:
1. Open the backend configuration file: **[backend/.env](file:///C:/Users/USER/OneDrive/Desktop/study%20assistance/backend/.env)**
2. Enter your API key (get one for free at [Google AI Studio](https://aistudio.google.com/)):
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```
3. Save the file and restart the backend server.

---

## 📂 Project Structure

* **`frontend/`**: Vite + React JSX client.
  * [index.html](file:///C:/Users/USER/OneDrive/Desktop/study%20assistance/frontend/index.html): HTML5 semantic entrypoint.
  * [src/App.jsx](file:///C:/Users/USER/OneDrive/Desktop/study%20assistance/frontend/src/App.jsx): Main React app code.
  * [src/index.css](file:///C:/Users/USER/OneDrive/Desktop/study%20assistance/frontend/src/index.css): Core CSS styling and colors.
  * [src/App.css](file:///C:/Users/USER/OneDrive/Desktop/study%20assistance/frontend/src/App.css): Interface components and animations.
* **`backend/`**: Express Node.js application server.
  * [server.js](file:///C:/Users/USER/OneDrive/Desktop/study%20assistance/backend/server.js): REST API and Gemini API handlers.
  * [db.js](file:///C:/Users/USER/OneDrive/Desktop/study%20assistance/backend/db.js): Custom JSON-file database engine with active SM-2 math logic.
  * [db.json](file:///C:/Users/USER/OneDrive/Desktop/study%20assistance/backend/db.json): Local database storage file (created upon first launch).
