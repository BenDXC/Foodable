import React from "react";
import { Link } from "react-router-dom";
import { CardItemProps } from "../../types";

const CardItem: React.FC<CardItemProps> = (props): JSX.Element => {
  return (
    <>
      <li className="cards__item">
        <Link 
          className="cards__item__link" 
          to={props.path}
          aria-label={`${props.label}: ${props.text}`}
        >
          <figure className="cards__item__pic-wrap" data-category={props.label}>
            <img 
              className="cards__item__img" 
              alt={`${props.label} - ${props.text}`} 
              src={props.src} 
            />
          </figure>
          <div className="cards__item__info">
            <h5 className="cards__item__text">{props.text}</h5>
          </div>
        </Link>
      </li>
    </>
  );
}

export default CardItem;
