import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import { getCountryInfo } from '../utils/country';

const DetailsScreen = ({ route }) => {
    const { name, forename, images, nationalities } = route.params;
    const [countryInfo, setCountryInfo] = useState([]);

    useEffect(() => {
        const fetchCountryInfo = async () => {
            const infoArray = await Promise.all(
                nationalities.map(async (nationalityCode) => {
                    return {
                        nationalityCode,
                        countryInfo: await getCountryInfo(nationalityCode),
                    };
                })
            );
            setCountryInfo(infoArray);
        };

        fetchCountryInfo();
    }, [nationalities]);

    const renderItem = ({ item }) => (
        <View style={styles.countryContainer}>
            <Text style={styles.countryText}>
                Pays à l'origine du mandat d'arrêt : {item.countryInfo.countryName}
            </Text>
            {item.countryInfo.flag && (
                <Image source={{ uri: item.countryInfo.flag }} style={styles.countryFlag} />
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.nameText}>Nom d'usage : {name}</Text>
            <Text style={styles.forenameText}>Prénom(s) : {forename}</Text>
            <Image source={{ uri: images }} style={styles.profileImage} />
            <FlatList
                data={countryInfo}
                keyExtractor={(item) => item.nationalityCode}
                renderItem={renderItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    nameText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    forenameText: {
        fontSize: 16,
        marginTop: 8,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginTop: 10,
    },
    countryContainer: {
        marginTop: 10,
    },
    countryText: {
        fontSize: 16,
    },
    countryFlag: {
        width: 100,
        height: 60,
        marginTop: 5,
    },
});

export default DetailsScreen;
