import React, { useEffect, useState } from 'react';
import c from './Company.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { getPlacesThunk, getInventoryThunk } from './companySlice';
import { getHeadItems, getRecursedPlacesArr } from './companyUtils';
import { Inventory } from './inventory/Inventory';
import { Places } from './places/Places';

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
  
  // ================= Company FC RETURN ==================
  return (
    <section className={c.company}>
      <div className={c.company__places}>
        <h2>Компания</h2>
        <Places nodes={recursedPlaces} handleShowInventory={handleShowInventory} />
      </div>
      <div className={c.company__inventory}>
        {selectedPlace ? (
          <>
            <h2>Инвентарь в {statePlaces.find((place) => place.id === selectedPlace).name}</h2>
            {isThereInventory.length > 0 ? (
              <ul>
                <Inventory isThereInventory={isThereInventory} 
                           statePlaces={statePlaces} 
                           selectedPlace={selectedPlace} />
              </ul>
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
