import React from "react";
import s from "./styles.module.css";
import defaultPokemonImg from "../../../assets/question-mark.png";
import axios from "axios";
import { useDispatch } from "react-redux";
import getPokemons from "../../../redux/actions/getPokemos";

export default function PokemonCard({ pokemon }) {
  const dispatch = useDispatch();
  const handeleDelete = (e) => {
    e.preventDefault();
    // e.stopPropagation();
    const { id } = e.target;
    axios.delete(`http://localhost:3001/pokemons/${id}`)
      .then((res) => {
        console.log(`Pokemon id:${id} eliminado`);
        console.log(res);
        dispatch(getPokemons());
      })
      .catch((e) => console.log("ERROR al eliminar",e));
  };

  return (
    <div className={s.card}>
      <img
        className={s.img}
        src={pokemon.img || defaultPokemonImg}
        alt={pokemon.name}
        onError={(e) => {
          e.target.src = defaultPokemonImg;
        }}
      />
      <div className={s.deletSpace}>
        {typeof pokemon.id === "string" && (
          <button id={pokemon.id} onClick={handeleDelete}>
            X
          </button>
        )}
        <div className={s.info}>
          <h3 className={s.name}>{pokemon.name}</h3>
          <ul className={s.typesContainer}>
            {pokemon.Types.map((type) => (
              <li key={type.name} className={s.type}>
                {type.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
