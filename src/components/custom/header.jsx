'use client';

import Image from 'next/image';
import { useContext } from 'react';

import { Button } from '@/components/ui/button';
import { UserDetailsContext } from '@/context/user-details-context';
import { Colors } from '@/data/colors';
import Link from 'next/link';
import { useSidebar } from '../ui/sidebar';
import { usePathname } from 'next/navigation';
import { LucideDownload, Rocket } from 'lucide-react';
import { ActionContext } from '@/context/action-context';

export const Header = () => {
  const { userDetails, setUserDetails } = useContext(UserDetailsContext);
  const { toggleSidebar } = useSidebar();
  const { action, setAction } = useContext(ActionContext);
  const path = usePathname();

  const onActionBtn = (action) => {
    setAction({
      actionType: action,
      timeStamp: Date.now(),
    });
  };
  return (
    <div className="p-4 flex justify-between items-center border-b">
      <Link href={'/'}>
        <Image src="/logo.svg" alt="Prompt Forge Logo" width={30} height={30} />
      </Link>
      {!userDetails?.name ? (
        <div className="flex gap-5">
          <Button variant="ghost">Sign In</Button>
          <Button
            className="text-white"
            style={{
              backgroundColor: Colors.BLUE,
            }}
          >
            Get Started
          </Button>
        </div>
      ) : (
        path?.includes('workspace') && (
          <div className="flex gap-2 items-center">
            <Button variant="ghost" onClick={() => onActionBtn('export')}>
              <LucideDownload />
              Export
            </Button>
            <Button
              className="bg-blue-500 text-white hover:bg-blue-600"
              onClick={() => onActionBtn('deploy')}
            >
              <Rocket />
              Deploy
            </Button>
            {userDetails && (
              <Image
                src={userDetails?.imageUrl}
                alt="user"
                width={30}
                height={30}
                className="rounded-full w-[30px] cursor-pointer"
                onClick={toggleSidebar}
              />
            )}
          </div>
        )
      )}
    </div>
  );
};
