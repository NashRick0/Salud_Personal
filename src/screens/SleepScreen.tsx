import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useData } from './../context/DataContext';
import { useWeeklyProgress } from './../hooks/useWeeklyProgress';
import { ProgressBar } from './../components/ProgressBar';
import { SimpleBarChart } from './../components/SimpleBarChart';

export function SleepScreen() {
    const todayKey = new Date().toISOString().split('T')[0];
    const { userData, decryptedStats, updateStats } = useData();
    const [hours, setHours] = useState('');
    const [bedTime, setBedTime] = useState('');
    const [wakeTime, setWakeTime] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sleepQuality, setSleepQuality] = useState(3); // 1-5 scale
    
    const { weeklyData, average, maxValue } = useWeeklyProgress('sleep');

    const handleLogSleep = async () => {
        let hoursToLog = parseFloat(hours);
        
        // Si no se ingresaron horas directamente, calcular de las horas de acostarse/despertar
        if ((!hours || isNaN(hoursToLog) || hoursToLog <= 0) && bedTime && wakeTime) {
            const bedTimeDate = new Date(`2000-01-01T${bedTime}`);
            let wakeTimeDate = new Date(`2000-01-01T${wakeTime}`);
            
            // Si la hora de despertar es menor que la de acostarse, asumir que es al día siguiente
            if (wakeTimeDate <= bedTimeDate) {
                wakeTimeDate.setDate(wakeTimeDate.getDate() + 1);
            }
            
            hoursToLog = (wakeTimeDate.getTime() - bedTimeDate.getTime()) / (1000 * 60 * 60);
            
            if (hoursToLog <= 0 || hoursToLog > 24) {
                Alert.alert("Horario inválido", "Por favor, verifica las horas ingresadas.");
                return;
            }
        } else if (isNaN(hoursToLog) || hoursToLog <= 0 || hoursToLog > 24) {
            Alert.alert("Valor inválido", "Por favor, introduce un número de horas válido (ej: 7.5).");
            return;
        }

        setIsLoading(true);
        try {
            const currentHours = decryptedStats?.[todayKey]?.sleep || 0;
            await updateStats(todayKey, { 
                sleep: currentHours + hoursToLog,
                sleepRecords: [
                    ...(decryptedStats?.[todayKey]?.sleepRecords || []),
                    {
                        date: new Date().toISOString(),
                        hours: hoursToLog,
                        quality: sleepQuality,
                        bedTime: bedTime || null,
                        wakeTime: wakeTime || null
                    }
                ]
            });
            
            setHours('');
            setBedTime('');
            setWakeTime('');
            Alert.alert("¡Registro Exitoso!", `Has registrado ${hoursToLog.toFixed(1)} horas de sueño.`);
        } catch (error) {
            Alert.alert("Error", "No se pudo registrar el sueño. Intenta de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    const dailyValue = decryptedStats?.[todayKey]?.sleep || 0;
    const goal = userData?.goals?.sleep || 8;
    const progress = Math.min((dailyValue / goal) * 100, 100);
    const remainingHours = Math.max(goal - dailyValue, 0);
    
    // Obtener registros de sueño del día
    const todaySleepRecords = decryptedStats?.[todayKey]?.sleepRecords || [];
    
    // Calcular estadísticas de sueño
    const getSleepStatus = () => {
        if (dailyValue >= goal) return '¡Excelente!';
        if (dailyValue >= goal - 1) return 'Bueno';
        if (dailyValue >= goal - 2) return 'Regular';
        return 'Insuficiente';
    };

    const getSleepMessage = () => {
        if (dailyValue >= goal) return '¡Has alcanzado tu meta de sueño! ¡Buen trabajo!';
        return `Intenta dormir ${remainingHours.toFixed(1)} horas más para alcanzar tu meta.`;
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {/* Encabezado */}
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <View style={styles.headerIcon}>
                            <Ionicons name="moon" size={28} color="#fff" />
                        </View>
                        <View>
                            <Text style={styles.headerTitle}>Seguimiento de Sueño</Text>
                            <Text style={styles.headerSubtitle}>Descansa para rendir mejor</Text>
                        </View>
                    </View>
                </View>

                {/* Tarjeta de Progreso */}
                <View style={styles.progressCard}>
                    <View style={styles.progressHeader}>
                        <Text style={styles.progressTitle}>Tu Sueño de Hoy</Text>
                        <View style={styles.progressBadge}>
                            <Text style={styles.progressBadgeText}>
                                {progress.toFixed(0)}% de la meta
                            </Text>
                        </View>
                    </View>
                    
                    <View style={styles.progressStats}>
                        <View>
                            <Text style={styles.statValue}>{dailyValue.toFixed(1)}<Text style={styles.unit}> hrs</Text></Text>
                            <Text style={styles.statLabel}>Dormidas</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View>
                            <Text style={styles.statValue}>{goal}<Text style={styles.unit}> hrs</Text></Text>
                            <Text style={styles.statLabel}>Meta</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View>
                            <Text style={[styles.statValue, { color: remainingHours > 2 ? '#ef4444' : '#1e293b' }]}>
                                {remainingHours.toFixed(1)}<Text style={styles.unit}> hrs</Text>
                            </Text>
                            <Text style={styles.statLabel}>Restantes</Text>
                        </View>
                    </View>
                    
                    <ProgressBar value={dailyValue} goal={goal} />
                    
                    <View style={styles.sleepStatus}>
                        <Text style={styles.sleepStatusText}>Estado: <Text style={styles.sleepStatusValue}>{getSleepStatus()}</Text></Text>
                        <Text style={styles.sleepMessage}>{getSleepMessage()}</Text>
                    </View>
                </View>

                {/* Formulario para registrar sueño */}
                <View style={styles.formCard}>
                    <Text style={styles.formTitle}>Registrar Sueño</Text>
                    <Text style={styles.formDescription}>¿Cuántas horas dormiste anoche?</Text>
                    
                    <View style={styles.timeInputsContainer}>
                        <View style={styles.timeInputGroup}>
                            <Text style={styles.timeLabel}>Hora de acostarse</Text>
                            <TextInput
                                style={[styles.input, styles.timeInput]}
                                placeholder="23:00"
                                placeholderTextColor="#94a3b8"
                                value={bedTime}
                                onChangeText={setBedTime}
                                keyboardType="numbers-and-punctuation"
                            />
                        </View>
                        
                        <View style={styles.timeInputGroup}>
                            <Text style={styles.timeLabel}>Hora de despertar</Text>
                            <TextInput
                                style={[styles.input, styles.timeInput]}
                                placeholder="07:00"
                                placeholderTextColor="#94a3b8"
                                value={wakeTime}
                                onChangeText={setWakeTime}
                                keyboardType="numbers-and-punctuation"
                            />
                        </View>
                    </View>
                    
                    <Text style={[styles.formDescription, { marginTop: 16 }]}>O ingresa las horas directamente:</Text>
                    <View style={styles.hoursInputContainer}>
                        <TextInput
                            style={[styles.input, styles.hoursInput]}
                            placeholder="7.5"
                            placeholderTextColor="#94a3b8"
                            keyboardType="numeric"
                            value={hours}
                            onChangeText={setHours}
                        />
                        <Text style={styles.inputUnit}>horas</Text>
                    </View>
                    
                    <View style={styles.qualityContainer}>
                        <Text style={styles.qualityLabel}>Calidad del sueño:</Text>
                        <View style={styles.qualityStars}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <TouchableOpacity 
                                    key={star}
                                    onPress={() => setSleepQuality(star)}
                                    style={styles.starButton}
                                >
                                    <Ionicons 
                                        name={star <= sleepQuality ? 'star' : 'star-outline'}
                                        size={24}
                                        color={star <= sleepQuality ? '#f59e0b' : '#cbd5e1'}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                    
                    <TouchableOpacity 
                        style={[styles.button, isLoading && styles.buttonDisabled]}
                        onPress={handleLogSleep}
                        disabled={isLoading || (!hours && (!bedTime || !wakeTime))}
                    >
                        {isLoading ? (
                            <Ionicons name="reload" size={20} color="#fff" style={styles.buttonIcon} />
                        ) : (
                            <Ionicons name="moon" size={20} color="#fff" style={styles.buttonIcon} />
                        )}
                        <Text style={styles.buttonText}>
                            {isLoading ? 'Registrando...' : 'Registrar Sueño'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Registros del día */}
                {todaySleepRecords.length > 0 && (
                    <View style={styles.recordsCard}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Registros de Hoy</Text>
                        </View>
                        
                        {todaySleepRecords.map((record, index) => (
                            <View key={index} style={styles.recordItem}>
                                <View style={styles.recordIcon}>
                                    <Ionicons name="moon" size={20} color="#6366f1" />
                                </View>
                                <View style={styles.recordDetails}>
                                    <Text style={styles.recordHours}>
                                        {record.hours.toFixed(1)} horas
                                        {record.bedTime && record.wakeTime && (
                                            <Text style={styles.recordTime}>
                                                {' '}({record.bedTime} - {record.wakeTime})
                                            </Text>
                                        )}
                                    </Text>
                                    <View style={styles.recordQuality}>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Ionicons 
                                                key={star}
                                                name={star <= record.quality ? 'star' : 'star-outline'}
                                                size={12}
                                                color={star <= record.quality ? '#f59e0b' : '#cbd5e1'}
                                                style={styles.qualityStar}
                                            />
                                        ))}
                                    </View>
                                </View>
                                <Text style={styles.recordTime}>
                                    {new Date(record.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Gráfico Semanal */}
                <View style={styles.chartCard}>
                    <View style={styles.chartHeader}>
                        <Text style={styles.chartTitle}>Progreso Semanal</Text>
                        <View style={styles.averageBadge}>
                            <Ionicons name="stats-chart" size={16} color="#8b5cf6" />
                            <Text style={styles.averageText}>Promedio: {average.toFixed(1)} hrs/día</Text>
                        </View>
                    </View>
                    
                    <View style={styles.chartContainer}>
                        <SimpleBarChart data={weeklyData} goal={goal} maxValue={maxValue} />
                    </View>
                    
                    <View style={styles.chartLegend}>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: '#8b5cf6' }]} />
                            <Text style={styles.legendText}>Horas de sueño</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: '#8b5cf6', height: 3 }]} />
                            <Text style={styles.legendText}>Meta Diaria</Text>
                        </View>
                    </View>
                </View>
                
                {/* Consejo de Sueño */}
                <View style={styles.tipCard}>
                    <Ionicons name="moon" size={24} color="#8b5cf6" style={styles.tipIcon} />
                    <View style={styles.tipContent}>
                        <Text style={styles.tipTitle}>Consejo para Dormir Mejor</Text>
                        <Text style={styles.tipText}>
                            Mantén un horario regular de sueño, incluso los fines de semana, para ayudar a regular tu reloj biológico.
                        </Text>
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
        backgroundColor: '#8b5cf6',
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
        backgroundColor: '#f3e8ff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    progressBadgeText: {
        color: '#7c3aed',
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
    sleepStatus: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
    },
    sleepStatusText: {
        fontSize: 14,
        color: '#64748b',
        textAlign: 'center',
        marginBottom: 4,
    },
    sleepStatusValue: {
        fontWeight: '600',
        color: '#8b5cf6',
    },
    sleepMessage: {
        fontSize: 13,
        color: '#64748b',
        textAlign: 'center',
        fontStyle: 'italic',
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
    timeInputsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    timeInputGroup: {
        flex: 1,
        marginHorizontal: 4,
    },
    timeLabel: {
        fontSize: 12,
        color: '#64748b',
        marginBottom: 4,
        marginLeft: 8,
    },
    input: {
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#1e293b',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    timeInput: {
        textAlign: 'center',
        padding: 12,
    },
    hoursInputContainer: {
        position: 'relative',
        marginBottom: 20,
    },
    hoursInput: {
        fontSize: 18,
        fontWeight: '600',
        paddingRight: 80,
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
    qualityContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    qualityLabel: {
        fontSize: 14,
        color: '#64748b',
        marginBottom: 8,
    },
    qualityStars: {
        flexDirection: 'row',
    },
    starButton: {
        padding: 8,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#8b5cf6',
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
    recordsCard: {
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
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1e293b',
    },
    recordItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    recordIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f5f3ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    recordDetails: {
        flex: 1,
        marginRight: 12,
    },
    recordHours: {
        fontSize: 15,
        color: '#1e293b',
        marginBottom: 2,
    },
    recordTime: {
        fontSize: 12,
        color: '#94a3b8',
    },
    recordQuality: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    qualityStar: {
        marginRight: 2,
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
        backgroundColor: '#f5f3ff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    averageText: {
        color: '#7c3aed',
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
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 20,
        marginBottom: 20,
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    tipIcon: {
        marginRight: 16,
    },
    tipContent: {
        flex: 1,
    },
    tipTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 6,
    },
    tipText: {
        fontSize: 14,
        color: '#64748b',
        lineHeight: 20,
    },
});