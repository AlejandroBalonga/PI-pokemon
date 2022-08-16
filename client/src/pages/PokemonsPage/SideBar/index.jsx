import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import getTypes from "../../../redux/actions/getTypes";
import s from "./styles.module.css";

export default function SideBar({ filters, onFiltersChange, onSearch }) {
  const dispatch = useDispatch();
  const types = useSelector((state) => state.types);
  const pokemonsNames = useSelector((state) => state.pokemons).map(
    (pokemon) => pokemon.name
  );

  useEffect(() => {
    if (!types.length) {
      dispatch(getTypes());
    }
  }, [dispatch, types.length]);

  const handlerReturn = () => {
    filters.search = "";
    onSearch();
  };

  return (
    <div className={s.SideBar}>
      <div>
        <input
          className={s.input}
          type="text"
          id="name"
          name="search"
          size="10"
          placeholder="Buscar"
          value={filters.search}
          onChange={onFiltersChange}
          list="suggestions"
        />
        <datalist id="suggestions">
          {pokemonsNames.map((pokemonName, i) => (
            <option key={i} value={pokemonName} />
          ))}
        </datalist>
        <button onClick={onSearch}>Buscar</button>
        <button onClick={handlerReturn}>{"<-"}</button>
      </div>
      <fieldset>
        <legend className={s.tituloFiltro}>Filtros:</legend>
        <div>
          <label htmlFor="types">Tipo</label>
          <select
            className={s.selectorTypes}
            id="types"
            name="type"
            value={filters.type}
            onChange={onFiltersChange}
          >
            <option value="">Todos</option>
            {types.map((type) => (
              <option key={type.id} value={type.name}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Origen:</label>
          <div>
            <label htmlFor="origen-natural">Natural</label>
            <input
              type="checkbox"
              id="origen-natural"
              name="originNatural"
              checked={filters.originNatural}
              onChange={onFiltersChange}
            />
          </div>
          <div>
            <label htmlFor="origen-created">Creado</label>
            <input
              type="checkbox"
              id="origen-created"
              name="originCreated"
              checked={filters.originCreated}
              onChange={onFiltersChange}
            />
          </div>
        </div>
      </fieldset>
      <fieldset>
        <legend className={s.tituloOrdenar}>Oredenar:</legend>
        <div>
          <input
            type="radio"
            id="order-name-asc"
            name="order"
            value="name-asc"
            checked={filters.order === "name-asc"}
            onChange={onFiltersChange}
          />
          <label htmlFor="order-name-asc">Nombre - Ascendente</label>
        </div>
        <div>
          <input
            type="radio"
            id="order-name-desc"
            name="order"
            value="name-desc"
            checked={filters.order === "name-desc"}
            onChange={onFiltersChange}
          />
          <label htmlFor="order-name-desc">Nombre - Descendente</label>
        </div>
        <div>
          <input
            type="radio"
            id="order-ataque-asc"
            name="order"
            value="ataque-asc"
            checked={filters.order === "ataque-asc"}
            onChange={onFiltersChange}
          />
          <label htmlFor="order-ataque-asc">Ataque - Ascendente</label>
        </div>
        <div>
          <input
            type="radio"
            id="order-ataque-desc"
            name="order"
            value="ataque-desc"
            checked={filters.order === "ataque-desc"}
            onChange={onFiltersChange}
          />
          <label htmlFor="order-ataque-desc">Ataque - Descendente</label>
        </div>
      </fieldset>
      <Link to="/pokemons/create">
        <button>Crear nuevo Pokemon</button>
      </Link>
    </div>
  );
}
