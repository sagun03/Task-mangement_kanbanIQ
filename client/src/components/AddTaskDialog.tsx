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
  FormRow,
  StyledTextField,
  CancelButton,
  SubmitButton,
} from "./styled/TaskFormElements";

const AddTaskDialog = ({
  open,
  onClose,
  onAddTask,
  users,
  boardId,
  defaultStatus = "To Do",
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    register,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      assignedTo: "",
      status: defaultStatus,
      boardOriginalId: boardId,
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
        <DialogTitle style={{ color: "black", background: "white" }}>
          Create New Task
        </DialogTitle>
        <DialogContent style={{ background: "white", marginTop: "20px" }}>
          <label style={{ color: "black" }}>Task Title</label>
          <StyledTextField
            {...register("title", { required: "Title is required" })}
            autoFocus
            id="title"
            type="text"
            fullWidth
            variant="outlined"
            error={!!errors.title}
            helperText={errors.title?.message}
            style={{ color: "black" }}
            placeholder="Enter a descriptive title"
          />

          <label style={{ color: "black" }}>Description</label>
          <StyledTextField
            {...register("description")}
            id="description"
            multiline
            rows={3}
            fullWidth
            variant="outlined"
            style={{ color: "black" }}
            placeholder="What needs to be done? Add details here..."
          />

          <FormRow>
            <label style={{ color: "black", flex: 1 }}>Priority</label>
            <FormControl fullWidth error={!!errors.priority} sx={{ flex: 3 }}>
              <Controller
                name="priority"
                control={control}
                rules={{ required: "Priority is required" }}
                render={({ field }) => (
                  <Select {...field}>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="low">Low</MenuItem>
                  </Select>
                )}
              />
              <FormHelperText>{errors.priority?.message}</FormHelperText>
            </FormControl>
          </FormRow>

          <FormRow>
            <label style={{ color: "black" }}>Due Date</label>
            <Controller
              name="dueDate"
              control={control}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    value={field.value}
                    onChange={(date) => field.onChange(date)}
                    slotProps={{
                      textField: { fullWidth: true, variant: "outlined" },
                    }}
                  />
                </LocalizationProvider>
              )}
            />
          </FormRow>

          <FormRow>
            <label style={{ color: "black" }}>Assign To</label>
            <FormControl fullWidth error={!!errors.assignedTo}>
              <Controller
                name="assignedTo"
                control={control}
                rules={{ required: "Please assign this task to someone" }}
                render={({ field }) => (
                  <Select {...field}>
                    {users.map((user) => (
                      <MenuItem key={user.userId} value={user.userId}>
                        {user.name || user.email}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              <FormHelperText>{errors.assignedTo?.message}</FormHelperText>
            </FormControl>
          </FormRow>
        </DialogContent>
        <DialogActions style={{ background: "white" }}>
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
