// 改造树形结构数据满足antd中tree组件数据源要求
export function transformToAntdTreeData(data: any, deepKey: string = '') {
  return data?.map((node: any, index: number) => {
    const key = deepKey ? `${deepKey}-${index + 1}` : `${index + 1}`;
    return {
      key,
      title: `${index + 1} . ${node.task}`,
      children: node.sub_task
        ? transformToAntdTreeData(node.sub_task, key)
        : [],
      task_source: node.task_source,
    };
  });
}

// 从字符串数组中随机选取几个
export function RandomSelectFromArray(arr: string[], number: number) {
  const newArr: string[] = [];
  while (newArr.length < number) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    const randomNumber = arr[randomIndex];
    if (!newArr.includes(randomNumber)) {
      newArr.push(randomNumber);
    }
  }
  return newArr;
}

const matchUrlFromClipboard = (prompt: string) => {
  const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
  const url = prompt.match(urlRegex);

  return url;
};

// 给url结尾加空格，并生成新的prompt
export const addTextUrlSpacing = (event: ClipboardEvent, inputValue: string) => {
  const prompt = event.clipboardData?.getData('text') || '';
  let newPrompt = '';
  const url = matchUrlFromClipboard(prompt);

  // 自定义粘贴事件
  if (url) {
    event.preventDefault();
    // @ts-ignore
    const selectionStart = event.target.selectionStart;
    // @ts-ignore
    const selectionEnd = event.target.selectionEnd;
    const pasteValue = prompt.replace(url[0], url[0] + ' ');
    newPrompt =
      inputValue.slice(0, selectionStart) +
      pasteValue +
      inputValue.slice(selectionEnd);
  } else {
    newPrompt = inputValue;
  }
  return newPrompt;
};

// 复制文本到剪切板
export function copyToClipboard(text: string) {
  const textArea = document.createElement('input');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999px';
  textArea.style.top = '-999px';
  document.body.appendChild(textArea);

  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
};


// 给lodash mergeWith 使用：当 merge array 时，直接替换 array
export function mergeWithArray(objValue:any, srcValue: any) {
  if (Array.isArray(objValue)) {
    return srcValue;
  }
};