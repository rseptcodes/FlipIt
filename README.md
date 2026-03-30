# 🗂️ Flip It!: Interactive Flashcards App

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

## 💡 The Story Behind the Project
I wanted a quick, highly interactive way to study without the clunky interfaces of traditional study apps. I needed a tool that felt natural on a phone, where I could easily flip through questions, mark what I knew, and edit mistakes on the fly. To solve this, I created **Flip It!**—a mobile-first, gesture-driven flashcard application that helps you focus on learning, not navigating menus.

## ✨ Features

* **Interactive Flashcards:** Tap to flip between questions and redacted answers. 
* **Progress Tracking:** Instantly mark cards as correct (green) or incorrect (red) to visualize your study progress.
* **Smart Filtering:** Quickly toggle your view between all cards, mastered cards (success), and cards you need to review (error).
* **📱 Mobile-First & Intuitive Gestures:** Highly optimized for touch devices.
  * *Swipe Up* to instantly create a new flashcard.
  * *Single Tap* to reveal the answer.
  * *Double Tap* to focus on a card and reveal the delete option.
  * *Long Press* to enter inline editing mode.
* **✏️ Inline Editing:** Tap and hold any flashcard to edit the question or answer directly on the card, without being redirected to a new page.
* **🌗 Dark & Light Themes:** Fully responsive custom UI themes that adapt to your environment and reduce eye strain.
* **💾 Local Storage:** Your flashcards, study progress (correct/incorrect states), theme preferences, and tutorial status are automatically saved locally in your browser.

## 🛠️ Technologies Used

* **Vanilla JavaScript (ES6+):** Utilized for complex state management, custom touch/gesture detection, dynamic DOM rendering, inline editing logic, and Local Storage integration.
* **CSS3:** Custom CSS variables for dynamic theming, CSS Grid for responsive desktop/tablet layouts, and smooth keyframe animations (`fadeIn`, `slideOut`) for a polished UX.
* **HTML5:** Semantic structure and layout generation via JavaScript DOM manipulation.