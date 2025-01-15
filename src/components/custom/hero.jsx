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

export const Hero = () => {
  const [userInput, setUserInput] = useState();
  const { messages, setMessages } = useContext(MessagesContext);
  const { userDetails, setUserdetails } = useContext(UserDetailsContext);
  const [openDialog, setOpenDialog] = useState(false);
  const CreateWorkspace = useMutation(api.workspace.CreateWorkspace);
  const router = useRouter();

  const onGenerate = async (input) => {
    if (!userDetails?.name) {
      setOpenDialog(true);
      return;
    }
    if (userDetails?.token < 10) {
      toast('You dont have enough token!');
      return;
    }
    setMessages({
      role: 'user',
      content: input,
    });

    const workspaceId = await CreateWorkspace({
      user: userDetails?._id,
      messages: [
        {
          role: 'user',
          content: input,
        },
      ],
    });
    console.log(workspaceId);
    router.push(`/workspace/${workspaceId}`);
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
            onChange={(event) => setUserInput(event.target.value)}
            placeholder={Lookup.INPUT_PLACEHOLDER}
            className="outline-none bg-transparent w-full h-32 max-h-56 resize-none"
          />
          {userInput && (
            <ArrowRight
              onClick={() => onGenerate(userInput)}
              className="bg-blue-500 p-2 h-10 w-10 rounded-md cursor-pointer"
            />
          )}{' '}
        </div>
        <div>
          <Link className="w-5 h-5" />
        </div>
      </div>
      <div className="flex mt-8 flex-wrap max-w-2xl items-center justify-center gap-3">
        {Lookup?.SUGGSTIONS.map((suggestion, index) => (
          <h2
            onClick={() => onGenerate(suggestion)}
            key={index}
            className="p-1 px-2 border rounded-full text-sm text-gray-400 hover:text-white cursor-pointer"
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
