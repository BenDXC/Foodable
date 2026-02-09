import React from "react";
import { Link } from "react-router-dom";
import { CardItemProps } from "../../types";

export default function RewardItem(props: CardItemProps): JSX.Element {
  return (
    <>
      <li className="rewards__item">
        <Link className="rewards__item__link" to={props.path}>
          <figure
            className="rewards__item__pic-wrap"
            data-category={props.label}
          >
            <img
              className="rewards__item__img"
              alt="Features"
              src={props.src}
            />
          </figure>
          <div className="rewards__item__info">
            <h5 className="rewards__item__text">{props.text}</h5>
          </div>
        </Link>
      </li>
    </>
  );
}
