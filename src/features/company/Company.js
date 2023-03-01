import React, { useEffect, useState } from 'react';
import c from './Company.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { getPlacesThunk, getInventoryThunk } from './companySlice';

export function Company() {
  const dispatch = useDispatch();
  const places = useSelector(state => state.company.places);
  const inventory = useSelector(state => state.company.inventory);

  const [selectedPlaceId, setSelectedPlaceId] = useState(null);

  useEffect(() => {
    dispatch(getPlacesThunk());
    dispatch(getInventoryThunk());
  }, [dispatch]);

  // ==============================================
  
  const {hasParts, noParts} = places.reduce((acc, place) => {
    place.data.parts && place.data.parts !== undefined && place.data.parts !== null
    ? acc.hasParts.push(place)
    : acc.noParts.push(place)
    
    return acc;
  }, { hasParts: [], noParts: [] });
  
  // ==============================================

  const allPlaces = hasParts.map(place => {
    
    const matchingPlaceNames = place.data.parts.map(part => {
      return noParts.filter(nestedPlace => nestedPlace.id === part.id);
    }).flat();

    const nestedPlaces = matchingPlaceNames.map(placeName => (
      <li key={placeName.id} onClick={() => setSelectedPlaceId(placeName.id)}>
        {placeName.data.name}
      </li>
    ))

    return (
      <details key={place.id}>
        <summary onClick={() => setSelectedPlaceId(place.id)}>{place.data.name}</summary>
        {matchingPlaceNames.length > 0 
        ? <ul>{nestedPlaces}</ul> : null}
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
