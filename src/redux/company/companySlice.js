import { createSlice } from '@reduxjs/toolkit';
import { companyAPI } from '../../api/companyAPI';

const initialState = {
  places: [],
  inventory: [],
  isFetching: false,
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
      state.inventory.unshift(action.payload);
    },
    deleteInventory: (state, action) => {
      state.inventory = state.inventory.filter((item) => item.id !== action.payload);
    },
    updateInventory: (state, action) => {
      state.inventory = state.inventory.map((item) => {
        if (item.id === action.payload.id) {
          return {
            id: item.id, 
            name: item.name, 
            count: action.payload.count, 
            placeId: item.placeId,
          }
        } else {
          return item;
        }
      });
    },
    setIsFetching: (state, action) => {
      state.isFetching = action.payload;
    },
  },
}); 

export const { getPlaces, getInventory, addInventory, deleteInventory, updateInventory, setIsFetching } = companySlice.actions;

export const getPlacesThunk = () => (dispatch) => {
  dispatch(setIsFetching(true));
  return companyAPI.getPlaces()
        .then(response => {
          let docs = response.docs.map(x => {
            const data = x.data()
            return {
              id: x.id,
              name: data.name,
              parts: data.parts && data.parts.map(part => part.id)
            }
          });
          dispatch(getPlaces(docs));
          dispatch(setIsFetching(false));
        })
}
export const getInventoryThunk = () => (dispatch) => {
  return companyAPI.getInventory()
        .then(response => {
          let docs = response.docs.map(x => {
            const data = x.data()
            return {
              id: x.id,
              name: data.name,
              count: data.count,
              placeId: data?.place?.id ?? data.placeId
            }
          });
          dispatch(getInventory(docs));
        });
};
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
    });
};
export const deleteInventoryThunk = (itemId) => (dispatch) => {
  return companyAPI.deleteInventory(itemId)
        .then(() => dispatch(deleteInventory(itemId)));
}
export const updateInventoryThunk = (id, count) => (dispatch) => {
  return companyAPI.updateInventory(id, count)
    .then(() => {
      dispatch(updateInventory({id: id, count: count}));
    });
};


export default companySlice.reducer;
