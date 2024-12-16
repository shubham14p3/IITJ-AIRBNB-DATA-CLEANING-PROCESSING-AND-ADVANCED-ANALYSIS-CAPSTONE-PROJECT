// src/slice/uniqueUpdateValuesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "../components/Constant";
 // Replace with your actual base URL

export const fetchUniqueValues = createAsyncThunk(
    "uniqueUpdateValues/fetchUniqueValues",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BASE_URL}/api/fetch-last-records`);
            if (!response.ok) {
                throw new Error("Failed to fetch unique values");
            }
            const data = await response.json();
            if (data.status) {
                return data.data; // Assuming unique values are in `data.data`
            } else {
                throw new Error(data.message || "Failed to fetch unique values");
            }
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

const uniqueUpdateValuesSlice = createSlice({
    name: "uniqueUpdateValues",
    initialState: {
        uniqueValues: {},
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUniqueValues.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUniqueValues.fulfilled, (state, action) => {
                state.loading = false;
                state.uniqueValues = action.payload;
            })
            .addCase(fetchUniqueValues.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default uniqueUpdateValuesSlice.reducer;
