import React from 'react';
import { Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Prompt } from '@/store/useSessionStore';
import useConfigStore from '@/store/useConfigStore';
import BlurFade from '@/components/magicui/blur-in';
import styles from './index.module.less';

interface Props {
  questions: string[];
  onClickItem: (params: Prompt) => void;
}

const RelationQuestion: React.FC<Props> = ({ questions, onClickItem }) => {
  const { lng } = useConfigStore();
  if (!questions?.length) {
    return null;
  }
  return (
    <div>
      <div className={styles.title}>
        {lng === 'en' ? 'Related Questions' : '问题推荐'}
      </div>
      <div className={styles.relations}>
        {questions.map((relation) => (
          <BlurFade
            key={relation}
            word={(
              <Button
                key={relation}
                icon={<ArrowRightOutlined />}
                iconPosition="end"
                onClick={() => onClickItem?.({ content: relation })}
                className={styles.relation}
              >
                {relation}
              </Button>
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default RelationQuestion;
