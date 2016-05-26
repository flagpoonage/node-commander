import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { remote } from 'electron';
import MainWindow from './components/MainWindow';
import AppMenu from './native/menu';
import AppStore from './store';

window.__s = AppStore;

const initializeReactApp = () => {
  remote.Menu.setApplicationMenu(AppMenu);

  ReactDOM.render(
    <Provider store={AppStore}>
      <MainWindow />
    </Provider>,
    document.getElementById('main-window')
  );
};

document.addEventListener('DOMContentLoaded', initializeReactApp);
