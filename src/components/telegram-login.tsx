import { useCallback, useState } from 'react';
import { api, botId, botTelegramId } from '../modules/api';
import { UserBot } from '../types';
import session from '../modules/session';
import { CircularProgress, IconButton } from '@mui/material';
import { Login } from '@mui/icons-material';
import { toast } from 'react-toastify';

const TelegramLogin = () => {
  const [loading, setLoading] = useState(false);
  const auth = useCallback(() => {
    setLoading(true);
    // @ts-ignore
    window.Telegram.Login.auth({ bot_id: botTelegramId, request_access: true }, (data: any) => {
      if (!data) {
        setLoading(false);
        return;
      }
      api
        .post(`/bot/${botId}/oauth`, { data })
        .then(({ ub, token }: { ub: UserBot; token: string }) => {
          localStorage.setItem('token', token);
          session.ub = ub;
        })
        .catch(toast.error)
        .finally(() => setLoading(false));
    });
  }, [setLoading]);

  return (
    <IconButton title="Войти с помощью Telegram" disabled={loading} onClick={auth}>
      {loading ? <CircularProgress size={24} /> : <Login />}
    </IconButton>
  );
};

export default TelegramLogin;
