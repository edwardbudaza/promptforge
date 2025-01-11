'use client';

import { useState } from 'react';

import { UserDetailsContext } from '@/context/user-details-context';

export function UserDetailsProvider({ children }) {
  const [userDetails, setUserDetails] = useState();
  return (
    <div>
      <UserDetailsContext.Provider value={{ userDetails, setUserDetails }}>
        {children}
      </UserDetailsContext.Provider>
    </div>
  );
}
