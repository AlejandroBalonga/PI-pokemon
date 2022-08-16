const axios = require("axios");
const { Router } = require("express");
const { Pokemon, Type } = require("../db");
const isUuid = require("../utils/isUuid");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const trae40 = false; //cargo los 40 que pide el PI o todos
const router = Router();
const arrResPokemons = [];

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.get("/pokemons", (req, res) => {
  /**
   * Obtener un listado de los pokemons desde pokeapi.
   * Debe devolver solo los datos necesarios para la ruta principal
   */
  const { name } = req.query;
  if (name) {
    /**
     * Obtener el pokemon que coincida exactamente con el nombre pasado como query parameter (Puede ser de pokeapi o creado por nosotros)
     * Si no existe ningún pokemon mostrar un mensaje adecuado
     */
    const apiPromise = axios
      .get(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then(formateoResApi)
      .catch((err) => {
        if (err.response.status !== 404) {
          throw err;
        }
      });
    const dbPromise = Pokemon.findOne({ where: { name }, include: Type });
    Promise.all([apiPromise, dbPromise])
      .then(([apiResponse, dbResponse]) => {
        res
          .status(200)
          .json(formateoRutaPrincipal([apiResponse || dbResponse]));
      })
      .catch((err) => {
        res.status(404).json(err);
      });
  } else if (trae40) {
    axios
      .get("https://pokeapi.co/api/v2/pokemon?offset=0&limit=40")
      .then((resp) => {
        const pokemonsPromices = resp.data.results.map((xPokemon) => {
          return axios.get(xPokemon.url).then(formateoResApi);
        });
        Promise.all(pokemonsPromices).then((arrRes) => {
          res.status(200).json(formateoRutaPrincipal(arrRes));
        });
      });
  } else {
    Pokemon.findAll({ include: Type }).then((pokemons) => {
      res
        .status(200)
        .json(formateoRutaPrincipal([...pokemons, ...arrResPokemons]));
    });
  }
});

function recursivAxios(url = "https://pokeapi.co/api/v2/pokemon") {
  if (!url || trae40) return;
  axios.get(url).then((resp) => {
    const pokemonsPromices = resp.data.results.map((xPokemon) => {
      return axios.get(xPokemon.url).then(formateoResApi);
    });
    Promise.all(pokemonsPromices)
      .then((arrRes) => {
        arrResPokemons.push(...arrRes);
        // console.log(arrResPokemons.length);
        recursivAxios(resp.data.next);
      })
      .catch((e) => console.log("recursivAxios ERROR", e));
  });
}
if (!trae40) recursivAxios();

function formateoResApi(res) {
  return {
    id: res.data.id,
    name: res.data.name,
    vida: res.data.stats[0].base_stat,
    ataque: res.data.stats[1].base_stat,
    defensa: res.data.stats[2].base_stat,
    velocidad: res.data.stats[5].base_stat,
    altura: res.data.height,
    peso: res.data.weight,
    Types: res.data.types.map((xType) => ({ name: xType.type.name })),
    img:
      res.data.sprites.other["official-artwork"].front_default ||
      res.data.sprites.other.home.front_default,
  };
}
function formateoRutaPrincipal(pokemons) {
  return pokemons.map((pokemon) => ({
    id: pokemon.id,
    name: pokemon.name,
    img: pokemon.img,
    ataque: pokemon.ataque,
    Types: pokemon.Types.map((type) => ({
      name: type.name,
    })),
  }));
}

/**
 * Obtener el detalle de un pokemon en particular
 * Debe traer solo los datos pedidos en la ruta de detalle de pokemon
 * Tener en cuenta que tiene que funcionar tanto para un id de un pokemon existente en pokeapi o uno creado por ustedes
 */
router.get("/pokemons/:id", (req, res) => {
  const { id } = req.params;
  if (Number(id)) {
    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then((resp) => {
        res.status(200).json(formateoResApi(resp));
      })
      .catch((err) => {
        if (err && err.response && err.response.status === 404) {
          res.status(404).send("not found");
          return;
        }
        throw err;
      });
  } else if (isUuid(id)) {
    Pokemon.findByPk(id, { include: Type })
      .then((pokemon) => {
        res.status(200).json(pokemon);
      })
      .catch((err) => {
        res.status(404).send("not found");
        return;
      });
  } else {
    res.status(400).send("the id must ba a integer or a UUID");
  }
});

/**
 * Recibe los datos recolectados desde el formulario controlado de la ruta de creación de pokemons por body
 * Crea un pokemon en la base de datos relacionado con sus types.
 */
router.post("/pokemons", (req, res) => {
  const { name, vida, ataque, defensa, velocidad, altura, peso, typeIds } =
    req.body;

  if (!name) {
    return res.status(400).end("Falta name");
  }

  Pokemon.create({
    name,
    vida,
    ataque,
    defensa,
    velocidad,
    altura,
    peso,
  })
    .then((pokemon) => pokemon.setTypes(typeIds))
    .then(() => {
      res.status(200).end(`Pokemon ${name} creado`);
    });
});

router.get("/types", (req, res) => {
  /**
   * Obtener todos los types de pokemons posibles
   * En una primera instancia deberán traerlos desde pokeapi y guardarlos en su propia base de datos y luego ya utilizarlos desde allí
   */
  Type.findAll().then((types) => {
    if (!types.length) {
      axios.get("https://pokeapi.co/api/v2/type").then((resp) => {
        const todosLosTypes = resp.data.results.map((xType) => {
          return { name: xType.name };
        });
        Type.bulkCreate(todosLosTypes).then(() => {
          Type.findAll().then((types) => {
            res.status(200).json(types);
          });
        });
      });
    } else {
      res.status(200).json(types);
    }
  });
});

router.delete("/pokemons/:id", (req, res) => {
  const { id } = req.params;
  if (isUuid(id)) {
    Pokemon.destroy({ where: { id } })
      .then(() => {
        res.status(200).send(`Pokemon id:${id} eliminado`);
      })
      .catch((err) => {
        res.status(404).send("not found");
        return;
      });
  }
});

module.exports = router;
