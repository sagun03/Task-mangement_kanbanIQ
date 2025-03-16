import React, { useState, useEffect } from "react";
import {
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  Button,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { useForm, Controller } from "react-hook-form";
import {
  StyledDialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  StyledTextField,
} from "./styled/TaskFormElements";
import { useAuth } from "../context/AuthContext";

const AddTaskDialog = ({ open, onClose, onAddTask, users, boardId, defaultStatus = "To Do", board }) => {
    const { user } = useAuth();
  const { control, handleSubmit, reset, formState: { errors }, setValue, register } = useForm({
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      assignedTo: "",
      status: defaultStatus,
      boardOriginalId: boardId,
      assignedBy: user.id,
      createdBy: user.id,
    },
  });

  useEffect(() => {
    setValue("boardOriginalId", boardId);
  }, [boardId, setValue]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    reset();
    onClose();
  };


  const getUser = (userId: string) => {
    return users.find((user) => user.id === userId);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await onAddTask(data);
      handleClose();
    } catch (error) {
      console.error("Error submitting task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <StyledDialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle sx={{ color: "black", background: "white" }}>
          Create New Task
        </DialogTitle>
        <DialogContent sx={{ background: "white", marginTop: "20px" }}>
          <label style={{ color: "black" }}>Task Title</label>
          <StyledTextField
            {...register("title", { required: "Title is required" })}
            autoFocus
            fullWidth
            variant="outlined"
            error={!!errors.title}
            helperText={errors.title?.message}
            placeholder="Enter a descriptive title"
            sx={{
              backgroundColor: "white",
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "black" },
                "&:hover fieldset": { borderColor: "black" },
                "&.Mui-focused fieldset": { borderColor: "black" },
              },
            }}
          />

          <label style={{ color: "black" }}>Description</label>
          <StyledTextField
            {...register("description")}
            multiline
            rows={3}
            fullWidth
            variant="outlined"
            placeholder="What needs to be done? Add details here..."
            sx={{
              backgroundColor: "white",
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "black" },
                "&:hover fieldset": { borderColor: "black" },
                "&.Mui-focused fieldset": { borderColor: "black" },
              },
            }}
          />

          <label style={{ color: "black" }}>Priority</label>
          <FormControl fullWidth error={!!errors.priority} sx={{ borderColor: "black" }}>
            <Controller
              name="priority"
              control={control}
              rules={{ required: "Priority is required" }}
              render={({ field }) => (
                <Select {...field} sx={{
                  backgroundColor: "white",
                 "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "black"
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: 'black',
                    borderWidth: '1.2px'
                  }
                  
                 
                }}>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </Select>
              )}
            />
            <FormHelperText>{errors.priority?.message}</FormHelperText>
          </FormControl>

          <label style={{ color: "black" }}>Due Date</label>
          <Controller
            name="dueDate"
            control={control}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={field.value}
                  onChange={(date) => field.onChange(date)}
                  sx={{
                    backgroundColor: "white",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "black" },
                      "&:hover fieldset": { borderColor: "black" },
                      "&.Mui-focused fieldset": { borderColor: "black" },
                    },
                  }}
                  slotProps={{
                    textField: { fullWidth: true, variant: "outlined" },
                  }}
                />
              </LocalizationProvider>
            )}
          />

          <label style={{ color: "black" }}>Assign To</label>
          <FormControl fullWidth error={!!errors.assignedTo} sx={{ borderColor: "black" }}>
            <Controller
              name="assignedTo"
              control={control}
              rules={{ required: "Please assign this task to someone" }}
              render={({ field }) => (
                <Select {...field} sx={{
                  backgroundColor: "white",
                 "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "black"
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: 'black',
                    borderWidth: '1.2px'
                  }
                  
                }}>
                   {board?.acceptedUserIds?.map((id) => {
                    const user = getUser(id);
                    const value = user?.name || user?.email ;
                    return <MenuItem key={user.id} value={id}>{value}</MenuItem>;
                  })}
                </Select>
              )}
            />
            <FormHelperText>{errors.assignedTo?.message}</FormHelperText>
          </FormControl>
        </DialogContent>

        <DialogActions sx={{ background: "white" }}>
          <Button onClick={handleClose} sx={{ color: "black" }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{
              bgcolor: "black",
              color: "white",
              "&:hover": { bgcolor: "gray" },
            }}
          >
            {isSubmitting ? "Creating..." : "Create Task"}
          </Button>
        </DialogActions>
      </form>
    </StyledDialog>
  );
};

export default AddTaskDialog;
