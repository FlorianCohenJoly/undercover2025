import React, { useState } from 'react';

const GameDiscussion = ({
    currentGame,
    onStartVoting,
    onResetGame
}) => {
    // Joueurs encore en vie
    const alivePlayers = currentGame.players.filter((_, index) =>
        !currentGame.eliminatedPlayers.includes(index)
    );

    // Déterminer l'ordre de parole - STRATÉGIE AMÉLIORÉE
    const getSpeakingOrder = () => {
        const alivePlayersWithRoles = alivePlayers.map(playerName => {
            const originalIndex = currentGame.players.findIndex(p => p === playerName);
            return {
                name: playerName,
                originalIndex: originalIndex,
                role: currentGame.roles[originalIndex]
            };
        });

        // Séparer les Blancs et les autres
        const nonWhitePlayers = alivePlayersWithRoles.filter(p => p.role.type !== 'white');
        const whitePlayers = alivePlayersWithRoles.filter(p => p.role.type === 'white');

        // Mélanger complètement l'ordre des non-Blancs
        const shuffledNonWhites = [...nonWhitePlayers].sort(() => Math.random() - 0.5);

        // Mélanger l'ordre des Blancs
        const shuffledWhites = [...whitePlayers].sort(() => Math.random() - 0.5);

        // NOUVELLE STRATÉGIE : Insérer les Blancs aléatoirement SAUF en première position
        const finalOrder = [];
        let whiteIndex = 0;

        // Toujours commencer par un non-Blanc
        if (shuffledNonWhites.length > 0) {
            finalOrder.push(shuffledNonWhites[0]);

            // Pour les positions restantes, mélanger non-Blancs et Blancs
            const remainingNonWhites = shuffledNonWhites.slice(1);
            const allRemaining = [...remainingNonWhites, ...shuffledWhites];

            // Mélanger complètement le reste
            const shuffledRemaining = allRemaining.sort(() => Math.random() - 0.5);
            finalOrder.push(...shuffledRemaining);
        } else {
            // Cas extrême : que des Blancs (ne devrait pas arriver souvent)
            finalOrder.push(...shuffledWhites);
        }

        return finalOrder;
    };

    const speakingOrder = getSpeakingOrder();

    console.log('🗣️ Ordre de parole:', speakingOrder.map(p => `${p.name} (${p.role.type})`));

    return (
        <div className="gradient-bg p-4">
            <div className="max-w-2xl mx-auto">
                <div className="card p-8 fade-in">
                    <div className="text-center mb-8">
                        <div className="round-indicator">
                            🗣️ Tour {currentGame.round} - Phase de discussion
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            C'est l'heure de parler !
                        </h2>
                        <p className="text-gray-600">
                            Chaque joueur donne un indice sur son mot à tour de rôle
                        </p>
                    </div>

                    {/* Instructions générales */}
                    <div className="game-status mb-8">
                        <h3 className="text-lg font-semibold mb-3">📋 Règles de la discussion :</h3>
                        <ul className="text-sm space-y-2 text-left">
                            <li>• Donnez <strong>un indice</strong> sur votre mot (un mot ou courte phrase)</li>
                            <li>• <strong>Interdictions</strong> : Pas le mot exact, pas de rime, pas d'épellation</li>
                            <li>• <strong>Écoutez</strong> attentivement les indices des autres</li>
                            <li>• <strong>Analysez</strong> : Qui a le même mot que vous ? Qui semble différent ?</li>
                            <li>• <strong>Si vous n'avez pas de mot</strong> : Bluffez en vous basant sur les autres indices !</li>
                        </ul>
                    </div>

                    {/* Ordre de parole ALÉATOIRE */}
                    <div className="voting-phase mb-8">
                        <h3 className="text-lg font-semibold mb-4 text-center">
                            🎯 Ordre de parole pour ce tour :
                        </h3>

                        <div className="space-y-3">
                            {speakingOrder.map((player, index) => (
                                <div
                                    key={player.originalIndex}
                                    className="player-vote-card"
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <span className="vote-count">
                                                {index + 1}
                                            </span>
                                            <span className="font-semibold text-gray-800 text-lg">
                                                {player.name}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className="px-3 py-1 rounded-full text-sm font-bold bg-blue-200 text-blue-800">
                                                🎤 À son tour
                                            </span>
                                            {index === 0 && (
                                                <p className="text-xs text-green-600 mt-1">
                                                    🌟 Commence le tour
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Note sur l'ordre aléatoire */}
                        <div className="mt-4 text-center">
                            <p className="text-xs text-gray-500">
                                🔀 L'ordre de parole est mélangé à chaque tour pour plus d'équité
                            </p>
                        </div>
                    </div>

                    {/* Instructions pour la discussion */}
                    <div className="text-center mb-6">
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-6">
                            <h4 className="font-semibold text-blue-800 mb-2">💡 Stratégies :</h4>
                            <div className="text-sm text-blue-700 space-y-1">
                                <p><strong>Si vous avez un mot :</strong> Donnez un indice ni trop évident, ni trop vague</p>
                                <p><strong>Si vous n'avez pas de mot :</strong> Écoutez d'abord, puis donnez un indice qui "colle" avec les autres</p>
                                <p><strong>Observez :</strong> Qui hésite ? Qui donne des indices bizarres ? Qui copie les autres ?</p>
                                <p><strong>Position dans l'ordre :</strong> Parler tôt = plus de risque, parler tard = plus d'infos</p>
                            </div>
                        </div>
                    </div>

                    {/* Timer optionnel */}
                    <div className="text-center mb-8">
                        <div className="game-status">
                            <p className="font-semibold mb-2">⏱️ Temps suggéré</p>
                            <p className="text-sm">
                                Environ <strong>30 secondes par joueur</strong> pour donner son indice
                            </p>
                            <p className="text-xs text-gray-600 mt-2">
                                Total estimé : ~{Math.ceil(speakingOrder.length * 0.5)} minutes
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="text-center">
                        <button
                            onClick={onStartVoting}
                            className="w-full p-4 btn-primary rounded-lg text-lg font-semibold mb-4"
                        >
                            🗳️ Passer au vote
                        </button>

                        <button
                            onClick={onResetGame}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            🔄 Nouvelle partie
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameDiscussion;