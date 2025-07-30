import React, { useState, useEffect } from 'react';

const GameVoting = ({
    currentGame,
    onVoteComplete,
    onWhiteWins,
    onResetGame
}) => {
    const [votes, setVotes] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [showWhiteGuess, setShowWhiteGuess] = useState(false);
    const [whiteGuess, setWhiteGuess] = useState('');
    const [eliminatedPlayerData, setEliminatedPlayerData] = useState(null);

    // Reset de l'état quand on revient sur la page de vote
    useEffect(() => {
        console.log('🗳️ GameVoting monté/remis à jour');
        // Si on revient sur cette page pour un nouveau vote, reset l'état
        if (currentGame && currentGame.skipWordDistribution) {
            console.log('🔄 Nouveau tour de vote détecté, reset de l\'interface');
            setVotes({});
            setShowResults(false);
            setShowWhiteGuess(false);
            setWhiteGuess('');
            setEliminatedPlayerData(null);
        }
    }, [currentGame?.round]); // Se déclenche quand le round change

    // Debug
    console.log('🗳️ GameVoting rendu, currentGame:', currentGame);
    console.log('🗳️ showResults:', showResults, 'showWhiteGuess:', showWhiteGuess);

    // Vérification de sécurité
    if (!currentGame || !currentGame.players || !currentGame.roles) {
        console.error('❌ currentGame invalide:', currentGame);
        return (
            <div className="gradient-bg p-4">
                <div className="max-w-2xl mx-auto">
                    <div className="card p-8 text-center">
                        <h2>Erreur: Données de jeu manquantes</h2>
                        <button onClick={onResetGame} className="btn-primary p-4 rounded-lg mt-4">
                            🔄 Nouvelle partie
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Joueurs encore en vie
    const alivePlayers = currentGame.players.filter((_, index) =>
        !currentGame.eliminatedPlayers.includes(index)
    );

    console.log('👥 Joueurs vivants:', alivePlayers);

    const handleVote = (playerName) => {
        const newVotes = { ...votes };
        newVotes[playerName] = (newVotes[playerName] || 0) + 1;
        setVotes(newVotes);
        console.log('🗳️ Vote ajouté pour:', playerName, 'Total:', newVotes[playerName]);
    };

    const removeVote = (playerName) => {
        const newVotes = { ...votes };
        if (newVotes[playerName] > 0) {
            newVotes[playerName] -= 1;
            if (newVotes[playerName] === 0) {
                delete newVotes[playerName];
            }
        }
        setVotes(newVotes);
        console.log('🗳️ Vote retiré pour:', playerName);
    };

    const finishVoting = () => {
        if (Object.keys(votes).length === 0) {
            alert('Aucun vote n\'a été enregistré !');
            return;
        }
        console.log('🗳️ Fin du vote, résultats:', votes);
        setShowResults(true);
    };

    const getVoteResults = () => {
        const voteEntries = Object.entries(votes).map(([playerName, voteCount]) => ({
            playerName,
            votes: voteCount,
            playerIndex: currentGame.players.findIndex(p => p === playerName)
        }));

        voteEntries.sort((a, b) => b.votes - a.votes);
        return voteEntries;
    };

    const eliminatePlayer = () => {
        const results = getVoteResults();
        if (results.length === 0) return;

        const mostVoted = results[0];
        const eliminatedRole = currentGame.roles[mostVoted.playerIndex];

        console.log('❌ Joueur éliminé:', mostVoted, 'Rôle:', eliminatedRole);

        // Si c'est un Blanc, lui donner la chance de deviner
        if (eliminatedRole.type === 'white') {
            setEliminatedPlayerData({
                playerName: mostVoted.playerName,
                playerIndex: mostVoted.playerIndex,
                role: eliminatedRole
            });
            setShowWhiteGuess(true);
        } else {
            // Pour Civil ou Undercover, appeler directement onVoteComplete
            console.log('🔄 Appel de onVoteComplete pour:', mostVoted.playerIndex);
            onVoteComplete(mostVoted.playerIndex);
        }
    };

    const handleWhiteGuess = () => {
        if (!whiteGuess.trim()) {
            alert('Veuillez entrer votre devinette !');
            return;
        }

        const normalizedGuess = whiteGuess.trim().toLowerCase();
        const normalizedCivilWord = currentGame.civilWord.toLowerCase();

        console.log('⚪ Devinette du Blanc:', normalizedGuess, 'vs', normalizedCivilWord);

        if (normalizedGuess === normalizedCivilWord) {
            // Le Blanc a gagné !
            console.log('🎉 Le Blanc a trouvé le mot !');
            onWhiteWins(eliminatedPlayerData.playerName, whiteGuess);
        } else {
            // Mauvaise réponse, continuer la partie
            console.log('❌ Mauvaise réponse du Blanc');
            onVoteComplete(eliminatedPlayerData.playerIndex);
        }
    };

    const skipWhiteGuess = () => {
        // Le Blanc choisit de ne pas deviner
        onVoteComplete(eliminatedPlayerData.playerIndex);
    };

    // Interface pour la devinette du Blanc
    if (showWhiteGuess && eliminatedPlayerData) {
        return (
            <div className="gradient-bg p-4">
                <div className="max-w-2xl mx-auto">
                    <div className="card p-8 fade-in">
                        <div className="text-center mb-8">
                            <div className="round-indicator">
                                ⚪ Chance du Blanc !
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                Dernière chance, {eliminatedPlayerData.playerName} !
                            </h2>
                        </div>

                        {/* Révélation que c'était un Blanc */}
                        <div className="text-center mb-8">
                            <div className="role-white p-6 rounded-xl mb-6">
                                <p className="text-lg font-bold text-gray-800 mb-2">
                                    {eliminatedPlayerData.playerName} était :
                                </p>
                                <p className="text-2xl font-bold mb-2">⚪ BLANC</p>
                                <p className="text-lg">Vous n'aviez pas de mot !</p>
                            </div>

                            <div className="game-status">
                                <p className="text-lg font-semibold mb-4">
                                    🎯 Vous avez UNE chance de deviner le mot des CIVILS pour gagner la partie !
                                </p>
                                <p className="text-sm text-gray-600">
                                    Si vous trouvez le bon mot, vous gagnez immédiatement. Sinon, la partie continue sans vous.
                                </p>
                            </div>
                        </div>

                        {/* Interface de devinette */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-lg font-semibold mb-3 text-center">
                                    Quel est le mot des CIVILS ?
                                </label>
                                <input
                                    type="text"
                                    value={whiteGuess}
                                    onChange={(e) => setWhiteGuess(e.target.value)}
                                    placeholder="Tapez votre devinette..."
                                    className="input-field text-center text-xl font-bold"
                                    onKeyPress={(e) => e.key === 'Enter' && handleWhiteGuess()}
                                    autoFocus
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleWhiteGuess}
                                    className="flex-1 p-4 btn-primary rounded-lg text-lg font-semibold"
                                >
                                    🎯 Deviner !
                                </button>
                                <button
                                    onClick={skipWhiteGuess}
                                    className="flex-1 p-4 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-lg font-semibold transition-colors"
                                >
                                    ❌ Passer
                                </button>
                            </div>
                        </div>

                        <div className="text-center mt-6">
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
    }

    if (showResults) {
        const results = getVoteResults();
        const mostVoted = results[0];

        // Vérification de sécurité pour le rôle
        const eliminatedRole = currentGame.roles[mostVoted.playerIndex];

        if (!eliminatedRole) {
            console.error('❌ Rôle introuvable pour l\'index:', mostVoted.playerIndex);
            return (
                <div className="gradient-bg p-4">
                    <div className="max-w-2xl mx-auto">
                        <div className="card p-8 text-center">
                            <h2>Erreur: Rôle du joueur introuvable</h2>
                            <button onClick={onResetGame} className="btn-primary p-4 rounded-lg mt-4">
                                🔄 Nouvelle partie
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="gradient-bg p-4">
                <div className="max-w-2xl mx-auto">
                    <div className="card p-8 fade-in">
                        <div className="text-center mb-8">
                            <div className="round-indicator">
                                🗳️ Tour {currentGame.round - 1} - Résultats du vote
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                Résultats du vote
                            </h2>
                        </div>

                        <div className="space-y-3 mb-8">
                            {results.map((result, index) => (
                                <div
                                    key={result.playerName}
                                    className={`player-vote-card ${index === 0 ? 'eliminated' : ''
                                        }`}
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-gray-800">
                                            {result.playerName}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className="vote-count">
                                                {result.votes} vote{result.votes > 1 ? 's' : ''}
                                            </span>
                                            {index === 0 && <span className="text-red-600 font-bold">❌ ÉLIMINÉ</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Révélation du rôle du joueur éliminé */}
                        <div className="text-center mb-8">
                            <div className={`p-6 rounded-xl ${eliminatedRole.type === 'civil' ? 'role-civil' :
                                eliminatedRole.type === 'undercover' ? 'role-undercover' :
                                    'role-white'
                                }`}>
                                <p className="text-lg font-bold text-gray-800 mb-2">
                                    {mostVoted.playerName} était :
                                </p>
                                <p className="text-2xl font-bold mb-2">
                                    {eliminatedRole.type === 'civil' && '👥 CIVIL'}
                                    {eliminatedRole.type === 'undercover' && '🕵️ UNDERCOVER'}
                                    {eliminatedRole.type === 'white' && '⚪ BLANC'}
                                </p>
                                {/* {eliminatedRole.word && (
                                    <p className="text-lg">
                                        Son mot était : <span className="font-bold">"{eliminatedRole.word}"</span>
                                    </p>
                                )} */}
                                {eliminatedRole.type === 'white' && (
                                    <p className="text-lg">Il n'avait pas de mot !</p>
                                )}
                            </div>
                        </div>

                        <div className="text-center">
                            <button
                                onClick={eliminatePlayer}
                                className="w-full p-4 btn-primary rounded-lg text-lg font-semibold mb-4"
                            >
                                ➡️ {eliminatedRole.type === 'white' ? 'Donner sa chance au Blanc' : 'Continuer la partie'}
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
    }

    // Page de vote normale
    return (
        <div className="gradient-bg p-4">
            <div className="max-w-2xl mx-auto">
                <div className="card p-8 fade-in">
                    <div className="text-center mb-8">
                        <div className="round-indicator">
                            🗳️ Tour {currentGame.round} - Phase de vote
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            Votez pour éliminer un joueur
                        </h2>
                        <p className="text-gray-600">
                            Cliquez sur + pour voter, sur - pour retirer un vote
                        </p>
                        {currentGame.skipWordDistribution && (
                            <p className="text-sm text-orange-600 mt-2">
                                🔄 Suite du tour précédent - Les survivants gardent leur mot
                            </p>
                        )}
                    </div>

                    <div className="voting-phase">
                        <h3 className="text-lg font-semibold mb-4 text-center">
                            🎯 Qui voulez-vous éliminer ?
                        </h3>

                        <div className="space-y-3">
                            {alivePlayers.map((playerName) => (
                                <div
                                    key={playerName}
                                    className="player-vote-card"
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-gray-800 text-lg">
                                            {playerName}
                                        </span>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => removeVote(playerName)}
                                                className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full font-bold transition-colors"
                                                disabled={!votes[playerName]}
                                                style={{ opacity: votes[playerName] ? 1 : 0.5 }}
                                            >
                                                -
                                            </button>
                                            <span className="vote-count min-w-12">
                                                {votes[playerName] || 0}
                                            </span>
                                            <button
                                                onClick={() => handleVote(playerName)}
                                                className="w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-full font-bold transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-center mt-8">
                        <button
                            onClick={finishVoting}
                            className="w-full p-4 btn-primary rounded-lg text-lg font-semibold mb-4"
                        >
                            🗳️ Terminer le vote
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

export default GameVoting;