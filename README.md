# Alkkagi.io

**[English Version](./README.en.md)**

전통적인 알까기 놀이를 현대적인 웹 기술로 재해석한 **Alkkagi.io**입니다. 이 프로젝트는 실시간 멀티플레이어 환경에서의 정밀한 물리 동기화와 커스텀 물리 엔진 구현에 중점을 두었습니다.

## 프로젝트 개요

Alkkagi.io는 플레이어가 자신의 돌을 튕겨 상대방을 보드 밖으로 밀어내는 실시간 아레나 게임입니다. 상대를 제거할 때마다 돌의 크기와 무게가 커지며, 이는 전장에서 더 강력한 힘을 갖게 함과 동시에 기동성이 낮아지는 전략적 재미를 제공합니다.

- **실시간 멀티플레이어**: Socket.io를 활용하여 저지연(Low-latency) 상호작용을 구현했습니다.
- **커스텀 물리 엔진**: 외부 라이브러리 없이 충돌, 마찰, 모멘텀을 계산하는 경량 물리 엔진을 직접 작성했습니다.
- **동적 아레나**: 플레이어 수에 따라 게임 보드 크기가 실시간으로 확장 및 축소됩니다.
- **성장 시스템**: 킬 수에 따라 돌의 물리적 특성(반경, 질량)이 변하는 성장 메커니즘을 포함합니다.

## 기술 스택

- **Frontend**: React 19, TypeScript, Vite
- **Backend**: Node.js, Express, Socket.io
- **Physics**: TypeScript 기반 커스텀 물리 모듈
- **Styling**: 고성능 렌더링을 위한 Vanilla CSS

## 프로젝트 구조

```text
Alkkagi/
├── client/           # React 프론트엔드 (Vite 기반)
│   ├── src/
│   │   ├── components/  # Canvas 렌더링 및 UI 컴포넌트
│   │   └── App.tsx      # 소켓 관리 및 코어 비즈니스 로직
├── server/           # Node.js 백엔드
│   ├── index.ts      # 소켓 이벤트 핸들러 및 60FPS 게임 루프
│   ├── physics.ts    # 충돌 처리 및 물리 시뮬레이션 로직
│   └── constants.ts  # 게임 밸런스 상수 정의
```

## 주요 기술적 도전

### 1. 실시간 물리 동기화
다양한 네트워크 환경에서도 모든 플레이어가 동일한 물리적 상태를 공유하도록 서버를 **Source of Truth**로 설정했습니다. 서버는 60 FPS로 물리 시뮬레이션을 수행하고, 계산된 상태를 모든 클라이언트에 브로드캐스팅합니다.

### 2. 정밀한 충돌 로직 구현
Matter.js와 같은 무거운 엔진 대신, 프로젝트에 최적화된 물리 모듈을 구현하여 다음을 해결했습니다.
- **탄성 충돌(Elastic Collisions)**: 질량과 속도에 기반한 임펄스(Impulse) 계산.
- **위치 보정(Position Correction)**: 고속 충돌 시 돌들이 서로 겹치는 현상 방지.
- **동적 스케일링**: 실시간으로 변화하는 질량과 반경에 따른 물리 반응 차별화.

## 시작하기

### 사전 요구사항
- Node.js (v18 이상)
- npm

### 설치 및 실행

1. **저장소 클론**
   ```bash
   git clone https://github.com/your-repo/Alkkagi.git
   cd Alkkagi
   ```

2. **서버 실행**
   ```bash
   cd server
   npm install
   npm run dev
   ```

3. **클라이언트 실행**
   ```bash
   cd ../client
   npm install
   npm run dev
   ```

## 게임 방법

1. 닉네임을 입력하고 서버에 접속합니다.
2. 금색 테두리로 표시된 자신의 돌을 **클릭 후 반대 방향으로 드래그**합니다.
3. 마우스를 놓으면 돌이 튕겨 나갑니다. 드래그 거리가 멀수록 힘이 강해집니다.
4. 상대를 밀어내어 돌을 키우고 리더보드의 정상을 차지하세요!

>  **더 자세한 정보가 필요하신가요?**
> 상세한 기술 명세, API 연동 방식, 하이퍼파라미터 등은 [상세 매뉴얼(DETAILS.md)](./DETAILS.md)에서 확인하실 수 있습니다.

---
Developed with  by [Your Name/Github]
