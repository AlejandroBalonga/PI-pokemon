import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import getPokemons from "../../redux/actions/getPokemos";
import setPageState from "../../redux/actions/setPageState";
import SideBar from "./SideBar";
import Paginator from "./Paginator";
import PokemonCard from "./PokemonCard";
import s from "./styles.module.css";

const cardsPerPage = 12;

export default function PokemonsPage(params) {
  const dispatch = useDispatch();
  const pokemons = useSelector((state) => state.pokemons);
  const { page, filters } = useSelector((state) => state.pageState);

  useEffect(() => {
    if (pokemons.length === 0) {
      dispatch(getPokemons());
    }
  }, [dispatch, pokemons.length]);

  const handlePageChange = (page) => {
    dispatch(
      setPageState({
        page,
        filters,
      })
    );
  };

  const handleFiltersChange = (e) => {
    const { name, value, type, checked } = e.target;
    dispatch(
      setPageState({
        page: 0,
        filters: {
          ...filters,
          [name]: type === "checkbox" ? checked : value,
        },
      })
    );
  };

  const handleSearch = () => {
    dispatch(getPokemons(filters.search));
  };

  const filteredPokemons = pokemons.filter((pokemon) => {
    if (!filters.originNatural) {
      const isNatural = typeof pokemon.id === "number";
      if (isNatural) {
        return false;
      }
    }
    if (!filters.originCreated) {
      const isCrated = typeof pokemon.id === "string";
      if (isCrated) {
        return false;
      }
    }
    if (filters.type) {
      const hasTheCorrectType = pokemon.Types.some(
        (type) => type.name === filters.type
      );
      if (!hasTheCorrectType) {
        return false;
      }
    }
    return true;
  });

  const orderedPokemos = filteredPokemons.sort((pokemonA, pokemonB) => {
    switch (filters.order) {
      case "name-asc":
        return pokemonA.name.localeCompare(pokemonB.name);
      case "name-desc":
        return pokemonB.name.localeCompare(pokemonA.name);
      case "ataque-asc":
        return pokemonA.ataque - pokemonB.ataque;
      case "ataque-desc":
        return pokemonB.ataque - pokemonA.ataque;

      default:
        return 0;
    }
  });

  return (
    <div className={s.page}>
      <SideBar
        onFiltersChange={handleFiltersChange}
        filters={filters}
        onSearch={handleSearch}
      />
      <div className={s.pokemonsPage}>
        <div className={s.cardsContainer}>
          {orderedPokemos
            .slice(page * cardsPerPage, (page + 1) * cardsPerPage)
            .map((pokemon) => (
              <Link to={`/pokemons/${pokemon.id}`} key={pokemon.id}>
                <PokemonCard pokemon={pokemon} />
              </Link>
            ))}
        </div>
        <Paginator
          page={page}
          numberOfPages={Math.ceil(orderedPokemos.length / cardsPerPage)}
          onSetPage={handlePageChange}
        />
      </div>
    </div>
  );
}
