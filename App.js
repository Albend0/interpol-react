// App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './src/screens/HomeScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { Image } from 'react-native';

const Tab = createBottomTabNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen
                    name="Interpol - Wanted Persons"
                    component={HomeScreen}
                    options={{
                        tabBarLabel: 'Accueil',
                        headerTintColor: '#fff',
                        headerStyle: {
                            height: 150,
                        },
                        headerTitle: () => (
                            <Image
                                source={require('./assets/logo.png')}
                                style={{ width: 82, height: 75 }}
                            />
                        ),
                    }}
                />
                <Tab.Screen name="Settings" component={SettingsScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
};

export default App;
