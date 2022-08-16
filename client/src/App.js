import { Route, Switch, Redirect } from "react-router-dom";
import CreatePokemonPage from "./pages/CreatePokemonPage/index";
import DetailPokemonPage from "./pages/DetailPokemonPage/index";
import InitialPage from "./pages/InitialPage/index";
import PokemonsPage from "./pages/PokemonsPage/index";

export default function App() {
  return (
    <Switch>
      <Route exact path="/" component={InitialPage} />
      <Route exact path="/pokemons" component={PokemonsPage} />
      <Route exact path="/pokemons/create" component={CreatePokemonPage} />
      <Route exact path="/pokemons/:id" component={DetailPokemonPage} />
      <Route component={() => <Redirect to="/" />} />
    </Switch>
  );
}
