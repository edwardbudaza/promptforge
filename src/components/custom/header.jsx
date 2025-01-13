'use client';

import Image from 'next/image';
import { useContext } from 'react';

import { Button } from '@/components/ui/button';
import { UserDetailsContext } from '@/context/user-details-context';
import { Colors } from '@/data/colors';

export const Header = () => {
  const { userDetails, setUserDetails } = useContext(UserDetailsContext);
  return (
    <div className="p-5 flex justify-between items-center">
      <Image src="/logo.svg" alt="Prompt Forge Logo" width={30} height={30} />
      {!userDetails?.name && (
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
      )}
    </div>
  );
};
