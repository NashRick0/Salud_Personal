
import React, { ReactNode } from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { commonStyles } from './../styles/main';

interface HabitCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: number;
  goal: number;
  unit: string;
  children?: ReactNode;
}

export const HabitCard = ({ icon, title, value, goal, unit, children }: HabitCardProps) => (
    <View style={commonStyles.card}>
        <View style={commonStyles.cardHeader}>
            <Ionicons name={icon} size={24} color="#3498db" />
            <Text style={commonStyles.cardTitle}>{title}</Text>
        </View>
        <View style={commonStyles.cardBody}>
            <Text style={commonStyles.cardValue}>{value.toFixed(1)} <Text style={commonStyles.cardUnit}>{unit}</Text></Text>
            <Text style={commonStyles.cardGoal}>Meta: {goal} {unit}</Text>
        </View>
        {children && <View style={commonStyles.cardFooter}>{children}</View>}
    </View>
);
