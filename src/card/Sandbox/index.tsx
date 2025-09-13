import {useEffect} from 'react';
import MiniSandbox from 'mini-sandbox';

type SandboxProps = {
  config: any;
}

const Sandbox: React.FC<SandboxProps> = (props) => {
  const { config } = props;

  useEffect(() => {
    // @ts-ignore
    new MiniSandbox({
      ...config,
      el: '#mini-sanbox',
    })
  }, [config]);

  return <div id="mini-sanbox"></div>;
}

export default Sandbox;