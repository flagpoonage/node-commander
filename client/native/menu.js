import { remote } from 'electron';
import AppStore from '../store';
import { openPackage } from '../actions/open-package';
const { Menu, app } = remote;

const template = [{
  label: 'File',
  submenu: [{
    label: 'Open package file...',
    click: () => openPackage(AppStore.dispatch)
  }]
}];

if (remote.process.platform === 'darwin') {
  const name = require('electron').remote.app.getName();

  template.unshift({
    label: name,
    submenu: [{
      label: 'About ' + name,
      role: 'about'
    },
    {
      type: 'separator'
    },
    {
      label: 'Services',
      role: 'services',
      submenu: []
    },
    {
      type: 'separator'
    },
    {
      label: 'Hide ' + name,
      accelerator: 'Command+H',
      role: 'hide'
    },
    {
      label: 'Hide Others',
      accelerator: 'Command+Alt+H',
      role: 'hideothers'
    },
    {
      label: 'Show All',
      role: 'unhide'
    },
    {
      type: 'separator'
    },
    {
      label: 'Quit',
      accelerator: 'Command+Q',
      click() { app.quit(); }
    }]
  });

  template.push({
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        role: 'undo'
      },
      {
        label: 'Redo',
        accelerator: 'Shift+CmdOrCtrl+Z',
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut'
      },
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy'
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste'
      },
      {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectall'
      }
    ]
  });
}

const AppMenu = Menu.buildFromTemplate(template);

export default AppMenu;
