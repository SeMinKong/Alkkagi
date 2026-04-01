import React from 'react';

interface RankEntry {
  nickname: string;
  kills: number;
  color: string;
}

interface LeaderBoardProps {
  rankings: RankEntry[];
}

function LeaderBoard({ rankings }: LeaderBoardProps) {
  return (
    <div className="leaderboard">
      <h3>Leaderboard</h3>
      {rankings.map((rank, i) => (
        <div key={i} className="rank-item">
          <span className="rank-num">{i + 1}.</span>
          <span className="rank-name" style={{ color: rank.color }}>{rank.nickname}</span>
          <span className="rank-kills">{rank.kills}</span>
        </div>
      ))}
    </div>
  );
}

export default LeaderBoard;
