import React from 'react';
import { useBoolean } from 'ahooks';
import classnames from 'classnames';
import { isNil } from 'lodash';
import { Button, Tooltip } from 'antd';
import { MotionAnimate } from 'react-motion-animate';
import {
  AlipayOutlined,
  ChromeOutlined,
  DownCircleOutlined,
  UpCircleOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import useConfigStore from '@/store/useConfigStore';
import { normalizeAlipayUrl } from '@/utils/markdown';
import { ExecutingTask } from '@/typings/answer';
import styles from './index.module.less';

const CollapsedLength_PC = 6;
const CollapsedLength_H5 = 3;

function getIcon(url: string) {
  const host = new URL(url).host;

  switch (true) {
    case host.includes('sina'):
      return <WeiboCircleOutlined />;
    case host.includes('alipay'):
      return <AlipayOutlined />;
    default:
      return <ChromeOutlined />;
  }
}

type Props = {
  list: ExecutingTask['task_source'];
};

const LinkButtonGroup: React.FC<Props> = ({ list = [] }) => {
  const [isCollapsed, { toggle: toggleCollapsed }] = useBoolean(true);
  const isCompact = useConfigStore((state) => state.isCompact);
  const maxCollapsedLength = isCompact ? CollapsedLength_H5 : CollapsedLength_PC;

  let renderList = list
    .filter((item) => !isNil(item.url) && item.url !== 'null') // 后端可能会返回 string 的 null，后续考虑 service adapter 层处理掉
    .map((item) => ({
      ...item,
      url: normalizeAlipayUrl(item.url!),
    })).filter(item => item.url);

  if (isCollapsed) {
    renderList = renderList.slice(0, maxCollapsedLength);
  }

  return (
    <div
      className={classnames([
        styles.linkButtonGroupContainer,
        {
          [styles.isMobile]: isCompact
        },
      ])}
    >
      <div className={styles.linkButtonGroup}>
        {
          renderList.map(({ url, title }, index) => {
            return (
              <Tooltip key={index} title={title}>
                <MotionAnimate delay={0.3}>
                  <div key={index} className={styles.listStyle} onClick={() => window.open(url)}>
                    <span className={styles.listIconStyle}>{getIcon(url)}</span>
                    {title}
                  </div>
                </MotionAnimate>
              </Tooltip>
            );
          })
        }
      </div>
      <div>
        {list.length > maxCollapsedLength && (
          <Button
            className={styles.button}
            size="small"
            type="link"
            onClick={toggleCollapsed}
            style={{ marginTop: '0.5rem' }}
          >
            {isCollapsed ? (
              <span>
                展开更多 <DownCircleOutlined />
              </span>
            ) : (
              <span>
                收起 <UpCircleOutlined />
              </span>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default LinkButtonGroup;
