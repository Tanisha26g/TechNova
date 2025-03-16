import React, { useEffect, useState } from 'react';
import CropRecommendationTool from './CropRecommendationTool'; // Import the component

const translations = {
    en: {
        soilTypes: 'Soil Types',
        noSoilTypes: 'No soil types available at the moment.',
        pH: 'pH',
    },
    hi: {
        soilTypes: 'मिट्टी के प्रकार',
        noSoilTypes: 'इस समय कोई मिट्टी के प्रकार उपलब्ध नहीं हैं।',
        pH: 'पीएच',
    },
    ta: {
        soilTypes: 'மண்ணின் வகைகள்',
        noSoilTypes: 'இப்போது மண்ணின் வகைகள் எதுவும் கிடைக்கவில்லை.',
        pH: 'பிஹச்',
    },
};

const soilTypeTranslations = {
    en: {
        "Loamy": "Loamy",
        "Clayey": "Clayey",
        "Sandy": "Sandy",
        "Loamy description": "Loamy soil is a mixture of sand, silt, and clay.",
        "Clayey description": "Clayey soil is composed of fine particles and has a high water-holding capacity.",
        "Sandy description": "Sandy soil is made up of larger particles and drains quickly."
    },
    hi: {
        "Loamy": "दोमट",
        "Clayey": "मिट्टीदार",
        "Sandy": "रेतीला",
        "Loamy description": "दोमट मिट्टी रेत, गाद, और चिकनी मिट्टी का मिश्रण होती है।",
        "Clayey description": "मिट्टीदार मिट्टी छोटे कणों से बनी होती है और इसकी पानी धारण करने की क्षमता अधिक होती है।",
        "Sandy description": "रेतीली मिट्टी बड़े कणों से बनी होती है और जल्दी नाली बनाती है।"
    },
    ta: {
        "Loamy": "களிமண்",
        "Clayey": "களிமண்",
        "Sandy": "மணல்",
        "Loamy description": "களிமண் மணல், கூந்தல் மற்றும் களிமண் கலவை.",
        "Clayey description": "களிமண் சிறிய துகள்களால் ஆனது மற்றும் அதிக நீர் வைத்திருக்கும் திறன்.",
        "Sandy description": "மணல் பெரிய துகள்களால் ஆனது மற்றும் விரைவாக வடிகட்டி."
    }
};

function SoilTypes() {
    const [soilTypes, setSoilTypes] = useState([]);
    const [language, setLanguage] = useState('en'); // Manage language state here

    useEffect(() => {
        fetch('http://localhost:5002/api/soil-types')
            .then(response => response.json())
            .then(data => setSoilTypes(data))
            .catch(error => {
                console.error('Error fetching soil types:', error);
                setSoilTypes([]);
            });
    }, []);

    const t = translations[language]; // Get translations based on selected language

    const translateSoilType = (soilType) => {
        return {
            ...soilType,
            name: soilTypeTranslations[language][soilType.name] || soilType.name,
            description: soilTypeTranslations[language][`${soilType.name} description`] || soilType.description,
        };
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-4xl font-bold text-green-700">{t.soilTypes}</h2>
                <div>
                    <button
                        onClick={() => setLanguage('en')}
                        className="mr-2 p-2 border border-green-700 rounded"
                    >
                        English
                    </button>
                    <button
                        onClick={() => setLanguage('hi')}
                        className="mr-2 p-2 border border-green-700 rounded"
                    >
                        हिंदी
                    </button>
                    <button
                        onClick={() => setLanguage('ta')}
                        className="p-2 border border-green-700 rounded"
                    >
                        தமிழ்
                    </button>
                </div>
            </div>
            {soilTypes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {soilTypes.map((soilType, index) => {
                        const translatedSoilType = translateSoilType(soilType);
                        return (
                            <div
                                key={index}
                                className="p-6 bg-white rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out"
                            >
                                {/* Image of the soil type */}
                                <img
                                    src={translatedSoilType.imageUrl || 'https://via.placeholder.com/300'}
                                    alt={translatedSoilType.name}
                                    className="w-full h-40 object-cover rounded-t-lg mb-4"
                                />
                                <h3 className="text-2xl font-bold mb-4 text-green-600">{translatedSoilType.name}</h3>
                                <p className="text-lg text-gray-700 mb-4">{translatedSoilType.description}</p>
                                <p className="text-md text-gray-600"><strong>{t.pH}:</strong> {translatedSoilType.pH}</p>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className="text-center text-gray-500">{t.noSoilTypes}</p>
            )}

            {/* Render the CropRecommendationTool component */}
            <div className="mt-10">
                <CropRecommendationTool soilTypes={soilTypes} />
            </div>
        </div>
    );
}

export default SoilTypes;
// import React, { useState } from 'react';
// import CropRecommendationTool from './CropRecommendationTool'; // Import the component

// const translations = {
//     en: {
//         soilTypes: 'Soil Types',
//         noSoilTypes: 'No soil types available at the moment.',
//         pH: 'pH',
//     },
//     hi: {
//         soilTypes: 'मिट्टी के प्रकार',
//         noSoilTypes: 'इस समय कोई मिट्टी के प्रकार उपलब्ध नहीं हैं।',
//         pH: 'पीएच',
//     },
//     ta: {
//         soilTypes: 'மண்ணின் வகைகள்',
//         noSoilTypes: 'இப்போது மண்ணின் வகைகள் எதுவும் கிடைக்கவில்லை.',
//         pH: 'பிஹச்',
//     },
// };

// const soilTypeTranslations = {
//     en: {
//         "Loamy": "Loamy",
//         "Clayey": "Clayey",
//         "Sandy": "Sandy",
//         "Peaty": "Peaty",
//         "Chalky": "Chalky",
//         "Silty": "Silty",
//         "Loamy description": "Loamy soil is a mixture of sand, silt, and clay.",
//         "Clayey description": "Clayey soil is composed of fine particles and has a high water-holding capacity.",
//         "Sandy description": "Sandy soil is made up of larger particles and drains quickly.",
//         "Peaty description": "Peaty soil is rich in organic material and is very fertile.",
//         "Chalky description": "Chalky soil is alkaline and contains calcium carbonate or lime.",
//         "Silty description": "Silty soil is smooth and retains water better than sandy soil."
//     },
//     hi: {
//         "Loamy": "दोमट",
//         "Clayey": "मिट्टीदार",
//         "Sandy": "रेतीला",
//         "Peaty": "पीट",
//         "Chalky": "चाकयुक्त",
//         "Silty": "गादयुक्त",
//         "Loamy description": "दोमट मिट्टी रेत, गाद, और चिकनी मिट्टी का मिश्रण होती है।",
//         "Clayey description": "मिट्टीदार मिट्टी छोटे कणों से बनी होती है और इसकी पानी धारण करने की क्षमता अधिक होती है।",
//         "Sandy description": "रेतीली मिट्टी बड़े कणों से बनी होती है और जल्दी नाली बनाती है।",
//         "Peaty description": "पीट मिट्टी जैविक सामग्री से भरपूर और बहुत उपजाऊ होती है।",
//         "Chalky description": "चाकयुक्त मिट्टी क्षारीय होती है और इसमें कैल्शियम कार्बोनेट या चूना होता है।",
//         "Silty description": "गादयुक्त मिट्टी चिकनी होती है और रेतीली मिट्टी की तुलना में पानी को बेहतर ढंग से रोकती है।"
//     },
//     ta: {
//         "Loamy": "களிமண்",
//         "Clayey": "களிமண்",
//         "Sandy": "மணல்",
//         "Peaty": "பீட்டி",
//         "Chalky": "சுண்ணாம்பு",
//         "Silty": "கழிமண்",
//         "Loamy description": "களிமண் மணல், கூந்தல் மற்றும் களிமண் கலவை.",
//         "Clayey description": "களிமண் சிறிய துகள்களால் ஆனது மற்றும் அதிக நீர் வைத்திருக்கும் திறன்.",
//         "Sandy description": "மணல் பெரிய துகள்களால் ஆனது மற்றும் விரைவாக வடிகட்டி.",
//         "Peaty description": "பீட்டி மண் சுயங்கொண்ட இயற்கையான பசுமையால் செழித்து உள்ளது.",
//         "Chalky description": "சுண்ணாம்பு மண் கல்சியம் கார்பனேட் அல்லது சுண்ணாம்பு கொண்டுள்ளது.",
//         "Silty description": "கழிமண் மண் மெல்லியதும், நீரை சேமிக்கும் திறனும் அதிகம்."
//     }
// };

// function SoilTypes() {
//     const [language, setLanguage] = useState('en'); // Manage language state here

//     // Dummy data for soil types
//     const soilTypes = [
//         { name: 'Loamy', description: 'Loamy soil is a mixture of sand, silt, and clay.', pH: '6.0 - 7.0', imageUrl: 'https://images.pexels.com/photos/7348759/pexels-photo-7348759.jpeg?auto=compress&cs=tinysrgb&w=600' },
//         { name: 'Clayey', description: 'Clayey soil is composed of fine particles and has a high water-holding capacity.', pH: '5.5 - 7.5', imageUrl: 'https://images.pexels.com/photos/6508534/pexels-photo-6508534.jpeg?auto=compress&cs=tinysrgb&w=600' },
//         { name: 'Sandy', description: 'Sandy soil is made up of larger particles and drains quickly.', pH: '4.5 - 6.5', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnotrixoF1MPV0fHqv0Rjpqg2ChrZmCd5CDA&s' },
//         { name: 'Peaty', description: 'Peaty soil is rich in organic material and is very fertile.', pH: '4.0 - 7.0', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqFaU7-NdkMhP1-J2tWjlJAxyEQ1VgB-C-5A&s' },
//         { name: 'Chalky', description: 'Chalky soil is alkaline and contains calcium carbonate or lime.', pH: '7.0 - 8.5', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_w4AJec2i4Ph80rCA7C_r66udAt-_zg01cg&s' },
//         { name: 'Silty', description: 'Silty soil is smooth and retains water better than sandy soil.', pH: '6.0 - 7.5', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMuknCYLB_jJ-_bClyOKY3s3u1rPkiHsabOg&s' },
//     ];

//     const t = translations[language]; // Get translations based on selected language

//     const translateSoilType = (soilType) => {
//         return {
//             ...soilType,
//             name: soilTypeTranslations[language][soilType.name] || soilType.name,
//             description: soilTypeTranslations[language][`${soilType.name} description`] || soilType.description,
//         };
//     };

//     return (
//         <div className="p-6 bg-gray-100 min-h-screen">
//             <div className="flex justify-between items-center mb-8">
//                 <h2 className="text-4xl font-bold text-green-700">{t.soilTypes}</h2>
//                 <div>
//                     <button
//                         onClick={() => setLanguage('en')}
//                         className="mr-2 p-2 border border-green-700 rounded"
//                     >
//                         English
//                     </button>
//                     <button
//                         onClick={() => setLanguage('hi')}
//                         className="mr-2 p-2 border border-green-700 rounded"
//                     >
//                         हिंदी
//                     </button>
//                     <button
//                         onClick={() => setLanguage('ta')}
//                         className="p-2 border border-green-700 rounded"
//                     >
//                         தமிழ்
//                     </button>
//                 </div>
//             </div>
//             {soilTypes.length > 0 ? (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                     {soilTypes.map((soilType, index) => {
//                         const translatedSoilType = translateSoilType(soilType);
//                         return (
//                             <div
//                                 key={index}
//                                 className="p-6 bg-white rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out"
//                             >
//                                 {/* Image of the soil type */}
//                                 <img
//                                     src={translatedSoilType.imageUrl}
//                                     alt={translatedSoilType.name}
//                                     className="w-full h-40 object-cover rounded-t-lg mb-4"
//                                 />
//                                 <h3 className="text-2xl font-bold mb-4 text-green-600">{translatedSoilType.name}</h3>
//                                 <p className="text-lg text-gray-700 mb-4">{translatedSoilType.description}</p>
//                                 <p className="text-md text-gray-600"><strong>{t.pH}:</strong> {translatedSoilType.pH}</p>
//                             </div>
//                         );
//                     })}
//                 </div>
//             ) : (
//                 <p className="text-center text-gray-500">{t.noSoilTypes}</p>
//             )}

//             {/* Render the CropRecommendationTool component */}
//             <div className="mt-10">
//                 <CropRecommendationTool soilTypes={soilTypes} />
//             </div>
//         </div>
//     );
// }

// export default SoilTypes;
