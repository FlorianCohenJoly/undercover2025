import React, { useState } from 'react';
import Head from 'next/head';
import GameSetup from '../components/GameSetup';
import GamePlay from '../components/GamePlay';
import GameVoting from '../components/GameVoting';
import GameEnd from '../components/GameEnd';
import GameReveal from '../components/GameReveal';
import { getWordsForCategory } from '../data/words';

export default function Home() {
  const [gameState, setGameState] = useState('setup');
  const [players, setPlayers] = useState(['']);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [gameConfig, setGameConfig] = useState({
    undercoverCount: 1,
    whiteCount: 0,
    category: 'all'
  });
  const [currentGame, setCurrentGame] = useState(null);

  // Debug: Log de l'état actuel
  console.log('🔍 État actuel:', gameState);
  console.log('🔍 Joueur actuel:', currentPlayer);
  console.log('🔍 Jeu actuel:', currentGame);

  const startGame = () => {
    const validPlayers = players.filter(p => p.trim() !== '');
    if (validPlayers.length < 3) {
      alert('Il faut au moins 3 joueurs pour jouer !');
      return;
    }

    const totalSpecial = gameConfig.undercoverCount + gameConfig.whiteCount;
    if (totalSpecial >= validPlayers.length) {
      alert('Il faut plus de civils que d\'undercover et blancs réunis !');
      return;
    }

    const availableWords = getWordsForCategory(gameConfig.category);
    const selectedWord = availableWords[Math.floor(Math.random() * availableWords.length)];

    const shuffledIndexes = [...Array(validPlayers.length).keys()].sort(() => Math.random() - 0.5);
    const roles = [];

    for (let i = 0; i < gameConfig.undercoverCount; i++) {
      roles[shuffledIndexes[i]] = { type: 'undercover', word: selectedWord.undercover };
    }

    for (let i = gameConfig.undercoverCount; i < gameConfig.undercoverCount + gameConfig.whiteCount; i++) {
      roles[shuffledIndexes[i]] = { type: 'white', word: null };
    }

    for (let i = gameConfig.undercoverCount + gameConfig.whiteCount; i < validPlayers.length; i++) {
      roles[shuffledIndexes[i]] = { type: 'civil', word: selectedWord.civil };
    }

    setCurrentGame({
      players: validPlayers,
      roles: roles,
      civilWord: selectedWord.civil,
      undercoverWord: selectedWord.undercover,
      eliminatedPlayers: [],
      round: 1,
      winner: null,
      winnerType: null,
      skipWordDistribution: false // Nouveau flag pour savoir si on doit skip
    });

    setCurrentPlayer(0);
    setGameState('playing');
    console.log('🎮 Jeu démarré !');
  };

  const nextPlayer = () => {
    console.log('🔄 nextPlayer appelé - joueur actuel:', currentPlayer);

    let nextPlayerIndex = currentPlayer + 1;
    console.log('🔄 Prochain index à tester:', nextPlayerIndex);

    while (nextPlayerIndex < currentGame.players.length &&
      currentGame.eliminatedPlayers.includes(nextPlayerIndex)) {
      console.log('🔄 Joueur', nextPlayerIndex, 'est éliminé, on passe au suivant');
      nextPlayerIndex++;
    }

    if (nextPlayerIndex < currentGame.players.length) {
      console.log('🔄 Passage au joueur:', nextPlayerIndex);
      setCurrentPlayer(nextPlayerIndex);
    } else {
      console.log('🗳️ PASSAGE AU VOTE ! Tous les joueurs ont vu leur mot');
      setGameState('voting');
    }
  };

  const handleWhiteWins = (playerName, guessedWord) => {
    console.log('⚪🎉 Le Blanc a gagné !', playerName, 'avec le mot:', guessedWord);

    const updatedGame = {
      ...currentGame,
      winner: playerName,
      winnerType: 'white',
      guessedWord: guessedWord,
      round: currentGame.round + 1
    };

    setCurrentGame(updatedGame);
    setGameState('gameEnd');
  };

  const handleVoteComplete = (eliminatedPlayerIndex) => {
    console.log('🗳️ Vote terminé, joueur éliminé:', eliminatedPlayerIndex);

    const eliminatedRole = currentGame.roles[eliminatedPlayerIndex];
    const newEliminatedPlayers = [...currentGame.eliminatedPlayers, eliminatedPlayerIndex];

    const updatedGame = {
      ...currentGame,
      eliminatedPlayers: newEliminatedPlayers,
      round: currentGame.round + 1
    };

    const remainingPlayers = currentGame.players.filter((_, index) =>
      !newEliminatedPlayers.includes(index)
    );

    const remainingRoles = remainingPlayers.map((player) => {
      const originalIndex = currentGame.players.findIndex(p => p === player);
      return currentGame.roles[originalIndex];
    });

    const civilsCount = remainingRoles.filter(role => role.type === 'civil').length;
    const undercoversCount = remainingRoles.filter(role => role.type === 'undercover').length;
    const whitesCount = remainingRoles.filter(role => role.type === 'white').length;

    console.log('📊 Rôle éliminé:', eliminatedRole.type);
    console.log('📊 Joueurs restants:', remainingPlayers.length);
    console.log('📊 Civils restants:', civilsCount);
    console.log('📊 Undercover restants:', undercoversCount);
    console.log('📊 Blancs restants:', whitesCount);

    // CONDITIONS DE VICTOIRE CORRIGÉES
    if (undercoversCount === 0) {
      console.log('🏁 FIN DE PARTIE ! Les Civils ont gagné ! (Plus d\'undercover)');
      updatedGame.winnerType = 'civils';
      setCurrentGame(updatedGame);
      setGameState('gameEnd');
    } else if (undercoversCount >= civilsCount) {
      console.log('🏁 FIN DE PARTIE ! Les Undercover ont gagné ! (Égalité ou supériorité numérique)');
      console.log('🔢 Undercover:', undercoversCount, 'vs Civils:', civilsCount);
      updatedGame.winnerType = 'undercover';
      setCurrentGame(updatedGame);
      setGameState('gameEnd');
    } else if (remainingPlayers.length <= 2) {
      // Seule exception : s'il ne reste que 2 joueurs ou moins, c'est ingagnable
      console.log('🏁 FIN DE PARTIE ! Trop peu de joueurs restants (≤2)');
      updatedGame.winnerType = 'undercover'; // Par défaut, mais peut être ajusté
      setCurrentGame(updatedGame);
      setGameState('gameEnd');
    } else {
      console.log('🔄 PARTIE CONTINUE !');
      console.log('🔄 Raison: Civils (' + civilsCount + ') > Undercover (' + undercoversCount + ') et assez de joueurs');

      // Décider si on doit redistribuer les mots ou passer direct au vote
      if (eliminatedRole.type === 'civil') {
        console.log('👥 Civil éliminé → PASSAGE DIRECT AU VOTE du prochain tour');
        updatedGame.skipWordDistribution = true;
        setCurrentGame(updatedGame);
        setGameState('voting'); // Direct au vote, pas de redistribution
      } else {
        console.log('🕵️ Undercover/Blanc éliminé → Redistribution des mots');
        updatedGame.skipWordDistribution = false;

        // Trouver le premier joueur vivant pour la redistribution
        let firstAlivePlayer = 0;
        while (firstAlivePlayer < updatedGame.players.length &&
          newEliminatedPlayers.includes(firstAlivePlayer)) {
          firstAlivePlayer++;
        }

        setCurrentGame(updatedGame);
        setCurrentPlayer(firstAlivePlayer);
        setGameState('playing'); // Redistribuer les mots
      }
    }
  };

  const resetGame = () => {
    setGameState('setup');
    setCurrentGame(null);
    setCurrentPlayer(0);
  };

  return (
    <>
      <Head>
        <title>🕵️ Undercover - Jeu de société</title>
        <meta name="description" content="Découvrez qui est l'imposteur dans ce jeu de déduction !" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {/* Debug: Affichage de l'état */}
        <div style={{ position: 'fixed', top: 0, right: 0, background: 'black', color: 'white', padding: '10px', zIndex: 9999 }}>
          État: {gameState} {currentGame?.skipWordDistribution && '(Skip Words)'}
        </div>

        {gameState === 'setup' && (
          <GameSetup
            players={players}
            setPlayers={setPlayers}
            gameConfig={gameConfig}
            setGameConfig={setGameConfig}
            onStartGame={startGame}
          />
        )}

        {gameState === 'playing' && (
          <GamePlay
            currentGame={currentGame}
            currentPlayer={currentPlayer}
            onNextPlayer={nextPlayer}
            onResetGame={resetGame}
          />
        )}

        {gameState === 'voting' && (
          <GameVoting
            currentGame={currentGame}
            onVoteComplete={handleVoteComplete}
            onWhiteWins={handleWhiteWins}
            onResetGame={resetGame}
          />
        )}

        {gameState === 'gameEnd' && (
          <GameEnd
            currentGame={currentGame}
            onResetGame={resetGame}
          />
        )}

        {gameState === 'revealing' && (
          <GameReveal
            currentGame={currentGame}
            onResetGame={resetGame}
          />
        )}
      </main>
    </>
  );
}