import React, { useEffect, useState } from 'react';
import './HomePage.css';

interface Pokemon {
  name: string;
  url: string;
}

interface PokemonData {
  sprites: {
    front_default: string;
  };
}

const HomePage: React.FC = () => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [filteredPokemonList, setFilteredPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=1302')
      .then(response => response.json())
      .then(data => {
        setPokemonList(data.results);
        setFilteredPokemonList(data.results);
        setLoading(false);
      });
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setFilter(value);
    setFilteredPokemonList(
      pokemonList.filter(pokemon => pokemon.name.toLowerCase().includes(value))
    );
  };

  const toggleFavorite = (name: string) => {
    setFavorites(prevFavorites => {
      const newFavorites = new Set(prevFavorites);
      if (newFavorites.has(name)) {
        newFavorites.delete(name);
      } else {
        newFavorites.add(name);
      }
      return newFavorites;
    });
  };

  return (
    <div className="HomePage">
      <h1>Pokémon List</h1>
      <input
        type="text"
        placeholder="Filter Pokémon"
        value={filter}
        onChange={handleFilterChange}
      />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="pokemon-list">
          {filteredPokemonList.map((pokemon, index) => (
            <PokemonItem
              key={index}
              name={pokemon.name}
              url={pokemon.url}
              isFavorite={favorites.has(pokemon.name)}
              toggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface PokemonItemProps extends Pokemon {
  isFavorite: boolean;
  toggleFavorite: (name: string) => void;
}

const PokemonItem: React.FC<PokemonItemProps> = ({ name, url, isFavorite, toggleFavorite }) => {
  const [pokemonData, setPokemonData] = useState<PokemonData | null>(null);

  useEffect(() => {
    fetch(url)
      .then(response => response.json())
      .then(data => setPokemonData(data));
  }, [url]);

  return (
    <div className="pokemon-item">
      <h2>{name}</h2>
      {pokemonData && <img src={pokemonData.sprites.front_default} alt={name} />}
      <button onClick={() => toggleFavorite(name)}>
        {isFavorite ? 'Unfavorite' : 'Favorite'}
      </button>
    </div>
  );
};

export default HomePage;
