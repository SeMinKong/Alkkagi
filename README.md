# Alkkagi.io ⚪⚫

**[한국어](#한국어) | [English](#english)**

---

<a id="한국어"></a>

# 알깨기.io - 실시간 멀티플레이어 게임 (한국어)

## 프로젝트 개요

**알깨기**는 전통적인 돌치기 놀이를 현대적인 실시간 멀티플레이어 게임으로 재탄생시킨 프로젝트입니다. 플레이어들은 자신의 돌을 조종하여 상대방의 돌을 보드 밖으로 밀어내고, 승리할 때마다 크기와 무게가 증가합니다.

- **실시간 멀티플레이**: Socket.io를 통한 저지연 상호작용
- **동적 물리 엔진**: 충돌, 마찰, 모멘텀을 처리하는 커스텀 물리 엔진
- **성장 시스템**: 상대방을 맞힐 때마다 돌의 크기와 무게 증가
- **리더보드**: 상위 플레이어를 실시간으로 추적
- **반응형 디자인**: 브라우저 창 크기에 자동으로 조정되는 게임 보드

---

## 기술 스택

### 프론트엔드 (Client)
- **React** 19.2.4 - UI 라이브러리
- **TypeScript** 5.9.3 - 정적 타입 언어
- **Vite** 8.0.1 - 빌드 도구 및 개발 서버
- **Socket.io Client** 4.8.3 - 실시간 통신
- **ESLint** - 코드 품질 관리

### 백엔드 (Server)
- **Node.js** - JavaScript 런타임
- **Express** 5.2.1 - 웹 서버 프레임워크
- **Socket.io** 4.8.3 - 실시간 양방향 통신
- **TypeScript** 5.9.3 - 정적 타입 언어
- **ts-node** - TypeScript 직접 실행
- **CORS** - 교차 출처 리소스 공유

---

## 주요 기능

### 게임 메커닉
- **돌 조종**: 클릭 후 드래그하여 돌을 튕겨냄
- **충돌 감지**: 리얼타임 물리 시뮬레이션으로 정확한 충돌 처리
- **성장 시스템**: 상대 돌을 밖으로 내보낼 때마다 반경과 질량 증가
- **쿨타임**: 돌 튕김 후 500ms의 쿨타임 (시각적 진행 링으로 표시)
- **보드 확장**: 플레이어 수에 따라 동적으로 보드 크기 증가

### UI/UX
- **리더보드**: 상위 10명의 플레이어 실시간 표시
- **킬 알림**: 누가 누구를 맞혔는지 5초간 화면에 표시
- **플레이어 정보**: 자신의 닉네임, 색상, 킬 수 표시
- **드래그 시각화**: 돌을 튕길 때 화살표로 방향과 힘 시각화

---

## 프로젝트 구조

```
Alkkagi/
├── client/                    # React 프론트엔드 애플리케이션
│   ├── src/
│   │   ├── App.tsx           # 메인 애플리케이션 컴포넌트
│   │   ├── main.tsx          # 진입점
│   │   ├── App.css           # 애플리케이션 스타일
│   │   └── components/       # React 컴포넌트
│   │       ├── GameCanvas.tsx       # 게임 보드 및 돌 렌더링
│   │       ├── LeaderBoard.tsx      # 순위 표시
│   │       └── KillNotifications.tsx # 킬 알림
│   ├── package.json          # 클라이언트 의존성
│   ├── tsconfig.json         # TypeScript 설정
│   └── vite.config.ts        # Vite 빌드 설정
│
├── server/                    # Express 백엔드 애플리케이션
│   ├── index.ts              # 서버 메인 파일 (Socket.io 핸들러)
│   ├── physics.ts            # 물리 엔진 (충돌, 마찰, 위치 계산)
│   ├── constants.ts          # 게임 상수 정의
│   ├── package.json          # 서버 의존성
│   ├── tsconfig.json         # TypeScript 설정
│   └── .env.example          # 환경 변수 예제
│
├── README.md                 # 이 파일
└── .gitignore              # Git 무시 파일
```

---

## 사전 요구사항

다음이 설치되어 있는지 확인하세요:
- **Node.js** v18 이상 ([nodejs.org](https://nodejs.org/))
- **npm** (Node.js와 함께 설치됨)

버전 확인:
```bash
node --version  # v18.0.0 이상
npm --version   # 9.0.0 이상
```

---

## 설치 및 실행

### 1. 저장소 클론

```bash
git clone https://github.com/your-repo/Alkkagi.git
cd Alkkagi
```

### 2. 서버 설정 및 실행

```bash
cd server
npm install
npm run dev
```

**결과**: 서버가 `http://localhost:3001`에서 시작됩니다.

**콘솔 출력 예시**:
```
Server running on http://0.0.0.0:3001
```

### 3. 클라이언트 설정 및 실행

새로운 터미널 창을 열고:

```bash
cd client
npm install
npm run dev
```

**결과**: 클라이언트가 일반적으로 `http://localhost:5173`에서 실행됩니다.

**콘솔 출력 예시**:
```
Local: http://localhost:5173/
```

브라우저를 열고 출력된 주소로 접속하면 게임이 로드됩니다.

---

## 게임 시작하기

### 1. 서버에 연결
- **닉네임**: 플레이할 닉네임 입력 (최대 10글자)
- **서버 IP**: 서버의 IP 주소 입력 (로컬에서는 `localhost`)
- **"Play Now"** 버튼 클릭

### 2. 돌 튕기기

#### 조작법
1. **마우스로 자신의 돌을 클릭** (금색 테두리로 표시된 돌)
2. **뒤쪽으로 드래그**: 돌의 위치에서 반대 방향으로 마우스를 이동
3. **마우스 해제**: 돌이 튕겨져 나갑니다

#### 튕기기의 물리
- **거리**: 드래그 거리가 클수록 힘이 강함 (최대 300 픽셀)
- **방향**: 드래그 방향이 돌이 이동할 방향 결정
- **보드 크기**: 보드가 클수록 돌이 더 빠르게 이동
- **질량**: 이전 킬 수가 많을수록 돌이 무거워져 움직이기 어려움

### 3. 게임 규칙

| 규칙 | 설명 |
|------|------|
| **상대 맞히기** | 다른 돌과 충돌하면 그 플레이어의 돌이 밀려남 |
| **보드 밖 내보내기** | 상대 돌이 보드 경계 밖으로 나가면 킬 1 획득 |
| **성장** | 킬 1회마다: 반경 +0.8, 질량 +0.05 |
| **패널티** | 자신의 돌이 보드 밖으로 나가면: 킬의 절반 손실 |
| **쿨타임** | 돌을 튕긴 후 다음 튕김까지 500ms 대기 필요 |

### 4. 승리와 진행

- **킬 증가**: 상대방을 보드 밖으로 내보낼 때마다 증가
- **크기 증가**: 킬이 많을수록 돌이 더 커짐
- **리더보드**: 상위 10위 플레이어가 실시간으로 표시됨
- **킬 알림**: 모든 플레이어가 누가 누구를 맞혔는지 볼 수 있음

---

## npm 스크립트

### 클라이언트 (client/)

```bash
npm run dev       # 개발 서버 시작 (Vite) - http://localhost:5173
npm run build     # TypeScript 타입 체크 후 프로덕션 빌드
npm run lint      # ESLint로 코드 품질 검사
npm run preview   # 빌드된 프로덕션 버전 미리보기
```

### 서버 (server/)

```bash
npm run dev       # 개발 모드로 서버 시작 (ts-node-esm)
npm test          # 테스트 실행 (현재 미구현)
```

---

## Socket.io 이벤트 명세

### 클라이언트 → 서버

#### `join` (게임 참가)
플레이어가 게임에 참가할 때 발생합니다.

```typescript
// 전송 데이터
socket.emit('join', nickname: string);

// 예시
socket.emit('join', 'Player123');
```

**서버 처리**:
- 플레이어 정보 생성
- 고유한 색상 할당
- 보드에 돌 추가
- 게임 상태 초기화

#### `flick` (돌 튕기기)
플레이어가 돌을 튕길 때 발생합니다.

```typescript
// 전송 데이터
socket.emit('flick', { vx: number, vy: number });

// 예시
socket.emit('flick', { vx: 100, vy: 50 });
```

**서버 검증**:
- 500ms 쿨타임 확인 (너무 자주 튕김 방지)
- 최대 속도 제한 적용
- 질량을 고려한 속도 감소

### 서버 → 클라이언트

#### `init` (게임 초기화)
클라이언트가 처음 연결되었을 때 게임 상태를 전송합니다.

```typescript
// 수신 데이터
socket.on('init', (data: {
  gameState: GameState;
  myId: string;
}) => {
  // gameState: { stones, players, boardSize, rankings }
  // myId: 현재 플레이어의 ID
});
```

**포함 정보**:
- 모든 돌의 위치, 크기, 색상
- 모든 플레이어의 정보
- 보드 크기
- 현재 순위

#### `gameStateUpdate` (게임 상태 업데이트)
60fps로 게임 상태를 지속적으로 업데이트합니다.

```typescript
// 수신 데이터 (60번/초)
socket.on('gameStateUpdate', (gameState: GameState) => {
  // gameState 구조는 init과 동일
});
```

**업데이트 내용**:
- 모든 돌의 새로운 위치 및 속도
- 플레이어 킬 수 변경
- 리더보드 순위 변경
- 보드 크기 변경

#### `killNotification` (킬 알림)
플레이어가 맞혀질 때 발생합니다.

```typescript
// 수신 데이터
socket.on('killNotification', (log: {
  killer: string;        // 공격자의 닉네임
  victim: string;        // 피해자의 닉네임
  killerColor: string;   // 공격자의 색상 (CSS 색상값)
  victimColor: string;   // 피해자의 색상 (CSS 색상값)
}) => {
  // 화면에 알림 표시 (5초간)
});
```

**표시 방식**:
- "Killer ➔ Victim" 형식으로 표시
- 플레이어 색상으로 구분
- 화면 우측 상단에 최신 5개 표시
- 5초 후 자동 사라짐

#### `disconnect` (연결 해제)
플레이어가 게임을 떠날 때 발생합니다.

```typescript
socket.on('disconnect', () => {
  // 플레이어 정보 및 돌 제거
  // 보드 크기 재조정
  // 리더보드 업데이트
});
```

---

## 게임 상수

`server/constants.ts`에서 정의된 주요 상수:

| 상수 | 값 | 설명 |
|------|------|------|
| `PORT` | 3001 | 서버 포트 |
| `BASE_RADIUS` | 15 | 초기 돌 반경 (픽셀) |
| `BASE_SIZE` | 500 | 초기 보드 크기 (픽셀) |
| `FRICTION` | 0.80 | 마찰 계수 (매 프레임 80%로 감속) |
| `STOP_SPEED` | 0.1 | 정지 속도 임계값 |
| `RESTITUTION` | 0.7 | 충돌 반발 계수 (0=완벽한 흡수, 1=완벽한 반탄) |
| `SUB_STEPS` | 10 | 물리 계산 세부 단계 (프레임당) |

---

## 물리 엔진 상세

### 성장 메커니즘

플레이어의 킬 수에 따라 돌의 반경과 질량이 증가합니다:

```
반경 = BASE_RADIUS + kills * 0.8
질량 = 1 + kills * 0.05

예시:
- 킬 0회: 반경 15, 질량 1.0
- 킬 5회: 반경 19, 질량 1.25
- 킬 10회: 반경 23, 질량 1.5
```

### 충돌 처리

두 돌이 충돌할 때:
1. **위치 교정**: 겹침을 해제하기 위해 각 돌을 반대 방향으로 이동
2. **속도 계산**: 충돌 법선 방향으로 반발력 계산
3. **임펄스 적용**: 각 돌의 질량을 고려하여 속도 변경

**특징**:
- 무거운 돌(높은 킬 수)은 가벼운 돌을 더 멀리 밀어냄
- 같은 무게의 돌은 균등하게 튕겨남
- RESTITUTION 계수로 에너지 손실 시뮬레이션

### 마찰과 정지

매 프레임마다:
```
새로운_속도 = 기존_속도 * (0.80 ^ stepFactor)
```

속도가 0.1 미만이면 완전히 정지됩니다.

### 보드 확장

보드 크기는 플레이어 수에 따라 자동 조정됩니다:

```
보드크기 = max(500, 400 + 플레이어수 * 100)

예시:
- 1명: 500x500
- 2명: 600x600
- 5명: 900x900
- 10명: 1400x1400
```

---

## 개발 가이드

### 로컬 개발 환경 설정

#### 단계 1: 저장소 클론 및 디렉토리 이동

```bash
git clone https://github.com/your-repo/Alkkagi.git
cd Alkkagi
```

#### 단계 2: 서버 시작

```bash
cd server
npm install
npm run dev
```

터미널에 다음이 표시되면 정상입니다:
```
Server running on http://0.0.0.0:3001
```

#### 단계 3: 클라이언트 시작 (새 터미널)

```bash
cd ../client
npm install
npm run dev
```

브라우저가 자동으로 열리거나, 터미널의 로컬 주소를 복사합니다:
```
Local: http://localhost:5173/
```

### 코드 구조 상세

#### 클라이언트 아키텍처

**App.tsx** (메인 컴포넌트)
- 소켓 연결 관리
- 게임 상태 관리 (useState)
- 드래그 및 튕김 로직
- 렌더링 조정 (반응형)

```typescript
// 주요 상태
- socket: Socket.io 연결
- isConnected: 연결 상태
- gameState: 게임 상태 (돌, 플레이어, 순위)
- myId: 현재 플레이어 ID
- dragStart/dragEnd: 드래그 상태
- cooldownProgress: 쿨타임 진행도 (0~1)
```

**GameCanvas.tsx** (게임 렌더링)
- 돌 및 보드 렌더링
- 드래그 시각화 (화살표)
- 쿨타임 링 표시
- 마우스 이벤트 처리

**LeaderBoard.tsx** (순위 표시)
- 상위 10위 플레이어 표시
- 플레이어 색상으로 구분

**KillNotifications.tsx** (킬 알림)
- 최근 킬 5개 표시
- 5초 후 자동 제거

#### 서버 아키텍처

**index.ts** (메인 서버)
- Socket.io 서버 설정
- 클라이언트 이벤트 핸들러
- 게임 상태 관리
- 60fps 게임 루프

```typescript
// 게임 상태 구조
gameState = {
  stones: Stone[],      // 보드의 모든 돌
  players: {            // 플레이어 정보 (ID로 인덱싱)
    [id: string]: Player
  },
  boardSize: number,    // 현재 보드 크기
  rankings: [           // 상위 10위 순위
    { nickname, kills, color }
  ]
}
```

**physics.ts** (물리 엔진)
- `updateStoneStats(stone, player)`: 킬 수에 따른 반경/질량 업데이트
- `resolveCollisions(stones)`: 모든 돌 간 충돌 처리
- `applyFrictionAndPosition(stone, stepFactor)`: 마찰 및 위치 업데이트

**constants.ts** (게임 상수)
- 게임 밸런싱 파라미터
- 여기서 게임 난이도 조정 가능

### 개발 워크플로우

#### 게임 로직 수정

1. 변경할 파일 결정:
   - **난이도 조정**: `server/constants.ts` 수정
   - **물리 계산**: `server/physics.ts` 수정
   - **UI/UX**: `client/src/` 파일 수정

2. 파일 수정 후 저장:
   - 서버: 자동으로 재시작됨 (ts-node 감시 모드)
   - 클라이언트: 자동으로 재로드됨 (Vite HMR)

3. 브라우저에서 변경 확인

#### 예: 마찰 계수 조정

```typescript
// server/constants.ts
export const FRICTION = 0.75;  // 기존: 0.80 (더 빨리 정지)

// 변경 후 서버가 자동으로 재시작되고, 
// 모든 클라이언트에 새로운 게임 상태가 전송됨
```

#### 예: 돌 크기 스케일 변경

```typescript
// server/physics.ts에서 updateStoneStats 함수 수정
export function updateStoneStats(stone: Stone, player: Player) {
  stone.radius = BASE_RADIUS + player.kills * 1.0;  // 기존: 0.8
  stone.mass = 1 + player.kills * 0.05;
}
```

### 디버깅 팁

#### 네트워크 문제
- 브라우저 DevTools → Network 탭에서 Socket.io 메시지 확인
- 콘솔 탭에서 연결 오류 메시지 확인

#### 물리 엔진 문제
- 콘솔에서 `gameState.stones` 구조 검사
- `server/index.ts`의 `updatePhysics()` 함수에 console.log 추가 가능

#### 성능 문제
- 플레이어가 너무 많으면 서버 부하 증가
- 클라이언트의 렌더링이 느려질 수 있음
- `gameState` 구조 최적화 필요

### 프로덕션 배포

#### 클라이언트 빌드

```bash
cd client
npm run build

# 결과: dist/ 폴더에 정적 파일 생성
# 이를 웹 서버(Nginx, Apache)로 호스팅 가능
```

#### 서버 배포

```bash
cd server

# TypeScript를 JavaScript로 컴파일
npx tsc

# Node.js로 직접 실행 (프로덕션)
node index.js

# 또는 PM2로 관리
npm install -g pm2
pm2 start index.js --name "alkkagi-server"
pm2 save
pm2 startup
```

#### 환경 변수 설정

```bash
# server/.env 파일 생성
PORT=3001

# server/index.ts에서 사용
const PORT = process.env.PORT || 3001;
```

### 프로덕션 체크리스트

- [ ] `client/.env` 설정 (API 엔드포인트)
- [ ] `server/.env` 설정 (포트, 데이터베이스 등)
- [ ] CORS 설정 검토 (`server/index.ts` 12-16줄)
- [ ] 클라이언트 빌드 테스트
- [ ] 서버 타입 체크 실행
- [ ] 로그 모니터링 설정
- [ ] 성능 테스트 실행

---

## 환경 변수

### 클라이언트

현재 클라이언트는 환경 변수가 불필요합니다. 서버 주소는 런타임에 입력받습니다.

### 서버

**.env.example**:
```
PORT=3001
```

**.env** (실제 파일):
```bash
# 필요 시 포트 변경
PORT=3001
```

**사용법**:
```typescript
// server/index.ts에서
const PORT = process.env.PORT || 3001;
```

---

## 파일별 역할 상세

### 클라이언트 파일

| 파일 | 라인수 | 역할 |
|------|--------|------|
| `src/App.tsx` | 260 | 메인 컴포넌트, 소켓 관리, 게임 로직 |
| `src/components/GameCanvas.tsx` | 134 | 게임 보드 렌더링, 드래그 시각화 |
| `src/components/LeaderBoard.tsx` | 28 | 순위 표시 |
| `src/components/KillNotifications.tsx` | 30 | 킬 알림 표시 |
| `src/App.css` | (별도) | 게임 UI 스타일 |

### 서버 파일

| 파일 | 라인수 | 역할 |
|------|--------|------|
| `index.ts` | 170 | Socket.io 서버, 게임 상태, 충돌/킬 처리 |
| `physics.ts` | 91 | 물리 계산 (충돌, 마찰, 성장) |
| `constants.ts` | 8 | 게임 상수 정의 |

---

## 타입 정의

### 공통 타입

```typescript
interface Stone {
  id: string;           // 고유 ID
  playerId: string;     // 플레이어 ID (소켓 ID)
  nickname: string;     // 플레이어 닉네임
  x: number;            // X 좌표
  y: number;            // Y 좌표
  vx: number;           // X 축 속도
  vy: number;           // Y 축 속도
  color: string;        // 돌 색상 (HSL)
  radius: number;       // 돌 반경
  mass: number;         // 돌 질량
  lastHitBy: string | null;  // 마지막 충돌 플레이어 ID
}

interface Player {
  id: string;           // 소켓 ID
  nickname: string;     // 플레이어 닉네임
  color: string;        // 돌 색상
  stoneId: string;      // 해당 돌의 ID
  kills: number;        // 킬 수
  lastFlickTime: number; // 마지막 튕김 시간
}

interface GameState {
  stones: Stone[];
  players: { [id: string]: Player };
  boardSize: number;
  rankings: { nickname: string, kills: number, color: string }[];
}
```

---

## 문제 해결

### 서버가 시작되지 않음

```bash
# 포트 사용 중인지 확인
lsof -i :3001

# 포트 포기시키기
kill -9 <PID>

# 다른 포트로 시작
PORT=3002 npm run dev
```

### 클라이언트가 서버에 연결되지 않음

1. 서버가 `localhost:3001`에서 실행 중인지 확인
2. 방화벽이 포트 3001을 차단하는지 확인
3. 브라우저 콘솔에서 오류 메시지 확인
4. 올바른 서버 IP 입력 확인

### 게임이 느린 경우

- 플레이어 수 줄이기 (보드 크기 감소)
- 브라우저 탭 전환 최소화
- 다른 애플리케이션 종료
- 브라우저 개발자 도구 닫기 (성능 향상)

### 킬이 카운트되지 않음

1. 쿨타임 확인 (500ms 대기)
2. 돌이 완전히 보드 밖으로 나갔는지 확인
3. 타이밍: 짧은 충돌 후 킬이 카운트될 수 있음

---

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

---

<a id="english"></a>

# Alkkagi.io - Real-Time Multiplayer Game (English)

## Project Overview

**Alkkagi** is a modern real-time multiplayer game inspired by the traditional Korean stone-flicking game (알깨기). Players control their stones to knock opponents off the board, growing larger and heavier with each victory.

- **Real-time Multiplayer**: Low-latency interactions powered by Socket.io
- **Dynamic Physics Engine**: Custom physics engine handling collisions, friction, and momentum
- **Growth System**: Stone size and mass increase with each kill
- **Leaderboard**: Track top players in real-time
- **Responsive Design**: Game board automatically scales to fit browser window

---

## Tech Stack

### Frontend (Client)
- **React** 19.2.4 - UI library
- **TypeScript** 5.9.3 - Statically typed language
- **Vite** 8.0.1 - Build tool and dev server
- **Socket.io Client** 4.8.3 - Real-time communication
- **ESLint** - Code quality management

### Backend (Server)
- **Node.js** - JavaScript runtime
- **Express** 5.2.1 - Web server framework
- **Socket.io** 4.8.3 - Real-time bidirectional communication
- **TypeScript** 5.9.3 - Statically typed language
- **ts-node** - Run TypeScript directly
- **CORS** - Cross-Origin Resource Sharing

---

## Key Features

### Game Mechanics
- **Stone Control**: Click and drag to flick your stone
- **Collision Detection**: Real-time physics simulation for accurate collisions
- **Growth System**: Radius +0.8 and mass +0.05 per kill
- **Cooldown**: 500ms cooldown between flicks (shown with visual progress ring)
- **Dynamic Board**: Board expands as more players join

### UI/UX
- **Leaderboard**: Real-time top 10 players display
- **Kill Notifications**: Shows who killed whom (5 seconds)
- **Player Info**: Display nickname, color, and kill count
- **Drag Visualization**: Arrow shows flick direction and power

---

## Project Structure

```
Alkkagi/
├── client/                    # React frontend application
│   ├── src/
│   │   ├── App.tsx           # Main application component
│   │   ├── main.tsx          # Entry point
│   │   ├── App.css           # Application styles
│   │   └── components/       # React components
│   │       ├── GameCanvas.tsx       # Game board and stone rendering
│   │       ├── LeaderBoard.tsx      # Leaderboard display
│   │       └── KillNotifications.tsx # Kill notifications
│   ├── package.json          # Client dependencies
│   ├── tsconfig.json         # TypeScript configuration
│   └── vite.config.ts        # Vite build configuration
│
├── server/                    # Express backend application
│   ├── index.ts              # Server main file (Socket.io handlers)
│   ├── physics.ts            # Physics engine (collisions, friction, position)
│   ├── constants.ts          # Game constants definition
│   ├── package.json          # Server dependencies
│   ├── tsconfig.json         # TypeScript configuration
│   └── .env.example          # Environment variables example
│
├── README.md                 # This file
└── .gitignore              # Git ignore rules
```

---

## Prerequisites

Ensure you have the following installed:
- **Node.js** v18+ ([nodejs.org](https://nodejs.org/))
- **npm** (comes with Node.js)

Verify versions:
```bash
node --version  # v18.0.0 or higher
npm --version   # 9.0.0 or higher
```

---

## Installation and Setup

### 1. Clone Repository

```bash
git clone https://github.com/your-repo/Alkkagi.git
cd Alkkagi
```

### 2. Server Setup and Start

```bash
cd server
npm install
npm run dev
```

**Result**: Server starts at `http://localhost:3001`

**Console output**:
```
Server running on http://0.0.0.0:3001
```

### 3. Client Setup and Start

Open a new terminal:

```bash
cd ../client
npm install
npm run dev
```

**Result**: Client typically runs at `http://localhost:5173`

**Console output**:
```
Local: http://localhost:5173/
```

Open the URL in your browser to load the game.

---

## How to Play

### 1. Connect to Server
- **Nickname**: Enter your desired nickname (max 10 characters)
- **Server IP**: Enter server IP address (use `localhost` for local play)
- **Click "Play Now"**

### 2. Flick Your Stone

#### Controls
1. **Click your stone** (marked with gold border)
2. **Drag backwards**: Move mouse away from stone position
3. **Release**: Stone launches in the direction opposite to drag

#### Flick Physics
- **Distance**: Larger drag distance = more power (max 300 pixels)
- **Direction**: Drag direction determines stone movement
- **Board Size**: Larger boards = faster stone movement
- **Mass**: More kills = heavier stone = harder to move

### 3. Game Rules

| Rule | Description |
|------|-------------|
| **Hit Opponent** | Colliding with other stones pushes them |
| **Knock Off Board** | Push opponent stone outside board = +1 kill |
| **Growth** | Each kill: radius +0.8, mass +0.05 |
| **Penalty** | Your stone falls off: lose half your kills |
| **Cooldown** | 500ms wait between flicks |

### 4. Winning and Progression

- **Kill Count**: Increases each time you knock opponent off board
- **Size Growth**: More kills = larger stone
- **Leaderboard**: Top 10 players displayed in real-time
- **Kill Notifications**: All players see who killed whom

---

## npm Scripts

### Client (client/)

```bash
npm run dev       # Start development server (Vite) - http://localhost:5173
npm run build     # Type check with TypeScript then build for production
npm run lint      # Check code quality with ESLint
npm run preview   # Preview built production version
```

### Server (server/)

```bash
npm run dev       # Start server in development mode (ts-node-esm)
npm test          # Run tests (currently not implemented)
```

---

## Socket.io Events Specification

### Client → Server

#### `join` (Enter Game)
Fired when player joins the game.

```typescript
// Send
socket.emit('join', nickname: string);

// Example
socket.emit('join', 'Player123');
```

**Server Processing**:
- Creates player information
- Assigns unique color
- Adds stone to board
- Initializes game state

#### `flick` (Flick Stone)
Fired when player flicks their stone.

```typescript
// Send
socket.emit('flick', { vx: number, vy: number });

// Example
socket.emit('flick', { vx: 100, vy: 50 });
```

**Server Validation**:
- Checks 500ms cooldown (prevents too-frequent flicking)
- Applies maximum speed limit
- Accounts for mass in speed reduction

### Server → Client

#### `init` (Game Initialization)
Sent when client first connects with game state.

```typescript
// Receive
socket.on('init', (data: {
  gameState: GameState;
  myId: string;
}) => {
  // gameState: { stones, players, boardSize, rankings }
  // myId: current player's ID
});
```

**Includes**:
- All stones' positions, sizes, colors
- All players' information
- Current board size
- Current rankings

#### `gameStateUpdate` (Game State Update)
Continuously sends game state updates at 60fps.

```typescript
// Receive (60 times per second)
socket.on('gameStateUpdate', (gameState: GameState) => {
  // gameState structure same as init
});
```

**Updates Include**:
- All stones' new positions and velocities
- Player kill count changes
- Leaderboard rank changes
- Board size changes

#### `killNotification` (Kill Notification)
Fired when a player is knocked off the board.

```typescript
// Receive
socket.on('killNotification', (log: {
  killer: string;        // Killer's nickname
  victim: string;        // Victim's nickname
  killerColor: string;   // Killer's color (CSS color value)
  victimColor: string;   // Victim's color (CSS color value)
}) => {
  // Display notification on screen (5 seconds)
});
```

**Display Format**:
- Format: "Killer ➔ Victim"
- Differentiated by player colors
- Shows latest 5 kills in top-right
- Auto-disappears after 5 seconds

#### `disconnect` (Connection Terminated)
Fired when player leaves the game.

```typescript
socket.on('disconnect', () => {
  // Player information and stone removed
  // Board size readjusted
  // Leaderboard updated
});
```

---

## Game Constants

Defined in `server/constants.ts`:

| Constant | Value | Description |
|----------|-------|-------------|
| `PORT` | 3001 | Server port |
| `BASE_RADIUS` | 15 | Initial stone radius (pixels) |
| `BASE_SIZE` | 500 | Initial board size (pixels) |
| `FRICTION` | 0.80 | Friction coefficient (80% speed per frame) |
| `STOP_SPEED` | 0.1 | Speed threshold for stopping |
| `RESTITUTION` | 0.7 | Collision bounce coefficient (0=absorb, 1=bounce) |
| `SUB_STEPS` | 10 | Physics calculation steps per frame |

---

## Physics Engine Details

### Growth Mechanism

Stone radius and mass increase based on kill count:

```
radius = BASE_RADIUS + kills * 0.8
mass = 1 + kills * 0.05

Examples:
- 0 kills: radius 15, mass 1.0
- 5 kills: radius 19, mass 1.25
- 10 kills: radius 23, mass 1.5
```

### Collision Resolution

When two stones collide:
1. **Position Correction**: Move each stone away to resolve overlap
2. **Velocity Calculation**: Calculate bounce force along collision normal
3. **Impulse Application**: Apply velocity changes based on mass

**Features**:
- Heavier stones (more kills) push lighter stones farther
- Equal mass stones bounce equally
- RESTITUTION coefficient simulates energy loss

### Friction and Stopping

Each frame:
```
new_velocity = old_velocity * (0.80 ^ stepFactor)
```

Stops completely if velocity < 0.1

### Board Expansion

Board size auto-adjusts with player count:

```
boardSize = max(500, 400 + playerCount * 100)

Examples:
- 1 player: 500x500
- 2 players: 600x600
- 5 players: 900x900
- 10 players: 1400x1400
```

---

## Development Guide

### Setting Up Local Development

#### Step 1: Clone Repository and Navigate

```bash
git clone https://github.com/your-repo/Alkkagi.git
cd Alkkagi
```

#### Step 2: Start Server

```bash
cd server
npm install
npm run dev
```

You should see:
```
Server running on http://0.0.0.0:3001
```

#### Step 3: Start Client (New Terminal)

```bash
cd ../client
npm install
npm run dev
```

Browser opens automatically or shows:
```
Local: http://localhost:5173/
```

### Code Structure Details

#### Client Architecture

**App.tsx** (Main Component)
- Manages Socket.io connection
- Manages game state (useState)
- Handles drag and flick logic
- Manages responsive rendering

```typescript
// Key State Variables
- socket: Socket.io connection
- isConnected: Connection status
- gameState: Game state (stones, players, rankings)
- myId: Current player's ID
- dragStart/dragEnd: Drag state
- cooldownProgress: Cooldown progress (0-1)
```

**GameCanvas.tsx** (Game Rendering)
- Renders stones and board
- Visualizes drag (arrow)
- Shows cooldown ring
- Handles mouse events

**LeaderBoard.tsx** (Ranking Display)
- Shows top 10 players
- Differentiated by color

**KillNotifications.tsx** (Kill Alerts)
- Shows latest 5 kills
- Auto-removes after 5 seconds

#### Server Architecture

**index.ts** (Main Server)
- Socket.io server setup
- Client event handlers
- Game state management
- 60fps game loop

```typescript
// Game State Structure
gameState = {
  stones: Stone[],      // All stones on board
  players: {            // Player information (indexed by ID)
    [id: string]: Player
  },
  boardSize: number,    // Current board size
  rankings: [           // Top 10 rankings
    { nickname, kills, color }
  ]
}
```

**physics.ts** (Physics Engine)
- `updateStoneStats(stone, player)`: Update radius/mass based on kills
- `resolveCollisions(stones)`: Handle all stone-to-stone collisions
- `applyFrictionAndPosition(stone, stepFactor)`: Update friction and position

**constants.ts** (Game Constants)
- Game balancing parameters
- Adjust difficulty here

### Development Workflow

#### Modifying Game Logic

1. Determine which file to modify:
   - **Difficulty adjustments**: `server/constants.ts`
   - **Physics calculations**: `server/physics.ts`
   - **UI/UX changes**: `client/src/` files

2. Save changes:
   - Server: Automatically restarts (ts-node watch mode)
   - Client: Automatically reloads (Vite HMR)

3. Test in browser

#### Example: Adjust Friction

```typescript
// server/constants.ts
export const FRICTION = 0.75;  // Was: 0.80 (stops faster)

// Server restarts automatically and all clients
// receive updated game state
```

#### Example: Change Stone Size Scale

```typescript
// server/physics.ts updateStoneStats function
export function updateStoneStats(stone: Stone, player: Player) {
  stone.radius = BASE_RADIUS + player.kills * 1.0;  // Was: 0.8
  stone.mass = 1 + player.kills * 0.05;
}
```

### Debugging Tips

#### Network Issues
- Browser DevTools → Network tab to inspect Socket.io messages
- Console tab for connection error messages

#### Physics Engine Issues
- Inspect `gameState.stones` structure in console
- Add console.log to `updatePhysics()` in `server/index.ts`

#### Performance Issues
- Reduce number of players (reduces board size)
- Minimize browser tab switching
- Close other applications
- Close browser DevTools (improves performance)

#### Kill Count Not Working
1. Check 500ms cooldown (wait time)
2. Verify stone completely left board
3. Note: Kill counted slightly after collision

### Production Deployment

#### Build Client

```bash
cd client
npm run build

# Creates dist/ folder with static files
# Host these with web server (Nginx, Apache)
```

#### Deploy Server

```bash
cd server

# Compile TypeScript to JavaScript
npx tsc

# Run with Node.js (production)
node index.js

# Or use PM2 for process management
npm install -g pm2
pm2 start index.js --name "alkkagi-server"
pm2 save
pm2 startup
```

#### Set Environment Variables

```bash
# Create server/.env
PORT=3001

# Used in server/index.ts
const PORT = process.env.PORT || 3001;
```

### Production Checklist

- [ ] Configure `client/.env` (API endpoint)
- [ ] Configure `server/.env` (port, database, etc.)
- [ ] Review CORS settings (`server/index.ts` lines 12-16)
- [ ] Test client build
- [ ] Run server type check
- [ ] Set up log monitoring
- [ ] Run performance tests

---

## Environment Variables

### Client

No environment variables currently required. Server address is entered at runtime.

### Server

**.env.example**:
```
PORT=3001
```

**.env** (actual file):
```bash
# Change port if needed
PORT=3001
```

**Usage**:
```typescript
// server/index.ts
const PORT = process.env.PORT || 3001;
```

---

## File Responsibilities

### Client Files

| File | Lines | Responsibility |
|------|-------|-----------------|
| `src/App.tsx` | 260 | Main component, socket management, game logic |
| `src/components/GameCanvas.tsx` | 134 | Game board rendering, drag visualization |
| `src/components/LeaderBoard.tsx` | 28 | Leaderboard display |
| `src/components/KillNotifications.tsx` | 30 | Kill notification display |
| `src/App.css` | varies | Game UI styling |

### Server Files

| File | Lines | Responsibility |
|------|-------|-----------------|
| `index.ts` | 170 | Socket.io server, game state, collision/kill handling |
| `physics.ts` | 91 | Physics calculations (collisions, friction, growth) |
| `constants.ts` | 8 | Game constants definition |

---

## Type Definitions

### Shared Types

```typescript
interface Stone {
  id: string;           // Unique ID
  playerId: string;     // Player ID (socket ID)
  nickname: string;     // Player nickname
  x: number;            // X coordinate
  y: number;            // Y coordinate
  vx: number;           // X axis velocity
  vy: number;           // Y axis velocity
  color: string;        // Stone color (HSL)
  radius: number;       // Stone radius
  mass: number;         // Stone mass
  lastHitBy: string | null;  // Last collision player ID
}

interface Player {
  id: string;           // Socket ID
  nickname: string;     // Player nickname
  color: string;        // Stone color
  stoneId: string;      // Associated stone ID
  kills: number;        // Kill count
  lastFlickTime: number; // Last flick timestamp
}

interface GameState {
  stones: Stone[];
  players: { [id: string]: Player };
  boardSize: number;
  rankings: { nickname: string, kills: number, color: string }[];
}
```

---

## Troubleshooting

### Server Won't Start

```bash
# Check if port is in use
lsof -i :3001

# Kill process
kill -9 <PID>

# Start on different port
PORT=3002 npm run dev
```

### Client Can't Connect to Server

1. Verify server running at `localhost:3001`
2. Check firewall isn't blocking port 3001
3. Check browser console for error messages
4. Verify correct server IP entered

### Game Running Slow

- Reduce number of players (reduces board size)
- Minimize browser tab switching
- Close other applications
- Close browser DevTools (improves performance)

### Kills Not Counting

1. Check 500ms cooldown requirement
2. Verify stone completely left board
3. Note: Kill counted slightly after collision

---

## License

This project is distributed under the MIT License.
