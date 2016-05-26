let path = require('path');
let precode = require('../utils/precoder');

const ERROR_ASCI = [27,91,51,49,109];

const normalizeScripts = (scripts) => {
  var output = [];
  for(var i in scripts) {
    output.push({
      label: i,
      command: scripts[i],
      data: [],
      process: null,
      returned: null
    });
  }

  return output;
};

const findScriptIndex = (label, scripts) => {
  for(var i = 0; i < scripts.length; i++) {
    if(scripts[i].label === label) {
      return i;
    }
  }

  return -1;
};

const updateScriptData = (data, label, scripts) => {
  let idx = findScriptIndex(label, scripts);
  if(idx !== -1) {
    scripts[idx].data.push(precode(data));
  }
};

const MainReducer = (state, action) => {
  let newState = Object.assign({}, state);

  switch(action.type) {
  case 'INIT':
    newState.initializing = true;
    newState.cwd = path.dirname(action.path);
    newState.pkg = null;
    break;
  case 'INIT_DONE':
    newState.initializing = false;
    newState.pkg = JSON.parse(action.pkg);
    newState.scripts = newState.pkg.scripts;
    newState.scriptsArray = normalizeScripts(newState.scripts);
    break;
  case 'INIT_ERROR':
    newState.initializing = false;
    newState.pkg = action.error;
    break;
  case 'SCRIPT_DATA':
    newState.scriptsArray = Array.prototype.slice.call(newState.scriptsArray);
    console.log('[' + action.data.map(a => a.toString()).join(',') + ']');
    updateScriptData(action.data, action.label, newState.scriptsArray);
    break;
  case 'SCRIPT_ERROR':
    newState.scriptsArray = Array.prototype.slice.call(newState.scriptsArray);
    console.log(action, action.data ? action.data.toString() : null);
    updateScriptData(ERROR_ASCI.concat(action.data), action.label, newState.scriptsArray);
    break;
  case 'SCRIPT_START':
  case 'SCRIPT_STOP':
    console.log(action, action.data ? action.data.toString() : null);
  }

  return newState;
};

export default MainReducer;
