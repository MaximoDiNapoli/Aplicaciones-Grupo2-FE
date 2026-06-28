import { createApiThunk } from '../shared/createApiThunk'
import {
  createUser,
  deleteUser,
  fetchUserById,
  fetchUsers,
  updateUser,
} from '../../services/api'

// Thunks CRUD de usuarios (GET / POST / PUT / DELETE) vía Axios.
export const loadUsers = createApiThunk('users/fetchAll', (params) => fetchUsers(params))
export const loadUserById = createApiThunk('users/fetchOne', (id) => fetchUserById(id))
export const createUserThunk = createApiThunk('users/create', (payload) => createUser(payload))
export const updateUserThunk = createApiThunk('users/update', ({ id, payload }) => updateUser(id, payload))
export const deleteUserThunk = createApiThunk('users/delete', async (id) => {
  await deleteUser(id)
  return id
})
