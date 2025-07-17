
import React, { createContext, useState, useEffect, useContext, ReactNode, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { getUserData, saveUserData } from './../firebase/services';
import { encryptData, decryptData } from './../utils/crypto';
import { UserData, DailyStats, DecryptedStats, Goal } from './../types/data';

interface DataContextType {
  userData: UserData | null;
  decryptedStats: DecryptedStats | null;
  loading: boolean;
  updateStats: (date: string, newStats: Partial<DailyStats>) => Promise<void>;
  updateGoals: (newGoals: Goal) => Promise<void>;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const decryptedStats = useMemo((): DecryptedStats | null => {
        if (!userData?.stats) return null;
        const stats: DecryptedStats = {};
        for (const dateKey in userData.stats) {
            const day = userData.stats[dateKey];
            stats[dateKey] = {
                exercise: day.exercise,
                nutrition: day.nutrition,
                sleep: typeof day.sleep === 'object' ? decryptData(day.sleep.value)?.sleep : day.sleep,
                weight: typeof day.weight === 'object' ? decryptData(day.weight.value)?.weight : day.weight,
            };
        }
        return stats;
    }, [userData]);

    useEffect(() => {
        const loadInitialData = async () => {
            if (user?.id) {
                setLoading(true);
                const data = await getUserData(user.id);
                setUserData(data);
                setLoading(false);
            } else {
                setUserData(null);
            }
        };
        loadInitialData();
    }, [user]);

    const updateStats = async (date: string, newStats: Partial<DailyStats>) => {
        if (!user || !userData) return;
        const dataToSave = JSON.parse(JSON.stringify(userData.stats));
        if (!dataToSave[date]) dataToSave[date] = {};
        if (newStats.sleep !== undefined) dataToSave[date].sleep = { value: encryptData({ sleep: newStats.sleep }) };
        if (newStats.weight !== undefined) dataToSave[date].weight = { value: encryptData({ weight: newStats.weight }) };
        if (newStats.exercise !== undefined) dataToSave[date].exercise = newStats.exercise;
        if (newStats.nutrition !== undefined) dataToSave[date].nutrition = newStats.nutrition;
        setUserData(prev => prev ? ({ ...prev, stats: dataToSave }) : null);
        await saveUserData(user.id, { stats: dataToSave });
    };

    const updateGoals = async (newGoals: Goal) => {
        if (!user) return;
        setUserData(prev => prev ? ({ ...prev, goals: newGoals }) : null);
        await saveUserData(user.id, { goals: newGoals });
    };

    return (
        <DataContext.Provider value={{ userData, decryptedStats, loading, updateStats, updateGoals }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) throw new Error('useData must be used within a DataProvider');
  return context;
};