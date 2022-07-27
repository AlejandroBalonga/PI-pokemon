const axios = require("axios");
const { Router } = require("express");
const { Pokemon, Tipo } = require("../db");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const router = Router();

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
      .then((res) => {
        return {
          id: res.data.id,
          name: res.data.name,
          vida: res.data.stats[0].base_stat,
          ataque: res.data.stats[1].base_stat,
          defensa: res.data.stats[2].base_stat,
          velocidad: res.data.stats[5].base_stat,
          altura: res.data.height,
          peso: res.data.weight,
        };
      })
      .catch((err) => {
        if (err.response.status !== 404) {
          throw err;
        }
      });
    const dbPromise = Pokemon.findOne({ where: { name } });
    Promise.all([apiPromise, dbPromise]).then(([apiResponse, dbResponse]) => {
      // console.log(apiResponse, dbResponse);
      res.status(200).json([apiResponse || dbResponse]);
    });
  } else {
    axios.get("https://pokeapi.co/api/v2/pokemon").then((resp) => {
      // console.log('-------------------------------------------------------',resp.data.results,'-------------------------------------------------------');
      res.status(200).json(resp.data.results);
    });
  }
});

router.get("/pokemons/:id", (req, res) => {
  /**
   * Obtener el detalle de un pokemon en particular
   * Debe traer solo los datos pedidos en la ruta de detalle de pokemon
   * Tener en cuenta que tiene que funcionar tanto para un id de un pokemon existente en pokeapi o uno creado por ustedes
   */
  const { id = "c3" } = req.params;
  if (Number(id)) {
    axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`).then((resp) => {
      // console.log('-------------------------------------------------------',resp.data,'-------------------------------------------------------');
      res.status(200).json(resp.data);
    });
  } else if (id.startsWith("c") && Number(id.slice(1))) {
    Pokemon.findByPk(id.slice(1)).then((pokemon) => {
      res.status(200).json(pokemon);
    });
  } else {
    res.status(400).end("id invalido");
  }
});

router.post("/pokemons", (req, res) => {
  /**
   * Recibe los datos recolectados desde el formulario controlado de la ruta de creación de pokemons por body
   * Crea un pokemon en la base de datos relacionado con sus tipos.
   */
  // console.log(
  //   "-------------------------------------------------------",
  //   req.body,
  //   "-------------------------------------------------------"
  // );
  const { name, vida, ataque, defensa, velocidad, altura, peso } = req.body;
  if (!name) {
    res.status(404).end("Falta name");
  } else {
    Pokemon.create({
      name,
      vida,
      ataque,
      defensa,
      velocidad,
      altura,
      peso,
    }).then(() => {
      res.status(200).end(`Pokemon ${name} creado`);
    });
  }
});

router.get("/tipos", (req, res) => {
  /**
   * Obtener todos los tipos de pokemons posibles
   * En una primera instancia deberán traerlos desde pokeapi y guardarlos en su propia base de datos y luego ya utilizarlos desde allí
   */
  Tipo.findAll().then((tipos) => {
    console.log(
      "--------------------------tipos.length-----------------------------",
      tipos.length,
      "-------------------------------------------------------"
    );
    if (!tipos.length) {
      axios.get("https://pokeapi.co/api/v2/type").then((resp) => {
        const todosLosTipos = resp.data.results.map((xTipo) => {
          return { name: xTipo.name };
        });
        console.log(
          "--------------------------todosLosTipos-----------------------------",
          todosLosTipos,
          "-------------------------------------------------------"
        );
        // Tipo.create(todosLosTipos[0])
        Tipo.bulkCreate(todosLosTipos).then(() => {
          console.log("tipos agregados a mi base 'Tipo'");
          Tipo.findAll().then((tipos) => {
            res.status(200).json(tipos);
          });
        });
      });
    } else {
      res.status(200).json(tipos);
    }
  });
});

module.exports = router;
