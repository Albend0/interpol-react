// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
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
                        headerTitle : () => (
                            <Image
                                style={{ width: 82, height: 75 }}
                                source={require('./assets/logo.png')}
                            />
                        ),
                    }}
                />
                <Tab.Screen name="Search" component={SearchScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
};

export default App;
