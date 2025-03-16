import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { IBoard, IUser } from "../types/kanban";

interface InviteUserDialogProps {
  open: boolean;
  onClose: () => void;
  board: IBoard;
  users: IUser[];
  userId: string;
  onInviteUsers: (selectedUsers: IUser[]) => Promise<void>; // Function to invite users
}

const InviteUserDialog: React.FC<InviteUserDialogProps> = ({
  open,
  onClose,
  users,
  onInviteUsers,
  board
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{ selectedUsers: IUser[] }>({
    defaultValues: { selectedUsers: [] },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
console.log("board", board);
  const onSubmit = async (data: { selectedUsers: IUser[] }) => {
    setIsSubmitting(true);
    try {
      await onInviteUsers(data.selectedUsers); // Call API function
      onClose();
    } catch (error) {
      console.error("Error inviting users:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: "white", color: "black" }}>
        Invite Team Members
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ bgcolor: "#f5f5f5", color: "black" }}>
          <Controller
            name="selectedUsers"
            control={control}
            rules={{
              validate: (value) =>
                value.length > 0 || "At least one email must be selected",
            }}
            render={({ field }) => (
              <>
                <Autocomplete
                  multiple
                  options={users.filter((user) => !board.invitedUserIds.includes(user.id || user.userId))}
                  getOptionLabel={(option) => option?.email || ""}
                  value={field.value || []}
                  onChange={(_, newValue) => field.onChange(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Enter email address"
                      error={!!errors.selectedUsers}
                      helperText={errors.selectedUsers?.message}
                    />
                  )}
                  sx={{
                    flex: 1,
                    backgroundColor: "white",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#ced4da" },
                      "&:hover fieldset": { borderColor: "black" },
                      "&.Mui-focused fieldset": { borderColor: "black" },
                    },
                  }}
                />
              </>
            )}
          />
        </DialogContent>
        <DialogActions sx={{ bgcolor: "white" }}>
          <Button onClick={onClose} sx={{ color: "black" }}>
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
            {isSubmitting ? "Inviting..." : "Invite Users"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default InviteUserDialog;
