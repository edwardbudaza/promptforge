import { ActionContext } from '@/context/action-context';
import { SandpackPreview, useSandpack } from '@codesandbox/sandpack-react';
import { useContext, useEffect, useRef } from 'react';

export const SandpackPreviewClient = () => {
  const previewRef = useRef();
  const { sandpack } = useSandpack();
  const { action, setAction } = useContext(ActionContext);

  useEffect(() => {
    GetSandpackClient();
  }, [sandpack && action]);

  const GetSandpackClient = async () => {
    const client = previewRef.current?.getClient();

    if (client) {
      console.log('Sanpack Client: ', client);
      const result = await client.getCodeSandboxURL();
      if (action?.actionType === 'deploy') {
        window.open(`https://${result?.sandboxId}.csb.app/`);
      } else if (action?.actionType === 'download') {
        window.open(result?.editorUrl);
      }
    }
  };
  return (
    <SandpackPreview
      ref={previewRef}
      style={{ height: '80vh' }}
      showNavigator={true}
    />
  );
};
