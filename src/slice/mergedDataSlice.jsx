import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "../components/Constant";

// Fetch merged data
export const fetchMergedData = createAsyncThunk(
  "mergedData/fetchMergedData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/fetch-from-rds`);
      if (!response.ok) throw new Error("Failed to fetch merged data");
      const result = await response.json();
      return result.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Load data to RDS
export const loadDataToRDS = createAsyncThunk(
  "mergedData/loadDataToRDS",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/upload-merged-data`);
      if (!response.ok) throw new Error("Failed to upload data to RDS");
      const result = await response.json();
      if (!result.status) throw new Error(result.message || "Upload failed");
      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const mergedDataSlice = createSlice({
  name: "mergedData",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMergedData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMergedData.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchMergedData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loadDataToRDS.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadDataToRDS.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(loadDataToRDS.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default mergedDataSlice.reducer;
