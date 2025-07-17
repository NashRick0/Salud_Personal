
import React from 'react';
import { View } from 'react-native';
import { commonStyles } from './../styles/main';

interface ProgressBarProps {
  value: number;
  goal: number;
}

export const ProgressBar = ({ value, goal }: ProgressBarProps) => {
    const percentage = goal > 0 ? (value / goal) * 100 : 0;
    return (
        <View style={commonStyles.progressBarContainer}>
            <View style={[commonStyles.progressBarFill, { width: `${Math.min(percentage, 100)}%` }]} />
        </View>
    );
};