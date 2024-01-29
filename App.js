// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import ReportScreen from './src/screens/ReportScreen';
import { Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createStackNavigator } from '@react-navigation/stack';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    headerTintColor: '#fff',
                    headerStyle: {
                        height: 150,
                    },
                    headerTitle: () => (
                        <Image
                            style={{ width: 82, height: 75 }}
                            source={require('./assets/logo.png')}
                        />
                    ),
                }}
            />
            <Stack.Screen
                name="Details"
                component={DetailsScreen}
                // No custom header for Details screen
            />
        </Stack.Navigator>
    );
}

const App = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen
                    name="Interpol - Wanted Persons"
                    component={HomeStack}
                    options={{
                        headerShown: false,
                        tabBarLabel: 'Red Notices',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="globe" color={color} size={size} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Search"
                    component={SearchScreen}
                    options={{
                        tabBarLabel: 'Recherche',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="search" color={color} size={size} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Report"
                    component={ReportScreen}
                    options={{
                        tabBarLabel: 'Signalements',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="alert" color={color} size={size} />
                        ),
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
};

export default App;
