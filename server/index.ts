import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = 3001;
const BASE_RADIUS = 15;
const FRICTION = 0.80; 
const STOP_SPEED = 0.1;
const BASE_SIZE = 500;
const RESTITUTION = 0.7;
const SUB_STEPS = 10;

interface Player {
  id: string;
  nickname: string;
  color: string;
  stoneId: string;
  kills: number;
  lastFlickTime: number; // 마지막 발사 시간 기록
}

interface Stone {
  id: string;
  playerId: string;
  nickname: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  lastHitBy: string | null;
  radius: number; // 동적 크기
  mass: number;   // 동적 무게
}

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

// 플레이어의 킬 수에 따라 알의 크기와 무게를 계산
function updateStoneStats(stone: Stone) {
  const player = gameState.players[stone.playerId];
  if (!player) return;
  
  stone.radius = BASE_RADIUS + player.kills * 0.8; // 1킬당 0.8px 증가
  stone.mass = 1 + player.kills * 0.05;           // 1킬당 무게 0.05배 증가
}

function resolveCollisions(stones: Stone[]) {
  for (let i = 0; i < stones.length; i++) {
    for (let j = i + 1; j < stones.length; j++) {
      const s1 = stones[i];
      const s2 = stones[j];
      
      // s1과 s2가 존재할 때만 처리 (TypeScript 에러 방지)
      if (!s1 || !s2) continue;

      const dx = s2.x - s1.x;
      const dy = s2.y - s1.y;
      const distance = Math.sqrt(dx * dx + dy * dy) || 0.1;
      const minDistance = s1.radius + s2.radius;

      if (distance < minDistance) {
        const angle = Math.atan2(dy, dx);
        const overlap = (minDistance - distance) / 2;
        
        s1.x -= Math.cos(angle) * overlap;
        s1.y -= Math.sin(angle) * overlap;
        s2.x += Math.cos(angle) * overlap;
        s2.y += Math.sin(angle) * overlap;

        const nx = dx / distance;
        const ny = dy / distance;
        const rvx = s2.vx - s1.vx;
        const rvy = s2.vy - s1.vy;
        const velAlongNormal = rvx * nx + rvy * ny;

        if (velAlongNormal > 0) continue;

        // 질량(무게)을 고려한 충격량 계산
        let jImpulse = -(1 + RESTITUTION) * velAlongNormal;
        jImpulse /= (1 / s1.mass + 1 / s2.mass);

        const impulseX = jImpulse * nx;
        const impulseY = jImpulse * ny;

        s1.vx -= (impulseX / s1.mass);
        s1.vy -= (impulseY / s1.mass);
        s2.vx += (impulseX / s2.mass);
        s2.vy += (impulseY / s2.mass);

        s1.lastHitBy = s2.playerId;
        s2.lastHitBy = s1.playerId;
      }
    }
  }
}

function updatePhysics(stepFactor: number) {
  const stepFriction = Math.pow(FRICTION, stepFactor);

  gameState.stones.forEach(stone => {
    updateStoneStats(stone); // 매 스텝마다 최신 킬수 반영

    stone.x += stone.vx * stepFactor;
    stone.y += stone.vy * stepFactor;

    stone.vx *= stepFriction;
    stone.vy *= stepFriction;

    if (Math.abs(stone.vx) < STOP_SPEED) stone.vx = 0;
    if (Math.abs(stone.vy) < STOP_SPEED) stone.vy = 0;
  });

  resolveCollisions(gameState.stones);

  const size = gameState.boardSize;
  gameState.stones.forEach(stone => {
    if (stone.x < -stone.radius || stone.x > size + stone.radius || stone.y < -stone.radius || stone.y > size + stone.radius) {
      // 사망 패널티 및 점수 흡수 로직
      const victimPlayer = gameState.players[stone.playerId];
      let absorbedKills = 0;
      if (victimPlayer) {
        absorbedKills = Math.floor(victimPlayer.kills / 2);
        victimPlayer.kills -= absorbedKills; // 피해자는 절반 상실
      }

      if (stone.lastHitBy && stone.lastHitBy !== stone.playerId) {
        const killer = gameState.players[stone.lastHitBy];
        if (killer) {
          killer.kills += (1 + absorbedKills); // 기본 1킬 + 피해자 점수 50% 흡수
          io.emit('killNotification', {
            killer: killer.nickname,
            victim: stone.nickname,
            killerColor: killer.color,
            victimColor: stone.color
          });
        }
      }
      
      updateRankings(); // 점수 변동 후 랭킹 업데이트
      
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

    // 쿨타임 체크 (500ms)
    const now = Date.now();
    if (now - player.lastFlickTime < 500) return;

    const stone = gameState.stones.find(s => s.id === player.stoneId);
    if (!stone) return;

    player.lastFlickTime = now; // 발사 시간 갱신
    stone.lastHitBy = socket.id;

    // 보드 크기에 비례하여 최대 속도 제한 (500px 기준 225)
    const maxSpeed = gameState.boardSize * 0.45; 
    const speed = Math.sqrt(vx * vx + vy * vy);
    
    // 질량(무게)에 따른 속도 저하 적용: v = P / m
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
