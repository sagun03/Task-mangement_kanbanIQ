import styled from 'styled-components';
import { 
  Dialog, 
  DialogTitle as MuiDialogTitle,
  DialogContent as MuiDialogContent,
  DialogActions as MuiDialogActions,
  TextField,
  Button as MuiButton
} from '@mui/material';

export const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    border-radius: 12px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }
`;

export const DialogTitle = styled(MuiDialogTitle)`
  background: linear-gradient(90deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 20px 24px;
  font-size: 1.25rem;
  font-weight: 600;
  color: #343a40;
  border-bottom: 1px solid #e9ecef;
`;

export const DialogContent = styled(MuiDialogContent)`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  
  @media (min-width: 600px) {
    min-width: 500px;
  }
`;

export const DialogActions = styled(MuiDialogActions)`
  padding: 16px 24px;
  border-top: 1px solid #e9ecef;
`;

export const FormGroup = styled.div`
  margin-bottom: 16px;
`;

export const FormRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

export const StyledTextField = styled(TextField)`
  .MuiOutlinedInput-root {
    border-radius: 8px;
    transition: all 0.2s ease;
    
    &:hover .MuiOutlinedInput-notchedOutline {
      border-color: #9b87f5;
    }
    
    &.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: #7E69AB;
      border-width: 2px;
    }
  }
  
  .MuiInputLabel-root {
    &.Mui-focused {
      color: #7E69AB;
    }
  }
`;

export const CancelButton = styled(MuiButton)`
  border-radius: 8px;
  text-transform: none;
  padding: 8px 22px;
  font-weight: 500;
`;

export const SubmitButton = styled(MuiButton)`
  border-radius: 8px;
  text-transform: none;
  padding: 8px 22px;
  font-weight: 500;
  background: linear-gradient(90deg, #9b87f5 0%, #7E69AB 100%);
  box-shadow: 0 4px 12px rgba(123, 97, 255, 0.2);
  
  &:hover {
    background: linear-gradient(90deg, #8b77e5 0%, #6E59A5 100%);
    box-shadow: 0 6px 16px rgba(123, 97, 255, 0.3);
  }
  
  &.Mui-disabled {
    background: #e9ecef;
    color: #adb5bd;
  }
`;
