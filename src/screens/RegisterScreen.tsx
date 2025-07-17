import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from './../context/AuthContext';
import { commonStyles } from './../styles/main';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from './../navigation/AppNavigator';

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

export default function RegisterScreen({ navigation }: Props) {
    const { register } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<{[key: string]: string}>({});

    const validateForm = () => {
        const newErrors: {[key: string]: string} = {};
        
        if (!username.trim()) {
            newErrors.username = 'El nombre de usuario es requerido';
        } else if (username.length < 3) {
            newErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
        }
        
        if (!email) {
            newErrors.email = 'El correo electrónico es requerido';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'El correo electrónico no es válido';
        }
        
        if (!password) {
            newErrors.password = 'La contraseña es requerida';
        } else if (password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }
        
        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        if (!validateForm()) return;
        
        setIsLoading(true);
        try {
            const success = await register(username, password, email);
            if (!success) {
                Alert.alert("Error de Registro", "El nombre de usuario o correo electrónico ya está en uso.");
            }
        } catch (error) {
            Alert.alert("Error", "Ocurrió un error al registrar la cuenta. Por favor, inténtalo de nuevo.");
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
                    contentContainerStyle={{ flexGrow: 1, paddingVertical: 20 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={[commonStyles.loginContainer, { paddingTop: 10 }]}>
                        {/* Título y Descripción */}
                        <View style={{ width: '100%', marginBottom: 30 }}>
                            <TouchableOpacity 
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 12,
                                    backgroundColor: '#e0f2fe',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginBottom: 20,
                                    borderWidth: 1,
                                    borderColor: '#bae6fd'
                                }}
                                onPress={() => navigation.goBack()}
                            >
                                <Ionicons name="arrow-back" size={20} color="#0ea5e9" />
                            </TouchableOpacity>
                            
                            <Text style={[commonStyles.loginTitle, { marginBottom: 10 }]}>Crear Cuenta</Text>
                            <Text style={commonStyles.loginSubtitle}>
                                Únete a nuestra comunidad y comienza a mejorar tu bienestar
                            </Text>
                        </View>

                        {/* Formulario de Registro */}
                        <View style={{ width: '100%', marginBottom: 20 }}>
                            {/* Nombre de Usuario */}
                            <View style={commonStyles.inputContainer}>
                                <Text style={commonStyles.inputLabel}>Nombre de usuario</Text>
                                <TextInput
                                    style={[
                                        commonStyles.loginInput,
                                        errors.username && { borderColor: '#ef4444' }
                                    ]}
                                    placeholder="Crea un nombre de usuario"
                                    placeholderTextColor="#94a3b8"
                                    value={username}
                                    onChangeText={(text) => {
                                        setUsername(text);
                                        if (errors.username) setErrors({...errors, username: ''});
                                    }}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                                {errors.username && (
                                    <Text style={commonStyles.errorText}>{errors.username}</Text>
                                )}
                            </View>

                            {/* Correo Electrónico */}
                            <View style={commonStyles.inputContainer}>
                                <Text style={commonStyles.inputLabel}>Correo electrónico</Text>
                                <TextInput
                                    style={[
                                        commonStyles.loginInput,
                                        errors.email && { borderColor: '#ef4444' }
                                    ]}
                                    placeholder="tucorreo@ejemplo.com"
                                    placeholderTextColor="#94a3b8"
                                    value={email}
                                    onChangeText={(text) => {
                                        setEmail(text);
                                        if (errors.email) setErrors({...errors, email: ''});
                                    }}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                                {errors.email && (
                                    <Text style={commonStyles.errorText}>{errors.email}</Text>
                                )}
                            </View>

                            {/* Contraseña */}
                            <View style={commonStyles.inputContainer}>
                                <Text style={commonStyles.inputLabel}>Contraseña</Text>
                                <View style={{ position: 'relative' }}>
                                    <TextInput
                                        style={[
                                            commonStyles.loginInput, 
                                            { paddingRight: 50 },
                                            errors.password && { borderColor: '#ef4444' }
                                        ]}
                                        placeholder="Crea una contraseña segura"
                                        placeholderTextColor="#94a3b8"
                                        value={password}
                                        onChangeText={(text) => {
                                            setPassword(text);
                                            if (errors.password) setErrors({...errors, password: ''});
                                        }}
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
                                {errors.password && (
                                    <Text style={commonStyles.errorText}>{errors.password}</Text>
                                )}
                                <Text style={{
                                    fontSize: 12,
                                    color: '#64748b',
                                    marginTop: 4
                                }}>
                                    Mínimo 6 caracteres
                                </Text>
                            </View>

                            {/* Confirmar Contraseña */}
                            <View style={commonStyles.inputContainer}>
                                <Text style={commonStyles.inputLabel}>Confirmar Contraseña</Text>
                                <View style={{ position: 'relative' }}>
                                    <TextInput
                                        style={[
                                            commonStyles.loginInput, 
                                            { paddingRight: 50 },
                                            errors.confirmPassword && { borderColor: '#ef4444' }
                                        ]}
                                        placeholder="Confirma tu contraseña"
                                        placeholderTextColor="#94a3b8"
                                        value={confirmPassword}
                                        onChangeText={(text) => {
                                            setConfirmPassword(text);
                                            if (errors.confirmPassword) setErrors({...errors, confirmPassword: ''});
                                        }}
                                        secureTextEntry={!showConfirmPassword}
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
                                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        <Ionicons 
                                            name={showConfirmPassword ? "eye-off" : "eye"} 
                                            size={20} 
                                            color="#94a3b8" 
                                        />
                                    </TouchableOpacity>
                                </View>
                                {errors.confirmPassword && (
                                    <Text style={commonStyles.errorText}>{errors.confirmPassword}</Text>
                                )}
                            </View>
                        </View>

                        {/* Términos y Condiciones */}
                        <View style={{ 
                            flexDirection: 'row', 
                            alignItems: 'flex-start',
                            marginBottom: 25,
                            padding: 12,
                            backgroundColor: '#f1f5f9',
                            borderRadius: 12
                        }}>
                            <Ionicons name="information-circle" size={20} color="#64748b" style={{ marginRight: 10, marginTop: 2 }} />
                            <Text style={{ 
                                flex: 1, 
                                fontSize: 13, 
                                color: '#475569',
                                lineHeight: 18
                            }}>
                                Al registrarte, aceptas nuestros Términos de servicio y Política de privacidad. Podrás gestionar tus preferencias en cualquier momento.
                            </Text>
                        </View>

                        {/* Botón de Registro */}
                        <TouchableOpacity 
                            style={[commonStyles.button, { 
                                width: '100%',
                                opacity: isLoading ? 0.7 : 1,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }]} 
                            onPress={handleRegister}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#ffffff" style={{ marginRight: 10 }} />
                            ) : (
                                <Ionicons name="person-add" size={20} color="#ffffff" style={{ marginRight: 10 }} />
                            )}
                            <Text style={commonStyles.buttonText}>
                                {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
                            </Text>
                        </TouchableOpacity>

                        {/* Enlace a Inicio de Sesión */}
                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 25 }}>
                            <Text style={{ color: '#64748b', marginRight: 5 }}>¿Ya tienes una cuenta?</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text style={{ color: '#3498db', fontWeight: '600' }}>Inicia Sesión</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}