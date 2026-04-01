import { FRICTION, STOP_SPEED, RESTITUTION, BASE_RADIUS } from './constants.js';

export interface Stone {
  id: string;
  playerId: string;
  nickname: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  lastHitBy: string | null;
  radius: number;
  mass: number;
}

export interface Player {
  id: string;
  nickname: string;
  color: string;
  stoneId: string;
  kills: number;
  lastFlickTime: number;
}

export function updateStoneStats(stone: Stone, player: Player) {
  stone.radius = BASE_RADIUS + player.kills * 0.8;
  stone.mass = 1 + player.kills * 0.05;
}

export function resolveCollisions(stones: Stone[]) {
  for (let i = 0; i < stones.length; i++) {
    for (let j = i + 1; j < stones.length; j++) {
      const s1 = stones[i];
      const s2 = stones[j];

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

export function applyFrictionAndPosition(stone: Stone, stepFactor: number) {
  const stepFriction = Math.pow(FRICTION, stepFactor);

  stone.x += stone.vx * stepFactor;
  stone.y += stone.vy * stepFactor;

  stone.vx *= stepFriction;
  stone.vy *= stepFriction;

  if (Math.abs(stone.vx) < STOP_SPEED) stone.vx = 0;
  if (Math.abs(stone.vy) < STOP_SPEED) stone.vy = 0;
}
