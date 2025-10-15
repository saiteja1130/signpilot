import {createSlice} from '@reduxjs/toolkit';

const activeSlice = createSlice({
  name: 'active',
  initialState: {
    value: [],
  },
  reducers: {
    setActiveState: (state, action) => {
      const item = action.payload;
      const index = state.value.indexOf(item);
      if (index >= 0) {
        state.value.splice(index, 1);
      } else {
        state.value.push(item);
      }
    },
    resetActive: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const {setActiveState, resetActive} = activeSlice.actions;
export default activeSlice.reducer;
