import { useCallback } from 'react';
import { api } from '../modules/api';
import { UserBot } from '../types';
import session from '../modules/session';
import { observer } from 'mobx-react';

const Main = observer(() => {
  const auth = useCallback(() => {
    // @ts-ignore
    window.Telegram.Login.auth({ bot_id: '6495023612', request_access: true }, (data: any) => {
      if (!data) return;
      console.log(data);
      api
        .post('/bot/1/oauth', { data })
        .then(({ ub, token }: { ub: UserBot; token: string }) => {
          localStorage.setItem('token', token);
          session.ub = ub;
        })
        .catch(alert);
    });
  }, []);

  return (
    <div>
      {session.ub ? (
        <div>
          <p>
            Hello, <b>{session.ub.user.username}</b>!
          </p>
          {session.ub.user.photoUrl && <img alt="" src={session.ub.user.photoUrl} />}
          <p>
            <button onClick={session.logout}>Exit</button>
          </p>
        </div>
      ) : (
        <button onClick={auth}>Auth via Telegram</button>
      )}
    </div>
  );
});

export default Main;
