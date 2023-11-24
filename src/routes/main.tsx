import React from 'react';
import session from '../modules/session';
import { observer } from 'mobx-react';
import { Avatar, IconButton, Stack } from '@mui/material';
import { Logout } from '@mui/icons-material';
import TelegramLogin from '../components/telegram-login';

const Main = observer(() => {
  return (
    <div>
      <Stack direction="row" justifyContent="space-between">
        <Stack>LOGO</Stack>
        <Stack>NAV</Stack>

        {session.ub ? (
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar src={session.ub.user.photoUrl ?? ''}>
              {session.ub.user.username?.substring(0, 1).toUpperCase()}
            </Avatar>
            <Stack>
              <b>{session.ub.user.firstName ?? `@${session.ub.user.username || session.ub.user.id}`}</b>
              <small>Бесплатный тариф</small>
            </Stack>
            <IconButton onClick={session.logout}>
              <Logout />
            </IconButton>
          </Stack>
        ) : (
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar>Д</Avatar>
            <Stack>
              <b>Демо пользователь</b>
              <small>Бесплатный тариф</small>
            </Stack>
            <TelegramLogin />
          </Stack>
        )}
      </Stack>
    </div>
  );
});

export default Main;
