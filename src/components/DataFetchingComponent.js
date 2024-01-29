// src/components/DataFetchingComponent.js

import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

import { View, Text, Image, FlatList, SafeAreaView, ActivityIndicator, StyleSheet, Pressable } from 'react-native';
import { fetchData, convertEntityIdToNoticeId } from '../utils/api';

const DataFetchingComponent = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);
    const navigation = useNavigation();

    const handlePress = (item) => {
        navigation.navigate('Details', {
            name: item.name,
            forename: item.forename,
            images: item.images,
            nationalities: item.nationalities,
            charge: item.charge,
            dateOfBirth: item.date_of_birth,
            weight: item.weight,
            height: item.height,
            sexId: item.sex_id,
            countryOfBirthId: item.country_of_birth_id,
            distinguishingMarks: item.distinguishing_marks,
            eyesColorsId: item.eyes_colors_id,
            hairsId: item.hairs_id,
            placeOfBirth: item.place_of_birth,
            noticeId: item.noticeId,
            entityId: item.entity_id,
        });
    };

    useEffect(() => {
        fetchDataFromApi();
    }, [currentPage]);

    const handleEndReached = () => {
        if (!loadingMore) {
            setCurrentPage((prevPage) => prevPage + 1);
            setLoadingMore(true);
        }
    };

    const fetchDataFromApi = async () => {
        try {
            setLoading(true);

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

                        const detailsResponse = await fetch(notice._links.self.href);
                        const detailsJson = await detailsResponse.json();

                        return {
                            entity_id: notice.entity_id,
                            noticeId: convertEntityIdToNoticeId(notice.entity_id),
                            forename: notice.forename || 'N/A',
                            name: notice.name || 'N/A',
                            images: imagesJson._links.thumbnail.href,
                            nationalities: notice.nationalities,
                            charge: detailsJson.arrest_warrants[0]?.charge || 'N/A',
                            date_of_birth: detailsJson.date_of_birth || 'N/A',
                            weight: detailsJson.weight || 'N/A',
                            height: detailsJson.height || 'N/A',
                            sex_id: detailsJson.sex_id || 'N/A',
                            country_of_birth_id: detailsJson.country_of_birth_id || 'N/A',
                            distinguishing_marks: detailsJson.distinguishing_marks || 'N/A',
                            eyes_colors_id: detailsJson.eyes_colors_id || [],
                            hairs_id: detailsJson.hairs_id || [],
                            place_of_birth: detailsJson.place_of_birth || 'N/A',
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

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.itemContainer}>
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.noticeId}
                    numColumns={2}
                    renderItem={({ item }) => (
                        <Pressable style={styles.item} onPress={() => handlePress(item)}>
                            <Image source={{ uri: item.images }} style={styles.image} />
                            <Text style={styles.name}>{item.name}</Text>
                        </Pressable>
                    )}
                    onEndReached={handleEndReached}
                    onEndReachedThreshold={0.1}
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
    name: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 8,
        textAlign: 'center',
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 50,
        marginBottom: 8,
    },
});

export default DataFetchingComponent;
