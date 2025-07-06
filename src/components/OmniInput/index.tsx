import React, { useCallback, useState } from 'react';
import { Button, Tooltip, Divider, AutoComplete, AutoCompleteProps } from 'antd';
import classnames from 'classnames';
import { debounce, isUndefined } from 'lodash';
import { ArrowUpOutlined, PauseCircleFilled, CloseOutlined } from '@ant-design/icons';
import { Node } from 'slate';
import { Skill } from '@/skill';
import Event from '@/constants/event';
import type { Prompt } from '@/store/useSessionStore';
import useConfigStore from '@/store/useConfigStore';
import useChatStore from '@/store/useChatStore';
import usePromptStore from '@/store/useInputStore';
import ShineBorder from "@/components/magicui/shine-border";
import AdaptiveButtonList from '@/components/AdaptiveButtonList';
// import RichInput from './RichInput';
import EasyInput from './EasyInput';
import SelectPopover from './SelectPopover';
import styles from './index.module.less';
import VoiceButton from '../VoiceButton';

interface Props {
  running: boolean;
  onSubmit: (params: Prompt) => void;
  onAbort: () => void;
}

const OmniInput: React.FC<Props> = ({ running, onSubmit, onAbort }) => {
  // suggest 输入框选项
  const [options, setOptions] = useState<AutoCompleteProps['options']>([]);
  const chat = useChatStore(state => state.chat);
  const { skills: skillOptions, input, isDocCopilotMode, enableAlipayVoice, suggestPoppover } = useConfigStore(state => state);
  const { prompt, disableSend } = usePromptStore(state => state);
  const [ selectPopoverVisible, setSelectPopoverVisible ] = useState(false);
  const currentSkill = skillOptions?.find(([skill]) => skill.type === prompt?.skill?.type);

  const handleRichInputChange = ({content, raw}: {content: string, raw?: Node[]}) => {
    if (content === '@' && skillOptions?.length) {
      setSelectPopoverVisible(true);
      return;
    };
    setSelectPopoverVisible(false);
    chat.mergePrompt({
      content,
      raw,
    });
  };

  const handleSendEvent = () => {
    if (!prompt?.content.trim()) return;
    onSubmit(prompt);
  };

  const handleCloseSkill = () => {
    chat.clearInput();
    chat.emit(Event.SKILL_DESTROY, currentSkill);
    currentSkill?.[0].onDestroy?.(chat);
    chat.clearSkill();
  };

  const handleSelectSkill = useCallback((skillType: string, skill: Skill) => {
    chat.clearInput();
    chat.activateSkill(skillType);
    chat.emit(Event.SKILL_CHANGE, skillType);
    skill.onAttach?.(chat);
  },[chat]);

  const handleSelectOption = (skillType: string) => {
    const skill = skillOptions?.find(([skill]) => skill.type === skillType);
    handleSelectSkill(skillType, skill![0]);
  };

  const handleVoiceButtonChange = () => {
    chat.emit(Event.VOICE_INPUT);
  };

  const handleSearch = (value: string) => {
    if(value) {
      suggestPoppover?.onSearch(value).then(setOptions);
    };
  };

  const onSelect = (value: string) => {
    chat.richInput.tf.setValue(value);
  };


  return (
    <div className={styles.container}>
      <div className={styles.skillContainer}>
        {
          !currentSkill && skillOptions && !isDocCopilotMode && (
            <AdaptiveButtonList items={skillOptions.map((skillOp, index) => ({
              label: skillOp[0].label,
              value: skillOp[0].type,
              Icon: skillOp[0].Icon,
              onChange: (skillType) => handleSelectSkill(skillType, skillOp[0]),
            }))} />
          )
        }
      </div>
      {
        <SelectPopover
          visible={selectPopoverVisible}
          options={skillOptions!.map((skill) => ({
            type: skill[0].type,
            label: skill[0].label,
            icon: skill[0].Icon,
            description: skill[0].description,
          }))}
          style={{ position: 'absolute', width: '100%', top: '-164px' }}
          className={styles.popover}
          onSelect={handleSelectOption}
          onClickAway={() => setSelectPopoverVisible(false)}
        />
      }
      <div className={styles.inputContainer}>
        {
          currentSkill && (
            <div className={styles.skillWrap}>
              <div className={styles.skillTop}>
                <div className={styles.skillLeft}>
                  <div className={styles.title}>
                    { React.createElement(currentSkill[0].Icon) }
                    { currentSkill[0].label }
                  </div>
                  {
                    currentSkill[0].Header && (
                      <>
                        <Divider type="vertical" />
                        { React.createElement(
                          currentSkill[0].Header,
                          {
                            ...currentSkill[1],
                            chat,
                            prompt,
                          },
                        ) }
                      </>
                    )
                  }
                </div>
                {
                  !currentSkill[0].disableClose && (
                    <Tooltip title="退出技能">
                      <Button icon={<CloseOutlined />} type="text" onClick={handleCloseSkill} />
                    </Tooltip>
                  )
                }
              </div>
              {
                currentSkill[0].Content && (
                  <div className={styles.skillContent}>
                    {
                      React.createElement(
                        currentSkill[0].Content,
                        {
                          ...currentSkill[1],
                          chat,
                          prompt,
                        }
                      )
                    }
                  </div>
                )
              }
            </div>
          )
        }
        {
          !input?.hidden && <AutoComplete
          options={options}
          style={{ width: '100%', height: '100%' }}
          onSelect={onSelect}
          onSearch={debounce(handleSearch, suggestPoppover?.delay)}
          disabled={!!suggestPoppover}
        >
          <div className={classnames(styles.inputBox)}>
            {/* <RichInput
              onChange={handleRichInputChange}
              placeholder={currentSkill?.[0].placeholder || input?.placeholder || '请输入你的问题'}
              onEnter={handleSendEvent}
            /> */}
            <EasyInput
              onChange={handleRichInputChange}
              placeholder={currentSkill?.[0].placeholder || input?.placeholder || '请输入你的问题'}
              onEnter={handleSendEvent}
              disabled={!isUndefined(input?.disabled) ? input.disabled : running}
            />
            <div className={styles.footerRight}>
                { enableAlipayVoice && 
                  <VoiceButton 
                    inputDisabled={running} 
                    onChange={handleVoiceButtonChange}
                  />
                }
                <Divider type="vertical" style={{height: '24px'}}/>
                {
                  running
                    ? (
                        <ShineBorder
                          shinning
                          borderRadius={12}
                          color={["#A07CFE", "#FE8FB5", "#FFBE7B", "#2566e8", "#00b2f0"]}
                        >
                          <Button icon={<PauseCircleFilled />} className={styles.submitButton} onClick={onAbort} />
                        </ShineBorder>
                      )
                    : (
                      <Button
                        disabled={!isUndefined(input?.disabled) ? input.disabled : running}
                        type="primary"
                        icon={<ArrowUpOutlined />}
                        className={styles.submitButton}
                        onClick={handleSendEvent}
                      />
                    )
                }
            </div>
          </div>
        </AutoComplete>
        }
        
      </div>
      
    </div>
  );
};

export default OmniInput;
