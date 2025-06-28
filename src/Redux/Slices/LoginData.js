import {createSlice} from '@reduxjs/toolkit';

const loginSlicer = createSlice({
  name: 'loginData',
  initialState: {
    value: {},
  },
  reducers: {
    addLoginData: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const {addLoginData} = loginSlicer.actions;
export default loginSlicer.reducer;
