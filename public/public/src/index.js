import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import TrainAlertApp from './TrainAlertApp';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <TrainAlertApp />
  </React.StrictMode>
);

serviceWorkerRegistration.register();
