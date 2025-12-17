import {
  Card,
  CardContent,
  Typography,
  TextField,
  IconButton,
  Stack
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { ChatMessage, CollaborativeSessionReturn } from '../types/models';
import { useState } from 'react';

type Props = {
  messages: ChatMessage[];
  currentUserId: string;
  onSend: CollaborativeSessionReturn['sendMessage'];
  onDelete: CollaborativeSessionReturn['deleteMessage'];
  onTyping: CollaborativeSessionReturn['markTyping'];
};

export function ChatPanel({
  messages,
  currentUserId,
  onSend,
  onDelete,
  onTyping
}: Props) {
  const [text, setText] = useState('');

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Chat
        </Typography>

        <Stack spacing={1} mb={2} maxHeight={300} overflow="auto" sx={{ px: { xs: 0.5, sm: 0 } }}>
          {messages.map((msg) => (
            <Stack
              key={msg.id}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ gap: 1 }}
            >
              <Typography variant="body2" sx={{ flex: 1, wordBreak: 'break-word' }}>
                <b>{msg.userId.slice(0, 4)}:</b> {msg.text}
              </Typography>

              {msg.userId === currentUserId && (
                <IconButton
                  size="small"
                  onClick={() => onDelete(msg.id)}
                  sx={{ flexShrink: 0 }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Stack>
          ))}
        </Stack>

        <TextField
          fullWidth
          size="small"
          placeholder="Type a message..."
          value={text}
          onFocus={() => onTyping(true)}
          onBlur={() => onTyping(false)}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && text.trim()) {
              onSend(text);
              setText('');
            }
          }}
        />
      </CardContent>
    </Card>
  );
}
