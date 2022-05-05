import { useSession } from 'next-auth/react';
import { createContext, useContext, useEffect, useState } from 'react';
import { v4 as newUuid } from 'uuid';
import { AuthContextData, AuthProviderProps, IUser } from '../interfaces';

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const { data: session } = useSession();
  const [user, setUser] = useState<IUser>();

  useEffect(() => {
    if (session) {
      setUser({
        userId: newUuid(),
        ...session.user,
      });
    }
  }, [session]);

  return (
    <AuthContext.Provider
      value={{
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
