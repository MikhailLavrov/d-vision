import React, { useEffect, useState } from 'react';
import c from './Company.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { getPlacesThunk, getInventoryThunk } from './companySlice';
import { getHeadItems, getRecursedPlacesArr } from './companyUtils';

export const Company = () => {
  const dispatch = useDispatch();
  const [selectedPlace, setSelectedPlaceId] = useState(null);

  const statePlaces = useSelector((state) => state.company.places) || [];
  const stateInventory = useSelector((state) => state.company.inventory) || [];

  const headItems = getHeadItems(statePlaces);
  const recursedPlaces = getRecursedPlacesArr(statePlaces, headItems, stateInventory);
  const isThereInventory = stateInventory.filter((item) => item.placeId === selectedPlace);

  useEffect(() => {
    dispatch(getPlacesThunk());
    dispatch(getInventoryThunk());
  }, [dispatch]);

  const handleShowInventory = (e) => {
    e.stopPropagation();
    setSelectedPlaceId(e.target.id);
  };
  
  // ===================== Places FC ======================
  const Places = ({ nodes }) => {
    if (!nodes || nodes.length === 0) return null;

    return (
      <ul>
        {nodes.map((node) => (
          <li key={node.id} onClick={handleShowInventory}>
            {node.parts ? (
              <details open>
                <summary id={node.id}>
                  <div className={c.places__placeSummary}>
                    <span className={`${c.countBadge} ${node.localInventCount === 0 ? c.countBadgeRed : c.countBadgeGreen}`}>
                      {node.localInventCount}
                    </span>
                    <p id={node.id}>
                      {node.name}
                    </p>
                  </div>
                </summary>
                <Places nodes={node.parts} />
              </details>
            ) : (
              <div id={node.id} className={c.places__placeInner}>
                <span className={`${c.countBadge} ${node.localInventCount === 0 ? c.countBadgeRed : c.countBadgeGreen}`}>
                  {node.localInventCount}
                </span>
                <p id={node.id}>{node.name}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  // =================== Inventory FC =====================

  const Inventory = () => {
    return isThereInventory.map((item) => {
      // const [count, setCount] = useState(item.count);
  
      // const handleDecrement = () => setCount(count - 1);
      // const handleIncrement = () => setCount(count + 1);
  
      return (
        <li key={item.id}>
          <p>Название <span>{item.name}</span></p>
          <p>
            Количество{" "}
            {statePlaces?.filter((place) => place.id === selectedPlace)[0]?.parts ? (
              <span>{item.count}</span>
            ) : (
              <>
                {/* <button onClick={handleDecrement}>-</button> */}
                <span>{item.count}</span>
                {/* <button onClick={handleIncrement}>+</button> */}
              </>
            )}
          </p>
        </li>
      );
    });
  };

  // ================= Company FC RETURN ==================
  return (
    <section className={c.company}>
      <div className={c.company__places}>
        <h2>Компания</h2>
        <Places nodes={recursedPlaces} />
      </div>
      <div className={c.company__inventory}>
        {selectedPlace ? (
          <>
            <h2>Инвентарь в {statePlaces.find((place) => place.id === selectedPlace).name}</h2>
            {isThereInventory.length > 0 ? (
              <ul>{Inventory()}</ul>
            ) : (
              <p>Здесь ничего нет</p>
            )}
          </>
        ) : (
          <p>Выберите место, чтобы увидеть его инвентарь</p>
        )}
      </div>
    </section>
  );
}
