import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import getTypes from "../../redux/actions/getTypes";
import s from "./styles.module.css";
import axios from "axios";
import getPokemons from "../../redux/actions/getPokemos";

export default function CreatePokemonPage() {
  const history = useHistory();
  const [form, setForm] = useState({
    name: "",
    vida: 0,
    ataque: 0,
    defensa: 0,
    velocidad: 0,
    altura: 0,
    peso: 0,
    typeIds: [],
  });
  const [errors, setErrors] = useState({
    name: "Falta el nombre",
    vida: undefined,
    ataque: undefined,
    defensa: undefined,
    velocidad: undefined,
    altura: undefined,
    peso: undefined,
    typeIds: undefined,
  });
  const types = useSelector((state) => state.types);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!types.length) {
      dispatch(getTypes());
    }
  }, [dispatch, types.length]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!Object.values(errors).some((err) => err)) {
      console.log("SUBMIT!", form);
      axios
        .post(`http://localhost:3001/pokemons`, form)
        .then(() => {
          dispatch(getPokemons());
          history.goBack();
        })
        .catch((e) => console.log(e));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "typeId1") {
      // form.typeIds[0] = value;
      setForm({
        ...form,
        typeIds: [Number(value)],
      });
    } else if (name === "typeId2") {
      // form.typeIds[1] = value;
      setForm({
        ...form,
        typeIds: [form.typeIds[0], Number(value)],
      });
    } else if (Number(value)) {
      if (value < 1000) {
        setForm({
          ...form,
          [name]: value,
        });
      }
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }

    if (name === "name") {
      if (value.length) {
        setErrors({
          ...errors,
          name: undefined,
        });
      } else {
        setErrors({
          ...errors,
          name: "Falta el nombre",
        });
      }
    } else if (value < 0) {
      setErrors({
        ...errors,
        [name]: `${name} debe ser positivo`,
      });
    } else {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  return (
    <div className={s.createPokemonPage}>
      <h3>Crea un nuevo Pokemon</h3>
      <form onSubmit={handleSubmit} className={s.form}>
        <label htmlFor="name">name:*</label>
        <input
          type="text"
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
        />
        {/* <p>{errors.name}</p> */}
        <label htmlFor="vida">vida:</label>
        <input
          type="number"
          id="vida"
          name="vida"
          value={form.vida}
          onChange={handleChange}
        />
        {/* <p>{errors.vida}</p> */}
        <label htmlFor="ataque">ataque:</label>
        <input
          type="number"
          id="ataque"
          name="ataque"
          value={form.ataque}
          onChange={handleChange}
        />
        {/* <p>{errors.ataque}</p> */}
        <label htmlFor="defensa">defensa:</label>
        <input
          type="number"
          id="defensa"
          name="defensa"
          value={form.defensa}
          onChange={handleChange}
        />
        {/* <p>{errors.defensa}</p> */}
        <label htmlFor="velocidad">velocidad:</label>
        <input
          type="number"
          id="velocidad"
          name="velocidad"
          value={form.velocidad}
          onChange={handleChange}
        />
        {/* <p>{errors.velocidad}</p> */}
        <label htmlFor="altura">altura:</label>
        <input
          type="number"
          id="altura"
          name="altura"
          value={form.altura}
          onChange={handleChange}
        />
        {/* <p>{errors.altura}</p> */}
        <label htmlFor="peso">peso:</label>
        <input
          type="number"
          id="peso"
          name="peso"
          value={form.peso}
          onChange={handleChange}
        />
        <label htmlFor="typeId1">Type 1:</label>
        <select id="typeId1" name="typeId1" onChange={handleChange}>
          <option value={0}>Vacio</option>
          {types
            .filter((type) => form.typeIds[1] !== type.id)
            .map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
        </select>
        <label htmlFor="typeId2">Type 2:</label>
        <select id="typeId2" name="typeId2" onChange={handleChange}>
          <option value={0}>Vacio</option>
          {types
            .filter((type) => form.typeIds[0] !== type.id)
            .map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
        </select>
        {Object.values(errors).map((err, i) => (
          <div key={i}>{err}</div>
        ))}
        <input
          type="submit"
          value="Crear"
          disabled={Object.values(errors).some((err) => err)}
        />
      </form>
      <button onClick={() => history.goBack()}>volver</button>
    </div>
  );
}
