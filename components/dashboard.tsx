'use client'

import { ChatPanel } from '@/components/chat-panel';
import { CounterPanel } from '@/components/counter-panel';
import { UserList } from '@/components/user-list';
import { ActivityFeed } from '@/components/activity-feed';
import { CursorIndicators } from '@/components/cursor-indicators';
import { useCollaborativeSession } from '@/hooks/useCollaborativeSession';
import {
  Container,
  Grid,
  Typography,
  Box,
  IconButton,
  Skeleton,
  Stack,
  Fade
} from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useEffect } from 'react';

export default function Dashboard() {
  const {
    users,
    messages,
    counter,
    currentUserId,
    activities,
    cursors,
    theme,
    isLoading,
    sendMessage,
    deleteMessage,
    updateCounter,
    markTyping,
    toggleTheme,
    updateCursorPosition
  } = useCollaborativeSession();

  // Track cursor movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      updateCursorPosition(e.clientX, e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [updateCursorPosition]);

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Stack spacing={2}>
          <Skeleton variant="text" width={400} height={60} />
          <Grid container spacing={3}>
            {[1, 2, 3, 4].map((i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, lg: 3 }}>
                <Skeleton variant="rectangular" height={300} />
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Container>
    );
  }

  return (
    <>
      <CursorIndicators cursors={cursors} />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Fade in timeout={500}>
          <Box>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              mb={3}
              spacing={{ xs: 2, sm: 0 }}
            >
              <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
                Cross-Tab Collaboration Dashboard
              </Typography>

              <IconButton onClick={toggleTheme} color="inherit">
                {theme === 'dark' ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Stack>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <UserList users={users} />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <CounterPanel counter={counter} onChange={updateCounter} />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <ChatPanel
                  messages={messages}
                  currentUserId={currentUserId}
                  onSend={sendMessage}
                  onDelete={deleteMessage}
                  onTyping={markTyping}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <ActivityFeed activities={activities} />
              </Grid>
            </Grid>
          </Box>
        </Fade>
      </Container>
    </>
  );
}
