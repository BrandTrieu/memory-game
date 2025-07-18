import { useState, useEffect } from 'react'
import './App.css'
import ImgCard from './imgcard';
import Scoreboard from './scoreboard';
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'

async function getPokemonData(pkmnId) {
    try {
        // Remember, this does not return a JSON object, but a Promise that resolves to a response object.
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pkmnId}`);
        // The response object contains the data, we parse it to get the JSON data
        const fullData = await response.json();
        return fullData;
    } catch (error) {
        console.error("Error fetching Pokemon data:", error);
        return null;
    }
}

async function processPokemonData(pkmnId) {
    try {
        const pokemonData = await getPokemonData(pkmnId);
        const dexId = pokemonData.id;
        const name = pokemonData.name;
        const sprite = pokemonData.sprites.front_default;
        return { dexId, name, sprite };
    } catch (error) {
        console.error("Error processing Pokemon data:", error);
        return null;
    }
}

// Returns an array of objects with dexId, name, and sprite for each Pokemon ID
async function fetchMultiplePokemon(idList) {
    // Map over the list of IDs and fetch data for each, each element in the array will be a Promise
    const pokemonPromises = idList.map(id => processPokemonData(id));
    // Wait for all Promises to resolve and return the an array of the results, which are the processed Pokemon data
    const results = await Promise.all(pokemonPromises);
    return results;
}

// Returns an array of random IDs
function chooseRandomIds(numberOfIds) {
    const ids = [];
    while (ids.length < numberOfIds) {
        const randomId = Math.floor(Math.random() * 1025) + 1; // There are 1025 Pokemon
        // If the random ID is not already in the list, add it
        if (!ids.includes(randomId)) {
            ids.push(randomId);
        }
    }
    return ids;
}

// Shuffle an array using the Fisher-Yates algorithm
function shuffleList(list) {
    const shuffledList = [...list];
    for (let i = 0; i < shuffledList.length; i++) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledList[i], shuffledList[j]] = [shuffledList[j], shuffledList[i]]; // swap
    }
    return shuffledList;
}





export default function App() {
  const [pkmnList, setPkmnList] = useState([])
  const [currentPkmnList, setCurrentPkmnList] = useState([])
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameState, setGameState] = useState('playing'); // 'playing', 'won', 'lost'
  const [reset, setReset] = useState(false);

  function detectReset() {
    console.log("Retrying the game...");
    setPkmnList([]);
    setCurrentPkmnList([]);
    setScore(0);
    setGameState('playing');
    setReset(!reset); // Toggle reset to trigger useEffect
  }

  function detectPkmnClick(event) {

    // Ignore clicks if the game is not in 'playing' state
    if (gameState !== 'playing') {
      console.log("Game is not in playing state, ignoring click.");
      return;
    }

    else {
      const clickedPkmnId = event.target.closest('.img-card').id;
      
      // If the Pokemon has already been clicked, end the game
      if (currentPkmnList.includes(clickedPkmnId)) {
        console.log("Pokemon already clicked, game over.");
        setGameState('lost');
        if (score > highScore) {
          setHighScore(score);
        }
      }

      // If you currently have all but one Pokemon clicked, and the last clicked is unique, you win
      else if ((currentPkmnList.length === pkmnList.length - 1) && !currentPkmnList.includes(clickedPkmnId)) {
        console.log("All Pokemon clicked, you win!");
        setScore(score + 1);
        setGameState('won');
        if (score + 1 > highScore) {
          setHighScore(score + 1);
        }
      }

      // If you didn't win or lose, continue the game
      else {
        console.log("Pokemon clicked");
        setScore(score + 1);
        // Shuffle the options
        setPkmnList(shuffleList(pkmnList));
        setCurrentPkmnList([...currentPkmnList, clickedPkmnId]);
      }
    }
  }

  useEffect(() => {
    async function fetchData() {
      const numberOfIds = 10; // Number of random Pokemon IDs to fetch
      const fetchedList = await fetchMultiplePokemon(chooseRandomIds(numberOfIds));
      setPkmnList(fetchedList);
      console.log(fetchedList);
    }
    fetchData();
  }, [reset]);



  return (
    <>
      <div id="main-scoreboard">
        <h1>Pokemon Memory Game</h1>
        <Scoreboard score={score} highScore={highScore} gameState={gameState} handleReset={detectReset} />
      </div>
      { pkmnList.map((pkmn) => (
        <ImgCard key={pkmn.dexId} pkmnId={pkmn.dexId} pkmnName={pkmn.name} pkmnSprite={pkmn.sprite} handleClick={detectPkmnClick}/>
      )) }
    </>
  )
}
