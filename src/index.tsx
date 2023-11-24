import ReactDOM from 'react-dom/client';
import './assets/scss/styles.scss';
import App from './app';
import { BrowserRouter } from 'react-router-dom';
import 'moment/locale/ru';
import moment from 'moment';
import ErrorFallback from './components/error-fallback';
import { ErrorBoundary } from 'react-error-boundary';
import { ToastContainer } from 'react-toastify';

moment.locale('ru');

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <BrowserRouter>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <App />
    </ErrorBoundary>
    <ToastContainer />
  </BrowserRouter>,
);
