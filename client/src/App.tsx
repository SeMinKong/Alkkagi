import React, { useState, useRef, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import './App.css';

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

interface Player {
  id: string;
  nickname: string;
  color: string;
  stoneId: string;
  kills: number;
}

interface KillLog {
  id: number;
  killer: string;
  victim: string;
  killerColor: string;
  victimColor: string;
}

interface GameState {
  stones: Stone[];
  players: { [id: string]: Player };
  boardSize: number;
  rankings: { nickname: string, kills: number, color: string }[];
}

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [myId, setMyId] = useState<string | null>(null);
  const [serverIP, setServerIP] = useState<string>(window.location.hostname);
  const [nickname, setNickname] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [killLogs, setKillLogs] = useState<KillLog[]>([]);

  const [dragStart, setDragStart] = useState<{ x: number, y: number } | null>(null);
  const [dragEnd, setDragEnd] = useState<{ x: number, y: number } | null>(null);
  const [selectedStoneId, setSelectedStoneId] = useState<string | null>(null);
  const [boardScale, setBoardScale] = useState(1);
  const [lastFlickTime, setLastFlickTime] = useState(0);
  const [cooldownProgress, setCooldownProgress] = useState(0);

  const boardRef = useRef<HTMLDivElement>(null);

  const updateScale = useCallback(() => {
    if (!gameState?.boardSize) return;
    const padding = 120;
    const availableWidth = window.innerWidth - padding;
    const availableHeight = window.innerHeight - padding - 60; 
    const scale = Math.min(availableWidth / gameState.boardSize, availableHeight / gameState.boardSize, 1);
    setBoardScale(scale);
  }, [gameState]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [updateScale]);

  // 쿨타임 애니메이션 루프
  useEffect(() => {
    const interval = setInterval(() => {
      if (lastFlickTime === 0) {
        setCooldownProgress(0);
        return;
      }
      const COOLDOWN_MS = 500;
      const elapsed = Date.now() - lastFlickTime;
      const progress = Math.max(0, 1 - elapsed / COOLDOWN_MS);
      setCooldownProgress(progress);
      if (progress === 0) setLastFlickTime(0);
    }, 16);
    return () => clearInterval(interval);
  }, [lastFlickTime]);

  const connectToServer = () => {
    if (!nickname.trim()) {
      setError('Please enter a nickname');
      return;
    }
    setError(null);
    const newSocket = io(`http://${serverIP}:3001`);
    
    newSocket.on('connect', () => {
      newSocket.emit('join', nickname);
      setIsConnected(true);
    });

    newSocket.on('connect_error', (err) => {
      setError(`Connection failed: ${err.message}`);
    });

    newSocket.on('init', ({ gameState, myId }) => {
      setGameState(gameState);
      setMyId(myId);
    });

    newSocket.on('gameStateUpdate', (newState) => {
      setGameState(newState);
    });

    newSocket.on('killNotification', (log: Omit<KillLog, 'id'>) => {
      const newLog = { ...log, id: Date.now() };
      setKillLogs(prev => [newLog, ...prev].slice(0, 5));
      setTimeout(() => {
        setKillLogs(prev => prev.filter(l => l.id !== newLog.id));
      }, 5000);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      setGameState(null);
    });

    setSocket(newSocket);
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!dragStart || !boardRef.current) return;
      const rect = boardRef.current.getBoundingClientRect();
      const BORDER_WIDTH = 15;
      const currentX = (e.clientX - rect.left) / boardScale - BORDER_WIDTH;
      const currentY = (e.clientY - rect.top) / boardScale - BORDER_WIDTH;
      setDragEnd({ x: currentX, y: currentY });
    };

    const handleGlobalMouseUp = (e: MouseEvent) => {
      if (!socket || !dragStart || !boardRef.current || !gameState || !selectedStoneId) {
        setDragStart(null);
        setDragEnd(null);
        setSelectedStoneId(null);
        return;
      }

      const rect = boardRef.current.getBoundingClientRect();
      const BORDER_WIDTH = 15;
      const endX = (e.clientX - rect.left) / boardScale - BORDER_WIDTH;
      const endY = (e.clientY - rect.top) / boardScale - BORDER_WIDTH;

      const dx = dragStart.x - endX;
      const dy = dragStart.y - endY;
      const rawDist = Math.sqrt(dx * dx + dy * dy);
      const maxVisualDist = 300;
      const cappedDist = Math.min(rawDist, maxVisualDist);

      const boardSize = gameState.boardSize;
      const sensitivity = (boardSize / 500) * 0.05; 
      const power = Math.pow(cappedDist, 1.3) * sensitivity;
      
      const angle = Math.atan2(dy, dx);
      const vx = Math.cos(angle) * power;
      const vy = Math.sin(angle) * power;

      socket.emit('flick', { vx, vy });
      setLastFlickTime(Date.now()); // 클라이언트 즉시 반영
      
      setDragStart(null);
      setDragEnd(null);
      setSelectedStoneId(null);
    };

    if (dragStart) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [dragStart, socket, boardScale, gameState, selectedStoneId]);

  const handleMouseDown = (stone: Stone) => {
    if (!socket || !gameState || myId !== stone.playerId || cooldownProgress > 0) return;
    setDragStart({ x: stone.x, y: stone.y });
    setDragEnd({ x: stone.x, y: stone.y });
    setSelectedStoneId(stone.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') connectToServer();
  };

  if (!isConnected) {
    return (
      <div className="lobby">
        <h1>Alkkagi.io</h1>
        <div className="connection-box">
          <input 
            type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} 
            onKeyDown={handleKeyDown} placeholder="Nickname" maxLength={10} autoFocus
          />
          <input 
            type="text" value={serverIP} onChange={(e) => setServerIP(e.target.value)} 
            onKeyDown={handleKeyDown} placeholder="Server IP"
          />
          {error && <p className="error-message">{error}</p>}
          <button onClick={connectToServer}>Play Now</button>
        </div>
      </div>
    );
  }

  const myPlayer = myId ? gameState?.players[myId] : null;

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>Alkkagi.io</h1>
        <div className="my-info">
          <span className="dot" style={{ backgroundColor: myPlayer?.color }}></span>
          <strong>{myPlayer?.nickname}</strong> | Kills: {myPlayer?.kills || 0}
        </div>
      </div>

      <div className="leaderboard">
        <h3>Leaderboard</h3>
        {gameState?.rankings.map((rank, i) => (
          <div key={i} className="rank-item">
            <span className="rank-num">{i + 1}.</span>
            <span className="rank-name" style={{ color: rank.color }}>{rank.nickname}</span>
            <span className="rank-kills">{rank.kills}</span>
          </div>
        ))}
      </div>

      <div className="kill-logs">
        {killLogs.map(log => (
          <div key={log.id} className="kill-log-item">
            <span style={{ color: log.killerColor }}>{log.killer}</span>
            <span className="kill-action"> ➔ </span>
            <span style={{ color: log.victimColor }}>{log.victim}</span>
          </div>
        ))}
      </div>

      <div className="board-outer-container">
        <div className="board-wrapper" style={{ width: (gameState?.boardSize || 500) * boardScale, height: (gameState?.boardSize || 500) * boardScale }}>
          <div 
            className="board alkkagi-board" 
            ref={boardRef}
            style={{ 
              width: gameState?.boardSize, 
              height: gameState?.boardSize,
              transform: `scale(${boardScale})`,
              transformOrigin: 'top left'
            }}
          >
            {gameState?.stones.map((stone) => {
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
                    zIndex: isMine ? 100 : 10
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    handleMouseDown(stone);
                  }}
                >
                  {/* Cooldown Loading Circle */}
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
              <svg className="flick-indicator" style={{ width: gameState?.boardSize, height: gameState?.boardSize }}>
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#f1c40f" />
                  </marker>
                </defs>
                {(() => {
                  const stone = gameState?.stones.find(s => s.id === selectedStoneId);
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
    </div>
  );
}

export default App;
