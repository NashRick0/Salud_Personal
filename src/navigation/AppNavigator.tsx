
import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { 
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem 
} from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';

import { useAuth } from './../context/AuthContext';
import { useData } from './../context/DataContext';

import LoginScreen from './../screens/LoginScreen';
import RegisterScreen from './../screens/RegisterScreen';
import { ExerciseScreen } from './../screens/ExerciseScreen';
import { SleepScreen } from './../screens/SleepScreen';
import { NutritionScreen } from './../screens/NutritionScreen';
import { ProfileScreen } from './../screens/ProfileScreen';

import { commonStyles } from './../styles/main';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Ejercicio: undefined;
  Sueño: undefined;
  Nutrición: undefined;
};


export type AppDrawerParamList = {
  Panel: { screen?: keyof MainTabParamList };
  Perfil: undefined;
};

const AuthStack = createStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const Drawer = createDrawerNavigator<AppDrawerParamList>();

function AuthNavigator() {
    return (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="Login" component={LoginScreen} />
            <AuthStack.Screen name="Register" component={RegisterScreen} />
        </AuthStack.Navigator>
    );
}

function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap = 'help-circle';
                    if (route.name === 'Ejercicio') iconName = focused ? 'barbell' : 'barbell-outline';
                    else if (route.name === 'Sueño') iconName = focused ? 'moon' : 'moon-outline';
                    else if (route.name === 'Nutrición') iconName = focused ? 'fast-food' : 'fast-food-outline';
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#3498db',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
            })}
        >
            <Tab.Screen name="Ejercicio" component={ExerciseScreen} />
            <Tab.Screen name="Sueño" component={SleepScreen} />
            <Tab.Screen name="Nutrición" component={NutritionScreen} />
        </Tab.Navigator>
    );
}


function CustomDrawerContent(props: any) {
    return (
        <DrawerContentScrollView {...props}>
            <DrawerItem
                label="Ejercicio"
                icon={({ color, size }) => <Ionicons name="barbell-outline" size={size} color={color} />}
                onPress={() => props.navigation.navigate('Panel', { screen: 'Ejercicio' })}
            />
            <DrawerItem
                label="Sueño"
                icon={({ color, size }) => <Ionicons name="moon-outline" size={size} color={color} />}
                onPress={() => props.navigation.navigate('Panel', { screen: 'Sueño' })}
            />
            <DrawerItem
                label="Nutrición"
                icon={({ color, size }) => <Ionicons name="fast-food-outline" size={size} color={color} />}
                onPress={() => props.navigation.navigate('Panel', { screen: 'Nutrición' })}
            />
            <DrawerItem
                label="Perfil"
                icon={({ color, size }) => <Ionicons name="person-circle-outline" size={size} color={color} />}
                onPress={() => props.navigation.navigate('Perfil')}
            />
        </DrawerContentScrollView>
    );
}

function AppDrawer() {
    return (
        <Drawer.Navigator 
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerStyle: { backgroundColor: '#3498db' }, 
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold' },
                drawerActiveTintColor: '#3498db',
                drawerInactiveTintColor: 'gray',
            }}
        >
            <Drawer.Screen name="Panel" component={MainTabs} />
            <Drawer.Screen name="Perfil" component={ProfileScreen} />
        </Drawer.Navigator>
    );
}

export default function AppNavigator() {
    const { user } = useAuth();
    const { loading } = useData();

    if (user && loading) {
        return (
            <View style={commonStyles.container}>
                <ActivityIndicator size="large" color="#3498db" />
                <Text style={{marginTop: 10, fontSize: 16}}>Cargando tus datos...</Text>
            </View>
        );
    }

    return (
        <NavigationContainer>
            {user ? <AppDrawer /> : <AuthNavigator />}
        </NavigationContainer>
    );
}