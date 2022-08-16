import React from "react";
import s from "./styles.module.css";

export default function Paginator({ page, numberOfPages, onSetPage }) {
  return (
    <div className={s.Paginator}>
      {page > 0 && <button onClick={() => onSetPage(page - 1)}>{"<-"}</button>}
      {page > 5 && <button onClick={() => onSetPage(0)}>{0}</button>}
      {page > 6 && <p>•••</p>}
      {page > 4 && (
        <button onClick={() => onSetPage(page - 5)}>{page - 5}</button>
      )}
      {page > 3 && (
        <button onClick={() => onSetPage(page - 4)}>{page - 4}</button>
      )}
      {page > 2 && (
        <button onClick={() => onSetPage(page - 3)}>{page - 3}</button>
      )}
      {page > 1 && (
        <button onClick={() => onSetPage(page - 2)}>{page - 2}</button>
      )}
      {page > 0 && (
        <button onClick={() => onSetPage(page - 1)}>{page - 1}</button>
      )}
      <p>
        <button>{page}</button>
      </p>
      {numberOfPages - page - 1 > 0 && (
        <button onClick={() => onSetPage(page + 1)}>{page + 1}</button>
      )}
      {numberOfPages - page - 1 > 1 && (
        <button onClick={() => onSetPage(page + 2)}>{page + 2}</button>
      )}
      {numberOfPages - page - 1 > 2 && (
        <button onClick={() => onSetPage(page + 3)}>{page + 3}</button>
      )}
      {numberOfPages - page - 1 > 3 && (
        <button onClick={() => onSetPage(page + 4)}>{page + 4}</button>
      )}
      {numberOfPages - page - 1 > 4 && (
        <button onClick={() => onSetPage(page + 5)}>{page + 5}</button>
      )}
      {numberOfPages - page - 1 > 6 && <p>•••</p>}
      {numberOfPages - page - 1 > 5 && (
        <button onClick={() => onSetPage(numberOfPages - 1)}>
          {numberOfPages - 1}
        </button>
      )}
      {numberOfPages - page - 1 > 0 && (
        <button onClick={() => onSetPage(page + 1)}>{"->"}</button>
      )}
    </div>
  );
}
/*
{numberOfPages <= 10 &&
  Array.from({ length: numberOfPages }, (_e, i) => (
    <button key={i} onClick={() => onSetPage(i)}>
      {i}
    </button>
  ))}
*/
/*
{page > 10 &&
  Array.from({ length: numberOfPages })
    .slice(page > 5 && page - 5, page + 5)
    .map((_e, i) => (
      <button key={i} onClick={() => onSetPage(i)}>
        {i}
      </button>
))}
*/
