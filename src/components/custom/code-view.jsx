'use client';

import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
} from '@codesandbox/sandpack-react';
import axios from 'axios';
import { useConvex, useMutation } from 'convex/react';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import { MessagesContext } from '@/context/messages-context';
import { Lookup } from '@/data/lookup';
import { Prompt } from '@/data/prompt';
import { cn } from '@/lib/utils';
import { api } from '../../../convex/_generated/api';
import { Loader2Icon } from 'lucide-react';
import { UserDetailsContext } from '@/context/user-details-context';
import { countToken } from '@/lib/utils';
import { SandpackPreviewClient } from './sandpack-preview-client';
import { ActionContext } from '@/context/action-context';

export const CodeView = () => {
  const { workspaceId } = useParams();
  const { userDetails, setUserDetails } = useContext(UserDetailsContext);
  const [activeTab, setActiveTab] = useState('code');
  const [files, setFiles] = useState(Lookup?.DEFAULT_FILE);
  const { messages, setMessages } = useContext(MessagesContext);
  const UpdateFiles = useMutation(api.workspace.UpdateFiles);
  const convex = useConvex();
  const [loading, setLoading] = useState(false);
  const UpdateTokens = useMutation(api.users.UpdateToken);
  const { action, setAction } = useContext(ActionContext);

  useEffect(() => {
    workspaceId && GetFiles();
  }, [workspaceId]);

  useEffect(() => {
    setActiveTab('preview');
  }, [action]);

  const GetFiles = async () => {
    setLoading(true);
    const result = await convex.query(api.workspace.GetWorkspace, {
      workspaceId: workspaceId,
    });
    const mergedFiles = { ...Lookup.DEFAULT_FILE, ...result?.fileData };
    setFiles(mergedFiles);
    setLoading(false);
  };

  useEffect(() => {
    if (messages?.length > 0) {
      const role = messages[messages?.length - 1].role;
      if (role === 'user') {
        GenerateAiCode();
      }
    }
  }, [messages]);

  const GenerateAiCode = async () => {
    setLoading(true);
    const PROMPT = JSON.stringify(messages) + ' ' + Prompt.CODE_GEN_PROMPT;
    const result = await axios.post('/api/gen-ai-code', {
      prompt: PROMPT,
    });

    console.log(result.data);
    const aiResp = result.data;

    const mergedFiles = { ...Lookup.DEFAULT_FILE, ...aiResp?.files };
    setFiles(mergedFiles);
    await UpdateFiles({
      workspaceId: workspaceId,
      files: aiResp?.files,
    });

    const token =
      Number(userDetails?.token) - Number(countToken(JSON.stringify(aiResp)));

    // Update Tokens in Database
    await UpdateTokens({
      userId: userDetails?._id,
      token: token,
    });
    setUserDetails((prev) => ({
      ...prev,
      token: token,
    }));

    setActiveTab('code');
    setLoading(false);
  };

  return (
    <div className="relative">
      <div className="bg-[#181818] w-full p-2 border">
        <div className="flex items-center justify-center flex-wrap shrink-0 bg-black p-1 w-[140px] gap-3 rounded-full">
          <h2
            onClick={() => setActiveTab('code')}
            className={cn(
              'text-sm cursor-pointer',
              activeTab === 'code' &&
                'text-blue-500 bg-blue-500 bg-opacity-25 p-1 px-2 rounded-full'
            )}
          >
            Code
          </h2>
          <h2
            onClick={() => setActiveTab('preview')}
            className={cn(
              'text-sm cursor-pointer',
              activeTab === 'preview' &&
                'text-blue-500 bg-blue-500 bg-opacity-25 p-1 px-2 rounded-full'
            )}
          >
            Preview
          </h2>
        </div>
      </div>
      <SandpackProvider
        files={files}
        template="react"
        theme={'dark'}
        customSetup={{
          dependencies: { ...Lookup.DEPENDANCY },
        }}
        options={{
          externalResources: ['https://cdn.tailwindcss.com'],
        }}
      >
        <SandpackLayout>
          {activeTab === 'code' ? (
            <>
              <SandpackFileExplorer style={{ height: '80vh' }} />
              <SandpackCodeEditor style={{ height: '80vh' }} />
            </>
          ) : (
            <>
              <SandpackPreviewClient />
            </>
          )}
        </SandpackLayout>
      </SandpackProvider>
      {loading && (
        <div className="p-10 bg-gray-900 opacity-80 absolute top-0 rounded-lg w-full h-full flex items-center justify-center">
          <Loader2Icon className="animate-spin h-10 w-10 text-white" />
          <h2 className="text-white">Generating your files...</h2>
        </div>
      )}
    </div>
  );
};
