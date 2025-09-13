import React, { useState } from 'react';
import { AgentInfo } from '../../hooks/useAgentList';
import { Modal, Card } from 'antd';
import styles from './AgentSelector.module.less';

interface AgentSelectorProps {
  agents: AgentInfo[];
  selectedAgent: AgentInfo | null;
  onAgentSelect: (agent: AgentInfo) => void;
}

const AgentSelector: React.FC<AgentSelectorProps> = ({ agents, selectedAgent, onAgentSelect }) => {
  const [showSelector, setShowSelector] = useState(false);

  const handleAgentSelect = (agent: AgentInfo) => {
    onAgentSelect(agent);
    setShowSelector(false);
  };

  return (
    <div className="agent-selector" style={{ position: 'relative' }}>
      <button
        className={styles.agentButton}
        onClick={() => setShowSelector(!showSelector)}
        title={selectedAgent ? selectedAgent.agent_name : '选择智能体'}
      >
        {selectedAgent ? selectedAgent.agent_name : 'AI'}
      </button>
      <Modal
        title="选择智能体"
        open={showSelector}
        onCancel={() => setShowSelector(false)}
        footer={null}
        width={800}
        centered
        bodyStyle={{ maxHeight: '60vh', overflowY: 'auto' }}
        className={styles.agentModal} /* 添加 className */
      >
        <div className={styles.agentGrid}>
          {agents.map(agent => (
            <Card
              key={agent.service_id}
              className={`${styles.agentCard} ${selectedAgent?.service_id === agent.service_id ? styles.selected : ''}`}
              onClick={() => handleAgentSelect(agent)}
              hoverable
            >
              <div className={styles.agentName}>{agent.agent_name}</div>
              <div className={styles.agentDescription}>{agent.description}</div>
            </Card>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default AgentSelector;