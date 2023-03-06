import React, { useEffect, useState } from 'react';
import c from './Company.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { getPlacesThunk, getInventoryThunk, addInventoryThunk } from '../../redux/company/companySlice';
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
    if (e.target.closest('#addForm') || e.target.id === 'addFormBtn') return;
      setShowAddInventory(false);
      setItemName('');
      setCountNumber('');
    e.stopPropagation();
    setSelectedPlaceId(e.target.id);
  };

  // Клик на добавить
  const handleRunAddForm = () => {
    const clickListener = (e) => {
      if (e.target.closest('#addForm') || e.target.id === 'addFormBtn') return;
      setShowAddInventory(false);
      setItemName('');
      setCountNumber('');
      document.removeEventListener('click', clickListener);
    };
    document.addEventListener('click', clickListener);
  }

  //* ================== Работа с местами ====================
  const headItems = getHeadItems(statePlaces);
  const recursedPlaces = getRecursedPlacesArr(statePlaces, headItems, stateInventory);

  // ================= Company FC RETURN =====================
  return (
    <section className={`${c.company}`}>
      <h1 className='visually-hidden'>Структура и инвентарь компании</h1>
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
        <div className={c.company__inventoryHeader}>
          <h2>Инвентарь в {statePlaces.find((place) => place.id === selectedPlace).name}</h2>
          
            {/* Для тех у кого нет дочерних добавляем кнопку ДОБАВИТЬ */}
            {!statePlaces.find((place) => place.id === selectedPlace).parts 
            ? (
              <>
                <button className={c.place__addButton} 
                        type='button' 
                        onClick={() => {
                          handleRunAddForm();
                          setShowAddInventory(true);
                        }}
                        style={{display: showAddInventory ? 'none' : 'block'}}
                        id='addFormBtn'>
                        Добавить
                </button>
                
                {/* Открытая форма добавления */}
                {showAddInventory && (
                  <div className={c.place__addFormWrapper}>
                    <form id='addForm' onSubmit={(e) => {
                            e.preventDefault();
                            dispatch(addInventoryThunk( itemName, countNumber, selectedPlace));
                            setShowAddInventory(false);
                            setItemName('');
                            setCountNumber('');
                          }}
                          >
                      <input type='text' 
                              id='addFormNameInput'
                              value={itemName} 
                              required
                              onChange={(e) => setItemName(e.target.value)} 
                              placeholder='Название' />
                      <input type='number' 
                              value={countNumber}
                              required
                              pattern="\d+" 
                              onChange={(e) => setCountNumber(e.target.value)} 
                              placeholder='Количество' />
                      <button type='submit'>Добавить</button>
                      <button className={c.place__closeButton} 
                              type='button' 
                              onClick={() => setShowAddInventory(false)}
                              style={{display: showAddInventory ? 'block' : 'none'}}>
                        Закрыть
                      </button>
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
