import React, { useEffect, useState } from 'react';
import c from './Company.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { getPlacesThunk, getInventoryThunk } from './companySlice';

// ===================== Utils ======================
const getHeadItems = (places) => {
  const ids = [];
  const parts = [];

  places.forEach(place => {
    if (place.parts) {
      return place.parts.forEach(part => parts.push(part))
    }
  });

  places.forEach(place => ids.push(place.id));

  const uniqueIds = ids.filter(id => !parts.includes(id));

  return places.filter(place => uniqueIds.includes(place.id)).map(i => i.id);
}
const getRecursedPlacesArr = (places, partIDs) => {
  let parsedPlaces = []
  let result = []
  
  places.forEach(place => {
    let isNewPlace = parsedPlaces.find(parsed => parsed === place.id) || (partIDs && !partIDs.find(id => id === place.id))
    
    if (isNewPlace) return parsedPlaces.push(place.id)

    if (place.parts) {
      result.push({...place, parts: getRecursedPlacesArr(places, place.parts)})
    } else {
      result.push(place)
    }
  })
  
  return result
}
const getInventoryCount = (inventory, placeId) => inventory.filter(item => item.placeId === placeId).length;
// ==================================================

export const Company = () => {
  const dispatch = useDispatch();
  const places = useSelector(state => state.company.places);
  const inventory = useSelector(state => state.company.inventory);
  const [ selectedPlaceId, setSelectedPlaceId ] = useState(null);

  useEffect(() => {
    dispatch(getPlacesThunk());
    dispatch(getInventoryThunk());
  }, [dispatch]);
  
  // ===================== Places ======================
  // Определили головные places
  const headPlaces = getHeadItems(places)
  // Получили структурированный массив places (с учетом зависимостей)
  const recursedPlaces = getRecursedPlacesArr(places, headPlaces);
  
  const handleShowInventory = (e) => {
    e.stopPropagation();
    console.log(e.target);
    console.log(e.target.id);
    setSelectedPlaceId(e.target.id);
  };
  
  const PlacesTree = ({ nodes }) => {
    if (!nodes || nodes.length === 0) return null
    
    return (
      <ul>
        {nodes.map((node) => (
          <li key={node.id} onClick={handleShowInventory}>
            {node.parts 
            ? (<details open>
                <summary>
                  <div className={c.places__placeSummary}>
                    <span className={`${c.countBadge} ${getInventoryCount(inventory, node.id) === 0 ? c.countBadgeRed : c.countBadgeGreen}`}>
                      {getInventoryCount(inventory, node.id)}
                    </span>
                    <p id={node.id}>{node.name}</p>
                  </div>
                </summary>
                <PlacesTree nodes={node.parts} />
              </details>) 
            : (<div className={c.places__placeInner}>
                <span className={`${c.countBadge} ${getInventoryCount(inventory, node.id) === 0 ? c.countBadgeRed : c.countBadgeGreen}`}>
                  {getInventoryCount(inventory, node.id)}
                </span>
                <p id={node.id}>{node.name}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };
  
  // ===================== Inventory ======================
  const allInventory = inventory
  .filter(item => item.placeId === selectedPlaceId)
  .map(item => (
    <li key={item.id}>
      <p>Название <span>{item.name}</span></p>
      <p>Количество <span>{item.count}</span></p>
    </li>
  ));
    
  // ===================== FC RETURN ======================
  return (
    <section className={c.company}>
      <div className={c.company__places}>
        <h2>Компания</h2>
        <PlacesTree nodes={recursedPlaces} />
      </div>
      <div className={c.company__inventory}>
        {selectedPlaceId ? (
          <>
            <h2>Инвентарь в {places.find((place) => place.id === selectedPlaceId).name}:</h2>
            {allInventory.length > 0 ? (
              <ul>{allInventory}</ul>
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
