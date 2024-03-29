import React from 'react';
import * as ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import reportWebVitals from './reportWebVitals';
import store, {persistor} from './store';
import {injectStore} from './api';
import PrivacyCompliantPersistGate from './components/organisms/PrivacyCompliantPersistGate';
import App from './App';

import './styles/index.css';

injectStore(store);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PrivacyCompliantPersistGate persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PrivacyCompliantPersistGate>
    </Provider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
