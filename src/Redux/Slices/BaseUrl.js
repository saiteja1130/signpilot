import {createSlice} from '@reduxjs/toolkit';

const baseUrlSlice = createSlice({
  name: 'baseUrl',
  initialState: {
    value: 'https://xhtmlreviews.in/mysignpilot/api',
  },
  reducers: {}, 
});

export default baseUrlSlice.reducer;
