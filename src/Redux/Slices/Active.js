import {createSlice} from '@reduxjs/toolkit';

const activeSlice = createSlice({
  name: 'active',
  initialState: {
    values: [],
  },
  reducers: {
    setActiveState: (state, action) => {
      console.log('action', action.payload);
      const item = action.payload;
      if (state.values.includes(item)) {
        state.values = state.values.filter(i => i !== item);
      } else {
        state.values.push(item);
      }
    },
    clearActiveStates: state => {
      state.values = [];
    },
  },
});

export const {setActiveState, clearActiveStates} = activeSlice.actions;

export default activeSlice.reducer;
