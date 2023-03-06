import React, { useEffect, useState } from 'react';
import c from './Company.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { getPlacesThunk, getInventoryThunk, addInventoryThunk } from './companySlice';
import { getHeadItems, getRecursedPlacesArr } from './companyUtils';
import { Inventory } from './inventory/Inventory';
import { Places } from './places/Places';

export const Company = () => {
  const dispatch = useDispatch();
  //* =================== Инициализация =====================
  const statePlaces = useSelector((state) => state.company.places) || [];
  const stateInventory = useSelector((state) => state.company.inventory) || [];
  useEffect(() => {
    dispatch(getPlacesThunk());
    dispatch(getInventoryThunk());
  }, [dispatch]);

  //* ================= Работа с инвентарем ==================
  const [selectedPlace, setSelectedPlaceId] = useState(null);
  const isThereInventory = stateInventory.filter((item) => item.placeId === selectedPlace);
  const [showAddInventory, setShowAddInventory] = useState(false);
  const [itemName, setItemName] = useState('');
  const [countNumber, setCountNumber] = useState('');
  const handleShowInventory = (e) => {
    e.stopPropagation();
    setSelectedPlaceId(e.target.id);
  };

  //* ================== Работа с местами ====================
  const headItems = getHeadItems(statePlaces);
  const recursedPlaces = getRecursedPlacesArr(statePlaces, headItems, stateInventory);

  // ================= Company FC RETURN =====================
  return (
    <section className={c.company}>
      {/* Места */}
      <div className={c.company__placesWrapper}>
        <h2>Компания</h2>
        <Places nodes={recursedPlaces} 
                handleShowInventory={handleShowInventory} />
      </div>
      {/* Инвентарь */}
      <div className={c.company__inventoryWrapper}>

      {/* Если выбрали место */}
      {selectedPlace ? 
      <>
        <div className={c.company__header}>
          <h2>Инвентарь в {statePlaces.find((place) => place.id === selectedPlace).name}</h2>
          
            {/* Для тех у кого нет дочерних добавляем кнопку ДОБАВИТЬ */}
            {!statePlaces.find((place) => place.id === selectedPlace).parts 
            ? (
              <>
                <button className={c.place__addButton} 
                        type='button' 
                        onClick={() => setShowAddInventory(true)}
                        style={{display: showAddInventory ? 'none' : 'block'}}>
                        Добавить
                </button>
                
                {/* Открытая форма добавления */}
                {showAddInventory && (
                  <div className={c.place__addFormWrapper}>
                    <form onSubmit={(e) => {
                            e.preventDefault();
                            dispatch(addInventoryThunk( itemName, countNumber, selectedPlace));
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
        </div>
        
        {isThereInventory.length > 0
        ? (
          // Если инвентарь есть в комнате
          <>
            <Inventory isThereInventory={isThereInventory} 
                       statePlaces={statePlaces} 
                       selectedPlace={selectedPlace} />
          </>
        ) : (
        // Если инвентаря нет в комнате
          <>
            <p>Здесь ничего нет</p>
            {showAddInventory && (
              <div>
                <form onSubmit={(e) => {
                            e.preventDefault();
                            dispatch(addInventoryThunk( itemName, countNumber, selectedPlace));
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
        )}
      </>
      : (
      <p>Выберите место, чтобы увидеть его инвентарь</p>
      )}
      </div>
    </section>
  );
}
