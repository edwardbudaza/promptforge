'use client';

import { useContext, useEffect, useState } from 'react';
import { useConvex } from 'convex/react';

import { UserDetailsContext } from '@/context/user-details-context';
import { api } from '../../../convex/_generated/api';
import Link from 'next/link';
import { useSidebar } from '../ui/sidebar';
import { useParams } from 'next/navigation';
import { cn } from '@/lib/utils';

export const WorkspaceHistory = () => {
  const { userDetails, setUserDetails } = useContext(UserDetailsContext);
  const convex = useConvex();
  const [workspaceList, setWorkspaceList] = useState();
  const { toggleSidebar } = useSidebar();
  const { workspaceId } = useParams();

  useEffect(() => {
    userDetails && GetAllWorkspace();
  }, [userDetails]);

  const GetAllWorkspace = async () => {
    const result = await convex.query(api.workspace.GetAllWorkspace, {
      userId: userDetails?._id,
    });

    setWorkspaceList(result);

    console.log('All Workspaces', result);
  };
  return (
    <div>
      <h2 className="font-medium text-lg">Your Chats</h2>
      <div>
        {workspaceList &&
          workspaceList?.map((workspace) => (
            <Link key={workspace._id} href={`/workspace/${workspace?._id}`}>
              <h2
                onClick={toggleSidebar}
                className={cn(
                  'text-sm text-gray-400 mt-2 font-light cursor-pointer hover:text-white',
                  workspaceId === workspace._id && 'text-white'
                )}
              >
                {workspace?.messages[0]?.content}
              </h2>
            </Link>
          ))}
      </div>
    </div>
  );
};
