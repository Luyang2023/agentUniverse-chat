import { useEffect, useState } from 'react';

export interface AgentInfo {
  agent_name: string;
  description: string;
  service_id: string;
}

export default function useAgentList() {
  const [agents, setAgents] = useState<AgentInfo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('http://127.0.0.1:8888/agent/list')
      .then(res => res.json())
      .then(data => {
        setAgents(data.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return { agents, loading };
}