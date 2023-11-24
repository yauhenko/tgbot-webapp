import React, { useCallback, useEffect } from 'react';
import session from '../modules/session';
import { observer, useLocalObservable } from 'mobx-react';
import { Alert, Avatar, Button, CircularProgress, IconButton, MenuItem, Stack, TextField } from '@mui/material';
import { Check, Logout, Star, Warning } from '@mui/icons-material';
import { telegramLogin } from '../components/telegram-login';
import { HashLink } from 'react-router-hash-link';
import { Category, Status } from '../types';
import { runInAction } from 'mobx';
import { api, botId } from '../modules/api';
import { toast } from 'react-toastify';

type State = {
  loading: boolean;
  status?: Status;
  category?: Category;
  categories?: Category[];
  subcategory?: Category;
  subcategories?: Category[];
  query: string;
};

const Main = observer(() => {
  const state = useLocalObservable<State>(() => ({
    loading: false,
    query: '',
  }));

  const setSubcategory = useCallback(
    (c: Category) => {
      runInAction(() => (state.subcategory = c));
    },
    [state],
  );

  const setCategory = useCallback(
    (c: Category) => {
      console.log(c);
      runInAction(() => {
        state.category = c;
        state.subcategory = undefined;
        state.subcategories = undefined;
      });
      if (c.isParent) {
        api.get(`/bot/${botId}/categories`, { pid: c.id }).then((res) => {
          runInAction(() => {
            state.subcategories = res;
            setSubcategory(res[0]);
          });
        });
      } else {
        setSubcategory(c);
      }
    },
    [state, setSubcategory],
  );

  const submit = useCallback(() => {
    runInAction(() => {
      state.loading = true;
      state.status = undefined;
    });
    api
      .post(`/bot/${botId}/category/${state.subcategory!.id}/query`, { query: state.query })
      .then((status: Status) => {
        runInAction(() => (state.status = status));
        const interval = setInterval(() => {
          api
            .get(`/status/${status.id}`)
            .then((status: Status) => {
              runInAction(() => (state.status = status));
              if (['done', 'fail'].includes(status.status)) {
                clearInterval(interval);
                runInAction(() => (state.loading = false));
              }
            })
            .catch((e) => {
              clearInterval(interval);
              toast.error(e);
              runInAction(() => (state.loading = false));
            });
        }, 1000);
      })
      .catch((e) => {
        toast.error(e);
        runInAction(() => (state.loading = false));
      });
  }, [state]);

  useEffect(() => {
    api.get(`/bot/${botId}/categories`).then((res) =>
      runInAction(() => {
        state.categories = res;
        setCategory(res[0]);
      }),
    );
  }, [state, setCategory]);

  return (
    <div>
      <Stack direction="row" justifyContent="space-between">
        <Stack>LOGO</Stack>
        <Stack direction="row" spacing={2}>
          <HashLink to="#query" smooth>
            Составить текст
          </HashLink>
          <HashLink to="#tools" smooth>
            Инструменты
          </HashLink>
          <HashLink to="#reviews" smooth>
            Отзывы
          </HashLink>
          <HashLink to="#support" smooth>
            Поддержка
          </HashLink>
        </Stack>
        {session.ub ? (
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar src={session.ub.user.photoUrl ?? ''}>
              {session.ub.user.username?.substring(0, 1).toUpperCase()}
            </Avatar>
            <Stack>
              <b>{session.ub.user.firstName ?? `@${session.ub.user.username || session.ub.user.id}`}</b>
              {session.ub.isPlus ? <small>Тариф PLUS</small> : <small>Бесплатный тариф</small>}
            </Stack>
            <IconButton onClick={session.logout}>
              <Logout />
            </IconButton>
            {!session.ub.isPaid && (
              <Button
                variant="contained"
                onClick={() => (window.location.href = session.ub?.bot.paymentUrl!)}
                startIcon={<Star />}
              >
                Получить PLUS
              </Button>
            )}
          </Stack>
        ) : (
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar>Д</Avatar>
            <Stack>
              <b>Демо пользователь</b>
              <small className="cursor-poiner link" onClick={telegramLogin}>
                Авторизоваться
              </small>
            </Stack>
            <Button
              variant="contained"
              onClick={() => telegramLogin().then(() => (window.location.href = session.ub?.bot.paymentUrl!))}
              startIcon={<Star />}
            >
              Получить PLUS
            </Button>
          </Stack>
        )}
      </Stack>

      <div id="query">
        <h2>Составить текст</h2>
        <Stack spacing={2} alignItems="start">
          <Stack direction="row" spacing={2}>
            {state.categories && (
              <TextField value={state.category?.id ?? 0} select disabled={state.loading} label="Категория">
                {state.categories.map((c) => (
                  <MenuItem key={c.id} value={c.id} onClick={() => setCategory(c)}>
                    {c.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
            {state.subcategories && (
              <TextField value={state.subcategory?.id ?? 0} select disabled={state.loading} label="Инструмент">
                {state.subcategories.map((c) => (
                  <MenuItem key={c.id} value={c.id} onClick={() => setSubcategory(c)}>
                    {c.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          </Stack>

          {state.subcategory && (
            <>
              <div
                style={{ whiteSpace: 'pre-wrap' }}
                dangerouslySetInnerHTML={{ __html: state.subcategory.message ?? '' }}
              />
              <TextField
                disabled={state.loading}
                fullWidth
                value={state.query}
                onChange={(e) => runInAction(() => (state.query = e.target.value))}
                multiline
                label="Ваш запрос"
                required
              />
              <Button size="large" disabled={!state.query.length || state.loading} variant="contained" onClick={submit}>
                Отправить
              </Button>
              {state.status && (
                <>
                  <Stack direction="row" spacing={1} alignItems="center">
                    {state.loading && <CircularProgress size={20} />}
                    {state.status.status === 'wait' && <span>Задание в очереди</span>}
                    {state.status.status === 'work' && <span>Обработка запроса</span>}
                  </Stack>

                  {state.status.status === 'fail' && (
                    <Alert icon={<Warning />} color="error">
                      Ошибка! {state.status.error}
                    </Alert>
                  )}
                  {state.status.status === 'done' && (
                    <Alert icon={<Check />} color="success">
                      <div style={{ whiteSpace: 'pre-wrap' }}>{state.status.result}</div>
                      {state.status.truncated && (
                        <div>
                          <b>Результат обрезан до 1000 знаков</b>.{' '}
                          <span onClick={telegramLogin} className="link">
                            Авторизуйтесь
                          </span>
                          , чтобы получить полный результат
                        </div>
                      )}
                    </Alert>
                  )}
                </>
              )}
            </>
          )}
        </Stack>
      </div>

      {/*<div id="tools">*/}
      {/*  <h2>Tools</h2>*/}
      {/*  <p>sss</p>*/}
      {/*  <p>sss</p>*/}
      {/*  <p>sss</p>*/}
      {/*  <p>sss</p>*/}
      {/*  <p>sss</p>*/}
      {/*  <p>sss</p>*/}
      {/*  <p>sss</p>*/}
      {/*  <p>sss</p>*/}
      {/*  <p>sss</p>*/}
      {/*  <p>sss</p>*/}
      {/*  <p>sss</p>*/}
      {/*  <p>sss</p>*/}
      {/*  <p>sss</p>*/}
      {/*  <p>sss</p>*/}
      {/*  <p>sss</p>*/}
      {/*  <p>sss</p>*/}
      {/*  <p>sss</p>*/}
      {/*  <p>sss</p>*/}
      {/*</div>*/}
    </div>
  );
});

export default Main;
