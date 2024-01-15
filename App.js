import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    FlatList,
    SafeAreaView,
    ActivityIndicator,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

function HomeScreen() {
    return <DataFetchingComponent />;
}

function SettingsScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Settings!</Text>
        </View>
    );
}

const DataFetchingComponent = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);

    useEffect(() => {
        fetchData();
    }, [currentPage]);

    const fetchData = async () => {
        try {
            const response = await fetch(
                `https://ws-public.interpol.int/notices/v1/red?page=${currentPage}`
            );
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const json = await response.json();

            if (json._embedded && Array.isArray(json._embedded.notices)) {
                const notices = json._embedded.notices.slice(0, 9);
                const processedData = await Promise.all(
                    notices.map(async (notice) => {
                        const imagesResponse = await fetch(notice._links.images.href);
                        const imagesJson = await imagesResponse.json();

                        return {
                            entity_id: notice.entity_id,
                            noticeId: convertEntityIdToNoticeId(notice.entity_id),
                            forename: notice.forename || 'N/A',
                            name: notice.name || 'N/A',
                            images: imagesJson._links.thumbnail.href,
                        };
                    })
                );

                setData((prevData) => [...prevData, ...processedData]);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const convertEntityIdToNoticeId = (entityId) => {
        return entityId.replace('/', '-');
    };

    const handleEndReached = () => {
        if (!loadingMore) {
            setCurrentPage((prevPage) => prevPage + 1);
            setLoadingMore(true);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.itemContainer}>
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.noticeId}
                    numColumns={3}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <Image source={{ uri: item.images }} style={styles.image} />
                            <Text style={styles.forename}>{item.forename}</Text>
                            <Text style={styles.name}>{item.name}</Text>
                        </View>
                    )}
                    onEndReached={handleEndReached}
                    onEndReachedThreshold={0.1} // Trigger the event when 10% from the bottom
                    ListFooterComponent={() =>
                        loadingMore ? (
                            <ActivityIndicator size="small" color="#0000ff" />
                        ) : null
                    }
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    itemContainer: {
        flex: 1,
        marginTop: 10,
    },
    item: {
        flex: 1,
        margin: 6,
        padding: 13,
        borderWidth: 1,
        borderColor: '#87CEFA',
        borderRadius: 8,
        alignItems: 'center',
        textAlign: 'center',
    },
    forename: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 8,
        textAlign: 'center',
    },
    name: {
        fontSize: 12,
        marginTop: 6,
        textAlign: 'center',
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 50,
        marginBottom: 8,
    },
});

export default function App() {
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
}
