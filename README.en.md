# Alkkagi.io ⚪⚫

**[한국어 버전](./README.md)**

A modern, web-based reimagining of the traditional Korean stone-flicking game, **Alkkagi**. This project focuses on high-performance real-time synchronization and a custom physics engine built from scratch.

## 🚀 Overview

Alkkagi.io is a real-time multiplayer arena where players flick their stones to knock others off the board. As you eliminate opponents, your stone grows in size and mass, making you a formidable but slower force on the battlefield.

- **Real-time Synchronization**: Powered by Socket.io for low-latency gameplay.
- **Custom Physics**: A specialized engine handling elastic collisions, friction, and momentum without external libraries.
- **Dynamic Arena**: The game board expands and contracts based on the number of active players.
- **Progressive Growth**: A strategic layer where kills translate to physical advantages (and trade-offs).

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Backend**: Node.js, Express, Socket.io
- **Physics**: Custom implementation in TypeScript
- **Styling**: Vanilla CSS for maximum performance

## 🏗 Project Structure

```text
Alkkagi/
├── client/           # React application (Vite)
│   ├── src/
│   │   ├── components/  # Canvas rendering & UI components
│   │   └── App.tsx      # Socket management & core logic
├── server/           # Node.js server
│   ├── index.ts      # Socket.io handlers & game loop (60fps)
│   ├── physics.ts    # Collision & movement logic
│   └── constants.ts  # Game balance parameters
```

## 🧠 Key Technical Challenges

### 1. Real-time Physics Synchronization
To ensure a consistent experience across different network conditions, the server acts as the "source of truth," running the physics simulation at 60 FPS and broadcasting state updates to all clients.

### 2. Custom Collision Logic
Instead of using heavy engines like Matter.js, I implemented a lightweight physics module to handle:
- **Elastic Collisions**: Calculating impulses based on mass and velocity.
- **Position Correction**: Preventing stones from overlapping during high-speed impacts.
- **Growth Scaling**: Dynamically adjusting mass and radius as players score kills.

## 🏁 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-repo/Alkkagi.git
   cd Alkkagi
   ```

2. **Run Server**
   ```bash
   cd server
   npm install
   npm run dev
   ```

3. **Run Client**
   ```bash
   cd ../client
   npm install
   npm run dev
   ```

## 🎮 How to Play

1. Enter your nickname and connect to the server.
2. **Click & Drag** your stone (gold border) in the opposite direction you want to flick.
3. **Release** to launch. The further you drag, the stronger the force.
4. Knock opponents off the board to grow!

> 💡 **Need more details?**
> For advanced configurations, API specs, and internal architecture, please refer to the [Detailed Manual (DETAILS.en.md)](./DETAILS.en.md).

---
Developed with ❤️ by [Your Name/Github]
