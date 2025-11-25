import { configureStore } from '@reduxjs/toolkit'
import jobsReducer from './jobsSlice'

export default configureStore({
    reducer: { jobs: jobsReducer }
})
