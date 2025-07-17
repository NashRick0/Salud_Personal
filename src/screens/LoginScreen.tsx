import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, Image, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from './../context/AuthContext';
import { commonStyles } from './../styles/main';
import { AuthStackParamList } from '../navigation/AppNavigator';
import { StackNavigationProp } from '@react-navigation/stack';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

export default function LoginScreen({ navigation }: Props) {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        if (!username.trim() || !password.trim()) {
            Alert.alert("Campos Requeridos", "Por favor, introduce tu usuario y contraseña.");
            return;
        }
        
        setIsLoading(true);
        try {
            await login(username, password);
        } catch (error) {
            Alert.alert("Error", "Ocurrió un error al iniciar sesión. Por favor, inténtalo de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
            <KeyboardAvoidingView 
                style={{ flex: 1 }} 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView 
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={commonStyles.loginContainer}>
                        {/* Logo y Título */}
                        <View style={commonStyles.logoContainer}>
                            <View style={{
                                width: 100,
                                height: 100,
                                backgroundColor: '#e0f2fe',
                                borderRadius: 20,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 20,
                                borderWidth: 1,
                                borderColor: '#bae6fd'
                            }}>
                                <Ionicons name="barbell" size={50} color="#0ea5e9" />
                            </View>
                            <Text style={commonStyles.loginTitle}>VitaTrack</Text>
                            <Text style={commonStyles.loginSubtitle}>
                                Tu compañero de salud y bienestar personal
                            </Text>
                        </View>

                        {/* Formulario */}
                        <View style={{ width: '100%', marginBottom: 20 }}>
                            <View style={commonStyles.inputContainer}>
                                <Text style={commonStyles.inputLabel}>Nombre de usuario</Text>
                                <TextInput
                                    style={commonStyles.loginInput}
                                    placeholder="Ingresa tu usuario"
                                    placeholderTextColor="#94a3b8"
                                    value={username}
                                    onChangeText={setUsername}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>

                            <View style={commonStyles.inputContainer}>
                                <Text style={commonStyles.inputLabel}>Contraseña</Text>
                                <View style={{ position: 'relative' }}>
                                    <TextInput
                                        style={[commonStyles.loginInput, { paddingRight: 50 }]}
                                        placeholder="Ingresa tu contraseña"
                                        placeholderTextColor="#94a3b8"
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry={!showPassword}
                                        autoCapitalize="none"
                                    />
                                    <TouchableOpacity 
                                        style={{
                                            position: 'absolute',
                                            right: 15,
                                            top: 0,
                                            bottom: 0,
                                            justifyContent: 'center'
                                        }}
                                        onPress={() => setShowPassword(!showPassword)}
                                    >
                                        <Ionicons 
                                            name={showPassword ? "eye-off" : "eye"} 
                                            size={20} 
                                            color="#94a3b8" 
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        {/* Botón de Inicio de Sesión */}
                        <TouchableOpacity 
                            style={[commonStyles.button, { 
                                width: '100%',
                                marginTop: 10,
                                opacity: isLoading ? 0.7 : 1,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }]} 
                            onPress={handleLogin}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#ffffff" style={{ marginRight: 10 }} />
                            ) : (
                                <Ionicons name="log-in" size={20} color="#ffffff" style={{ marginRight: 10 }} />
                            )}
                            <Text style={commonStyles.buttonText}>
                                {isLoading ? 'Iniciando sesión...' : 'Ingresar'}
                            </Text>
                        </TouchableOpacity>

                        {/* Divider */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 30, width: '100%' }}>
                            <View style={{ flex: 1, height: 1, backgroundColor: '#e2e8f0' }} />
                            <Text style={{ paddingHorizontal: 10, color: '#94a3b8', fontSize: 14 }}>o</Text>
                            <View style={{ flex: 1, height: 1, backgroundColor: '#e2e8f0' }} />
                        </View>

                        {/* Botón de Registro */}
                        <TouchableOpacity 
                            style={[commonStyles.secondaryButton, { width: '100%' }]} 
                            onPress={() => navigation.navigate('Register')}
                        >
                            <Text style={[commonStyles.secondaryButtonText, { color: '#3498db' }]}>
                                Crear una cuenta nueva
                            </Text>
                        </TouchableOpacity>

                        {/* Términos y Condiciones */}
                        <Text style={{
                            marginTop: 30,
                            textAlign: 'center',
                            color: '#94a3b8',
                            fontSize: 12,
                            lineHeight: 18,
                            paddingHorizontal: 20
                        }}>
                            Al iniciar sesión, aceptas nuestros Términos de servicio y Política de privacidad
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}