import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { MdAdd, MdArrowBack, MdDelete } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import api from '../config/axiosInstance';
import { styled } from '@mui/system';
import "@fontsource/open-sans/600.css";

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  priority: string;
  boardOriginalId: string;
}

// Add a type for valid status values
type TaskStatus = 'To Do' | 'In Progress' | 'Completed';

const STATUS_OPTIONS = ['To Do', 'In Progress', 'Completed'];
const PRIORITY_OPTIONS = ['low', 'medium', 'high'];

const TaskCard = styled(Card)({
  height: '100%',
  display: "flex",
  fontFamily: 'Open Sans',
  flexDirection: "column",
  position: "relative",
  backgroundColor: "#ffffff",
  transition: "all 0.2s ease-in-out",
  boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
  borderRadius: "16px",
  border: "none",
  cursor: "pointer",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 12px 24px rgba(0,0,0,0.08)",
  }
});

const DeleteButton = styled(IconButton)({
  position: "absolute",
  top: 12,
  right: 12,
  color: "#000000",
  opacity: 0.5,
  transition: "all 0.2s ease",
  padding: "8px",
  "&:hover": {
    backgroundColor: "rgba(246, 245, 255, 0.1)",
    opacity: 1,
    color: "#ff3b30",
  },
});

const EditButton = styled(IconButton)({
  position: "absolute",
  top: 12,
  right: 48, // Position it next to delete button
  color: "#000000",
  opacity: 0.5,
  transition: "all 0.2s ease",
  padding: "8px",
  "&:hover": {
    backgroundColor: "rgba(246, 245, 255, 0.1)",
    opacity: 1,
    color: "#2563eb",
  },
});

const MyTasks: React.FC = () => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const navigate = useNavigate();
  const { getTasksByUserId } = useKanban();
  const { user } = useAuth();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await getTasksByUserId(user.id);
      setTasks(response)
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter(task => task.id !== taskId));
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task');
    }
  };

  // Add handler functions for editing
  const handleStartEdit = (task: Task) => {
    setEditingTask(task);
    setEditedTitle(task.title);
    setEditedDescription(task.description);
    setEditedStatus(task.status);
    setEditedPriority(task.priority);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setEditedTitle('');
    setEditedDescription('');
    setEditedStatus('');
    setEditedPriority('');
  };

  const handleSaveEdit = async (taskId: string) => {
    try {
      const updatedTaskData = {
        title: editedTitle,
        description: editedDescription,
        status: editedStatus,
        priority: editedPriority
      };

      const response = await api.put(`/tasks/${taskId}`, updatedTaskData);

      if (response.status === 200) {
        // Update local state
        setTasks(prevTasks => 
          prevTasks.map(task => 
            (task.id === taskId || task._id === taskId) 
              ? { ...task, ...updatedTaskData }
              : task
          )
        );
        handleCancelEdit();
      }
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task');
    }
  };

  // Update the getStatusColor function
  const getStatusColor = (status: string): string => {
    const colors: Record<TaskStatus, string> = {
      'To Do': '#e5e7eb',
      'In Progress': '#fef3c7',
      'Completed': '#d1fae5'
    };

    return colors[status as TaskStatus] || '#e5e7eb';
  };

  return (
    <Box sx={{ p: 4, bgcolor: "#f8fafa", minHeight: "100vh" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 5,
        }}
      >
        <Box>
          <Typography 
            variant="h4" 
            sx={{ 
              color: "#000000", 
              fontWeight: 700,
              letterSpacing: "-0.5px",
              mb: 2
            }}
          >
            My Tasks
          </Typography>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '400px' 
        }}>
          <Typography sx={{ 
            color: "#666666",
            fontSize: '1.1rem'
          }}>
            Loading your tasks...
          </Typography>
        </Box>
      ) : error ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '400px' 
        }}>
          <Typography color="error" sx={{ fontSize: '1.1rem' }}>
            {error}
          </Typography>
        </Box>
      ) : tasks.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            background: 'linear-gradient(to bottom, #ffffff, #f8fafa)',
            borderRadius: 4,
            py: 8,
          }}
        >
          <Box sx={{ 
            width: 80, 
            height: 80, 
            bgcolor: '#f8fafa',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3
          }}>
            <MdAdd style={{ fontSize: '40px', color: '#666666' }} />
          </Box>
          <Typography 
            variant="h5" 
            sx={{ 
              color: "#000000", 
              fontWeight: 600,
              mb: 2
            }}
          >
            No tasks yet
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: "#666666",
              mb: 4,
              textAlign: 'center',
              maxWidth: '400px'
            }}
          >
            Create your first task to start tracking your work
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {tasks.map((task) => (
            <Grid item xs={12} sm={6} md={4} key={task.id}>
<<<<<<< HEAD
              <TaskCard>
                <EditButton
                  onClick={() => handleStartEdit(task)}
                  aria-label="edit"
                >
                  <MdEdit />
                </EditButton>
=======
              <TaskCard onClick={() => navigate(`/kanban-board/tasks/${task.id}`)}>
>>>>>>> 809f8b32e89f317cb5517c445ca024250cfef6e8
                <DeleteButton
                  onClick={(e) => {
                    e.stopPropagation();
                    setTaskToDelete(task);
                    setDeleteDialogOpen(true);
                  }}
                  aria-label="delete"
                >
                  <MdDelete />
                </DeleteButton>
                <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={task.status}
                      size="small"
                      sx={{
                        bgcolor: getStatusColor(task.status),
                        color: '#000000',
                        fontWeight: 500,
                        fontSize: '0.75rem'
                      }}
                    />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ 
                      color: "#000000", 
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      mb: 2 
                    }}
                  >
                    {task.title}
                  </Typography>
                  {task.description && (
                    <Typography
                      variant="body2"
                      sx={{ 
                        color: "#666666",
                        mb: 'auto'
                      }}
                    >
                      {task.description}
                    </Typography>
                  )}
                  <Box sx={{ 
                    mt: 3, 
                    pt: 2, 
                    borderTop: '1px solid rgba(0,0,0,0.08)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <Typography
                      variant="caption"
                      sx={{ 
                        color: "#999999",
                        fontSize: '0.75rem'
                      }}
                    >
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </Typography>
                    <Chip
                      label={task.priority}
                      size="small"
                      sx={{
                        bgcolor: task.priority === 'high' ? '#fee2e2' :
                               task.priority === 'medium' ? '#fef3c7' :
                               '#ecfdf5',
                        color: task.priority === 'high' ? '#dc2626' :
                              task.priority === 'medium' ? '#d97706' :
                              '#059669',
                        fontWeight: 500,
                        fontSize: '0.75rem'
                      }}
                    />
                  </Box>
                </CardContent>
              </TaskCard>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: 400,
            borderRadius: 2,
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          Delete Task
        </DialogTitle>
        <DialogContent sx={{ py: 2 }}>
          <Typography>
            Are you sure you want to delete "{taskToDelete?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ 
              color: '#666666',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.05)'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => taskToDelete && handleDeleteTask(taskToDelete.id!)}
            sx={{
              bgcolor: '#dc2626',
              color: 'white',
              '&:hover': {
                bgcolor: '#b91c1c'
              }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={!!editingTask} 
        onClose={handleCancelEdit}
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: 500,
            borderRadius: 2,
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          Edit Task
        </DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              fullWidth
              label="Title"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={editedStatus}
                label="Status"
                onChange={(e) => setEditedStatus(e.target.value)}
              >
                {STATUS_OPTIONS.map(status => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={editedPriority}
                label="Priority"
                onChange={(e) => setEditedPriority(e.target.value)}
              >
                {PRIORITY_OPTIONS.map(priority => (
                  <MenuItem key={priority} value={priority}>{priority}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={handleCancelEdit}
            sx={{ 
              color: '#666666',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.05)'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => editingTask && handleSaveEdit(editingTask.id)}
            sx={{
              bgcolor: 'black',
              color: 'white'
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyTasks;