# Alkkagi.io ⚪⚫

A real-time, multiplayer "Alkkagi" (stone-flicking) game built with **React**, **Node.js (Express)**, and **Socket.io**. Players flick their stones to knock opponents off the board, gaining size and mass with every kill.

## 🚀 Features

- **Real-time Multiplayer:** Powered by Socket.io for low-latency interactions.
- **Dynamic Physics:** Custom physics engine handling collisions, friction, and momentum.
- **Growth System:** Knocking out opponents increases your stone's radius and mass.
- **Leaderboard:** Track top players in real-time.
- **Responsive Design:** The game board scales dynamically to fit your browser window.

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)

---

## 🏃 Getting Started

Follow these steps to get the project running locally.

### 1. Clone the Repository
```bash
git clone <your-github-repo-url>
cd omok
```

### 2. Server Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Configure environment variables:
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   *The server will run on `http://localhost:3001`.*

### 3. Client Setup
1. Open a new terminal and navigate to the client directory:
   ```bash
   cd ../client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The client will usually run on `http://localhost:5173`.*

---

## 🎮 How to Play

1. **Join the Game:** Enter your nickname and the server IP (default is `localhost`).
2. **Flick Your Stone:** 
   - Click and drag back from your stone (highlighted with a gold border).
   - Release to launch it toward your opponents.
3. **Winning:** Knock other stones off the board! 
   - Each kill increases your size and weight, making you harder to move and more powerful when hitting others.
4. **Cooldown:** There is a 500ms cooldown between flicks, indicated by a visual ring on your stone.

---

## 📂 Project Structure

- `client/`: React frontend with Vite and TypeScript.
- `server/`: Express backend with Socket.io and custom game logic.
- `.gitignore`: Configured to exclude `node_modules` and build artifacts.
