const translit = (str: string): string => {
  const ua = 'А-а-Б-б-В-в-Г-г-Д-д-Е-е-Є-є-Ж-ж-З-з-И-и-І-і-Ї-ї-Й-й-К-к-Л-л-' +
    'М-м-Н-н-О-о-П-п-Р-р-С-с-Т-т-У-у-Ф-ф-Х-х-Ц-ц-Ч-ч-Ш-ш-Щ-щ-Ь-ь-Ю-ю-Я-я'.split('-');
  const en = "A-a-B-b-V-v-G-g-D-d-E-e-YE-ye-ZH-zh-Z-z-I-i-YI-yi-IY-iy-K-k-L-l" +
    "-M-m-N-n-O-o-P-p-R-r-S-s-T-t-U-u-F-f-H-h-TS-ts-CH-ch-SH-sh-SCH-sch-'-'-YU-yu-Ya-ya'".split('-');

  let result = '';
  for (let i = 0, l = str.length; i < l;  i++) {
    const s = str.charAt(i);
    let n = ua.indexOf(s);
    if(n >= 0) {
      result += en[n];
    } else {
      result += s;
    }
  }
  return result;
};

export const generateSlug = (str: string): string => {
  let url: string = str.replace(/[\s]+/gi, '-');
  url = translit(url);

  url = url
    .replace(/[^0-9a-z_\-]+/gi, '')
    .replace('---', '-')
    .replace('--', '-')
    .toLowerCase();

  return url;
};

