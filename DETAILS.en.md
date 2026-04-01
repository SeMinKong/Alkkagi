# Alkkagi.io Technical Details

## 1. Socket.io Event Specification
### Client → Server
- **`join`**: `socket.emit('join', nickname: string)`
  - Creates player profile, assigns unique color, and spawns stone.
- **`flick`**: `socket.emit('flick', { vx: number, vy: number })`
  - Validates 500ms cooldown and applies mass-based velocity reduction.

### Server → Client
- **`init`**: `socket.on('init', { gameState, myId })`
  - Sends initial board size, stones coordinates, and player ID.
- **`gameStateUpdate`**: Continuously broadcasts exact positions and physics state at 60fps.
- **`killNotification`**: Displays "Killer ➔ Victim" to all connected clients for 5 seconds.

## 2. Physics Engine Details (`server/physics.ts`)
- **Growth Mechanism**: `radius = BASE_RADIUS + kills * 0.8`, `mass = 1 + kills * 0.05`.
- **Collision Resolution**: Before applying velocities, the engine forces *Position Correction* to resolve visual overlaps. It then calculates elastic impulses based on mass and `RESTITUTION`.
- **Friction Algorithm**: `new_velocity = old_velocity * (0.80 ^ stepFactor)`. Complete stop when velocity drops below 0.1.
- **Dynamic Board**: Auto-expands based on active players: `boardSize = max(500, 400 + playerCount * 100)`.

## 3. Game Constants (`server/constants.ts`)
Tweak these to adjust the difficulty and pacing:
- `FRICTION = 0.80`: Controls how fast stones slide to a halt.
- `RESTITUTION = 0.7`: Bounciness factor (1.0 = perfectly elastic).
- `BASE_RADIUS = 15`: Starting footprint of a player's stone.
- `SUB_STEPS = 10`: Splits physics calculations per frame for accuracy at high speeds.
