// Component to display a card

// Function to fetch an image from Pokemon API

import { useState } from 'react'

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
        const sprite = pokemonData.sprites.front_default;
        return { dexId, sprite };
    } catch (error) {
        console.error("Error processing Pokemon data:", error);
        return null;
    }
}

function ImgCard({ pkmnId, pkmnSprite }) {
    const [pokemonData, setPokemonData] = useState(null);

    // Fetch the Pokemon data when the component mounts
    useState(() => {
        async function fetchData() {
            const data = await processPokemonData(pokemonName);
            setPokemonData(data);
        }
        fetchData();
    }, [pokemonName]);

    if (!pokemonData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="img-card">
            <h2>{pokemonData.name}</h2>
            <img src={pokemonData.sprite} alt={pokemonData.name} />
        </div>
    );
}
