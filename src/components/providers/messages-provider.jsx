'use client';

import { useState } from 'react';

import { MessagesContext } from '@/context/messages-context';

export function MessagesProvider({ children }) {
  const [messages, setMessages] = useState();
  return (
    <div>
      <MessagesContext.Provider value={{ messages, setMessages }}>
        {children}
      </MessagesContext.Provider>
    </div>
  );
}
