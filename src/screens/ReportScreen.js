import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, AsyncStorage } from 'react-native';

const ReportScreen = () => {
    const [reportedCard, setReportedCard] = useState(null);

    useEffect(() => {
        const getReportedCard = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem('reportedCard');
                if (jsonValue !== null) {
                    const card = JSON.parse(jsonValue);
                    console.log('Reported Card:', card);
                    setReportedCard(card);
                }
            } catch (error) {
                console.error('Error retrieving reported card:', error);
            }
        };

        getReportedCard();
    }, []);


    if (!reportedCard) {
        return (
            <View style={styles.container}>
                <Text>No reported card available</Text>
            </View>
        );
    }

    // Render the reported card details as needed

    return (
        <View style={styles.container}>
            {/* Render the reported card details here */}
            <Text>{reportedCard.name}</Text>
            {/* ... (other details) */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ReportScreen;
