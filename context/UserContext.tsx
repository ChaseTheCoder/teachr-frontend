import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

interface UserContextType {
  user: any;
  isLoadingUser: boolean;
  auth0Id: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useUser();
  const [persistedUser, setPersistedUser] = useState<any>(null);
  const [persistedLoading, setPersistedLoading] = useState<boolean>(true);
  const [persistedAuth0Id, setPersistedAuth0Id] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && user) {
      setPersistedUser(user);
      setPersistedLoading(false);
      setPersistedAuth0Id(user.sub)
    } else if (!isLoading && !user) {
      setPersistedLoading(false);
    }
  }, [user, isLoading]);

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