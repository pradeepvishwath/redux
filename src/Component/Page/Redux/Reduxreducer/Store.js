import rootReducer from "./Reduxindex";
import { configureStore } from "@reduxjs/toolkit";

export const Store = configureStore({ 
    reducer: rootReducer
 });