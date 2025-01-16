'use client';

import { ActionContext } from '@/context/action-context';
import { SandpackPreview, useSandpack } from '@codesandbox/sandpack-react';
import { useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export const SandpackPreviewClient = () => {
  const previewRef = useRef();
  const { sandpack } = useSandpack();
  const { action, setAction } = useContext(ActionContext);
  const [isProcessing, setIsProcessing] = useState(false);
  const clientRef = useRef(null);

  // Initialize client once when component mounts
  useEffect(() => {
    const initializeClient = async () => {
      try {
        if (previewRef.current && !clientRef.current) {
          clientRef.current = await previewRef.current.getClient();
          console.log('Sandpack Client initialized');
        }
      } catch (error) {
        console.error('Failed to initialize Sandpack client:', error);
        toast.error('Failed to initialize preview');
      }
    };

    initializeClient();
  }, []);

  // Handle actions
  useEffect(() => {
    if (!action?.actionType || isProcessing || !clientRef.current) return;

    const handleAction = async () => {
      try {
        setIsProcessing(true);

        const result = await clientRef.current.getCodeSandboxURL();
        if (!result?.sandboxId) {
          throw new Error('Failed to get sandbox URL');
        }

        switch (action.actionType) {
          case 'deploy':
            window.open(`https://${result.sandboxId}.csb.app/`, '_blank');
            toast.success('Deployed successfully!');
            break;
          case 'download':
            window.open(result.editorUrl, '_blank');
            toast.success('Opening CodeSandbox editor');
            break;
          default:
            console.warn('Unknown action type:', action.actionType);
        }
      } catch (error) {
        console.error('Action processing failed:', error);
        toast.error(`Failed to ${action.actionType}. Please try again.`);
      } finally {
        setIsProcessing(false);
        setAction(null); // Reset action after processing
      }
    };

    handleAction();
  }, [action?.actionType, isProcessing, setAction]);

  // Refresh client when sandpack changes
  useEffect(() => {
    if (sandpack?.status === 'running' && clientRef.current) {
      clientRef.current.refresh();
    }
  }, [sandpack?.status]);

  return (
    <div className="relative w-full">
      <SandpackPreview
        ref={previewRef}
        style={{ height: '80vh' }}
        showNavigator={true}
      />
      {isProcessing && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="animate-pulse text-white">Processing...</div>
        </div>
      )}
    </div>
  );
};
