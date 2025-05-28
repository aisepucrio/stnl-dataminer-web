import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type SourceType = 'github' | 'jira' 
// | 'stackoverflow'

interface SourceState {
  value: SourceType
}

const initialState: SourceState = {
  value: 'github',
}

const sourceSlice = createSlice({
  name: 'source',
  initialState,
  reducers: {
    setSource: (state, action: PayloadAction<SourceType>) => {
      state.value = action.payload
    },
  },
})

export const { setSource } = sourceSlice.actions
export default sourceSlice.reducer
