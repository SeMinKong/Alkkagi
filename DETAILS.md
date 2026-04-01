# Alkkagi.io 기술 상세 명세 (Technical Details)

## 1. Socket.io 이벤트 명세
### 클라이언트 → 서버
- **join (게임 참가)**: `socket.emit('join', nickname: string)`
  - 플레이어 정보 생성, 고유 색상 할당 및 보드에 돌 추가.
- **flick (돌 튕기기)**: `socket.emit('flick', { vx: number, vy: number })`
  - 500ms 쿨타임 확인. 질량을 고려한 속도 감소 로직이 적용됨.

### 서버 → 클라이언트
- **init (게임 초기화)**: `socket.on('init', { gameState, myId })`
  - 연결 초기 시 전체 돌의 위치, 보드 크기, 순위표를 전송.
- **gameStateUpdate (상태 업데이트)**: `socket.on('gameStateUpdate', gameState)`
  - 60fps로 모든 돌의 이동과 게임 상태를 지속적으로 업데이트.
- **killNotification (킬 알림)**: `socket.on('killNotification', log)`
  - 화면 상단에 "Killer ➔ Victim" 형태로 5초간 표시됨.

## 2. 물리 엔진 상세 (`server/physics.ts`)
외부 라이브러리 없이 자체 구현된 물리 모듈의 핵심 메커니즘입니다.
- **성장 메커니즘**: `반경 = 15 + kills * 0.8`, `질량 = 1 + kills * 0.05`
- **충돌 처리**: 두 돌이 충돌할 경우 `Position Correction`을 통해 위치 겹침을 해제한 후, 지정된 반발 계수(`RESTITUTION = 0.7`)와 질량 기반의 임펄스(Impulse)를 계산해 새로운 속도 벡터를 반환.
- **마찰(Friction)**: 매 프레임 `새로운_속도 = 기존_속도 * (0.80 ^ stepFactor)`로 감속. 속도가 0.1 미만이면 정지.
- **보드 확장**: 접속한 플레이어 수에 비례하여 크기 증가 `max(500, 400 + 플레이어수 * 100)`.

## 3. 주요 게임 상수 (`server/constants.ts`)
이 상수값을 변경하여 게임 난이도와 템포를 조절할 수 있습니다.
- `FRICTION = 0.80`: 마찰 계수 (매 프레임 80%로 속도 감속)
- `RESTITUTION = 0.7`: 충돌 반발 계수 (0=완벽한 흡수, 1=완벽한 반탄)
- `BASE_RADIUS = 15`: 초기 돌 크기
- `STOP_SPEED = 0.1`: 정지 상태로 간주할 최소 속도 임계값
- `SUB_STEPS = 10`: 높은 속도의 충돌을 정밀하게 처리하기 위한 프레임당 물리 계산 세부 단계 수
