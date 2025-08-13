import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useData } from './../context/DataContext';
import { useWeeklyProgress } from './../hooks/useWeeklyProgress';
import { ProgressBar } from './../components/ProgressBar';
import { SimpleBarChart } from './../components/SimpleBarChart';

export function ExerciseScreen() {
    const todayKey = new Date().toISOString().split('T')[0];
    
    const { userData, decryptedStats, updateStats } = useData();
    const [minutes, setMinutes] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { weeklyData, average, maxValue } = useWeeklyProgress('exercise');

    const handleLogExercise = async () => {
        const newMinutes = parseInt(minutes, 10);
        if (isNaN(newMinutes) || newMinutes <= 0) {
            Alert.alert("Valor inválido", "Por favor, introduce un número positivo de minutos.");
            return;
        }

        setIsLoading(true);
        try {
            const currentMinutes = decryptedStats?.[todayKey]?.exercise || 0;
            await updateStats(todayKey, { exercise: currentMinutes + newMinutes });
            setMinutes('');
            Alert.alert("¡Registro Exitoso!", `Has añadido ${newMinutes} minutos de ejercicio.`);
        } catch (error) {
            Alert.alert("Error", "No se pudo registrar el ejercicio. Intenta de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const dailyValue = decryptedStats?.[todayKey]?.exercise || 0;
    const goal = userData?.goals?.exercise || 60;
    const progress = Math.min((dailyValue / goal) * 100, 100);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {/* Encabezado */}
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <View style={styles.headerIcon}>
                            <Ionicons name="barbell" size={28} color="#fff" />
                        </View>
                        <View>
                            <Text style={styles.headerTitle}>Ejercicio Diario</Text>
                            <Text style={styles.headerSubtitle}>Mantente activo y saludable</Text>
                        </View>
                    </View>
                </View>

                {/* Tarjeta de Progreso */}
                <View style={styles.progressCard}>
                    <View style={styles.progressHeader}>
                        <Text style={styles.progressTitle}>Tu Progreso de Hoy</Text>
                        <View style={styles.progressBadge}>
                            <Text style={styles.progressBadgeText}>
                                {progress.toFixed(0)}% Completado
                            </Text>
                        </View>
                    </View>
                    
                    <View style={styles.progressStats}>
                        <View>
                            <Text style={styles.statValue}>{dailyValue}<Text style={styles.unit}> min</Text></Text>
                            <Text style={styles.statLabel}>Realizado</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View>
                            <Text style={styles.statValue}>{goal}<Text style={styles.unit}> min</Text></Text>
                            <Text style={styles.statLabel}>Meta</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View>
                            <Text style={styles.statValue}>{goal - dailyValue > 0 ? goal - dailyValue : 0}<Text style={styles.unit}> min</Text></Text>
                            <Text style={styles.statLabel}>Restante</Text>
                        </View>
                    </View>
                    
                    <ProgressBar value={dailyValue} goal={goal} />
                </View>

                {/* Formulario para agregar ejercicio */}
                <View style={styles.formCard}>
                    <Text style={styles.formTitle}>Registrar Ejercicio</Text>
                    <Text style={styles.formDescription}>¿Cuántos minutos de ejercicio realizaste hoy?</Text>
                    
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej: 30"
                            placeholderTextColor="#94a3b8"
                            keyboardType="numeric"
                            value={minutes}
                            onChangeText={setMinutes}
                        />
                        <Text style={styles.inputUnit}>minutos</Text>
                    </View>
                    
                    <TouchableOpacity 
                        style={[styles.button, isLoading && styles.buttonDisabled]}
                        onPress={handleLogExercise}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Ionicons name="reload" size={20} color="#fff" style={styles.buttonIcon} />
                        ) : (
                            <Ionicons name="add-circle" size={20} color="#fff" style={styles.buttonIcon} />
                        )}
                        <Text style={styles.buttonText}>
                            {isLoading ? 'Registrando...' : 'Agregar Ejercicio'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Gráfico Semanal */}
                <View style={styles.chartCard}>
                    <View style={styles.chartHeader}>
                        <Text style={styles.chartTitle}>Progreso Semanal</Text>
                        <View style={styles.averageBadge}>
                            <Ionicons name="stats-chart" size={16} color="#10b981" />
                            <Text style={styles.averageText}>Promedio: {average.toFixed(0)} min/día</Text>
                        </View>
                    </View>
                    
                    <View style={styles.chartContainer}>
                        <SimpleBarChart data={weeklyData} goal={goal} maxValue={maxValue} />
                    </View>
                    
                    <View style={styles.chartLegend}>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: '#3b82f6' }]} />
                            <Text style={styles.legendText}>Minutos</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: '#10b981', height: 3 }]} />
                            <Text style={styles.legendText}>Meta Diaria</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    scrollView: {
        flex: 1,
    },
    header: {
        backgroundColor: '#3b82f6',
        padding: 20,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        marginBottom: 20,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerIcon: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 4,
    },
    headerSubtitle: {
        color: '#e0f2fe',
        fontSize: 14,
    },
    progressCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    progressTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1e293b',
    },
    progressBadge: {
        backgroundColor: '#e0f2fe',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    progressBadgeText: {
        color: '#0369a1',
        fontSize: 12,
        fontWeight: '600',
    },
    progressStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    statValue: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1e293b',
        textAlign: 'center',
    },
    statLabel: {
        fontSize: 12,
        color: '#64748b',
        textAlign: 'center',
        marginTop: 4,
    },
    statDivider: {
        width: 1,
        backgroundColor: '#e2e8f0',
        marginHorizontal: 10,
    },
    unit: {
        fontSize: 16,
        color: '#94a3b8',
        fontWeight: '500',
    },
    achievementButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fffbeb',
        padding: 12,
        borderRadius: 12,
        marginTop: 16,
    },
    achievementButtonText: {
        color: '#d97706',
        fontWeight: '600',
        marginLeft: 8,
    },
    formCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    formTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 8,
    },
    formDescription: {
        fontSize: 14,
        color: '#64748b',
        marginBottom: 16,
    },
    inputContainer: {
        position: 'relative',
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        padding: 16,
        fontSize: 18,
        fontWeight: '600',
        color: '#1e293b',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        paddingRight: 100,
    },
    inputUnit: {
        position: 'absolute',
        right: 16,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        color: '#94a3b8',
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 56,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3b82f6',
        padding: 16,
        borderRadius: 12,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonIcon: {
        marginRight: 8,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    chartCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1e293b',
    },
    averageBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ecfdf5',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    averageText: {
        color: '#059669',
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 6,
    },
    chartContainer: {
        marginTop: 20,
        marginBottom: 10,
    },
    chartLegend: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 12,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 12,
    },
    legendColor: {
        width: 16,
        height: 16,
        borderRadius: 4,
        marginRight: 6,
    },
    legendText: {
        fontSize: 12,
        color: '#64748b',
    },
    tipCard: {
        display: 'none',
    },
    tipIcon: {
        display: 'none',
    },
    tipContent: {
        display: 'none',
    },
    tipTitle: {
        display: 'none',
    },
    tipText: {
        display: 'none',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    sectionContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1e293b',
    },
});