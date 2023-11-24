import { observer } from 'mobx-react';
import { Route, Routes } from 'react-router-dom';
import Main from './routes/main';
import session from './modules/session';

const App = observer(() => {
  return (
    <div className="app">
      {session.ready ? (
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="*" element={<div>Not found</div>} />
        </Routes>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
});

export default App;
