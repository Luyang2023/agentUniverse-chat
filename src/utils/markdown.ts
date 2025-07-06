import { flow } from 'lodash';

// 处理latex公式
export function escapeDollarNumber(text: string) {
  let escapedText = '';

  for (let i = 0; i < text.length; i += 1) {
    let char = text[i];
    const nextChar = text[i + 1] || ' ';

    if (char === '$' && nextChar >= '0' && nextChar <= '9') {
      char = '\\$';
    }

    escapedText += char;
  }

  return escapedText;
}

export function escapeBrackets(text: string) {
  const pattern = /(```[\S\s]*?```|`.*?`)|\\\[([\S\s]*?[^\\])\\]|\\\((.*?)\\\)/g;
  return text.replaceAll(pattern, (match, codeBlock, squareBracket, roundBracket) => {
    if (codeBlock) {
      return codeBlock;
    } else if (squareBracket) {
      return `$$${squareBracket}$$`;
    } else if (roundBracket) {
      return `$${roundBracket}$`;
    }
    return match;
  });
}

export function escapeMhchem(text: string) {
  return text.replaceAll('$\\ce{', '$\\\\ce{').replaceAll('$\\pu{', '$\\\\pu{');
}

export const fixLatex = flow([escapeDollarNumber, escapeBrackets, escapeMhchem]);


// 处理 alipay schema 链接
export function normalizeAlipayUrl(url: string): string {
  if (!url.startsWith('alipays://')) {
    return url;
  }

  const querystring: string = url.split('?')[1];
  const params = new URLSearchParams(querystring);

  if (params.get('appId') !== '66666721') {
    // 只有 66666721 可以对外，其他不可对外
    return '';
  }

  const subUrl = params.get('url');
  if (!subUrl) {
    return url;
  }

  const query = new URLSearchParams(subUrl.split('?')[1]);
  const dataSourceId = query.get('dataSourceId');

  if (!dataSourceId) {
    return url;
  }

  return `https://render.alipay.com/p/f/fd-j1xcs5me/news-share.html?dataSourceId=${dataSourceId}`;
}