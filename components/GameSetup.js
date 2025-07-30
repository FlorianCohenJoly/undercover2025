import React from 'react';

const GameSetup = ({
    players,
    setPlayers,
    gameConfig,
    setGameConfig,
    onStartGame
}) => {
    const addPlayer = () => {
        setPlayers([...players, '']);
    };

    const removePlayer = (index) => {
        if (players.length > 1) {
            const newPlayers = players.filter((_, i) => i !== index);
            setPlayers(newPlayers);
        }
    };

    const updatePlayer = (index, name) => {
        const newPlayers = [...players];
        newPlayers[index] = name;
        setPlayers(newPlayers);
    };

    return (
        <div className="gradient-bg p-4">
            <div className="max-w-2xl mx-auto">
                <div className="card p-8 fade-in">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">🕵️ Undercover</h1>
                        <p className="text-gray-600">Découvrez qui est l&apos;imposteur !</p>
                    </div>

                    <div className="space-y-6">
                        {/* Configuration */}
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center">
                                🎮 Configuration
                            </h3>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Nombre d&apos;Undercover</label>
                                    <select
                                        value={gameConfig.undercoverCount}
                                        onChange={(e) => setGameConfig({ ...gameConfig, undercoverCount: parseInt(e.target.value) })}
                                        className="select-field"
                                    >
                                        <option value={1}>1</option>
                                        <option value={2}>2</option>
                                        <option value={3}>3</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Nombre de Blancs</label>
                                    <select
                                        value={gameConfig.whiteCount}
                                        onChange={(e) => setGameConfig({ ...gameConfig, whiteCount: parseInt(e.target.value) })}
                                        className="select-field"
                                    >
                                        <option value={0}>0</option>
                                        <option value={1}>1</option>
                                        <option value={2}>2</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium mb-2">Catégorie</label>
                                <select
                                    value={gameConfig.category}
                                    onChange={(e) => setGameConfig({ ...gameConfig, category: e.target.value })}
                                    className="select-field"
                                >
                                    <option value="all">Toutes les catégories</option>
                                    <option value="animaux">🐾 Animaux</option>
                                    <option value="nourriture">🍕 Nourriture</option>
                                    <option value="objets">📱 Objets</option>
                                    <option value="lieux">🏢 Lieux</option>
                                    <option value="métiers">👨‍💼 Métiers</option>
                                    <option value="sports">⚽ Sports</option>
                                </select>
                            </div>
                        </div>

                        {/* Joueurs */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 flex items-center">
                                👥 Joueurs ({players.filter(p => p.trim()).length})
                            </h3>

                            <div className="space-y-2">
                                {players.map((player, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={player}
                                            onChange={(e) => updatePlayer(index, e.target.value)}
                                            placeholder={`Joueur ${index + 1}`}
                                            className="input-field"
                                        />
                                        {players.length > 1 && (
                                            <button
                                                onClick={() => removePlayer(index)}
                                                className="btn-red p-3 rounded-lg"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={addPlayer}
                                    className="flex-1 p-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    + Ajouter un joueur
                                </button>

                                <button
                                    onClick={onStartGame}
                                    className="flex-1 p-3 btn-primary rounded-lg flex items-center justify-center font-semibold"
                                >
                                    ▶️ Commencer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameSetup;