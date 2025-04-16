import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';

interface UserContextType {
  user: any;
  isLoadingUser: boolean;
  auth0Id: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading, error } = useUser();
  const router = useRouter();
  const [persistedUser, setPersistedUser] = useState<any>(null);
  const [persistedLoading, setPersistedLoading] = useState<boolean>(true);
  const [persistedAuth0Id, setPersistedAuth0Id] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading) {
      if (error) {
        // Handle auth error by redirecting to login
        router.push('/api/auth/login');
        return;
      }
      
      if (user) {
        setPersistedUser(user);
        setPersistedAuth0Id(user.sub);
      } else {
        // Clear persisted state when user is null
        setPersistedUser(null);
        setPersistedAuth0Id(null);
      }
      setPersistedLoading(false);
    }
  }, [user, isLoading, error, router]);

  return (
    <UserContext.Provider value={{ user: persistedUser, isLoadingUser: persistedLoading, auth0Id: persistedAuth0Id }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    return { user: null, isLoadingUser: null, auth0Id: null };
  }
  return context;
};