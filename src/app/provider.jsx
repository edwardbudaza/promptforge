'use client';

import { useState } from 'react';

import { AuthProvider } from '@/components/providers/auth-provider';
import { MessagesProvider } from '@/components/providers/messages-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { UserDetailsProvider } from '@/components/providers/user-details-provider';
import { ActionContext } from '@/context/action-context';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Header } from '@/components/custom/header';
import { AppSidebar } from '@/components/custom/app-sidebar';

const Provider = ({ children }) => {
  const [action, setAction] = useState();
  return (
    <div>
      <AuthProvider>
        <PayPalScriptProvider
          options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID }}
        >
          <UserDetailsProvider>
            <MessagesProvider>
              <ActionContext.Provider value={{ action, setAction }}>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="dark"
                  enableSystem={false}
                  disableTransitionOnChange
                >
                  <SidebarProvider
                    defaultOpen={false}
                    className="flex flex-col relative"
                  >
                    <Header />
                    {children}
                    <div className="absolute">
                      <AppSidebar />
                    </div>
                  </SidebarProvider>
                </ThemeProvider>
              </ActionContext.Provider>
            </MessagesProvider>
          </UserDetailsProvider>
        </PayPalScriptProvider>
      </AuthProvider>
    </div>
  );
};
export default Provider;
