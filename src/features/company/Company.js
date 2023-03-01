import React, { useEffect, useState } from 'react';
import c from './Company.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { getPlacesThunk, getInventoryThunk } from './companySlice';

export const Company = () => {
  const dispatch = useDispatch();

  // Присваиваем переменные данным из стейта, для удобства работы с ними
  const places = useSelector(state => state.company.places);
  const inventory = useSelector(state => state.company.inventory);

  // Обрабатываем хуком id элемента при клике для отображения соответствующего ему инвентаря
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);

  // Загружаем данные и диспачим их в redux store
  useEffect(() => {
    dispatch(getPlacesThunk());
    dispatch(getInventoryThunk());
  }, [dispatch]);

  // Делим places на два массива с parts и без (для дальнейшего удобства обработки)
  const {hasParts, noParts} = places.reduce((acc, place) => {
    place.data.parts && place.data.parts !== undefined && place.data.parts !== null
    ? acc.hasParts.push(place)
    : acc.noParts.push(place)
    
    return acc;
  }, { hasParts: [], noParts: [] });
  
  // Утилита для подсчета количества инвентаря в элементе
  const getInventoryCount = (placeId) => {
    return inventory.filter(item => item.placeId === placeId).length;
  };

  const allPlaces = hasParts.map(place => {
    const inventoryCount = getInventoryCount(place.id);

    const matchingPlaceNames = place.data.parts.map(part => {
      return noParts.filter(nestedPlace => nestedPlace.id === part.id);
    }).flat();
    
    const nestedPlaces = matchingPlaceNames.map(placeName => (
      <li key={placeName.id} onClick={() => setSelectedPlaceId(placeName.id)}>
        {placeName.data.name} ({getInventoryCount(placeName.id)})
      </li>
    ))
      
    return (
      <details key={place.id}>
        <summary onClick={() => setSelectedPlaceId(place.id)}>
          {place.data.name} <span>({inventoryCount})</span>
        </summary>
        {
          matchingPlaceNames.length > 0 
          ? <ul>{nestedPlaces}</ul> 
          : null
        }
      </details>
    );
  });
  
  // ===================================================

  const allInventory = inventory
  .filter(item => item.placeId === selectedPlaceId)
  .map(item => (
    <li key={item.id}>
      <p>Название <span>{item.data.name}</span></p>
      <p>Количество <span>{item.data.count}</span></p>
    </li>
  ));
    
  // ===================================================

  return (
    <section className={c.company}>
      <div className={c.company__places}>
        <h2>Место:</h2>
        {allPlaces}
      </div>
      <div className={c.company__inventory}>
        {selectedPlaceId ? (
          <>
            <h2>Инвентарь в {places.find((place) => place.id === selectedPlaceId).data.name}:</h2>
            {allInventory.length > 0 ? (
              <ul>{allInventory}</ul>
            ) : (
              <p>Выберите место, чтобы увидеть его инвентарь</p>
            )}
          </>
        ) : (
          <p>Выберите место, чтобы увидеть его инвентарь</p>
        )}
      </div>
    </section>
  );

}
