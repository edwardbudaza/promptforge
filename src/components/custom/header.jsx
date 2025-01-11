import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Colors } from '@/data/colors';

export const Header = () => {
  return (
    <div className="p-5 flex justify-between items-center">
      <Image src="/logo.svg" alt="Prompt Forge Logo" width={30} height={30} />

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
    </div>
  );
};
