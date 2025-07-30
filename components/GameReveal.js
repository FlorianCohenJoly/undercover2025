import React from 'react';

const GameReveal = ({ currentGame, onResetGame }) => {
    return (
        <div className="gradient-bg p-4">
            <div className="max-w-2xl mx-auto">
                <div className="card p-8 fade-in">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">🎭 Révélation des rôles</h2>
                        <div className="words-display mb-6">
                            <div className="word-card-civil">
                                <p className="text-sm text-green-700 mb-1">Mot des Civils</p>
                                <p className="text-xl font-bold text-green-800">{currentGame.civilWord}</p>
                            </div>
                            <div className="word-card-undercover">
                                <p className="text-sm text-red-700 mb-1">Mot des Undercover</p>
                                <p className="text-xl font-bold text-red-800">{currentGame.undercoverWord}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 mb-8">
                        {currentGame.players.map((player, index) => {
                            const role = currentGame.roles[index];
                            const isEliminated = currentGame.eliminatedPlayers?.includes(index);

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
                                        {isEliminated && <span className="text-red-600">❌ Éliminé</span>}
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
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <button
                        onClick={onResetGame}
                        className="w-full p-4 btn-primary rounded-lg text-lg font-semibold"
                    >
                        🔄 Nouvelle partie
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GameReveal;