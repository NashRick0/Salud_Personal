import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, TextInput, SafeAreaView, Image, StyleSheet, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from './../context/AuthContext';
import { useData } from './../context/DataContext';
import { commonStyles } from './../styles/main';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    registerForPushNotificationsAsync,
    scheduleDailyTipNotification,
    cancelAllNotifications,
} from '../services/notificationService';

export function ProfileScreen() {
    const { user, logout } = useAuth();
    const { userData, updateGoals } = useData();
    
    const [exerciseGoal, setExerciseGoal] = useState('');
    const [sleepGoal, setSleepGoal] = useState('');
    const [caloriesGoal, setCaloriesGoal] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);

    useEffect(() => {
        if (userData?.goals) {
            setExerciseGoal(userData.goals.exercise.toString());
            setSleepGoal(userData.goals.sleep.toString());
            setCaloriesGoal(userData.goals.calories.toString());
        }
        const loadNotificationSetting = async () => {
            const storedSetting = await AsyncStorage.getItem('notificationsEnabled');
            if (storedSetting !== null) {
                setNotificationsEnabled(JSON.parse(storedSetting));
            }
        };
        loadNotificationSetting();
    }, [userData]);

    const handleLogout = () => {
        Alert.alert(
            "Cerrar Sesión",
            "¿Estás seguro de que quieres cerrar sesión?",
            [
                { 
                    text: "Cancelar", 
                    style: "cancel" 
                },
                { 
                    text: "Cerrar Sesión", 
                    onPress: logout, 
                    style: "destructive" 
                }
            ]
        );
    };

    const handleSaveGoals = async () => {
        const newExerciseGoal = parseInt(exerciseGoal, 10);
        const newSleepGoal = parseFloat(sleepGoal);
        const newCaloriesGoal = parseInt(caloriesGoal, 10);

        if (isNaN(newExerciseGoal) || isNaN(newSleepGoal) || isNaN(newCaloriesGoal)) {
            Alert.alert("Error", "Por favor, introduce valores numéricos válidos para todas las metas.");
            return;
        }

        if (newExerciseGoal < 0 || newSleepGoal < 0 || newCaloriesGoal < 0) {
            Alert.alert("Error", "Los valores de las metas no pueden ser negativos.");
            return;
        }

        if (newExerciseGoal > 1440) {
            Alert.alert("Error", "La meta de ejercicio no puede ser mayor a 1440 minutos (24 horas).");
            return;
        }
        
        if (newSleepGoal > 24) {
            Alert.alert("Error", "La meta de sueño no puede ser mayor a 24 horas.");
            return;
        }

        setIsLoading(true);
        try {
            await updateGoals({
                exercise: newExerciseGoal,
                sleep: newSleepGoal,
                calories: newCaloriesGoal,
            });
            setIsEditing(false);
            Alert.alert("¡Éxito!", "Tus metas han sido actualizadas correctamente.");
        } catch (error) {
            Alert.alert("Error", "No se pudieron guardar los cambios. Por favor, inténtalo de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleNotificationsToggle = async (value: boolean) => {
        setNotificationsEnabled(value);
        await AsyncStorage.setItem('notificationsEnabled', JSON.stringify(value));

        if (value) {
            const permissionGranted = await registerForPushNotificationsAsync();
            if (permissionGranted) {
                await scheduleDailyTipNotification();
                Alert.alert('¡Notificaciones Activadas!', 'Recibirás un consejo saludable todos los días a las 9:00 AM.');
            } else {
                Alert.alert('Permiso Denegado', 'No se pudieron activar las notificaciones. Por favor, habilita los permisos en la configuración de tu dispositivo.');
                setNotificationsEnabled(false); // Revert switch if permission is denied
                await AsyncStorage.setItem('notificationsEnabled', JSON.stringify(false));
            }
        } else {
            await cancelAllNotifications();
            Alert.alert('Notificaciones Desactivadas', 'Ya no recibirás consejos diarios.');
        }
    };

    const toggleEditMode = () => {
        setIsEditing(!isEditing);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
            <ScrollView style={styles.container}>
                {/* Encabezado del Perfil */}
                <View style={styles.headerContainer}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Ionicons name="person" size={50} color="#0ea5e9" />
                        </View>
                        <TouchableOpacity style={styles.editButton} onPress={toggleEditMode}>
                            <Ionicons name={isEditing ? "close" : "pencil"} size={20} color="#0ea5e9" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.userName}>{user?.name || 'Usuario'}</Text>
                </View>

                {/* Sección de Metas */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Mis Metas Diarias</Text>
                        {isEditing && (
                            <TouchableOpacity onPress={handleSaveGoals} disabled={isLoading}>
                                <Text style={styles.saveButton}>
                                    {isLoading ? 'Guardando...' : 'Guardar'}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <View style={styles.goalCard}>
                        <View style={styles.goalHeader}>
                            <View style={[styles.goalIcon, { backgroundColor: '#e0f7fa' }]}>
                                <Ionicons name="barbell" size={24} color="#00bcd4" />
                            </View>
                            <Text style={styles.goalLabel}>Ejercicio (min/día)</Text>
                        </View>
                        {isEditing ? (
                            <TextInput
                                style={[styles.input, styles.goalInput]}
                                value={exerciseGoal}
                                onChangeText={setExerciseGoal}
                                keyboardType="numeric"
                                placeholder="Ej: 30"
                                placeholderTextColor="#94a3b8"
                            />
                        ) : (
                            <Text style={styles.goalValue}>{exerciseGoal} <Text style={styles.unit}>min</Text></Text>
                        )}
                    </View>

                    <View style={styles.goalCard}>
                        <View style={styles.goalHeader}>
                            <View style={[styles.goalIcon, { backgroundColor: '#e3f2fd' }]}>
                                <Ionicons name="moon" size={24} color="#2196f3" />
                            </View>
                            <Text style={styles.goalLabel}>Sueño (hrs/noche)</Text>
                        </View>
                        {isEditing ? (
                            <TextInput
                                style={[styles.input, styles.goalInput]}
                                value={sleepGoal}
                                onChangeText={setSleepGoal}
                                keyboardType="numeric"
                                placeholder="Ej: 8"
                                placeholderTextColor="#94a3b8"
                            />
                        ) : (
                            <Text style={styles.goalValue}>{sleepGoal} <Text style={styles.unit}>hrs</Text></Text>
                        )}
                    </View>

                    <View style={styles.goalCard}>
                        <View style={styles.goalHeader}>
                            <View style={[styles.goalIcon, { backgroundColor: '#f3e5f5' }]}>
                                <Ionicons name="restaurant" size={24} color="#9c27b0" />
                            </View>
                            <Text style={styles.goalLabel}>Calorías (kcal/día)</Text>
                        </View>
                        {isEditing ? (
                            <TextInput
                                style={[styles.input, styles.goalInput]}
                                value={caloriesGoal}
                                onChangeText={setCaloriesGoal}
                                keyboardType="numeric"
                                placeholder="Ej: 2000"
                                placeholderTextColor="#94a3b8"
                            />
                        ) : (
                            <Text style={styles.goalValue}>{caloriesGoal} <Text style={styles.unit}>kcal</Text></Text>
                        )}
                    </View>
                </View>

                {/* Sección de Configuración */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Configuración</Text>
                    </View>
                    <View style={styles.settingRow}>
                        <View style={styles.settingLabelContainer}>
                            <Ionicons name="notifications" size={24} color="#64748b" />
                            <Text style={styles.settingLabel}>Notificaciones Diarias</Text>
                        </View>
                        <Switch
                            trackColor={{ false: "#e2e8f0", true: "#86efac" }}
                            thumbColor={notificationsEnabled ? "#22c55e" : "#f1f5f9"}
                            ios_backgroundColor="#e2e8f0"
                            onValueChange={handleNotificationsToggle}
                            value={notificationsEnabled}
                        />
                    </View>
                </View>

                {/* Botón de Cerrar Sesión */}
                <TouchableOpacity 
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >
                    <Ionicons name="log-out" size={20} color="#ef4444" style={{ marginRight: 8 }} />
                    <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
                </TouchableOpacity>

                <View style={styles.versionContainer}>
                    <Text style={styles.versionText}>VitaTrack v1.0.0</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
        padding: 16,
    },
    headerContainer: {
        alignItems: 'center',
        paddingVertical: 24,
        marginBottom: 16,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#e0f2fe',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#bae6fd',
    },
    editButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#ffffff',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    userName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 16,
        color: '#64748b',
    },
    sectionContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
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
    saveButton: {
        color: '#0ea5e9',
        fontSize: 16,
        fontWeight: '600',
    },
    goalCard: {
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    goalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    goalIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    goalLabel: {
        fontSize: 16,
        color: '#475569',
        fontWeight: '500',
    },
    goalValue: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1e293b',
    },
    unit: {
        fontSize: 16,
        color: '#64748b',
        fontWeight: '500',
    },
    input: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        color: '#1e293b',
    },
    goalInput: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        paddingVertical: 14,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    settingLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingLabel: {
        fontSize: 16,
        color: '#334155',
        marginLeft: 16,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginTop: 8,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#fee2e2',
    },
    logoutButtonText: {
        color: '#ef4444',
        fontSize: 16,
        fontWeight: '600',
    },
    versionContainer: {
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 24,
    },
    versionText: {
        fontSize: 14,
        color: '#94a3b8',
    },
});