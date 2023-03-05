import { createSlice } from '@reduxjs/toolkit';
import { companyAPI } from './companyAPI';

const initialState = {
  places: [],
  inventory: [],
};

export const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    getPlaces: (state, action) => {
      state.places = action.payload;
    },
    getInventory: (state, action) => {
      state.inventory = action.payload;
    },
    addInventory: (state, action) => {
      console.log('Это в экшене: ', action.payload);
      state.inventory.unshift(action.payload);
    },
    deleteInventory: (state, action) => {
      state.inventory = state.inventory.filter((item) => item.id !== action.payload);
      console.log('При удалении, в редюсере action.payload: ', action.payload);
      console.log('При удалении, в редюсере state.inventory: ', state.inventory);
    },
    updateInventory: (state, action) => {
      console.log('Редюсер редактор!', action.payload);
      state.inventory = state.inventory.map((item) => {
        if (item.id === action.payload.id) {
          console.log('Совпало item.id === action.id в редюсере: ', action.payload.id);
          return {
            ...item,
            count: action.payload.count
          };
        } else {
          return item;
        }
      });
    },
    
  },
}); 

export const { getPlaces, getInventory, addInventory, deleteInventory, updateInventory } = companySlice.actions;

export const getPlacesThunk = () => (dispatch) => {
  return companyAPI.getPlaces()
        .then(response => {
          let docs = response.docs.map(x => {
            const data = x.data()
            // console.log('x.data(): ', x.data());
            return {
              id: x.id,
              name: data.name,
              parts: data.parts && data.parts.map(part => part.id)
            }
          });
          dispatch(getPlaces(docs));
        })
}
export const getInventoryThunk = () => (dispatch) => {
  return companyAPI.getInventory()
        .then(response => {
          let docs = response.docs.map(x => {
            const data = x.data()
            console.log('x.data(): ', x.data());
            return {
              id: x.id,
              name: data.name,
              count: data.count,
              placeId: data?.place?.id ?? data.placeId
            }
          });
          console.log(docs);
          dispatch(getInventory(docs));
        });
}
// export const addInventoryThunk = ( name, count, placeId) => (dispatch) => {
//   return companyAPI.addInventory( name, count, placeId )
//         .then(() => dispatch(addInventory({ name, count, placeId })));
// }
export const addInventoryThunk = (name, count, placeId) => (dispatch) => {
  return companyAPI.addInventory(name, count, placeId)
    .then((generatedId) => {
      const newItem = {
        id: generatedId,
        name: name,
        count: count,
        placeId: placeId
      };
      dispatch(addInventory(newItem));
      console.log('Это в санке: ', newItem);
    });
};
export const deleteInventoryThunk = (itemId) => (dispatch) => {
  console.log('При удалении, в санке itemId: ', itemId);
  return companyAPI.deleteInventory(itemId)
        .then(() => dispatch(deleteInventory(itemId)));
}
export const updateInventoryThunk = (id, count) => (dispatch) => {
  console.log('При редактировании, itemId: ', id);
  return companyAPI.updateInventory(id, count)
    .then(() => dispatch(updateInventory({ id, count })));
};


export default companySlice.reducer;
