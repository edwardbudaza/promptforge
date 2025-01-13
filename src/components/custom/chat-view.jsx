'use client';

import { useConvex } from 'convex/react';
import { useParams } from 'next/navigation';
import { useEffect, useContext, useState } from 'react';
import { ArrowRight, Link } from 'lucide-react';

import Image from 'next/image';

import { api } from '../../../convex/_generated/api';
import { MessagesContext } from '@/context/messages-context';
import { UserDetailsContext } from '@/context/user-details-context';
import { Colors } from '@/data/colors';
import { Lookup } from '@/data/lookup';

export const ChatView = () => {
  const { workspaceId } = useParams();
  const convex = useConvex();
  const { messages, setMessages } = useContext(MessagesContext);
  const { userDetails, setUserDetails } = useContext(UserDetailsContext);
  const [userInput, setUserInput] = useState();

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
  return (
    <div className="relative h-[85vh] flex flex-col">
      <div className="flex-1 overflow-y-scroll">
        {messages?.map((msg, index) => (
          <div
            key={index}
            className="p-3 rounded-lg mb-2 flex gap-2 items-start"
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
            <h2>{msg.content}</h2>
          </div>
        ))}
      </div>

      {/* Input Section */}
      <div
        className="p-5 border rounded-xl max-w-xl w-full mt-3"
        style={{
          backgroundColor: Colors.BACKGROUND,
        }}
      >
        <div className="flex gap-2">
          <textarea
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
  );
};
