import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { getCountryInfo } from '../utils/country';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReportScreen from "./ReportScreen";



const DetailsScreen = ({ route }) => {
    const { name, forename, images, nationalities, charge, dateOfBirth, weight, height, sexId, distinguishingMarks, eyesColorsId, hairsId } = route.params;
    const [countryInfo, setCountryInfo] = useState([]);
    const navigation = useNavigation();

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

    const renderCountryFlags = () => (
        <View style={styles.countryContainer}>
            {countryInfo.map((item, index) => (
                <Image
                    key={index}
                    source={{ uri: item.countryInfo?.flag }}
                    style={styles.countryFlag}
                />
            ))}
        </View>
    );

    const handleReport = async () => {
        try {
            await AsyncStorage.setItem('reportedCard', JSON.stringify(route.params));
            alert('Card reported successfully!');
            // Navigate to the ReportScreen.js component
            navigation.navigate('ReportScreen');
        } catch (error) {
            console.error('Error saving reported card:', error);
        }
    };


    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.countryFlagContainer}>
                    {countryInfo.length > 0 && (
                        <Image
                            source={{ uri: countryInfo[0]?.countryInfo?.flag }}
                            style={styles.countryFlag}
                        />
                    )}
                </View>
                <Image source={{ uri: images }} style={styles.profileImage} />
                <View style={styles.textContainer}>
                    <Text style={styles.nameText}>Nom : {name}</Text>
                    <Text style={styles.forenameText}>Prénom(s) : {forename}</Text>
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>Date de naissance : {dateOfBirth}</Text>
                    <Text style={styles.infoText}>Poids : {weight}</Text>
                    <Text style={styles.infoText}>Taille : {height}</Text>
                    <Text style={styles.infoText}>Sexe : {sexId}</Text>
                    <Text style={styles.infoText}>Marques distinctives : {distinguishingMarks}</Text>
                    <Text style={styles.infoText}>Couleurs des yeux : {eyesColorsId.join(', ')}</Text>
                    <Text style={styles.infoText}>Couleurs des cheveux : {hairsId.join(', ')}</Text>
                </View>
                <View style={styles.chargeContainer}>
                    <Text style={styles.chargeText} ellipsizeMode="tail" numberOfLines={5}>
                        Motif(s) : {charge}
                    </Text>
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.reportButton} onPress={handleReport}>
                    <Text style={styles.reportButtonText}>
                        <Ionicons name="warning" size={24} color="#FFF" style={styles.icon} />
                        Signaler
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        position: 'relative',
    },
    infoContainer: {
        marginTop: 5,
    },
    reportedText: {
        fontSize: 16,
        color: '#FF0000',
        fontWeight: 'bold',
    },
    infoText: {
        fontSize: 14,
        marginTop: 5,
        color: '#555', // Couleur de texte plus sombre
    },
    countryFlagContainer: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 1,
    },
    chargeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0E4378',
        padding: 10,
        borderRadius: 8,
        marginTop: 20,
    },
    countryFlag: {
        width: 60,
        height: 40,
        borderRadius: 5,
    },
    nameText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    forenameText: {
        fontSize: 16,
        marginTop: 8,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: 'center',
        marginBottom: 10,
    },
    textContainer: {
        marginTop: 20,
        marginBottom: 5,
    },
    countryContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    countryText: {
        fontSize: 16,
    },
    icon: {
        marginRight: 5,
    },
    chargeText: {
        fontSize: 16,
        color: '#FFF',
    },
    buttonContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    reportButton: {
        backgroundColor: '#FF000090',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    reportButtonText: {
        color: '#FFF', // White color for text
        fontWeight: 'bold',
        fontSize: 16,
        paddingBottom: 5,
    },
});

export default DetailsScreen;
