import React from 'react';

interface KillLog {
  id: number;
  killer: string;
  victim: string;
  killerColor: string;
  victimColor: string;
}

interface KillNotificationsProps {
  killLogs: KillLog[];
}

function KillNotifications({ killLogs }: KillNotificationsProps) {
  return (
    <div className="kill-logs">
      {killLogs.map(log => (
        <div key={log.id} className="kill-log-item">
          <span style={{ color: log.killerColor }}>{log.killer}</span>
          <span className="kill-action"> ➔ </span>
          <span style={{ color: log.victimColor }}>{log.victim}</span>
        </div>
      ))}
    </div>
  );
}

export default KillNotifications;
