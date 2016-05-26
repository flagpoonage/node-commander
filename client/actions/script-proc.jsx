import { spawn } from 'child_process';

const startScript = (script, cwd) => dispatch => {
  let cmds = script.command.split(' ');
  let cmd = cmds[0], args = ['--color','always'].concat(cmds.slice(1));

  let proc = spawn(cmd, args, { cwd: cwd });

  dispatch({
    type: 'SCRIPT_START',
    process: proc,
    cmd: cmd,
    args: args
  });

  proc.stdout.on('data', (data) => {
    dispatch({
      type: 'SCRIPT_DATA',
      label: script.label,
      data: data
    });
  });

  proc.stderr.on('data', (data) => {
    dispatch({
      type: 'SCRIPT_ERROR',
      label: script.label,
      data: data
    });
  });

  proc.on('close', (code) => {
    dispatch({
      type: 'SCRIPT_STOP',
      label: script.label,
      code: code
    });
  });
};

const stopScript = proc => {
  proc.exit();
};

export { startScript, stopScript };
