import {visit} from 'unist-util-visit';
import useConfigStore from '@/store/useConfigStore';

export function highlightPlugin() {
  return (tree: any) => {
    visit(tree, (node) => {
      if (node.type === 'textDirective' && node.name === 'highlight') {
        const data = node.data || (node.data = {})
        data.hName = 'span'
        data.hProperties = {
          className: 'highlight',
        }
      }
    });
  };
}

export function imgLoadingPlugin() {
  return (tree: any) => {
    visit(tree, (node: any) => {
      if (node.type === 'textDirective' && node.name === 'img') {
        node.data = node.data || (node.data = {});
        // 删除内容(目前旅行支小助的图片内容是文字，不需要显示内容)
        const imgKeyword = node.children[0]?.value;
        node.data.hName = 'img';
        node.data.hProperties = {
          src: useConfigStore.getState().markdown?.imgFlag?.srcGen?.(imgKeyword),
        };
      }
    });
  };
}
