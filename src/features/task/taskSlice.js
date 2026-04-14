import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as taskService from "../task/taskService";

const initialState = {
  tasks: [],
  task: null,
  isSuccess: false,
  isLoading: false,
  isError: false,
  message: "",
  createSuccess: false,
  fetchSuccess: false,
};

export const createTask = createAsyncThunk(
  "task/create",
  async (taskData, thunkAPI) => {
    try {
      return await taskService.createTask(taskData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          error.message?.data?.message,
      );
    }
  },
);

export const getAllTasks = createAsyncThunk(
  "task/getAll",
  async (_, thunkAPI) => {
    try {
      return await taskService.getAllTasks();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const deleteTask = createAsyncThunk(
  "task/delete",
  async (id, thunkAPI) => {
    try {
      return await taskService.deleteTask(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const updateTask = createAsyncThunk(
  "task/update",
  async ({ id, data }, thunkAPI) => {
    try {
      return await taskService.updateTask(id, data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    resetTaskState: (state) => {
      state.isSuccess = false;
      state.isLoading = false;
      ((state.isError = false),
        (state.message = ""),
        (state.createSuccess = false),
        (state.fetchSuccess = false));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.createSuccess = true;
        state.tasks.unshift(action.payload.data);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      //getall tasks
      .addCase(getAllTasks.pending, (state) => {
        state.isLoading = true;
        state.fetchSuccess = false;
      })
      .addCase(getAllTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.fetchSuccess = true; // Fetch specific success
        state.tasks = action.payload.data;
      })
      .addCase(getAllTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      //delete
      .addCase(deleteTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        ((state.isLoading = false),
          (state.tasks = state.tasks.filter(
            (task) => task._id !== action.meta.arg,
          )));
      })
      .addCase(deleteTask.rejected, (state, action) => {
        ((state.isLoading = false),
          (state.isError = true),
          (state.message = action.payload));
      })

      //update task
      .addCase(updateTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = state.tasks.map((task) =>
          task._id === action.payload.data._id ? action.payload.data : task,
        );
      })
      .addCase(updateTask.rejected, (state, action) => {
        ((state.isLoading = false),
          (state.isError = true),
          (state.message = action.payload));
      });
  },
});

export const { resetTaskState } = taskSlice.actions;
export default taskSlice.reducer;
