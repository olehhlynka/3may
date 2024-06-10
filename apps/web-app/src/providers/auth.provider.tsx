import { UserType, getUserContract } from '@3may/contracts';
import { getFetchRequest } from '@swarmion/serverless-contracts';
import { createContext, useContext, useEffect, useState } from 'react';

export const AuthContext = createContext<{
  token: string | null;
  setToken: (token: string | null) => void;
  user: UserType | null;
  loading: boolean;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}>({
  token: null,
  setToken: () => {},
  user: null,
  loading: true,
  setIsLoggedIn: () => {},
  isLoggedIn: false,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');

    setToken(storedToken);

    setLoading(false);
  }, [isLoggedIn]);

  useEffect(() => {
    if (!loading) {
      getUser();
    }
  }, [loading, token]);

  const getUser = async () => {
    try {
      const { body } = await getFetchRequest(getUserContract, fetch, {
        baseUrl: import.meta.env.VITE_SWARMION_API_URL,
        // @ts-expect-error headers are not defined
        headers: {
          Authorization: token,
        },
      });

      if (!('message' in body)) {
        setUser(body);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ token, setToken, loading, isLoggedIn, setIsLoggedIn, user }}
    >
      {children}
    </AuthContext.Provider>
  );
};
