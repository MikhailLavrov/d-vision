import React, { useEffect, useState } from 'react';
import c from './Company.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { getPlacesThunk, getInventoryThunk, addInventoryThunk } from './companySlice';
import { getHeadItems, getRecursedPlacesArr } from './companyUtils';
import { Inventory } from './inventory/Inventory';
import { Places } from './places/Places';

export const Company = () => {
  const dispatch = useDispatch();
  const statePlaces = useSelector((state) => state.company.places) || [];
  const stateInventory = useSelector((state) => state.company.inventory) || [];
  useEffect(() => {
    dispatch(getPlacesThunk());
    dispatch(getInventoryThunk());
  }, [dispatch]);

  //* ================= Работа с инвентарем ==================
  const [selectedPlace, setSelectedPlaceId] = useState(null);
  const isThereInventory = stateInventory.filter((item) => item.placeId === selectedPlace);
  const handleShowInventory = (e) => {
    e.stopPropagation();
    setSelectedPlaceId(e.target.id);
  };

  // TODO Добавление инвентаря
  const [showAddInventory, setShowAddInventory] = useState(false);
  const [itemName, setItemName] = useState('');
  const [countNumber, setCountNumber] = useState('');
  // TODO ====================

  //* ================== Работа с местами ====================
  const headItems = getHeadItems(statePlaces);
  const recursedPlaces = getRecursedPlacesArr(statePlaces, headItems, stateInventory);


  
  // ================= Company FC RETURN ==================
  return (
    <section className={c.company}>
      {/* Места */}
      <div className={c.company__places}>
        <h2>Компания</h2>
        <Places nodes={recursedPlaces} handleShowInventory={handleShowInventory} />
      </div>
      <div className={c.company__inventory}>

      {/* Инвентарь */}
      {/* Если выбрали место */}
      {selectedPlace ? 
      <>
        <h2>Инвентарь в {statePlaces.find((place) => place.id === selectedPlace).name}</h2>

        {isThereInventory.length > 0
        ? (
          <>
            <ul>
              <Inventory isThereInventory={isThereInventory} 
                         statePlaces={statePlaces} 
                         selectedPlace={selectedPlace} />
            </ul>
            {/* Для тех у кого нет дочерних добавляем кнопку ДОБАВИТЬ */}
            {!statePlaces.find((place) => place.id === selectedPlace).parts 
            ? (
              <>
                <button type='button' onClick={() => {setShowAddInventory(true)}}>Добавить</button>
                
                {/* Открытая форма добавления */}
                {showAddInventory && (
                  <div>
                    <form onSubmit={(e) => {
                            e.preventDefault();
                            dispatch(addInventoryThunk(selectedPlace, itemName, countNumber, selectedPlace));
                            setShowAddInventory(false);
                            setItemName(itemName);
                            setCountNumber(countNumber);
                          }}>
                      <input type='text' 
                              value={itemName} 
                              onChange={(e) => setItemName(e.target.value)} 
                              placeholder='Название' />
                      <input type='number' 
                              value={countNumber} 
                              onChange={(e) => setCountNumber(e.target.value)} 
                              placeholder='Количество' />
                      <button type='submit'>Добавить</button>
                    </form>
                  </div>
                )}
              </>
            ) : ''}
          </>
        ) : (
        // Если инвентаря нет в комнате
          <>
            <p>Здесь ничего нет</p>
            {/* <button type='button' onClick={() => setShowAddInventory(true)}>Добавить</button> */}
            {showAddInventory && (
              <li>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  dispatch(addInventoryThunk(selectedPlace, itemName, countNumber, selectedPlace));
                  setShowAddInventory(false);
                  setItemName('');
                  setCountNumber('');
                }}>
                  <input type='text' value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder='Название' />
                  <input type='number' value={countNumber} onChange={(e) => setCountNumber(e.target.value)} placeholder='Количество' />
                  <button type='submit'>Добавить</button>
                </form>
              </li>
            )}
          </>
        )}
      </>
      : (
      <p>Выберите место, чтобы увидеть его инвентарь</p>
      )}
      </div>
    </section>
  );
}
