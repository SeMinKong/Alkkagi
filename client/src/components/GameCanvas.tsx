import React from 'react';

interface Stone {
  id: string;
  playerId: string;
  nickname: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  radius: number;
}

interface GameCanvasProps {
  stones: Stone[];
  boardSize: number;
  boardScale: number;
  boardRef: React.RefObject<HTMLDivElement>;
  myId: string | null;
  cooldownProgress: number;
  selectedStoneId: string | null;
  dragStart: { x: number; y: number } | null;
  dragEnd: { x: number; y: number } | null;
  onMouseDown: (stone: Stone) => void;
}

function GameCanvas({
  stones,
  boardSize,
  boardScale,
  boardRef,
  myId,
  cooldownProgress,
  selectedStoneId,
  dragStart,
  dragEnd,
  onMouseDown,
}: GameCanvasProps) {
  return (
    <div className="board-outer-container">
      <div
        className="board-wrapper"
        style={{ width: boardSize * boardScale, height: boardSize * boardScale }}
      >
        <div
          className="board alkkagi-board"
          ref={boardRef}
          style={{
            width: boardSize,
            height: boardSize,
            transform: `scale(${boardScale})`,
            transformOrigin: 'top left',
          }}
        >
          {stones.map((stone) => {
            const isMine = stone.playerId === myId;
            return (
              <div
                key={stone.id}
                className={`stone ${isMine ? 'my-stone' : ''} ${isMine && cooldownProgress > 0 ? 'cooldown' : ''}`}
                style={{
                  left: stone.x,
                  top: stone.y,
                  width: stone.radius * 2,
                  height: stone.radius * 2,
                  backgroundColor: stone.color,
                  transform: 'translate(-50%, -50%)',
                  zIndex: isMine ? 100 : 10,
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  onMouseDown(stone);
                }}
              >
                {isMine && cooldownProgress > 0 && (
                  <svg className="cooldown-svg" viewBox="0 0 100 100">
                    <circle
                      cx="50" cy="50" r="45"
                      fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="10"
                      strokeDasharray={`${cooldownProgress * 283} 283`}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                )}
                <span className="stone-nickname">{stone.nickname}</span>
              </div>
            );
          })}

          {selectedStoneId && dragEnd && (
            <svg className="flick-indicator" style={{ width: boardSize, height: boardSize }}>
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#f1c40f" />
                </marker>
              </defs>
              {(() => {
                const stone = stones.find(s => s.id === selectedStoneId);
                if (!stone || !dragStart) return null;

                const dx = dragStart.x - dragEnd.x;
                const dy = dragStart.y - dragEnd.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const maxVisualDist = 300;
                const visualScale = dist > maxVisualDist ? maxVisualDist / dist : 1;

                return (
                  <>
                    <line
                      x1={stone.x} y1={stone.y}
                      x2={stone.x - dx} y2={stone.y - dy}
                      stroke="rgba(255,255,255,0.2)" strokeWidth={2 / boardScale} strokeDasharray={5 / boardScale}
                    />
                    <line
                      x1={stone.x} y1={stone.y}
                      x2={stone.x + dx * visualScale}
                      y2={stone.y + dy * visualScale}
                      stroke="#f1c40f" strokeWidth={5 / boardScale}
                      markerEnd="url(#arrowhead)"
                    />
                  </>
                );
              })()}
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}

export default GameCanvas;
