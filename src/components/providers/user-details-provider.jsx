'use client';

import { useState, useEffect } from 'react';

import { UserDetailsContext } from '@/context/user-details-context';
import { useConvex } from 'convex/react';
import { api } from '../../../convex/_generated/api';

export function UserDetailsProvider({ children }) {
  const [userDetails, setUserDetails] = useState();
  const convex = useConvex();

  useEffect(() => {
    IsAuthenticated();
  }, []);

  const IsAuthenticated = async () => {
    if (typeof window !== undefined) {
      const user = JSON.parse(localStorage.getItem('user'));

      //Fetch from Database
      const result = await convex.query(api.users.GetUser, {
        email: user?.email,
      });
      setUserDetails(result);
      console.log('User Details:', result);
    }
  };

  return (
    <div>
      <UserDetailsContext.Provider value={{ userDetails, setUserDetails }}>
        {children}
      </UserDetailsContext.Provider>
    </div>
  );
}
