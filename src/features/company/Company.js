import React, { useEffect, useMemo, useState } from 'react';
import c from './Company.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { getPlacesThunk, getInventoryThunk } from './companySlice';
import { getHeadItems, getRecursedPlacesArr } from './companyUtils';

export const Company = () => {
  const dispatch = useDispatch();
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [editingNameId, setEditingNameId] = useState(null);
  const [editingCountId, setEditingCountId] = useState(null);

  const places = useSelector((state) => state.company.places) || [];
  const inventory = useSelector((state) => state.company.inventory) || [];

  const headItems = getHeadItems(places);
  const recursedPlaces = getRecursedPlacesArr(places, headItems, inventory);

  useEffect(() => {
    dispatch(getPlacesThunk());
    dispatch(getInventoryThunk());
  }, [dispatch]);

  const handleShowInventory = (e) => {
    e.stopPropagation();
    setSelectedPlaceId(e.target.id);
  };

  const handleNameEdit = (e) => {
    setEditingNameId(null); // Stop editing
    const placeId = e.target.parentElement.id;
    const name = e.target.textContent;
    // TODO: Update the state with the new name
  };

  const handleCountEdit = (e) => {
    setEditingCountId(null); // Stop editing
    const itemId = e.target.parentElement.parentElement.id;
    const count = e.target.textContent;
    // TODO: Update the state with the new count
  };

  console.log('Render');

  const PlacesTree = ({ nodes }) => {
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
                    <p
                      id={node.id}
                      contentEditable={editingNameId === node.id}
                      onBlur={handleNameEdit}
                      onFocus={() => setEditingNameId(node.id)}>
                      {node.name}
                    </p>
                  </div>
                </summary>
                <PlacesTree nodes={node.parts} />
              </details>
            ) : (
              <div id={node.id} className={c.places__placeInner}>
                <span className={`${c.countBadge} ${node.localInventCount === 0 ? c.countBadgeRed : c.countBadgeGreen}`}>
                  {node.localInventCount}
                </span>
                <p
                  id={node.id}
                  contentEditable={editingCountId === node.id}
                  onBlur={handleCountEdit}
                  onFocus={() => setEditingCountId(node.id)}>
                  {node.name}
                </p>
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  // ===================== Inventory ======================
  const allInventory = useMemo(() => {
    return inventory
      .filter((item) =>item.placeId === selectedPlaceId)
      .map(item => (
        <li key={item.id}>
          <p>Название <span>{item.name}</span></p>
          <p>Количество <span>{item.count}</span></p>
        </li>
      ));
  }, [inventory, selectedPlaceId]);
  
    
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
