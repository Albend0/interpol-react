// Importez axios ou utilisez fetch pour effectuer des requêtes HTTP
import axios from 'axios';

// Fonction pour obtenir le drapeau et le nom du pays en fonction de la nationalité
export const getCountryInfo = async (nationalityCode) => {
    try {
        const response = await axios.get(`https://restcountries.com/v3.1/alpha/${nationalityCode}`);

        if (response.data) {
            const countryData = response.data[0];
            const flag = countryData.flags.png;
            const countryName = countryData.name.common;

            return { flag, countryName };
        } else {
            throw new Error('Country data not found');
        }
    } catch (error) {
        console.error('Error fetching country info:', error);
        return { flag: null, countryName: 'N/A' };
    }
};

// Exemple d'utilisation
const nationalityCode = 'FR'; // Remplacez par le code de la nationalité réel
getCountryInfo(nationalityCode)
    .then(({ flag, countryName }) => {
        console.log('Flag:', flag);
        console.log('Country Name:', countryName);
    });
