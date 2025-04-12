import React, { createContext, useContext } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getData } from '../services/authenticatedApiCalls';

interface UserContextType {
  user: any;
  isLoadingUser: boolean;
  auth0Id: string | null;
  profileData: any;
  isLoadingProfile: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useUser();
  const queryClient = useQueryClient();

  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/profile_auth0/${user?.sub}`),
    enabled: !!user?.sub,
    staleTime: Infinity,
    initialData: () => queryClient.getQueryData(['profile'])
  });

  const value = {
    user,
    isLoadingUser: isLoading,
    auth0Id: user?.sub || null,
    profileData,
    isLoadingProfile
  };

  console.log('UserContext value:', value);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    return { user: null, isLoadingUser: null, auth0Id: null, profileData: null, isLoadingProfile: null };
  }
  return context;
};