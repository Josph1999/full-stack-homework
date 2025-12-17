'use client'

import { Box, Tooltip } from '@mui/material';
import { CursorPosition } from '../types/models';
import { useEffect, useState } from 'react';

type Props = {
  cursors: CursorPosition[];
};

export function CursorIndicators({ cursors }: Props) {
  return (
    <>
      {cursors.map((cursor) => (
        <CursorPointer key={cursor.userId} cursor={cursor} />
      ))}
    </>
  );
}

function CursorPointer({ cursor }: { cursor: CursorPosition }) {
  const [visible, setVisible] = useState(true);

  // Hide cursor after 3 seconds of inactivity
  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timer);
  }, [cursor.x, cursor.y]);

  if (!visible) return null;

  return (
    <Tooltip title={cursor.username} arrow placement="top">
      <Box
        sx={{
          position: 'fixed',
          left: cursor.x,
          top: cursor.y,
          pointerEvents: 'none',
          zIndex: 9999,
          transform: 'translate(-50%, -50%)',
          transition: 'all 0.1s ease-out',
          animation: 'fadeIn 0.2s ease-in'
        }}
      >
        <Box
          sx={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            bgcolor: cursor.avatarColor,
            border: '2px solid white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '10px',
            fontWeight: 'bold'
          }}
        >
          {cursor.username.charAt(0)}
        </Box>
        <style jsx global>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translate(-50%, -50%) scale(0.8);
            }
            to {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1);
            }
          }
        `}</style>
      </Box>
    </Tooltip>
  );
}
