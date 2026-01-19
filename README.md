# 🃏 Flip It! — Minimalist Flashcards

![Vanilla JS](https://img.shields.io/badge/vanilla_js-100%25-ff69b4)
![Status](https://img.shields.io/badge/status-🛠️_Day_1_Complete-yellow)
![Time Spent](https://img.shields.io/badge/time_invested-2_hours-blue)

A high-performance, minimalist flashcard app built from scratch. This project is a personal challenge to demonstrate how much can be achieved with pure **Vanilla JavaScript** and clean architecture in a short time frame.

---

# 📖 The Sprint Story

This project is divided into two focused sessions. The goal is to move from a blank screen to a fully gesture-driven, persistent web app.

### ⏱️ Sprint Log

| Session | Status | Time Spent | Key Achievements |
| :--- | :--- | :--- | :--- |
| **Day 1** | ✅ Done | **2h 18min** | Architecture, DOM Factory, Core CRUD, Basic Swipes |
| **Day 2** | 📅 Planned | -- | 3D Flip Physics, LocalStorage, UI Polishing |

---

# 🛠️ Day 1: The Foundation (Completed)

In the first **2 hours**, the focus was on building a scalable "engine" for the app. 

### What's under the hood?
* **Modular Object Architecture:** Organized the code into independent modules (`header`, `flashCards`, `editMenu`) to avoid global scope pollution.
* **Custom DOM Factory:** Built a `helperFunctions` library to handle dynamic element creation efficiently.
* **Gesture Orchestration:** Implemented initial `touchstart` and `touchend` logic for mobile-first interactions.
* **Input System:** Developed a clean, floating edit menu with active-state label animations.



---

# 🚀 Day 2: The Horizon (Tomorrow's Goals)

Tomorrow will be dedicated to "Magic and Persistence." The plan is to transform this functional logic into a premium-feel experience.

1.  **3D Flip Physics:** Implementing `preserve-3d` and `rotateY` transitions to make cards feel like physical objects.
2.  **Data Persistence:** Integrating `localStorage` so your deck survives a page refresh.
3.  **Visual Feedback:** Adding real-time tracking to gestures (cards following the finger movement).
4.  **Dark Mode Completion:** Finalizing the theme-switch logic to ensure a comfortable night-study experience.

---

# 📂 Current Architecture

The project follows a **Central State Object** pattern, ensuring the UI is a direct reflection of the data:

```javascript
const appConfig = { /* App Bootstrapping */ };
const header = { /* UI Components */ };
const flashCards = { /* Data & Rendering */ };
const editMenu = { /* Input Handling */ };
const handleGestures = { /* Interaction Logic */ };
const helperFunctions = { /* The "Engine" */ };
```
"Good code is built session by session." - Day 1 of Flip It! is officially in the books.
