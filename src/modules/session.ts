import { makeAutoObservable, runInAction } from 'mobx';
import { UserBot } from '../types';
import { api } from './api';

class Session {
  ub?: UserBot;
  ready: boolean = false;

  constructor() {
    makeAutoObservable(this);
    this.init();
  }

  init = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      runInAction(() => (this.ready = true));
      return;
    }
    api.setToken(token);
    this.fetch().finally(() => runInAction(() => (this.ready = true)));
    setInterval(this.fetch, 60000);
  };

  fetch = async () => {
    if (!localStorage.getItem('token')) {
      return;
    } else {
      try {
        const ub = await api.get(`/bot/1/users/me`);
        return runInAction(() => (this.ub = ub));
      } catch {
        this.logout();
      }
    }
  };

  logout = () => {
    runInAction(() => {
      this.ub = undefined;
      api.setToken(null);
      localStorage.removeItem('token');
    });
  };
}

const session = new Session();

export default session;
