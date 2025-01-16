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
  const { userDetails } = useContext(UserDetailsContext);
  const convex = useConvex();
  const [workspaceList, setWorkspaceList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toggleSidebar } = useSidebar();
  const { workspaceId } = useParams();

  useEffect(() => {
    // Only fetch if userDetails exists and has _id
    if (userDetails?._id) {
      GetAllWorkspace();
    }
  }, [userDetails?._id]); // Depend on userDetails._id specifically

  const GetAllWorkspace = async () => {
    try {
      setIsLoading(true);
      // Only make the query if we have a userId
      if (!userDetails?._id) return;

      const result = await convex.query(api.workspace.GetAllWorkspace, {
        userId: userDetails._id,
      });

      setWorkspaceList(result || []);
    } catch (error) {
      console.error('Error fetching workspaces:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state
  if (isLoading || !userDetails?._id) {
    return (
      <div>
        <h2 className="font-medium text-lg">Your Chats</h2>
        <div className="mt-4 space-y-2">
          {/* Loading skeleton */}
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-6 bg-gray-700 animate-pulse rounded w-full"
            />
          ))}
        </div>
      </div>
    );
  }

  // Show empty state if no workspaces
  if (!workspaceList?.length) {
    return (
      <div>
        <h2 className="font-medium text-lg">Your Chats</h2>
        <p className="text-sm text-gray-400 mt-2">No chats yet</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-medium text-lg">Your Chats</h2>
      <div>
        {workspaceList.map((workspace) => (
          <Link key={workspace._id} href={`/workspace/${workspace._id}`}>
            <h2
              onClick={toggleSidebar}
              className={cn(
                'text-sm text-gray-400 mt-2 font-light cursor-pointer hover:text-white line-clamp-1 hover:line-clamp-2',
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
