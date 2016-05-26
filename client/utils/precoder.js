'use strict';

// Reverse a map so its keys become its values and vice versa
const reverseMap = (map, keepval) => {
  let output = {};
  for(let i in map) {
    if(i === 'keys') {
      continue;
    }

    output[map[i]] = keepval ? map[i] : i;
  }

  return output;
};

/*

  START - ANSI CSI codes

*/

// The ANSI escape character 0x1B, and the open square bracket [
const ESC_S = [27,91];

// The letter 'm' denoting the end of an ANSI sequence.
const ESC_E = 109;

// Ranges for forground and background colours
const FG_COLOUR = { start: 30, end: 37 };
const BG_COLOUR = { start: 40, end: 47 };

// List of colour codes and corresponding strings
const COLOUR_LIST = {
  '0': 'black',
  '1': 'red',
  '2': 'green',
  '3': 'yellow',
  '4': 'blue',
  '5': 'magenta',
  '6': 'cyan',
  '7': 'white',
  keys: [0,1,2,3,4,5,6,7]
};

// List of font modifiers codes and corresponding strings
const MOD_LIST = {
  '1': 'bold',
  '3': 'italic',
  '4': 'underline',
  '7': 'inverse',
  '9': 'strike',
  keys: [1,3,4,7,9]
};

// List of style reset codes and corresponding strings
const RESET_LIST = {
  '0': 'all',
  '22': 'bold',
  '23': 'italic',
  '24': 'underline',
  '27': 'inverse',
  '29': 'strike',
  '39': 'fg',
  '49': 'bg',
  keys: [0,22,23,24,27,29,39,49]
};

const MOD_MAP = {
  codes: reverseMap(MOD_LIST),
  strings: reverseMap(MOD_LIST, true)
};

const RESET_MAP = {
  codes: reverseMap(RESET_LIST),
  strings: reverseMap(RESET_LIST, true)
};

const STYLES = {
  reset: 'reset',
  mod: 'mod',
  fg: 'fg',
  bg: 'bg'
};

/*

  END - ANSI CSI codes

*/

/*

  START - Sugary sweet closures

*/


// Create a byte pushing closure. Just for some sweet syntactic sugar.
const createBytePusher = (o, b) => (s, e) => {
  if(s === e) {
    return;
  }

  var bstring = bytesToString(b.slice(s, e));
  //console.log('Byte string is', '\"' + bstring + '\"');
  o.output.push(bstring);
  //console.log('Current output after bpush', o);

};

// Create a reset applicator closure
const createResetApplier = (s, o) => (t, v) => applyReset(s, o, t, v);

/*

  END - Sugary sweet closures

*/

// Converts an array of bytes into a string
const bytesToString = input => input.reduce((acc, val) => acc += String.fromCharCode(val), '');

// Returns a style modifier element based on the input code
const getCode = input => {
  let code = Number(input);

  // Foreground colour code
  if(code >= FG_COLOUR.start && code <= FG_COLOUR.end) {
    return { type: STYLES.fg, value: COLOUR_LIST[code - FG_COLOUR.start] };
  }

  // Background colour code
  if(code >= BG_COLOUR.start && code <= BG_COLOUR.end) {
    return { type: STYLES.bg, value: COLOUR_LIST[code - BG_COLOUR.start] };
  }

  // Reset code
  if(RESET_LIST.keys.indexOf(code) > -1) {
    return { type: STYLES.reset, value: RESET_LIST[code] };
  }

  // Font style code
  if(MOD_LIST.keys.indexOf(code) > -1) {
    return { type: STYLES.mod, value: MOD_LIST[code] };
  }
};

// Generate a style output object from a parsed style
const generateStyle = s => ({ style: s.type + '-' + s.value, output: [] });

// Nest a list of styles together
const nestStyleList = styles => {
  //console.log('Nesting style list');
  if(styles.length > 0) {
    let base = generateStyle(styles[0]);
    let s = base;
    for(var i = 1; i < styles.length; i++) {
      s = nestStyle(s, styles[i]);
    }

    //console.log('Base style', base);

    return {
      block: base,
      current: s
    };
  }
};

// Nests a single style into its parent and returns the nested style output.
const nestStyle = (parent, style) => {
  var s = generateStyle(style);
  s.parent = parent;
  parent.output.push(s);

  return s;
};

// Applies a reset to the currently applied styles, and sets the current output
// nesting object.
const applyReset = (appliedStyles, currentOutput, rtype, rvalue) => {
  //console.log('Reset begins');
  let prepop = [];
  let popped = [];

  for(let i = appliedStyles.length - 1; i >= 0; i--) {
    // If it's not the style we're looking for, add them to a list,
    // so they can be reappended once we step back from the current style.
    if(appliedStyles[i].type === rtype && (!rvalue || appliedStyles[i].value === rvalue)) {
      popped = prepop.concat(popped);
      prepop = [];
    }
    else {
      prepop.unshift(appliedStyles[i]);
    }
  }

  //console.log('Prepop', prepop);
  //console.log('Popped', popped);
  let stepout = appliedStyles.length;
  while(stepout > prepop.length) {
    //console.log('Stepping back', currentOutput.parent.output);
    let prevOutput = currentOutput;
    currentOutput = currentOutput.parent;
    delete prevOutput.parent;
    //console.log('Stepped out', currentOutput);
    stepout--;
  }

  appliedStyles = prepop.concat(popped);

  let styleblock = nestStyleList(popped);

  if(styleblock) {
    //console.log('Check', currentOutput);
    styleblock.base.parent = currentOutput;
    currentOutput.output.push(styleblock);
    currentOutput = styleblock.current;
    //console.log('Check', currentOutput);
  }
  //console.log('Final', currentOutput);

  return {
    output: currentOutput,
    styles: appliedStyles
  };
};

const precode = bytes => {
  let output = {
    style: 'base',
    output: []
  };

  let cursor = 0;
  let valid = bytes.length > 0;
  let appliedStyles = [];
  let currentOutput = output;

  // DEBUG
  let loop = 0;

  while(valid) {
    loop++
    //console.log('Current loop', loop, 'Cursor at:', cursor);
    // Create a data pusher for the current output and byte sequence
    let pusher = createBytePusher(currentOutput, bytes);

    // Find the first ANSI escape character
    let idx = bytes.indexOf(ESC_S[0], cursor);

    // If none exists in the data, break the loop. Output the remainder of the data
    if(idx === -1) {
      //console.log('No more escapes found');
      pusher(cursor);
      break;
    }

    //console.log('Next escape index', idx);

    // Otherwise push all text up to the start of the ASCI sequence
    pusher(cursor, idx);

    // If the control character is found but the open '[' is missing this is
    // not a valid sequence, we omit the single byte, increment the cursor
    // so that the next loop doesn't check the same byte, and start again.
    if(bytes[idx + 1] !== ESC_S[1]) {
      cursor = idx + 1;
      //console.log('Not a true escape sequence', 'Cursor at', cursor);
      continue;
    }

    // Otherwise Increment the cursor to move past the open '[';
    cursor = idx + 2;

    //console.log('Cursor incremeneted to', cursor);

    // Find the index of the end ASCI sequence
    let edx = bytes.indexOf(ESC_E, cursor);

    // If an end point isnt found, it's not a valid escape code,
    // and we can't continue, so break at this point and push the
    // remainder of the data
    if(edx === -1) {
      //console.log('No end index found, breaking.');
      pusher(idx);
      break;
    }

    // Move the cursor past the ASCI byte sequence
    cursor = edx + 1;

    //console.log('Cursor moved past sequence to', cursor);

    // Extract the ASCI sequence ie 34 or 35;42
    let sequence = bytesToString(bytes.slice(idx + 2, edx));

    //console.log('Extracted sequence', sequence);

    let attrib = sequence.split(';').map(code => getCode(code)).filter(a => typeof a !== 'undefined');
    let resets = attrib.filter(a => a.type === STYLES.reset);
    let styles = attrib.filter(a => a.type !== STYLES.reset);

    //console.log('Extracted resets', resets);
    //console.log('Extracted styles', styles);

    // For each reset (there should only be one per sequence) perform the reset steps
    resets.forEach(r => {
      //console.log('Running reset', r);
      if(r.value === RESET_MAP.strings.all) {
        // Reset back to root object output.
        //console.log('Resetting all');
        currentOutput = output;
        appliedStyles = [];
      }
      else {
        let results = null;
        let applyReset = createResetApplier(appliedStyles, currentOutput);
        switch(r.value) {
        case RESET_MAP.strings.bold:
          results = applyReset(STYLES.mod, MOD_MAP.strings.bold);
          break;
        case RESET_MAP.strings.italic:
          results = applyReset(STYLES.mod, MOD_MAP.strings.italic);
          break;
        case RESET_MAP.strings.underline:
          results = applyReset(STYLES.mod, MOD_MAP.strings.underline);
          break;
        case RESET_MAP.strings.inverse:
          results = applyReset(STYLES.mod, MOD_MAP.strings.inverse);
          break;
        case RESET_MAP.strings.strike:
          results = applyReset(STYLES.mod, MOD_MAP.strings.strike);
          break;
        case RESET_MAP.strings.fg:
          results = applyReset(STYLES.fg);
          break;
        case RESET_MAP.strings.bg:
          results = applyReset(STYLES.bg);
          break;
        }

        currentOutput = results.output;
        appliedStyles = results.styles;

        //console.log('Reset applied');
        //console.log('Current output after reset', currentOutput);
        //console.log('Applied styles after reset', appliedStyles);
      }
    });

    styles.forEach(s => {
      //console.log('Applying style', s);
      currentOutput = nestStyle(currentOutput, s);
      appliedStyles.push(s);

      //console.log('Current output after style', currentOutput);
      //console.log('Applied styles after style', appliedStyles);
    });
  }

  return output;
};

module.exports = precode;
