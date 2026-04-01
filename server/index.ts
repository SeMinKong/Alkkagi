import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { PORT, BASE_RADIUS, BASE_SIZE, SUB_STEPS } from './constants.js';
import { type Stone, type Player, updateStoneStats, resolveCollisions, applyFrictionAndPosition } from './physics.js';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

interface GameState {
  stones: Stone[];
  players: { [id: string]: Player };
  boardSize: number;
  rankings: { nickname: string, kills: number, color: string }[];
}

let gameState: GameState = {
  stones: [],
  players: {},
  boardSize: BASE_SIZE,
  rankings: [],
};

function getRandomColor() {
  const h = Math.floor(Math.random() * 360);
  return `hsl(${h}, 80%, 60%)`;
}

function updateBoardSize() {
  const playerCount = Object.keys(gameState.players).length;
  gameState.boardSize = Math.max(BASE_SIZE, 400 + playerCount * 100);
}

function updateRankings() {
  gameState.rankings = Object.values(gameState.players)
    .map(p => ({ nickname: p.nickname, kills: p.kills, color: p.color }))
    .sort((a, b) => b.kills - a.kills)
    .slice(0, 10);
}

function updatePhysics(stepFactor: number) {
  gameState.stones.forEach(stone => {
    applyFrictionAndPosition(stone, stepFactor);
  });

  resolveCollisions(gameState.stones);

  const size = gameState.boardSize;
  gameState.stones.forEach(stone => {
    if (stone.x < -stone.radius || stone.x > size + stone.radius || stone.y < -stone.radius || stone.y > size + stone.radius) {
      const victimPlayer = gameState.players[stone.playerId];
      let absorbedKills = 0;
      if (victimPlayer) {
        absorbedKills = Math.floor(victimPlayer.kills / 2);
        victimPlayer.kills -= absorbedKills;
      }

      if (stone.lastHitBy && stone.lastHitBy !== stone.playerId) {
        const killer = gameState.players[stone.lastHitBy];
        if (killer) {
          killer.kills += (1 + absorbedKills);
          // Update stone stats immediately when kill count changes
          const killerStone = gameState.stones.find(s => s.id === killer.stoneId);
          if (killerStone) updateStoneStats(killerStone, killer);
          io.emit('killNotification', {
            killer: killer.nickname,
            victim: stone.nickname,
            killerColor: killer.color,
            victimColor: stone.color
          });
        }
      }

      // Update victim stone stats after kills change
      if (victimPlayer) {
        updateStoneStats(stone, victimPlayer);
      }

      updateRankings();

      stone.x = Math.random() * (size - 100) + 50;
      stone.y = Math.random() * (size - 100) + 50;
      stone.vx = 0;
      stone.vy = 0;
      stone.lastHitBy = null;
    }
  });
}

setInterval(() => {
  for (let i = 0; i < SUB_STEPS; i++) {
    updatePhysics(1 / SUB_STEPS);
  }
  io.emit('gameStateUpdate', gameState);
}, 1000 / 60);

io.on('connection', (socket) => {
  socket.on('join', (nickname: string) => {
    const color = getRandomColor();
    const stoneId = `stone-${socket.id}`;

    gameState.players[socket.id] = {
      id: socket.id,
      nickname: nickname || 'Anonymous',
      color,
      stoneId,
      kills: 0,
      lastFlickTime: 0
    };
    updateBoardSize();
    updateRankings();

    gameState.stones.push({
      id: stoneId,
      playerId: socket.id,
      nickname: nickname || 'Anonymous',
      x: Math.random() * (gameState.boardSize - 100) + 50,
      y: Math.random() * (gameState.boardSize - 100) + 50,
      vx: 0,
      vy: 0,
      color,
      lastHitBy: null,
      radius: BASE_RADIUS,
      mass: 1
    });

    socket.emit('init', { gameState, myId: socket.id });
  });

  socket.on('flick', ({ vx, vy }) => {
    const player = gameState.players[socket.id];
    if (!player) return;

    const now = Date.now();
    if (now - player.lastFlickTime < 500) return;

    const stone = gameState.stones.find(s => s.id === player.stoneId);
    if (!stone) return;

    player.lastFlickTime = now;
    stone.lastHitBy = socket.id;

    const maxSpeed = gameState.boardSize * 0.45;
    const speed = Math.sqrt(vx * vx + vy * vy);

    stone.vx = (speed > maxSpeed ? (vx / speed) * maxSpeed : vx) / stone.mass;
    stone.vy = (speed > maxSpeed ? (vy / speed) * maxSpeed : vy) / stone.mass;
  });

  socket.on('disconnect', () => {
    delete gameState.players[socket.id];
    gameState.stones = gameState.stones.filter(s => s.playerId !== socket.id);
    updateBoardSize();
    updateRankings();
  });
});

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
