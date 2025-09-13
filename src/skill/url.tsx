import { LinkOutlined } from '@ant-design/icons';
import { Skill } from '@/skill';

// url.tsx
const urlSkill: Skill = {
  type: 'url',
  label: '网页解读',
  description: '快速解读网页内容',
  Icon: LinkOutlined,
  placeholder: '请输入需要解读的网址',
  
  onAttach: (chat) => {
    chat.richInput.tf.setValue('解读这个网页： https://');
    // chat.richInput.tf.setValue([
    //   {
    //     type: 'paragraph',
    //     children: [
    //       { text: '解读这个网页：' },
    //       { type: 'inline', placeholder: '输入网址', children: [{ text: '' }] },
    //     ],
    //   },
    // ]);
  },
  
};

export default urlSkill;
