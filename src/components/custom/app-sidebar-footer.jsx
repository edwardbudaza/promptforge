'use client';

import { HelpCircle, LogOut, Settings, Wallet } from 'lucide-react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { googleLogout } from '@react-oauth/google';
import { useSidebar } from '../ui/sidebar';

export const AppSidebarFooter = () => {
  const router = useRouter();
  const { toggleSidebar } = useSidebar();

  const handleLogout = () => {
    // Clear Google OAuth session
    googleLogout();

    // Clear any local storage or cookies
    localStorage.clear();

    // Remove any cookies
    document.cookie.split(';').forEach((cookie) => {
      document.cookie = cookie
        .replace(/^ +/, '')
        .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
    });

    // Use window.location for a complete refresh and navigation
    window.location.href = '/';
  };

  const options = [
    {
      name: 'Settings',
      icon: Settings,
    },
    {
      name: 'Help Center',
      icon: HelpCircle,
    },
    {
      name: 'My Subscription',
      icon: Wallet,
      path: '/pricing',
    },
    {
      name: 'Sign Out',
      icon: LogOut,
      onClick: handleLogout,
    },
  ];

  const onOptionClick = (option) => {
    if (option.onClick) {
      option.onClick();
    } else if (option.path) {
      toggleSidebar();
      router.push(option.path);
    }
  };

  return (
    <div className="p-2 mb-10">
      {options.map((option, index) => (
        <Button
          onClick={() => onOptionClick(option)}
          variant="ghost"
          className="w-full flex justify-start my-3 gap-2"
          key={index}
        >
          <option.icon className="h-4 w-4" />
          <span>{option.name}</span>
        </Button>
      ))}
    </div>
  );
};
