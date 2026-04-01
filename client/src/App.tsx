import React, { useState, useRef, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import './App.css';
import KillNotifications from './components/KillNotifications';
import LeaderBoard from './components/LeaderBoard';
import GameCanvas from './components/GameCanvas';

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
  // Connection state
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [serverIP, setServerIP] = useState<string>(window.location.hostname);
  const [nickname, setNickname] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Game state
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [myId, setMyId] = useState<string | null>(null);
  const [killLogs, setKillLogs] = useState<KillLog[]>([]);

  // Drag/flick state
  const [dragStart, setDragStart] = useState<{ x: number, y: number } | null>(null);
  const [dragEnd, setDragEnd] = useState<{ x: number, y: number } | null>(null);
  const [selectedStoneId, setSelectedStoneId] = useState<string | null>(null);

  // Board display state
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
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [updateScale]);

  // Cooldown animation loop
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

  const connectToServer = useCallback(() => {
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

    newSocket.on('init', ({ gameState: initState, myId: initMyId }) => {
      setGameState(initState);
      setMyId(initMyId);
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
  }, [nickname, serverIP]);

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
      setLastFlickTime(Date.now());

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

  const handleMouseDown = useCallback((stone: Stone) => {
    if (!socket || !gameState || myId !== stone.playerId || cooldownProgress > 0) return;
    setDragStart({ x: stone.x, y: stone.y });
    setDragEnd({ x: stone.x, y: stone.y });
    setSelectedStoneId(stone.id);
  }, [socket, gameState, myId, cooldownProgress]);

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

      <LeaderBoard rankings={gameState?.rankings ?? []} />

      <KillNotifications killLogs={killLogs} />

      <GameCanvas
        stones={gameState?.stones ?? []}
        boardSize={gameState?.boardSize ?? 500}
        boardScale={boardScale}
        boardRef={boardRef}
        myId={myId}
        cooldownProgress={cooldownProgress}
        selectedStoneId={selectedStoneId}
        dragStart={dragStart}
        dragEnd={dragEnd}
        onMouseDown={handleMouseDown}
      />
    </div>
  );
}

export default App;
