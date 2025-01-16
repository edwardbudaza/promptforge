'use client';

import { ArrowRight, Link } from 'lucide-react';
import { useContext, useState } from 'react';
import { useMutation } from 'convex/react';
import { useRouter } from 'next/navigation';

import { MessagesContext } from '@/context/messages-context';
import { UserDetailsContext } from '@/context/user-details-context';
import { Lookup } from '@/data/lookup';
import { Colors } from '@/data/colors';
import { SignInDialog } from '../dialogs/sign-in-dialog';
import { api } from '../../../convex/_generated/api';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export const Hero = () => {
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { messages, setMessages } = useContext(MessagesContext);
  const { userDetails, setUserdetails } = useContext(UserDetailsContext);
  const [openDialog, setOpenDialog] = useState(false);
  const CreateWorkspace = useMutation(api.workspace.CreateWorkspace);
  const router = useRouter();

  const onGenerate = async (input) => {
    try {
      // Basic validation checks
      if (!input?.trim()) {
        toast.error('Please enter some text');
        return;
      }

      if (!userDetails?.name) {
        setOpenDialog(true);
        return;
      }

      if (!userDetails?._id) {
        toast.error('User details not loaded yet. Please try again.');
        return;
      }

      if (userDetails?.token < 10) {
        toast.error("You don't have enough tokens!");
        return;
      }

      setIsLoading(true);

      // Update messages context
      setMessages({
        role: 'user',
        content: input,
      });

      // Create workspace with proper user ID
      const workspaceId = await CreateWorkspace({
        user: userDetails._id,
        messages: [
          {
            role: 'user',
            content: input,
          },
        ],
      });

      if (!workspaceId) {
        throw new Error('Failed to create workspace');
      }

      // Navigate to the new workspace
      router.push(`/workspace/${workspaceId}`);
    } catch (error) {
      console.error('Error generating workspace:', error);
      toast.error('Failed to create workspace. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mt-36 xl:mt-52 gap-2">
      <h2 className="font-bold text-4xl">{Lookup.HERO_HEADING}</h2>
      <p className="text-gray-400 font-medium">{Lookup.HERO_DESC}</p>
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
            disabled={isLoading}
          />
          {userInput && (
            <ArrowRight
              onClick={() => onGenerate(userInput)}
              className={cn(
                'p-2 h-10 w-10 rounded-md cursor-pointer',
                isLoading ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600',
                isLoading && 'animate-pulse'
              )}
              disabled={isLoading}
            />
          )}
        </div>
        <div>
          <Link className="w-5 h-5" />
        </div>
      </div>
      <div className="flex mt-8 flex-wrap max-w-2xl items-center justify-center gap-3">
        {Lookup?.SUGGSTIONS?.map((suggestion, index) => (
          <h2
            onClick={() => !isLoading && onGenerate(suggestion)}
            key={index}
            className={cn(
              'p-1 px-2 border rounded-full text-sm text-gray-400 hover:text-white',
              isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
            )}
          >
            {suggestion}
          </h2>
        ))}
      </div>
      <SignInDialog
        openDialog={openDialog}
        closeDialog={(v) => setOpenDialog(v)}
      />
    </div>
  );
};
