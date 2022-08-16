import s from "./styles.module.css";
import defaultPokemonImg from "../../assets/question-mark.png";
import axios from "axios";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

export default function DetailPokemonPage(props) {
  const pokemonId = props.match.params.id;
  const history = useHistory();
  const [detail, setDetail] = useState({
    id: 0,
    name: "",
    vida: 0,
    ataque: 0,
    defensa: 0,
    velocidad: 0,
    altura: 0,
    peso: 0,
    Types: [{ name: "" }],
    img: "",
  });

  useEffect(() => {
    if (detail.id === 0) {
      axios
        .get(`http://localhost:3001/pokemons/${pokemonId}`)
        .then((resp) => {
          setDetail(resp.data);
        })
        .catch((e) => {
          console.log("ERROR", e);
          history.goBack();
        });
    }
  }, [detail.id, pokemonId, history]);

  return (
    <div className={s.page}>
      <button onClick={() => history.goBack()}>volver</button>
      <div className={s.info}>
        <h3 className={s.label}>Id:</h3>
        <h3>{detail.id}</h3>
        <h3 className={s.label}>Nombre: </h3>
        <h3 className={s.name}>
          {`${detail.name[0]?.toUpperCase()}${detail.name.slice(1)}`}
        </h3>
        <h3 className={s.label}>Altura: </h3>
        <h3>{detail.altura / 10}mt</h3>
        <h3 className={s.label}>Peso:</h3>
        <h3> {detail.peso / 10}kg</h3>
        <h3 className={s.label}>Tipos:</h3>
        <div className={s.typesContainer}>
          {detail.Types.map((type) => (
            <div key={type.name} className={s.type}>
              {type.name}
            </div>
          ))}
        </div>
      </div>
      <img
        className={s.img}
        src={detail.img || defaultPokemonImg}
        alt={detail.name}
        onError={(e) => {
          e.target.src = defaultPokemonImg;
        }}
      />
      <div className={s.seccion}>
        <h3>Estadisticas:</h3>
        <div className={s.estadisticas}>
          <h3 className={s.label}>Vida: </h3>
          <div style={{width: detail.vida/2 + "%"}}>{detail.vida}</div>
          <h3 className={s.label}>Ataque: </h3>
          <div style={{width: detail.ataque/2 + "%"}}>{detail.ataque}</div>
          <h3 className={s.label}>Defensa: </h3>
          <div style={{width: detail.defensa/2 + "%"}}>{detail.defensa}</div>
          <h3 className={s.label}>Velocidad: </h3>
          <div style={{width: detail.velocidad/2 + "%"}}>{detail.velocidad}</div>
        </div>
      </div>
    </div>
  );
}
