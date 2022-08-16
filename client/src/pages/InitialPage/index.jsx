import { Link } from "react-router-dom";
import s from "./styles.module.css";

export default function InitialPage(params) {
  return (
    <div className={s.initialPageContainer}>
      <div className={s.initialPageBackgrond}>
        <Link to="/pokemons">
          <button>Explora el mundo Pokemon</button>
        </Link>
      </div>
    </div>
  );
}
