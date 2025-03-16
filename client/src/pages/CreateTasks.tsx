import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  Container,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  SelectChangeEvent,
  IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../config/axiosInstance';
import { MdArrowBack } from 'react-icons/md';

interface Board {
  id: string;
  name: string;
}

interface TaskFormData {
  title: string;
  description: string;
  priority: string; // Will use default "medium"
  dueDate: string;
  assignedTo: string; // Will use default current userId
  assignedBy: string; // Will use default current userId
  status: string;
  createdBy: string; // Will use current userId
  boardOriginalId: string;
}

const STATUS_OPTIONS = ['To Do', 'In Progress', 'Done'];

const Tasks: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('To Do');
  const [boardId, setBoardId] = useState('');
  const [boards, setBoards] = useState<Board[]>([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchBoards();
  }, [user?.userId]);

  const fetchBoards = async () => {
    try {
      const response = await api.get('/boards');
      if (Array.isArray(response.data)) {
        const userBoards = response.data.filter(board => board.adminId === user?.userId);
        setBoards(userBoards);
        if (userBoards.length > 0) {
          setBoardId(userBoards[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching boards:', error);
      setError('Failed to fetch boards');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !boardId || !dueDate || !status) {
      setError('Please fill in all required fields');
      return;
    }

    if (!user?.userId) {
      setError('You must be logged in to create a task');
      return;
    }

    try {
      // Format the date to ISO string
      const formattedDate = new Date(dueDate).toISOString();

      const taskData: TaskFormData = {
        title: title.trim(),
        description: description.trim(),
        priority: 'medium',
        dueDate: formattedDate,
        assignedTo: user.userId,
        assignedBy: user.userId,
        status: status,
        createdBy: user.userId,
        boardOriginalId: boardId
      };

      // Log the data being sent
      console.log('Sending task data:', taskData);

      const response = await api.post('/tasks', taskData);
      
      if (response.status === 201 && response.data) {
        navigate('/dashboard/tasks');
      } else {
        throw new Error('Failed to create task');
      }
    } catch (error: any) {
      console.error('Error creating task:', error);
      setError(error.response?.data?.message || 'Failed to create task');
    }
  };

  return (
    <Container maxWidth="lg">
      {/* Back Button */}
      <Box sx={{ mt: 2, mb: 2, display: 'flex', alignItems: 'center' }}>
        <IconButton 
          onClick={() => navigate('/dashboard')}
          sx={{ color: '#0e182b', mr: 1 }}
        >
          <MdArrowBack />
        </IconButton>
        <Typography variant="h6" sx={{ color: '#0e182b' }}>
          Back to Dashboard
        </Typography>
      </Box>

      <Card sx={{ p: 4, boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', borderRadius: 2 }}>
        <Typography fontWeight="bold" gutterBottom sx={{fontSize: "25px", fontFamily: 'Open Sans', textAlign: "left", marginBottom: 3 }}>
          Create New Task
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Left Column */}
            <Grid item xs={12} md={6}>
              {/* Task Title */}
              <Box mb={3}>
                <Typography variant="body1" fontWeight="bold" mb={1} sx={{ fontFamily: 'Open Sans', textAlign: "left" }}>
                  Task Title*
                </Typography>
                <TextField
                  fullWidth
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter task title"
                  sx={{
                    backgroundColor: 'white',
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#ced4da' },
                      '&:hover fieldset': { borderColor: '#000000' },
                      '&.Mui-focused fieldset': { borderColor: '#000000' },
                    },
                  }}
                />
              </Box>

              {/* Description */}
              <Box mb={3}>
                <Typography variant="body1" fontWeight="bold" mb={1} sx={{ fontFamily: 'Open Sans', textAlign: "left" }}>
                  Description
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter task description"
                  sx={{
                    backgroundColor: 'white',
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#ced4da' },
                      '&:hover fieldset': { borderColor: '#000000' },
                      '&.Mui-focused fieldset': { borderColor: '#000000' },
                    },
                  }}
                />
              </Box>
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} md={6}>
              {/* Due Date */}
              <Box mb={3}>
                <Typography variant="body1" fontWeight="bold" mb={1} sx={{ fontFamily: 'Open Sans', textAlign: "left" }}>
                  Due Date*
                </Typography>
                <TextField

                  fullWidth
                  required
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  sx={{
                    backgroundColor: 'white',
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#ced4da' },
                      '&:hover fieldset': { borderColor: '#000000' },
                      '&.Mui-focused fieldset': { borderColor: '#000000' },
                    },
                  }}
                />
              </Box>

              {/* Status Selection */}
              <Box mb={3}>
                <Typography variant="body1" fontWeight="bold" mb={1} sx={{ fontFamily: 'Open Sans', textAlign: "left" }}>
                  Status*
                </Typography>
                <FormControl fullWidth required>
                  <Select
                    value={status}
                    onChange={(e: SelectChangeEvent) => setStatus(e.target.value)}
                    sx={{
                      backgroundColor: 'white',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#ced4da' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#000000' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#000000' },
                    }}
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Board Selection */}
              <Box mb={3}>
                <Typography variant="body1" fontWeight="bold" mb={1} sx={{ fontFamily: 'Open Sans', textAlign: "left" }}>
                  Select Board*
                </Typography>
                <FormControl fullWidth required>
                  <Select
                    value={boardId}
                    onChange={(e: SelectChangeEvent) => setBoardId(e.target.value)}
                    sx={{
                      backgroundColor: 'white',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#ced4da' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#000000' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#000000' },
                    }}
                  >
                    {boards.map((board) => (
                      <MenuItem key={board.id} value={board.id}>
                        {board.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            {/* Error Message */}
            {error && (
              <Grid item xs={12}>
                <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
              </Grid>
            )}

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/dashboard')}
                  sx={{ 
                    color: '#000000',
                    borderColor: '#000000',
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: '#000000',
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ 
                    bgcolor: '#000000',
                    textTransform: 'none',
                    '&:hover': {
                      bgcolor: '#333333',
                    },
                  }}
                >
                  Create Task
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Card>
    </Container>
  );
};

export default Tasks;