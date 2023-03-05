import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteInventoryThunk, updateInventoryThunk } from '../companySlice';
import c from './Inventory.module.css';

export const Inventory = (props) => {
  const { selectedPlace, statePlaces, isThereInventory } = props;
  const dispatch = useDispatch();
  const [editItemId, setEditItemId] = useState(null);
  // const [itemName, setItemName] = useState('');
  const [countNumber, setCountNumber] = useState('');

  const handleDeleteInventory = (itemId) => dispatch(deleteInventoryThunk(itemId));
  console.log('isThereInventory: ', isThereInventory);
  return (
    <ul className={c.inventory}>
      {isThereInventory.map((item) => (
        <li className={c.inventory__item} key={item.id}>
          {editItemId === item.id 
          ? (
            <form className={c.inventory__form}
                  onSubmit={(e) => {
                    e.preventDefault();
                    dispatch(updateInventoryThunk(item.id, countNumber));
                    setEditItemId(null);
                    // setItemName('');
                    setCountNumber('');}}>
              {/* <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                // onChange={(e) => handleUpdateInventory(item.id, e.target.value, item.count)}
              /> */}
              <p>Название <span>{item.name}</span></p>
              <input
                type="number"
                value={countNumber}
                onChange={(e) => {
                  setCountNumber(e.target.value)
                  dispatch(updateInventoryThunk(item.id, countNumber));
                }}
                // onChange={(e) => handleUpdateInventory(item.id, item.name, e.target.value)}
              />
              <button type='submit'>Сохранить</button>
            </form>
          ) : (
            <>
              <p>Название <span>{item.name}</span></p>
              <div>
                Количество{" "}
                {statePlaces?.filter((place) => place.id === selectedPlace)[0]?.parts 
                ? (
                  <span>{item.count}</span>
                ) : (
                  <>
                    <span id="itemCount">{item.count}</span>
                    <p className={c.inventory__buttons}>
                      <button
                        className={c.inventory__editButton}
                        type="button"
                        onClick={() => {
                          setEditItemId(item.id)
                          setCountNumber(item.count)
                          // setItemName(item.name)
                        }}
                      > &#9998;</button>
                      <button
                        className={c.inventory__delButton}
                        type="button"
                        onClick={() => handleDeleteInventory(item.id)}
                      >&#10006;</button>
                    </p>
                  </>
                )}
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
};
