import { Card, CardContent, Typography, Stack, Button } from '@mui/material';
import { CounterState, CollaborativeSessionReturn } from '../types/models';

type Props = {
  counter: CounterState;
  onChange: CollaborativeSessionReturn['updateCounter'];
};

export function CounterPanel({ counter, onChange }: Props) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Shared Counter</Typography>

        <Typography variant="h3" textAlign="center" my={2}>
          {counter.value}
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="contained" onClick={() => onChange(-1)}>
            -
          </Button>
          <Button variant="contained" onClick={() => onChange(1)}>
            +
          </Button>
        </Stack>

        {counter.lastUpdatedBy && (
          <Typography variant="caption" display="block" mt={2}>
            Last updated at{' '}
            {new Date(counter.lastUpdatedAt!).toLocaleTimeString()}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
