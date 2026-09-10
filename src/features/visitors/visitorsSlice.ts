import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { visitorService } from '../../api/visitorService';
import type { NewVisitor, Visitor } from '../../types';

interface VisitorsState {
  items: Visitor[];
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
  mutatingIds: string[];
}

const initialState: VisitorsState = {
  items: [],
  status: 'idle',
  error: null,
  mutatingIds: [],
};

export const fetchVisitors = createAsyncThunk('visitors/fetchAll', async (_, { rejectWithValue }) => {
  try {
    return await visitorService.getAll();
  } catch (err) {
    return rejectWithValue((err as Error).message);
  }
});

export const addVisitor = createAsyncThunk(
  'visitors/add',
  async (visitor: NewVisitor, { rejectWithValue }) => {
    try {
      return await visitorService.create(visitor);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const approveVisitor = createAsyncThunk(
  'visitors/approve',
  async (id: string, { rejectWithValue }) => {
    try {
      return await visitorService.approve(id);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const rejectVisitor = createAsyncThunk(
  'visitors/reject',
  async (id: string, { rejectWithValue }) => {
    try {
      return await visitorService.reject(id);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const deleteVisitor = createAsyncThunk(
  'visitors/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await visitorService.remove(id);
      return id;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

const visitorsSlice = createSlice({
  name: 'visitors',
  initialState,
  reducers: {
    clearVisitorsError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVisitors.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchVisitors.fulfilled, (state, action) => {
        state.status = 'idle';
        state.items = action.payload;
      })
      .addCase(fetchVisitors.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Failed to load visitors';
      })
      .addCase(addVisitor.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(addVisitor.rejected, (state, action) => {
        state.error = (action.payload as string) || 'Failed to add visitor';
      })
      .addCase(deleteVisitor.fulfilled, (state, action) => {
        state.items = state.items.filter((v) => v.id !== action.payload);
        state.mutatingIds = state.mutatingIds.filter((id) => id !== action.payload);
      })
      .addCase(deleteVisitor.rejected, (state, action) => {
        state.error = (action.payload as string) || 'Failed to delete visitor';
      })
      .addMatcher(isAnyOf(approveVisitor.pending, rejectVisitor.pending), (state, action) => {
        state.mutatingIds.push(action.meta.arg);
      })
      .addMatcher(isAnyOf(approveVisitor.fulfilled, rejectVisitor.fulfilled), (state, action) => {
        const visitor = action.payload;
        const index = state.items.findIndex((v) => v.id === visitor.id);
        if (index !== -1) state.items[index] = visitor;
        state.mutatingIds = state.mutatingIds.filter((id) => id !== visitor.id);
      })
      .addMatcher(isAnyOf(approveVisitor.rejected, rejectVisitor.rejected), (state, action) => {
        state.error = (action.payload as string) || 'Action failed';
        state.mutatingIds = state.mutatingIds.filter((id) => id !== action.meta.arg);
      });
  },
});

export const { clearVisitorsError } = visitorsSlice.actions;
export default visitorsSlice.reducer;
