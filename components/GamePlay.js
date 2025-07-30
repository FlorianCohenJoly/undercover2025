import React, { useState } from 'react';

const GamePlay = ({
    currentGame,
    currentPlayer,
    onNextPlayer,
    onResetGame
}) => {
    const [showWord, setShowWord] = useState(false);

    // Filtrer les joueurs encore en vie
    const alivePlayers = currentGame.players.filter((_, index) =>
        !currentGame.eliminatedPlayers.includes(index)
    );

    // Trouver l'index du joueur actuel parmi les vivants
    const alivePlayerIndex = alivePlayers.findIndex(player =>
        player === currentGame.players[currentPlayer]
    );

    // Si le joueur actuel est éliminé, passer au suivant
    React.useEffect(() => {
        if (currentGame.eliminatedPlayers.includes(currentPlayer)) {
            onNextPlayer();
        }
    }, [currentPlayer, currentGame.eliminatedPlayers, onNextPlayer]);

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
                        <div className="round-indicator">
                            🎮 Tour {currentGame.round}
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            Tour de {currentGame.players[currentPlayer]}
                        </h2>
                        <p className="text-gray-600">
                            Joueur {alivePlayerIndex + 1} sur {alivePlayers.length} encore en vie
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
                                    className="w-full p-4 btn-green rounded-lg text-lg font-semibold"
                                >
                                    👁️ Voir mon mot
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="word-display">
                                    {role.word ? (
                                        <div>
                                            <p className="text-sm text-gray-600 mb-2">Votre mot :</p>
                                            <p className="text-3xl font-bold text-gray-800">{role.word}</p>
                                            <p className="text-sm text-gray-500 mt-4">
                                                💡 Donnez un indice sur ce mot sans le dire explicitement
                                            </p>
                                        </div>
                                    ) : (
                                        <div>
                                            <p className="text-2xl font-bold text-gray-600 mb-4">⚪ Vous êtes BLANC</p>
                                            <p className="text-lg text-gray-700 mb-4">Vous n'avez pas de mot !</p>
                                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg text-left">
                                                <p className="text-sm text-yellow-800">
                                                    <strong>Votre mission :</strong><br />
                                                    • Écoutez les indices des autres joueurs<br />
                                                    • Essayez de deviner leur mot secret<br />
                                                    • Bluffez en donnant un indice crédible<br />
                                                    • Si vous êtes éliminé, vous pourrez tenter de deviner le mot des Civils pour gagner instantly !
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={handleNextPlayer}
                                    className="w-full p-4 btn-primary rounded-lg text-lg font-semibold"
                                >
                                    🔄 {alivePlayerIndex < alivePlayers.length - 1 ? 'Joueur suivant' : 'Commencer la discussion'}
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