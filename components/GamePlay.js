import React, { useState } from 'react';

const GamePlay = ({
    currentGame,
    currentPlayer,
    onNextPlayer,
    onResetGame
}) => {
    const [showWord, setShowWord] = useState(false);

    const getCurrentRole = () => {
        if (!currentGame) return null;
        return currentGame.roles[currentPlayer];
    };

    const handleNextPlayer = () => {
        setShowWord(false);
        onNextPlayer();
    };

    const role = getCurrentRole();

    return (
        <div className="gradient-bg p-4">
            <div className="max-w-lg mx-auto">
                <div className="card p-8 text-center fade-in">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            Tour de {currentGame.players[currentPlayer]}
                        </h2>
                        <p className="text-gray-600">
                            Joueur {currentPlayer + 1} sur {currentGame.players.length}
                        </p>
                    </div>

                    <div className="mb-8">
                        {!showWord ? (
                            <div className="space-y-4">
                                <p className="text-lg text-gray-700">
                                    Regardez votre mot en secret puis passez à la personne suivante
                                </p>
                                <button
                                    onClick={() => setShowWord(true)}
                                    className="w-full p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all text-lg font-semibold"
                                >
                                    👁️ Voir mon mot
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="p-6 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl">
                                    {/* <p className="text-sm text-gray-600 mb-2">Votre rôle :</p>
                                    <p className={`text-lg font-bold mb-4 ${role.type === 'civil' ? 'text-green-600' :
                                            role.type === 'undercover' ? 'text-red-600' :
                                                'text-gray-600'
                                        }`}>
                                        {role.type === 'civil' && '👥 Civil'}
                                        {role.type === 'undercover' && '🕵️ Undercover'}
                                        {role.type === 'white' && '⚪ Blanc'}
                                    </p> */}

                                    {role.word ? (
                                        <div>
                                            <p className="text-sm text-gray-600 mb-2">Votre mot :</p>
                                            <p className="text-3xl font-bold text-gray-800">{role.word}</p>
                                        </div>
                                    ) : (
                                        <p className="text-xl text-gray-700">Vous n&apos;avez pas de mot !</p>
                                    )}
                                </div>

                                <button
                                    onClick={handleNextPlayer}
                                    className="w-full p-4 btn-primary rounded-lg text-lg font-semibold"
                                >
                                    🔄 {currentPlayer < currentGame.players.length - 1 ? 'Joueur suivant' : 'Commencer les votes'}
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={onResetGame}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        🔄 Nouvelle partie
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GamePlay;