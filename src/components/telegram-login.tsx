import { api, botId, botTelegramId } from '../modules/api';
import { UserBot } from '../types';
import session from '../modules/session';
import { runInAction } from 'mobx';

export type TelegramAuthData = {
  id: number;
  first_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
};

export const telegramLogin = (): Promise<{ data: TelegramAuthData; ub: UserBot; token: string } | false> => {
  return new Promise((resolve, reject) => {
    // @ts-ignore
    window.Telegram.Login.auth({ bot_id: botTelegramId, request_access: true }, (data: TelegramAuthData) => {
      if (!data) return reject('Login failed');
      return api
        .post(`/bot/${botId}/oauth`, { data })
        .then(({ ub, token }: { ub: UserBot; token: string }) => {
          localStorage.setItem('token', token);
          api.setToken(token);
          runInAction(() => (session.ub = ub));
          resolve({ data, ub, token });
        })
        .catch(reject);
    });
  });
};
