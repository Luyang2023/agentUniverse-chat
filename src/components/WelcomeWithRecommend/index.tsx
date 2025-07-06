import React, { useEffect, useState } from 'react';
import { Button, Col, Row } from 'antd';
import TextEllipsis from 'react-ellipsis-component';
import { chunk, isEmpty, sampleSize } from 'lodash';
import { RedoOutlined } from '@ant-design/icons';
import { Prompt } from '@/store/useSessionStore';
import useConfigStore from '@/store/useConfigStore';
import usePromptStore from '@/store/useInputStore';
import BlurIn from "@/components/magicui/blur-in";
import BlurFade from "@/components/magicui/blur-fade";
import styles from './index.module.less';

interface Props {
  onClick: (params: Prompt) => void;
}

const WelcomeWithRecommend: React.FC<Props> = ({ onClick }) => {
  const {recommend, welcomeSlot, isCompact, lng } = useConfigStore((state) => state);
  const { avatar, product } = useConfigStore(state => state);
  const { prompt: storePrompt } = usePromptStore(state => state);
  const [localRecommendList, setLocalRecommendList] = useState(sampleSize(recommend?.list, 4) || []);
  const isEn = lng === 'en';
  

  const chunks = !isCompact
    ? chunk(localRecommendList.slice(0, 4), 2)
    : [localRecommendList.slice(0, 2)];

  const handleClickChange = () => {
    setLocalRecommendList(
      sampleSize(
        recommend?.list.filter(
          item => !localRecommendList.find(localItem => localItem.content === item.content)
        ),
        4,
      )
    );
  };

  useEffect(() => {
    handleClickChange();
  },[recommend]);

  return (
    <div className={styles.container}>
      <div className={styles.titleBox}>
        {
          welcomeSlot ? welcomeSlot : (
            <>
              { avatar.assistant }
              <BlurIn word={`你好，我是${product.name}，你可以对我说`} />
            </>
          )
        }
      </div>
      {
        !isEmpty(recommend?.list) && (
          <div>
            <div className={styles.changeButton}>
              <Button type="link" onClick={handleClickChange}>
                <RedoOutlined />
                { isEn ? 'Make a change' : '换一换' }
              </Button>
            </div>

            {chunks.map((chunk, index) => (
              <Row
                key={index}
                className={styles.promptList}
                gutter={[16, 8]}
                justify="space-between"
              >
                {chunk.map((prompt, idx) => {
                  return (
                    <Col
                      key={idx}
                      onClick={() => {
                        // TODO：业务侧脏逻辑，不好处理，先在sdk内部感知吧
                        if (storePrompt?.skill?.type === 'PEER') {
                          prompt.skill = storePrompt.skill;
                        }
                        onClick(prompt);
                      }}
                      span={!isCompact ? 12 : 24}
                    >
                      <BlurFade key={prompt.content} delay={0.25 + index * 0.05}>
                        <TextEllipsis
                          ellipsis
                          text={prompt.content}
                          className={styles.prompt}
                          maxLine={isEn && isCompact ? 5 : 2}
                        />
                      </BlurFade>
                    </Col>
                  );
                })}
              </Row>
            ))}
          </div>
        )
      }
    </div>
  );
};

export default WelcomeWithRecommend;
