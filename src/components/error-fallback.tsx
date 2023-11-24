import {
  Button,
  colors,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from '@mui/material';
import { Warning } from '@mui/icons-material';

const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary(): void }) => {
  return (
    <Dialog open={true} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={0.5} color={colors.red[700]}>
          <Warning />
          <span>Oops! {error.name}</span>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <DialogContentText>{error.message}</DialogContentText>
          <details>
            <summary className="cursor-pointer">Stack trace</summary>
            <pre>{error.stack}</pre>
          </details>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => window.location.reload()}>Reload</Button>
        <Button onClick={resetErrorBoundary}>Reset</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ErrorFallback;
