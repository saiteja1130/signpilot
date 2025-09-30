import {createSlice} from '@reduxjs/toolkit';

const AllDataSlicer = createSlice({
  name: 'allData',
  initialState: {
    value: [],
  },
  reducers: {
    addData: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const {addData} = AllDataSlicer.actions;
export default AllDataSlicer.reducer;
