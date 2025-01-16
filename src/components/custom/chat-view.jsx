'use client';

import Image from 'next/image';
import { useConvex, useMutation } from 'convex/react';
import { useParams } from 'next/navigation';
import { useEffect, useContext, useState } from 'react';
import { ArrowRight, Link, Loader2Icon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

import { api } from '../../../convex/_generated/api';
import { MessagesContext } from '@/context/messages-context';
import { UserDetailsContext } from '@/context/user-details-context';
import { Colors } from '@/data/colors';
import { Lookup } from '@/data/lookup';
import { Prompt } from '@/data/prompt';
import axios from 'axios';
import { useSidebar } from '../ui/sidebar';
import { countToken } from '@/lib/utils';
import { toast } from 'sonner';

export const ChatView = () => {
  const { workspaceId } = useParams();
  const convex = useConvex();
  const { messages, setMessages } = useContext(MessagesContext);
  const { userDetails, setUserDetails } = useContext(UserDetailsContext);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const UpdateMessages = useMutation(api.workspace.UpdateMessages);
  const { toggleSidebar } = useSidebar();
  const UpdateTokens = useMutation(api.users.UpdateToken);

  // Initialize messages as an empty array if undefined
  const messagesList = Array.isArray(messages) ? messages : [];

  useEffect(() => {
    if (workspaceId) {
      GetWorkspaceData();
    }
  }, [workspaceId]);

  const GetWorkspaceData = async () => {
    try {
      const result = await convex.query(api.workspace.GetWorkspace, {
        workspaceId,
      });
      setMessages(result?.messages || []);
      console.log('Workspace Data:', result);
    } catch (error) {
      console.error('Error fetching workspace:', error);
      toast.error('Failed to load chat history');
    }
  };

  useEffect(() => {
    if (messagesList.length > 0) {
      const lastMessage = messagesList[messagesList.length - 1];
      if (lastMessage?.role === 'user') {
        GetAiResponse();
      }
    }
  }, [messagesList]);

  const GetAiResponse = async () => {
    try {
      setLoading(true);
      const PROMPT = JSON.stringify(messagesList) + Prompt.CHAT_PROMPT;
      const result = await axios.post('/api/ai-chat', {
        prompt: PROMPT,
      });

      const aiResp = {
        role: 'ai',
        content: result.data.result,
      };

      const updatedMessages = [...messagesList, aiResp];
      setMessages(updatedMessages);

      await UpdateMessages({
        messages: updatedMessages,
        workspaceId: workspaceId,
      });

      const tokenCount = countToken(JSON.stringify(aiResp));
      const newTokenCount =
        Number(userDetails?.token || 0) - Number(tokenCount);

      setUserDetails((prev) => ({
        ...prev,
        token: newTokenCount,
      }));

      await UpdateTokens({
        userId: userDetails?._id,
        token: newTokenCount,
      });
    } catch (error) {
      console.error('Error generating response:', error);
      toast.error('Failed to generate response');
    } finally {
      setLoading(false);
    }
  };

  const onGenerate = (input) => {
    if (!input?.trim()) return;

    if (!userDetails?.token || userDetails.token < 10) {
      toast.error("You don't have enough tokens!");
      return;
    }

    const newMessages = [
      ...messagesList,
      {
        role: 'user',
        content: input.trim(),
      },
    ];

    setMessages(newMessages);
    setUserInput('');
  };

  return (
    <div className="relative h-[85vh] flex flex-col">
      <div className="flex-1 overflow-y-scroll scrollbar-hide pl-5">
        {messagesList.map((msg, index) => (
          <div
            key={index}
            className="p-3 rounded-lg mb-2 flex gap-2 items-start leading-7"
            style={{
              backgroundColor: Colors.BACKGROUND,
            }}
          >
            {msg?.role === 'user' && userDetails?.imageUrl && (
              <Image
                src={userDetails.imageUrl}
                alt="User Image"
                width={35}
                height={35}
                className="rounded-full"
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

      <div className="flex gap-2 items-end">
        {userDetails?.imageUrl && (
          <Image
            src={userDetails.imageUrl}
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
              disabled={loading}
            />
            {userInput?.trim() && !loading && (
              <ArrowRight
                onClick={() => onGenerate(userInput)}
                className="bg-blue-500 p-2 h-10 w-10 rounded-md cursor-pointer hover:bg-blue-600"
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
