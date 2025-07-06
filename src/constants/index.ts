export const DARK_THEME_LOGO =
  'https://gw.alipayobjects.com/zos/finxbff/compress-tinypng/Ek69FC46jbmc4rBmNKiLa/899A7B21_C634_4135_B7E9_D16C1C3BE4D5.png';
export const LIGHT_THEME_LOGO =
  'https://gw.alipayobjects.com/zos/finxbff/compress-tinypng/QBYeBCymJCQGCgUDcKADp/yuantulogo3.png';

export const DEFAULT_HUMAN_AVATAR =
  'https://mdn.alipayobjects.com/huamei_fhgwxz/afts/img/A*-0HBTYiyk9EAAAAAAAAAAAAADoewAQ/original';
export const DEFAULT_AI_AVATAR =
  'https://gw.alipayobjects.com/zos/finxbff/compress-tinypng/igrVm7tHegnACtg4gFPaY/weitu__1_.png';


// 判断pc或移动端，true代表pc端，false代表移动端
export const PC_FLAG =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i.test(
    window.navigator.userAgent,
  )
    ? false
    : true;

export const ALI_APP_FLAG = /AliApp/i.test(window.navigator.userAgent);


// 支付宝短链
// 生成工具：https://tools.antfin-inc.com/utm#/url-toolkit/url-scheme/record?urlSchemeId=5100014
export const ALI_PAY_SHORT_LINK = 'https://u.alipay.cn/_7hAsODTuPmKeVNR7FS0IxY';


// 链接正则，判断是否URL
export const URL_REGEX =
  /\bhttps?:\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|]\b/gi;

