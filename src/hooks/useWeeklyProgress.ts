
import { useMemo } from 'react';
import { useData } from './../context/DataContext';

type Category = 'exercise' | 'sleep' | 'nutrition';

export const useWeeklyProgress = (category: Category) => {
    const { decryptedStats } = useData();

    return useMemo(() => {
        const result = { weeklyData: [] as {value: number, label: string}[], average: 0, total: 0, maxValue: 0 };
        if (!decryptedStats) return result;

        const today = new Date();
        let total = 0;
        let maxValue = 0;
        let daysWithData = 0;

        for (let i = 6; i >= 0; i--) {
            const day = new Date(today);
            day.setDate(today.getDate() - i);
            const dateKey = day.toISOString().split('T')[0];
            
            const value = decryptedStats[dateKey]?.[category] || 0;
            
            result.weeklyData.push({
                value,
                label: day.toLocaleDateString('es-ES', { weekday: 'short' }).charAt(0).toUpperCase()
            });
            if (value > 0) {
                total += value;
                daysWithData++;
            }
            if (value > maxValue) {
                maxValue = value;
            }
        }
        
        result.average = daysWithData > 0 ? total / daysWithData : 0;
        result.total = total;
        result.maxValue = maxValue;

        return result;

    }, [decryptedStats, category]);
};
