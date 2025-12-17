import { 
  Card, 
  CardContent, 
  Typography, 
  Stack, 
  Chip,
  Avatar,
  Box,
  Fade
} from '@mui/material';
import { User } from '../types/models';

type Props = {
  users: User[];
};

export function UserList({ users }: Props) {
  return (
    <Card>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            Active Users
          </Typography>
          <Chip 
            label={users.length} 
            size="small" 
            color="primary"
          />
        </Stack>

        <Stack spacing={1.5}>
          {users.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', py: 2 }}>
              No other users online
            </Typography>
          ) : (
            users.map((user) => (
              <Fade key={user.id} in timeout={300}>
                <Box>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                      p: 1.5,
                      borderRadius: 1,
                      transition: 'background-color 0.2s',
                      '&:hover': {
                        bgcolor: 'action.hover'
                      }
                    }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: user.avatarColor || 'primary.main',
                          fontSize: '0.875rem'
                        }}
                      >
                        {user.name?.charAt(0) || '?'}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {user.name || 'Unknown'}
                        </Typography>
                        {user.typing && (
                          <Typography variant="caption" color="text.secondary">
                            typing...
                          </Typography>
                        )}
                      </Box>
                    </Stack>

                    <Chip
                      size="small"
                      label={new Date(user.lastActive).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                      variant="outlined"
                    />
                  </Stack>
                </Box>
              </Fade>
            ))
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}