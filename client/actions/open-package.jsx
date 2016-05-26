import { remote } from 'electron';
import { readFile } from 'fs';
const { dialog } = remote;

const openPackage = dispatch => {
  dispatch({
    type: 'PACKAGE_DIALOG'
  });

  dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'package', extensions: ['json'] }]
  }, result => {
    if(!result) {
      return;
    }

    dispatch(initializePackage(result[0]));
  });
};

const initializePackage = path => dispatch => {
  dispatch({
    type: 'PACKAGE_INIT',
    path: path
  });

  readFile(path, (err, data) => {
    if(err) {
      dispatch({
        type: 'PACKAGE_ERROR',
        error: err
      });
    }
    else {
      dispatch({
        type: 'PACKAGE_LOADED',
        pkg: data
      });
    }
  });
};

export { openPackage, initializePackage };
