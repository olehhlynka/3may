import { createContext, useContext, useEffect, useState } from 'react';

export const AuthContext = createContext<{
  token: string | null;
  setToken: (token: string | null) => void;
  loading: boolean;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}>({
  token: null,
  setToken: () => {},
  loading: true,
  setIsLoggedIn: () => {},
  isLoggedIn: false,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');

    setToken(storedToken);

    setLoading(false);
  }, [isLoggedIn]);

  return (
    <AuthContext.Provider
      value={{ token, setToken, loading, isLoggedIn, setIsLoggedIn }}
    >
      {children}
    </AuthContext.Provider>
  );
};
