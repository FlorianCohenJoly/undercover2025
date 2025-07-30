import React from 'react';

const GameEnd = ({ currentGame, onResetGame }) => {
    const getWinners = () => {
        // Si un Blanc a gagné
        if (currentGame.winnerType === 'white') {
            return {
                winners: 'white',
                message: '⚪🎉 Le Blanc a gagné !',
                description: `${currentGame.winner} a deviné le mot des Civils : "${currentGame.guessedWord}" !`,
                specialWin: true
            };
        }

        const remainingPlayers = currentGame.players.filter((_, index) =>
            !currentGame.eliminatedPlayers.includes(index)
        );

        const remainingRoles = remainingPlayers.map((_, playerIndex) => {
            const originalIndex = currentGame.players.findIndex(p => p === remainingPlayers[playerIndex]);
            return currentGame.roles[originalIndex];
        });

        const civilsCount = remainingRoles.filter(role => role.type === 'civil').length;
        const undercoversCount = remainingRoles.filter(role => role.type === 'undercover').length;

        // Conditions de victoire normales
        if (currentGame.winnerType === 'civils' || undercoversCount === 0) {
            return {
                winners: 'civils',
                message: '🎉 Les Civils ont gagné !',
                description: 'Tous les Undercover ont été éliminés !'
            };
        } else if (currentGame.winnerType === 'undercover' || undercoversCount >= civilsCount) {
            return {
                winners: 'undercover',
                message: '🕵️ Les Undercover ont gagné !',
                description: 'Les Undercover sont aussi nombreux que les Civils !'
            };
        }

        return {
            winners: 'unknown',
            message: '🤔 Fin de partie',
            description: 'Résultat indéterminé'
        };
    };

    const winInfo = getWinners();
    const remainingPlayers = currentGame.players.filter((_, index) =>
        !currentGame.eliminatedPlayers.includes(index)
    );

    return (
        <div className="gradient-bg p-4">
            <div className="max-w-2xl mx-auto">
                <div className="card p-8 fade-in">
                    <div className="text-center mb-8">
                        <div className={`winner-announcement ${winInfo.winners === 'white' ? 'bg-gradient-to-r from-gray-100 to-white border-gray-400' : ''
                            }`}>
                            {winInfo.message}
                        </div>
                        <p className="text-lg text-gray-700 mb-6">
                            {winInfo.description}
                        </p>

                        {/* Message spécial pour la victoire du Blanc */}
                        {winInfo.specialWin && (
                            <div className="game-status mb-6">
                                <p className="text-lg font-semibold">
                                    🎯 Victoire par devinette ! Le Blanc a réussi à identifier le mot secret des Civils !
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Révélation des mots */}
                    <div className="words-display mb-8">
                        <div className="word-card-civil">
                            <p className="text-sm text-green-700 mb-1">Mot des Civils</p>
                            <p className="text-xl font-bold text-green-800">{currentGame.civilWord}</p>
                            {winInfo.winners === 'white' && (
                                <p className="text-sm text-green-600 mt-2">
                                    ✅ Deviné par {currentGame.winner} !
                                </p>
                            )}
                        </div>
                        <div className="word-card-undercover">
                            <p className="text-sm text-red-700 mb-1">Mot des Undercover</p>
                            <p className="text-xl font-bold text-red-800">{currentGame.undercoverWord}</p>
                        </div>
                    </div>

                    {/* Récapitulatif des joueurs */}
                    <div className="space-y-3 mb-8">
                        <h3 className="text-lg font-semibold text-center mb-4">
                            📋 Récapitulatif de la partie
                        </h3>

                        {currentGame.players.map((player, index) => {
                            const role = currentGame.roles[index];
                            const isEliminated = currentGame.eliminatedPlayers.includes(index);
                            const isSpecialWinner = winInfo.winners === 'white' && player === currentGame.winner;
                            const isNormalWinner = !isSpecialWinner && !isEliminated && (
                                (winInfo.winners === 'civils' && role.type === 'civil') ||
                                (winInfo.winners === 'undercover' && role.type === 'undercover')
                            );

                            return (
                                <div
                                    key={index}
                                    className={`role-card ${role.type === 'civil' ? 'role-civil' :
                                            role.type === 'undercover' ? 'role-undercover' :
                                                'role-white'
                                        } ${isEliminated ? 'opacity-50' : ''}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-gray-800">{player}</span>
                                        {isEliminated && <span className="text-red-600">❌</span>}
                                        {isSpecialWinner && <span className="text-yellow-600">👑⚪</span>}
                                        {isNormalWinner && <span className="text-yellow-600">👑</span>}
                                    </div>
                                    <div className="text-right">
                                        <span className={`badge-${role.type}`}>
                                            {role.type === 'civil' && '👥 Civil'}
                                            {role.type === 'undercover' && '🕵️ Undercover'}
                                            {role.type === 'white' && '⚪ Blanc'}
                                        </span>
                                        {role.word && (
                                            <p className="text-sm text-gray-600 mt-1">{role.word}</p>
                                        )}
                                        {role.type === 'white' && !role.word && (
                                            <p className="text-sm text-gray-600 mt-1">Pas de mot</p>
                                        )}
                                        {isSpecialWinner && (
                                            <p className="text-sm text-yellow-600 mt-1 font-bold">
                                                A deviné : "{currentGame.guessedWord}"
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Statistiques de la partie */}
                    <div className="text-center mb-6">
                        <div className="game-status">
                            <p className="font-semibold mb-2">📊 Statistiques de la partie</p>
                            <div className="text-sm space-y-1">
                                <p>🔢 Nombre de tours : {currentGame.round}</p>
                                <p>👥 Joueurs éliminés : {currentGame.eliminatedPlayers.length}</p>
                                <p>🏆 Type de victoire : {
                                    winInfo.winners === 'white' ? 'Devinette du Blanc' :
                                        winInfo.winners === 'civils' ? 'Élimination des Undercover' :
                                            winInfo.winners === 'undercover' ? 'Domination numérique' :
                                                'Indéterminée'
                                }</p>
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <button
                            onClick={onResetGame}
                            className="w-full p-4 btn-primary rounded-lg text-lg font-semibold"
                        >
                            🔄 Nouvelle partie
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameEnd;