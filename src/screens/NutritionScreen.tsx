import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useData } from './../context/DataContext';
import { useWeeklyProgress } from './../hooks/useWeeklyProgress';
import { ProgressBar } from './../components/ProgressBar';
import { SimpleBarChart } from './../components/SimpleBarChart';

export function NutritionScreen() {
    const todayKey = new Date().toISOString().split('T')[0];
    
    const { userData, decryptedStats, updateStats } = useData();
    const [calories, setCalories] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [mealType, setMealType] = useState('comida'); // 'almuerzo', 'comida', 'cena', 'snack'
    const [mealDescription, setMealDescription] = useState('');
    
    const { weeklyData, average, maxValue } = useWeeklyProgress('nutrition');

    const handleLogCalories = async () => {
        const newCalories = parseInt(calories, 10);
        if (isNaN(newCalories) || newCalories <= 0) {
            Alert.alert("Valor inválido", "Por favor, introduce un número positivo de calorías.");
            return;
        }
        if (!mealDescription.trim()) {
            Alert.alert("Descripción requerida", "Por favor, describe qué has comido.");
            return;
        }

        setIsLoading(true);
        try {
            const currentCalories = decryptedStats?.[todayKey]?.nutrition || 0;
            await updateStats(todayKey, { 
                nutrition: currentCalories + newCalories,
                meals: [
                    ...(decryptedStats?.[todayKey]?.meals || []),
                    {
                        type: mealType,
                        description: mealDescription,
                        calories: newCalories,
                        time: new Date().toISOString()
                    }
                ]
            });
            
            setCalories('');
            setMealDescription('');
            Alert.alert("¡Registro Exitoso!", `Has registrado ${newCalories} kcal de ${mealType}.`);
        } catch (error) {
            Alert.alert("Error", "No se pudo registrar el consumo. Intenta de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    const dailyValue = decryptedStats?.[todayKey]?.nutrition || 0;
    const goal = userData?.goals?.calories || 2000;
    const remainingCalories = goal - dailyValue > 0 ? goal - dailyValue : 0;
    const progress = Math.min((dailyValue / goal) * 100, 100);
    
    // Obtener comidas del día
    const todayMeals = decryptedStats?.[todayKey]?.meals || [];
    const mealIcons = {
        'almuerzo': 'cafe',
        'comida': 'restaurant',
        'cena': 'moon',
        'snack': 'nutrition'
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {/* Encabezado */}
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <View style={styles.headerIcon}>
                            <Ionicons name="restaurant" size={28} color="#fff" />
                        </View>
                        <View>
                            <Text style={styles.headerTitle}>Nutrición Diaria</Text>
                            <Text style={styles.headerSubtitle}>Cuida tu alimentación</Text>
                        </View>
                    </View>
                </View>

                {/* Tarjeta de Progreso */}
                <View style={styles.progressCard}>
                    <View style={styles.progressHeader}>
                        <Text style={styles.progressTitle}>Tu Consumo de Hoy</Text>
                        <View style={styles.progressBadge}>
                            <Text style={styles.progressBadgeText}>
                                {progress.toFixed(0)}% de tu meta
                            </Text>
                        </View>
                    </View>
                    
                    <View style={styles.progressStats}>
                        <View>
                            <Text style={styles.statValue}>{dailyValue}<Text style={styles.unit}> kcal</Text></Text>
                            <Text style={styles.statLabel}>Consumidas</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View>
                            <Text style={styles.statValue}>{goal}<Text style={styles.unit}> kcal</Text></Text>
                            <Text style={styles.statLabel}>Meta</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View>
                            <Text style={[styles.statValue, { color: remainingCalories < 500 ? '#ef4444' : '#1e293b' }]}>
                                {remainingCalories}<Text style={styles.unit}> kcal</Text>
                            </Text>
                            <Text style={styles.statLabel}>Restantes</Text>
                        </View>
                    </View>
                    
                    <ProgressBar value={dailyValue} goal={goal} />
                    
                    <View style={styles.macroStats}>
                        <View style={styles.macroItem}>
                            <View style={[styles.macroDot, { backgroundColor: '#3b82f6' }]} />
                            <Text style={styles.macroText}>Proteínas: 120g</Text>
                        </View>
                        <View style={styles.macroItem}>
                            <View style={[styles.macroDot, { backgroundColor: '#10b981' }]} />
                            <Text style={styles.macroText}>Carbos: 250g</Text>
                        </View>
                        <View style={styles.macroItem}>
                            <View style={[styles.macroDot, { backgroundColor: '#f59e0b' }]} />
                            <Text style={styles.macroText}>Grasas: 70g</Text>
                        </View>
                    </View>
                </View>

                {/* Formulario para agregar comida */}
                <View style={styles.formCard}>
                    <Text style={styles.formTitle}>Registrar Comida</Text>
                    <Text style={styles.formDescription}>¿Qué has comido hoy?</Text>
                    
                    <View style={styles.mealTypeSelector}>
                        {['almuerzo', 'comida', 'cena', 'snack'].map((type) => (
                            <TouchableOpacity
                                key={type}
                                style={[
                                    styles.mealTypeButton,
                                    mealType === type && styles.mealTypeButtonActive
                                ]}
                                onPress={() => setMealType(type)}
                            >
                                <Ionicons 
                                    name={mealIcons[type as keyof typeof mealIcons] as any} 
                                    size={20} 
                                    color={mealType === type ? '#3b82f6' : '#64748b'} 
                                />
                                <Text 
                                    style={[
                                        styles.mealTypeText,
                                        mealType === type && styles.mealTypeTextActive
                                    ]}
                                >
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    
                    <TextInput
                        style={[styles.input, styles.mealDescriptionInput]}
                        placeholder="Describe lo que has comido..."
                        placeholderTextColor="#94a3b8"
                        value={mealDescription}
                        onChangeText={setMealDescription}
                        multiline
                    />
                    
                    <View style={styles.caloriesInputContainer}>
                        <TextInput
                            style={[styles.input, styles.caloriesInput]}
                            placeholder="0"
                            placeholderTextColor="#94a3b8"
                            keyboardType="numeric"
                            value={calories}
                            onChangeText={setCalories}
                        />
                        <Text style={styles.inputUnit}>kcal</Text>
                    </View>
                    
                    <TouchableOpacity 
                        style={[styles.button, (isLoading || !calories || !mealDescription) && styles.buttonDisabled]}
                        onPress={handleLogCalories}
                        disabled={isLoading || !calories || !mealDescription}
                    >
                        {isLoading ? (
                            <Ionicons name="reload" size={20} color="#fff" style={styles.buttonIcon} />
                        ) : (
                            <Ionicons name="add-circle" size={20} color="#fff" style={styles.buttonIcon} />
                        )}
                        <Text style={styles.buttonText}>
                            {isLoading ? 'Registrando...' : 'Agregar Comida'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Historial de comidas del día */}
                {todayMeals.length > 0 && (
                    <View style={styles.mealHistoryCard}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Hoy has consumido</Text>
                            <Text style={styles.seeAllText}>Ver todo</Text>
                        </View>
                        
                        {todayMeals.slice(0, 3).map((meal, index) => (
                            <View key={index} style={styles.mealItem}>
                                <View style={styles.mealIconContainer}>
                                    <Ionicons 
                                        name={mealIcons[meal.type as keyof typeof mealIcons] as any} 
                                        size={20} 
                                        color="#3b82f6" 
                                    />
                                </View>
                                <View style={styles.mealDetails}>
                                    <Text style={styles.mealName} numberOfLines={1}>
                                        {meal.description}
                                    </Text>
                                    <Text style={styles.mealTime}>
                                        {new Date(meal.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Text>
                                </View>
                                <Text style={styles.mealCalories}>
                                    {meal.calories} kcal
                                </Text>
                            </View>
                        ))}
                        
                        {todayMeals.length > 3 && (
                            <TouchableOpacity style={styles.viewMoreButton}>
                                <Text style={styles.viewMoreText}>
                                    Ver {todayMeals.length - 3} más
                                </Text>
                                <Ionicons name="chevron-down" size={16} color="#3b82f6" />
                            </TouchableOpacity>
                        )}
                    </View>
                )}

                {/* Gráfico Semanal */}
                <View style={styles.chartCard}>
                    <View style={styles.chartHeader}>
                        <Text style={styles.chartTitle}>Progreso Semanal</Text>
                        <View style={styles.averageBadge}>
                            <Ionicons name="stats-chart" size={16} color="#10b981" />
                            <Text style={styles.averageText}>Promedio: {average.toFixed(0)} kcal/día</Text>
                        </View>
                    </View>
                    
                    <View style={styles.chartContainer}>
                        <SimpleBarChart data={weeklyData} goal={goal} maxValue={maxValue} />
                    </View>
                    
                    <View style={styles.chartLegend}>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: '#3b82f6' }]} />
                            <Text style={styles.legendText}>Calorías</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: '#10b981', height: 3 }]} />
                            <Text style={styles.legendText}>Meta Diaria</Text>
                        </View>
                    </View>
                </View>
                
                {/* Consejo de Nutrición */}
                <View style={styles.tipCard}>
                    <Ionicons name="nutrition" size={24} color="#f59e0b" style={styles.tipIcon} />
                    <View style={styles.tipContent}>
                        <Text style={styles.tipTitle}>Consejo de Nutrición</Text>
                        <Text style={styles.tipText}>
                            Incluye una variedad de frutas y verduras en tus comidas para obtener una amplia gama de nutrientes esenciales.
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
        backgroundColor: '#10b981',
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
        backgroundColor: '#d1fae5',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    progressBadgeText: {
        color: '#065f46',
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
    macroStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
    },
    macroItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    macroDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 6,
    },
    macroText: {
        fontSize: 12,
        color: '#64748b',
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
    mealTypeSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    mealTypeButton: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        padding: 10,
        borderRadius: 12,
        backgroundColor: '#f8fafc',
        marginHorizontal: 4,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    mealTypeButtonActive: {
        backgroundColor: '#f0f9ff',
        borderColor: '#bae6fd',
    },
    mealTypeText: {
        fontSize: 12,
        color: '#64748b',
        marginTop: 4,
    },
    mealTypeTextActive: {
        color: '#0ea5e9',
        fontWeight: '600',
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
    mealDescriptionInput: {
        minHeight: 60,
        textAlignVertical: 'top',
        marginBottom: 12,
    },
    caloriesInputContainer: {
        position: 'relative',
        marginBottom: 20,
    },
    caloriesInput: {
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
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#10b981',
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
    mealHistoryCard: {
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
    seeAllText: {
        color: '#3b82f6',
        fontSize: 14,
        fontWeight: '500',
    },
    mealItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    mealIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#ecfdf5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    mealDetails: {
        flex: 1,
        marginRight: 12,
    },
    mealName: {
        fontSize: 16,
        color: '#1e293b',
        marginBottom: 2,
    },
    mealTime: {
        fontSize: 12,
        color: '#94a3b8',
    },
    mealCalories: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1e293b',
    },
    viewMoreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        marginTop: 8,
    },
    viewMoreText: {
        color: '#3b82f6',
        fontSize: 14,
        fontWeight: '500',
        marginRight: 4,
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