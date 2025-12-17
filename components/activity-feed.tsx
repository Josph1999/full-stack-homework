import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  Avatar,
  Fade,
  Chip
} from '@mui/material';
import {
  ChatBubble,
  Delete,
  Add,
  Login,
  Logout,
  Brightness4,
} from '@mui/icons-material';
import { Activity } from '../types/models';

type Props = {
  activities: Activity[];
};

const getActivityIcon = (action: Activity['action']) => {
  switch (action) {
    case 'sent message':
      return <ChatBubble fontSize="small" />;
    case 'deleted message':
      return <Delete fontSize="small" />;
    case 'updated counter':
      return <Add fontSize="small" />;
    case 'joined':
      return <Login fontSize="small" />;
    case 'left':
      return <Logout fontSize="small" />;
    case 'changed theme':
      return <Brightness4 fontSize="small" />;
    default:
      return null;
  }
};

const getActivityColor = (action: Activity['action']) => {
  switch (action) {
    case 'sent message':
      return 'primary.main';
    case 'deleted message':
      return 'error.main';
    case 'updated counter':
      return 'success.main';
    case 'joined':
      return 'info.main';
    case 'left':
      return 'warning.main';
    case 'changed theme':
      return 'secondary.main';
    default:
      return 'text.secondary';
  }
};

export function ActivityFeed({ activities }: Props) {
  return (
    <Card>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            Activity Feed
          </Typography>
          <Chip
            label={activities.length}
            size="small"
            color="primary"
          />
        </Stack>

        <Stack spacing={1} maxHeight={400} overflow="auto" sx={{ px: { xs: 0.5, sm: 0 } }}>
          {activities.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', py: 2 }}>
              No recent activity
            </Typography>
          ) : (
            activities.map((activity) => (
              <Box key={activity.id}>
                <Fade in timeout={300}>
                  <Stack
                    direction="row"
                    spacing={{ xs: 1, sm: 1.5 }}
                    alignItems="flex-start"
                    sx={{
                      p: { xs: 1, sm: 1.5 },
                      borderRadius: 1,
                      transition: 'background-color 0.2s',
                      '&:hover': {
                        bgcolor: 'action.hover'
                      }
                    }}
                  >
                  <Avatar
                    sx={{
                      width: { xs: 28, sm: 32 },
                      height: { xs: 28, sm: 32 },
                      bgcolor: getActivityColor(activity.action),
                      fontSize: '0.75rem'
                    }}
                  >
                    {getActivityIcon(activity.action)}
                  </Avatar>

                  <Box flex={1} sx={{ minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={500} sx={{ fontSize: { xs: '0.813rem', sm: '0.875rem' } }}>
                      {activity.username}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        wordBreak: 'break-word',
                        display: 'block'
                      }}
                    >
                      {activity.action}
                      {activity.details && `: ${activity.details}`}
                    </Typography>
                  </Box>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      whiteSpace: 'nowrap',
                      fontSize: { xs: '0.688rem', sm: '0.75rem' }
                    }}
                  >
                    {new Date(activity.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Typography>
                  </Stack>
                </Fade>
              </Box>
            ))
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
