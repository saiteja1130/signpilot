import {configureStore} from '@reduxjs/toolkit';
import activereducer from './Slices/Active';
import loginReducer from './Slices/LoginData';
import AllDataReducer from './Slices/Alldata';
import projectReducer from './Slices/ProjectData';
import signProjectReducer from './Slices/SigProject';
import photoReducer from './Slices/PhotosActive';
import BaseUrl from './Slices/BaseUrl';

export const store = configureStore({
  reducer: {
    active: activereducer,
    login: loginReducer,
    allData: AllDataReducer,
    project: projectReducer,
    signProject: signProjectReducer,
    photoActive: photoReducer,
    baseUrl: BaseUrl,
  },
});
