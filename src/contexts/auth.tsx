import { createContext, useContext, useState } from 'react';
import { AuthContextData, AuthProviderProps, IUser } from '../interfaces';

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<IUser>();

  const signIn = (userData: IUser) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
