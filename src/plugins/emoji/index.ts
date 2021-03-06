import './emoji.css';

const EMOJI_MAP = {
  'π': '1f60e',
  'π': '1f600',
  'π ': '1f620',
  'π²': '1f632',
  'π': '1f61e',
  'π΅': '1f635',
  'π°': '1f630',
  'π': '1f612',
  'π': '1f60d',
  'π€': '1f624',
  'π': '1f61d',
  'π': '1f60b',
  'π': '1f618',
  'π·': '1f637',
  'π³': '1f633',
  'π': '1f603',
  'π': '1f605',
  'π': '1f606',
  'π': '1f601',
  'π': '1f602'
};
const _createRegexp = (map: any) => {
  var keys = Object.keys(map);
  keys.sort(function (a, b) {
    return b.length - a.length;
  });
  return new RegExp('(' + keys.join('|') + ')', 'g');
};

const EMOJI_REGEXP = _createRegexp(EMOJI_MAP);

const textToEmoji = (text: string) => {
  return text.replace(EMOJI_REGEXP, function (_, m) {
    // @ts-ignore
    var em = EMOJI_MAP[m];
    return `<span class="emoji emoji${em}"></span>`;
  });
};

// TODO ειδΊδΎθ΅εΊ, εͺθ½ 20x20, ζζδΈδ½³
export default {
  EMOJI_MAP,
  textToEmoji,
  emojis: Object.keys(EMOJI_MAP)
};
