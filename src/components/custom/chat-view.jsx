'use client';

import { useConvex, useMutation } from 'convex/react';
import { useParams } from 'next/navigation';
import { useEffect, useContext, useState } from 'react';
import { ArrowRight, Link, Loader2Icon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

import Image from 'next/image';

import { api } from '../../../convex/_generated/api';
import { MessagesContext } from '@/context/messages-context';
import { UserDetailsContext } from '@/context/user-details-context';
import { Colors } from '@/data/colors';
import { Lookup } from '@/data/lookup';
import { Prompt } from '@/data/prompt';
import axios from 'axios';
import { useSidebar } from '../ui/sidebar';

export const ChatView = () => {
  const { workspaceId } = useParams();
  const convex = useConvex();
  const { messages, setMessages } = useContext(MessagesContext);
  const { userDetails, setUserDetails } = useContext(UserDetailsContext);
  const [userInput, setUserInput] = useState();
  const [loading, setLoading] = useState(false);
  const UpdateMessages = useMutation(api.workspace.UpdateMessages);
  const { toggleSidebar } = useSidebar();

  useEffect(() => {
    workspaceId && GetWorkspaceData();
  }, [workspaceId]);

  /**
   * Used to Get Workspace data using Workspace ID
   */
  const GetWorkspaceData = async () => {
    const result = await convex.query(api.workspace.GetWorkspace, {
      workspaceId,
    });
    setMessages(result?.messages);
    console.log('Workspace Data:', result);
  };

  useEffect(() => {
    if (messages?.length > 0) {
      const role = messages[messages?.length - 1].role;
      if (role === 'user') {
        GetAiResponse();
      }
    }
  }, [messages]);

  const GetAiResponse = async () => {
    setLoading(true);
    const PROMPT = JSON.stringify(messages) + Prompt.CHAT_PROMPT;
    const result = await axios.post('/api/ai-chat', {
      prompt: PROMPT,
    });
    console.log(result.data.result);
    const aiResp = {
      role: 'ai',
      content: result.data.result,
    };
    setMessages((prev) => [...prev, aiResp]);
    await UpdateMessages({
      messages: [...messages, aiResp],
      workspaceId: workspaceId,
    });
    setLoading(false);
  };

  const onGenerate = (input) => {
    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        content: input,
      },
    ]);
    setUserInput('');
  };
  return (
    <div className="relative h-[85vh] flex flex-col">
      <div className="flex-1 overflow-y-scroll scrollbar-hide pl-5">
        {messages?.map((msg, index) => (
          <div
            key={index}
            className="p-3 rounded-lg mb-2 flex gap-2 items-start  leading-7"
            style={{
              backgroundColor: Colors.BACKGROUND,
            }}
          >
            {msg?.role === 'user' && (
              <Image
                src={userDetails?.imageUrl}
                alt="User Image"
                width={35}
                height={35}
                className="
                rounded-full"
              />
            )}
            <ReactMarkdown className="flex flex-col">
              {msg.content}
            </ReactMarkdown>
          </div>
        ))}
        {loading && (
          <div
            className="p-3 rounded-lg mb-2 flex gap-2 items-start"
            style={{
              backgroundColor: Colors.BACKGROUND,
            }}
          >
            <Loader2Icon className="animate-spin" />
            <h2>Generating response...</h2>
          </div>
        )}
      </div>

      {/* Input Section */}

      <div className="flex gap-2 items-end">
        {userDetails && (
          <Image
            src={userDetails?.imageUrl}
            alt="user"
            width={30}
            height={30}
            className="rounded-full cursor-pointer"
            onClick={toggleSidebar}
          />
        )}
        <div
          className="p-5 border rounded-xl max-w-xl w-full mt-3"
          style={{
            backgroundColor: Colors.BACKGROUND,
          }}
        >
          <div className="flex gap-2">
            <textarea
              value={userInput}
              onChange={(event) => setUserInput(event.target.value)}
              placeholder={Lookup.INPUT_PLACEHOLDER}
              className="outline-none bg-transparent w-full h-32 max-h-56 resize-none"
            />
            {userInput && (
              <ArrowRight
                onClick={() => onGenerate(userInput)}
                className="bg-blue-500 p-2 h-10 w-10 rounded-md cursor-pointer"
              />
            )}
          </div>
          <div>
            <Link className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};
