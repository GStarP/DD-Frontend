import './emoji.css';

const EMOJI_MAP = {
  '😎': '1f60e',
  '😀': '1f600',
  '😠': '1f620',
  '😲': '1f632',
  '😞': '1f61e',
  '😵': '1f635',
  '😰': '1f630',
  '😒': '1f612',
  '😍': '1f60d',
  '😤': '1f624',
  '😝': '1f61d',
  '😋': '1f60b',
  '😘': '1f618',
  '😷': '1f637',
  '😳': '1f633',
  '😃': '1f603',
  '😅': '1f605',
  '😆': '1f606',
  '😁': '1f601',
  '😂': '1f602'
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

// TODO 受限于依赖库, 只能 20x20, 效果不佳
export default {
  EMOJI_MAP,
  textToEmoji,
  emojis: Object.keys(EMOJI_MAP)
};
