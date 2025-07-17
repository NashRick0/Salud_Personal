
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { getUserData, saveUserData } from '../firebase/services';
import { Alert } from 'react-native';
import { hashPassword } from '../utils/crypto';
import { UserData } from '../types/data';

interface User {
  id: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string) => {
    const userId = username.trim().toLowerCase();
    const userData = await getUserData(userId);

    if (!userData || !userData.passwordHash) {
        Alert.alert("Error de Login", "Usuario o contraseña incorrectos.");
        return;
    }

    const passwordHash = await hashPassword(password);
    if (passwordHash === userData.passwordHash) {
        setUser({ id: userId, name: username.trim() });
    } else {
        Alert.alert("Error de Login", "Usuario o contraseña incorrectos.");
    }
  };

  const register = async (username: string, password: string): Promise<boolean> => {
    const userId = username.trim().toLowerCase();
    const existingUser = await getUserData(userId);

    if (existingUser && existingUser.passwordHash) {
        return false;
    }

    const passwordHash = await hashPassword(password);
    const newUser: Partial<UserData> = { passwordHash };
    
    await saveUserData(userId, newUser);
    setUser({ id: userId, name: username.trim() });
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};