import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    items: [],
    loading: false,
}

const slice = createSlice({
    name: 'jobs',
    initialState,
    reducers: {
        setJobs(state, action) {
            state.items = action.payload || []
        },
        addJob(state, action) {
            state.items.unshift(action.payload)
        },
        updateJob(state, action) {
            const idx = state.items.findIndex(j => j.id === action.payload.id)
            if (idx !== -1) state.items[idx] = action.payload
        },
        setLoading(state, action) {
            state.loading = !!action.payload
        }
    }
})

export const { setJobs, addJob, updateJob, setLoading } = slice.actions
export default slice.reducer
