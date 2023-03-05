import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteInventoryThunk, updateInventoryThunk } from '../companySlice';
import c from './Inventory.module.css';

export const Inventory = (props) => {
  const { selectedPlace, statePlaces, isThereInventory } = props;
  
  const dispatch = useDispatch();
  const [editItemId, setEditItemId] = useState(null);
  const [count, setCount] = useState('');

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
                    dispatch(updateInventoryThunk(item.id, count));
                    setEditItemId(null)}}>
              <p>Название <span>{item.name}</span></p>
              <input
                type="number"
                value={count}
                onChange={(e) => {
                  setCount(e.target.value)
                  dispatch(updateInventoryThunk(item.id, count));
                }}
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
                          setCount(item.count)
                        }}
                      > &#9998;</button>
                      <button
                        className={c.inventory__delButton}
                        type="button"
                        onClick={() => dispatch(deleteInventoryThunk(item.id))}
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
