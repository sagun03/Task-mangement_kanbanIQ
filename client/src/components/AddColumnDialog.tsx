import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

interface ColumnFormData {
  name: string;
}

interface AddColumnDialogProps {
  open: boolean;
  onClose: () => void;
  onAddColumn: (columnName: string) => Promise<void>;
}

const AddColumnDialog: React.FC<AddColumnDialogProps> = ({ open, onClose, onAddColumn }) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<ColumnFormData>({
    defaultValues: { name: '' },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: ColumnFormData) => {
    setIsSubmitting(true);
    try {
      await onAddColumn(data.name);
      handleClose();
    } catch (error) {
      console.error('Error adding column:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle sx={{ bgcolor: 'white', color: 'black' }}>Add New Column</DialogTitle>
        <DialogContent sx={{ bgcolor: '#f5f5f5', color: 'black' }}>
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Column name is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                autoFocus
                margin="dense"
                id="name"
                type="text"
                fullWidth
                variant="outlined"
                error={!!errors.name}
                helperText={errors.name?.message}
                sx={{
                  '& .MuiInputBase-root': { bgcolor: 'white', color: 'black' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'black' },
                    '&:hover fieldset': { borderColor: 'gray' },
                    '&.Mui-focused fieldset': { borderColor: 'black' },
                  },
                  '& .MuiFormHelperText-root': { color: 'red' },
                  input: { color: 'black' },
                }}
              />
            )}
          />
        </DialogContent>
        <DialogActions sx={{ bgcolor: 'white' }}>
          <Button onClick={handleClose} sx={{ color: 'black' }}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            disabled={isSubmitting}
            sx={{ bgcolor: 'black', color: 'white', '&:hover': { bgcolor: 'gray' } }}
          >
            {isSubmitting ? 'Adding...' : 'Add Column'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddColumnDialog;
