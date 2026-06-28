import { createSlice } from '@reduxjs/toolkit'
import { handleAsync } from '../shared/asyncState'
import {
  createUserThunk,
  deleteUserThunk,
  loadUserById,
  loadUsers,
  updateUserThunk,
} from './usersThunks'

const initialState = {
  items: [],
  current: null,
  loading: false,
  error: null,
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    handleAsync(builder, loadUsers, (state, { payload }) => { state.items = payload })
    handleAsync(builder, loadUserById, (state, { payload }) => { state.current = payload })
    handleAsync(builder, createUserThunk, (state, { payload }) => {
      if (payload?.id) state.items.push(payload)
    })
    handleAsync(builder, updateUserThunk, (state, { payload }) => {
      if (payload?.id) state.items = state.items.map((u) => (u.id === payload.id ? payload : u))
    })
    handleAsync(builder, deleteUserThunk, (state, { payload: id }) => {
      state.items = state.items.filter((u) => u.id !== id)
    })
  },
})

export const selectUsers = (state) => state.users.items
export const selectUsersLoading = (state) => state.users.loading
export const selectUsersError = (state) => state.users.error

export default usersSlice.reducer
