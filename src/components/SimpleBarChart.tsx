import React from 'react';
import { View, Text } from 'react-native';
import { commonStyles } from './../styles/main';

interface ChartData {
    value: number;
    label: string;
}

interface SimpleBarChartProps {
  data: ChartData[];
  goal: number;
  maxValue: number;
}

export const SimpleBarChart = ({ data, goal, maxValue }: SimpleBarChartProps) => {
    const chartHeight = 150;
    const chartRenderHeight = chartHeight * 0.9; 
    
    const maxVal = goal * 1.25 || 1;

    return (
        <View style={[commonStyles.chartContainer, { height: chartHeight }]}>
            {goal > 0 && (
                <View style={[commonStyles.goalLine, { bottom: (goal / maxVal) * chartRenderHeight }]} />
            )}

            {data.map((item, index) => (
                <View key={index} style={commonStyles.barWrapper}>
                    <View style={[commonStyles.bar, { height: (Math.min(item.value, maxVal) / maxVal) * chartRenderHeight }]} />
                    <Text style={commonStyles.barLabel}>{item.label}</Text>
                </View>
            ))}
        </View>
    );
};