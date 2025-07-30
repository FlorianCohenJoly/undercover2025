export const wordDatabase = {
    animaux: [
        { civil: 'Chat', undercover: 'Chien' },
        { civil: 'Lion', undercover: 'Tigre' },
        { civil: 'Cheval', undercover: 'Âne' },
        { civil: 'Poule', undercover: 'Canard' },
        { civil: 'Mouton', undercover: 'Chèvre' },
        { civil: 'Lapin', undercover: 'Lièvre' },
        { civil: 'Requin', undercover: 'Dauphin' },
        { civil: 'Aigle', undercover: 'Faucon' },
        { civil: 'Serpent', undercover: 'Lézard' },
        { civil: 'Papillon', undercover: 'Libellule' },
        { civil: 'Éléphant', undercover: 'Rhinocéros' },
        { civil: 'Pingouin', undercover: 'Manchot' }
    ],
    nourriture: [
        { civil: 'Pizza', undercover: 'Burger' },
        { civil: 'Pomme', undercover: 'Poire' },
        { civil: 'Chocolat', undercover: 'Caramel' },
        { civil: 'Café', undercover: 'Thé' },
        { civil: 'Salade', undercover: 'Soupe' },
        { civil: 'Fromage', undercover: 'Yaourt' },
        { civil: 'Spaghetti', undercover: 'Lasagne' },
        { civil: 'Croissant', undercover: 'Pain au chocolat' },
        { civil: 'Glace', undercover: 'Sorbet' },
        { civil: 'Steak', undercover: 'Côtelette' },
        { civil: 'Baguette', undercover: 'Pain de mie' },
        { civil: 'Crêpe', undercover: 'Gaufre' }
    ],
    objets: [
        { civil: 'Téléphone', undercover: 'Tablette' },
        { civil: 'Livre', undercover: 'Magazine' },
        { civil: 'Chaise', undercover: 'Tabouret' },
        { civil: 'Voiture', undercover: 'Moto' },
        { civil: 'Montre', undercover: 'Bracelet' },
        { civil: 'Parapluie', undercover: 'Parasol' },
        { civil: 'Lunettes', undercover: 'Lentilles' },
        { civil: 'Clé', undercover: 'Cadenas' },
        { civil: 'Bougie', undercover: 'Lampe' },
        { civil: 'Miroir', undercover: 'Fenêtre' },
        { civil: 'Stylo', undercover: 'Crayon' },
        { civil: 'Sac', undercover: 'Valise' }
    ],
    lieux: [
        { civil: 'Plage', undercover: 'Piscine' },
        { civil: 'Montagne', undercover: 'Colline' },
        { civil: 'Restaurant', undercover: 'Café' },
        { civil: 'Cinéma', undercover: 'Théâtre' },
        { civil: 'Hôpital', undercover: 'Pharmacie' },
        { civil: 'École', undercover: 'Université' },
        { civil: 'Supermarché', undercover: 'Marché' },
        { civil: 'Parc', undercover: 'Jardin' },
        { civil: 'Musée', undercover: 'Galerie' },
        { civil: 'Aéroport', undercover: 'Gare' },
        { civil: 'Bibliothèque', undercover: 'Librairie' },
        { civil: 'Stade', undercover: 'Gymnase' }
    ],
    métiers: [
        { civil: 'Médecin', undercover: 'Infirmier' },
        { civil: 'Professeur', undercover: 'Formateur' },
        { civil: 'Cuisinier', undercover: 'Boulanger' },
        { civil: 'Policier', undercover: 'Gendarme' },
        { civil: 'Acteur', undercover: 'Chanteur' },
        { civil: 'Pilote', undercover: 'Steward' },
        { civil: 'Avocat', undercover: 'Juge' },
        { civil: 'Architecte', undercover: 'Ingénieur' },
        { civil: 'Journaliste', undercover: 'Écrivain' },
        { civil: 'Dentiste', undercover: 'Orthodontiste' },
        { civil: 'Pompier', undercover: 'Sauveteur' },
        { civil: 'Coiffeur', undercover: 'Esthéticienne' }
    ],
    sports: [
        { civil: 'Football', undercover: 'Rugby' },
        { civil: 'Tennis', undercover: 'Badminton' },
        { civil: 'Natation', undercover: 'Plongée' },
        { civil: 'Basketball', undercover: 'Volleyball' },
        { civil: 'Cyclisme', undercover: 'Moto' },
        { civil: 'Ski', undercover: 'Snowboard' },
        { civil: 'Golf', undercover: 'Mini-golf' },
        { civil: 'Boxe', undercover: 'Karaté' },
        { civil: 'Course', undercover: 'Marche' },
        { civil: 'Escalade', undercover: 'Alpinisme' },
        { civil: 'Judo', undercover: 'Taekwondo' },
        { civil: 'Équitation', undercover: 'Polo' }
    ]
};

export const getAllWords = () => {
    return Object.values(wordDatabase).flat();
};

export const getWordsForCategory = (category) => {
    if (category === 'all') return getAllWords();
    return wordDatabase[category] || [];
};