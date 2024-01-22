import React, { useState, useEffect } from 'react';
import { SafeAreaView, FlatList, Pressable, Image, Text, TextInput, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';

const SearchScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [typingTimeout, setTypingTimeout] = useState(0);

    const handleSearch = (query) => {
        if (query.trim() === '') {
            setSearchResults([]);
            return;
        }

        const url = `https://ws-public.interpol.int/notices/v1/red?name=${query}`;

        // Utilisez le serveur intermédiaire CORS si nécessaire
        // const apiUrl = 'https://cors-anywhere.herokuapp.com/' + url;

        axios.get(url)
            .then((response) => {
                console.log('API Response:', response.data);
                setSearchResults(response.data._embedded.notices);
            })
            .catch((error) => console.error(error));
    };

    const handleSearchWithDelay = (text) => {
        clearTimeout(typingTimeout);

        setTypingTimeout(setTimeout(() => {
            handleSearch(text);
        }, 1000)); // Mettez en attente pendant 1 seconde après la dernière frappe
    };

    useEffect(() => {
        const cleanup = () => clearTimeout(typingTimeout);
        return cleanup;
    }, [typingTimeout]);

    return (
        <SafeAreaView style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder="Search Interpol notices..."
                value={searchQuery}
                onChangeText={(text) => {
                    setSearchQuery(text);
                    handleSearchWithDelay(text);
                }}
            />
            {searchResults.length > 0 ? (
                <FlatList
                    data={searchResults}
                    keyExtractor={(item) => item.entity_id.toString()}
                    renderItem={({ item }) => (
                        <Pressable
                            style={styles.item}
                            onPress={() => navigation.navigate('Details', { entityId: item.entity_id })}
                        >
                            <Image
                                source={{ uri: item._links.thumbnail?.href ?? 'https://placeholder-image-url.com' }}
                                style={styles.image}
                            />
                            <Text style={styles.name}>{item.name}</Text>
                        </Pressable>
                    )}
                />
            ) : (
                <Text>No results found</Text>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 16,
    },
    searchInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 8,
        marginTop: 20,
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

export default SearchScreen;
