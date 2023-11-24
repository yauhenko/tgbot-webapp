import ReactDOM from 'react-dom/client';
import './assets/scss/styles.scss';
import App from './app';
import { BrowserRouter } from 'react-router-dom';
import 'moment/locale/ru';
import moment from 'moment';
moment.locale('ru');

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
