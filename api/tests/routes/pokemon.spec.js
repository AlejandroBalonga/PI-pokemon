/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require("chai");
const session = require("supertest-session");
const app = require("../../src/app.js");
const { Pokemon, conn } = require("../../src/db.js");

const agent = session(app);
const pokemon = {
  name: "Testiu",
};

describe("Pokemon routes", () => {
  before(() =>
    conn.authenticate().catch((err) => {
      console.error("Unable to connect to the database:", err);
    })
  );
  beforeEach(() =>
    conn.sync({ force: true }).then(() => Pokemon.create(pokemon))
  );
  describe("GET /pokemons", () => {
    it("should get 200", () => {
      return agent.get("/pokemons").then((res) => {
        expect(res.status).to.be.equal(200);
      });
    });
    //Obtener un listado de los pokemons desde pokeapi.
    it("should get a list of Pokemon from PokeApi", () => {
      return agent.get("/pokemons").then((res) => {
        expect(res.body[1].id).to.be.a("number");
      });
    });
    //lo mismo pero de mi base de datos
    it("should get a list of Pokemon from our Data Base", () => {
      return agent.get("/pokemons").then((res) => {
        expect(res.body[0].id).to.be.a("string");
      });
    });
    //Debe devolver solo los datos necesarios para la ruta principal
    it("should get only the required fields for the principal route", () => {
      return agent.get("/pokemons").then((res) => {
        const pokemonsKeys = Object.keys(res.body[0]);
        expect(pokemonsKeys).to.be.deep.equals([
          "id",
          "name",
          "ataque",
          "Types",
        ]);
      });
    });

    //si se le pasa un "name" debe devolver solo el pokemon con ese name
    it("if a 'name' is pased should get only the Pokemon with that 'name'", () => {
      return agent.get(`/pokemons?name=${pokemon.name}`).then((res) => {
        expect(res.body).to.be.a.instanceOf(Array);
        res.body.forEach((p)=>{
          expect(p.name).to.be.equal(pokemon.name);
        })
      });
    });
  });
});
