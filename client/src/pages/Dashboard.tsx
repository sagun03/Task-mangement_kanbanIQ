import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  IconButton,
  Drawer,
  List as MuiList,
  ListItemIcon,
  ListItemButton,
  createTheme,
  ThemeProvider,
  CssBaseline,
  useMediaQuery,
  Chip,
  TextField,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { MdAdd, MdNavigateNext, MdNavigateBefore, MdSave, MdClose, MdEdit } from "react-icons/md";
import "@fontsource/open-sans/600.css";
import { useAuth } from "../context/AuthContext";
import api from "../config/axiosInstance";
import SkeletonLoader from "../components/SkeletonLoader";
import { IBoard } from "../types/kanban";

const drawerWidth = 280;

const theme = createTheme({
  typography: {
    fontFamily: "'Open Sans', sans-serif",
    fontWeightRegular: 400,
  },
});

const StyledDrawer = styled(Drawer)({
  width: drawerWidth,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    boxSizing: "border-box",
    backgroundColor: "#f8fafa",
    boxShadow: "0px 0 6px -2px rgba(0, 0, 0, 0.1)",
  },
});

const SearchBar = styled(Paper)(({ theme }) => ({
  padding: "2px 4px",
  display: "flex",
  alignItems: "center",
  width: "100%",
  maxWidth: 400,
  border: "1px solid #e0e0e0",
  borderRadius: "8px",
  boxShadow: "none",
  [theme.breakpoints.down("sm")]: {
    maxWidth: "100%",
  },
}));

const BoardCard = styled(Card)({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  cursor: "pointer",
  backgroundColor: "#ffffff",
  transition: "all 0.2s ease-in-out",
  border: "1px solid rgba(0,0,0,0.08)",
  borderRadius: "12px",
  boxShadow: "none",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 16px rgba(0,0,0,0.06)",
  },
});

const TaskColumn = styled(Paper)(({ theme }) => ({
  padding: 16,
  borderRadius: 8,
  height: "96%",
  [theme.breakpoints.down("sm")]: {
    marginBottom: theme.spacing(2),
  },
}));

const StyledButton = styled(Button)(({ variant }) => ({
  textTransform: "none",
  px: 3,
  py: 1.5,
  borderRadius: 2,
  ...(variant === "contained"
    ? {
        backgroundColor: "#0e182b",
        color: "white",
        "&:hover": {
          backgroundColor: "#1a2537",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        },
      }
    : {
        color: "#0e182b",
        borderColor: "#0e182b",
        "&:hover": {
          borderColor: "#0e182b",
          backgroundColor: "rgba(14, 24, 43, 0.04)",
        },
      }),
}));

interface Board {
  id: string;
  name: string;
  adminId: string;
  invitedUserIds: string[];
  columnNames: string[];
  createdAt: string;
  updatedAt: string;
}

// Update the Task interface
interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  priority: string;
  boardOriginalId: string;
  createdBy: string;
}

interface ActivityItem {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
}

export default function Dashboard() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const [columns, setColumns] = useState<string[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [tasksError, setTasksError] = useState("");

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await api.get("/boards");
        if (Array.isArray(response.data)) {
          // Filter boards where adminId matches user's uid
          const userBoards = response.data.filter(
            (board) => board.adminId === user?.id || board.acceptedUserIds.includes(user?.id)
          );
          setBoards(userBoards);
          setColumns(userBoards.map((board) => board.columnNames).flat());
          console.log(boards, columns);
        } else {
          setError("Invalid response format");
        }
      } catch (error) {
        console.error("Error fetching boards:", error);
        setError("Failed to fetch boards");
      } finally {
        setLoading(false);
      }
    };

    const fetchTasks = async () => {
      try {
        const response = await api.get("/tasks");
        if (Array.isArray(response.data)) {
          // Filter tasks created by the current user
          const userTasks = response.data.filter(
            (task) => task.createdBy === user?.userId
          );
          setTasks(userTasks);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setTasksError("Failed to fetch tasks");
      } finally {
        setTasksLoading(false);
      }
    };
    console.log(user);
    if (user?.userId) {
      fetchBoards();
      fetchTasks();
    }
  }, [user?.userId]);

  // Add these handler functions in your component
  const handleStartEdit = (task: Task) => {
    setEditingTask(task);
    setEditedTitle(task.title);
    setEditedPriority(task.priority);
  };
  
  const handleCancelEdit = () => {
    setEditingTask(null);
    setEditedTitle('');
    setEditedPriority('');
  };
  
  const handleSaveEdit = async (taskId: string) => {
    try {
      const response = await api.put(`/tasks/${taskId}`, {
        title: editedTitle,
        priority: editedPriority
      });
  
      if (response.status === 200) {
        // Update local state
        setTasks(tasks.map(task => 
          task.id === taskId 
            ? { ...task, title: editedTitle, priority: editedPriority }
            : task
        ));
        handleCancelEdit();
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent, taskId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      try {
        const response = await api.put(`/tasks/${taskId}`, {
          title: editedTitle,
          priority: editedPriority
        });
    
        if (response.status === 200) {
          setTasks(tasks.map(task => 
            task.id === taskId 
              ? { ...task, title: editedTitle, priority: editedPriority }
              : task
          ));
          handleCancelEdit();
        }
      } catch (error) {
        console.error('Error updating task:', error);
      }
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const activities: ActivityItem[] = [
    {
      id: "1",
      user: "John",
      action: "updated",
      target: "Homepage Design",
      timestamp: "2 hours ago",
    },
    {
      id: "2",
      user: "Emma",
      action: "commented on",
      target: "API Integration",
      timestamp: "5 hours ago",
    },
  ];
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", bgcolor: "#f8fafa" }}>
        <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: "#f8fafa" }}>
          <Box
            sx={{
              mb: 4,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              alignContent: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography
              sx={{
                mb: 3,
                fontSize: "30px",
                fontWeight: "800",
                alignItems: "center",
                textAlign: "left",
              }}
            >
              Welcome back, {user?.name || user?.email}!
            </Typography>

            <Button
              variant="contained"
              sx={{
                color: "#ffffff",
                height: "60px",
                bgcolor: "#0e182b",
                textTransform: "none",
                px: 3,
                py: 1.5,
                borderRadius: 2,
                "&:hover": {
                  bgcolor: "#1a2537",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                },
              }}
              startIcon={<MdAdd />}
              onClick={() => navigate("/createboard")}
            >
              Create Board
            </Button>
            {/* <Button
              variant="outlined"
              sx={{
                color: "#0e182b",
                borderColor: "#0e182b",
                textTransform: "none",
                px: 3,
                py: 1.5,
                borderRadius: 2,
                "&:hover": {
                  borderColor: "#0e182b",
                  bgcolor: "rgba(14, 24, 43, 0.04)",
                },
              }}
              startIcon={<MdAdd />}
              onClick={() => navigate("/createtask")}
            >
              Add Task
            </Button> */}
          </Box>

          <Typography
            variant="h6"
            sx={{ mb: 2, color: "#0e182b", textAlign: "left" }}
          >
            Active Boards
          </Typography>
          {loading ? (
            <Box sx={{ display: "flex", gap: "20px", mb: 4 }}>
              {[1, 2, 3].map((_, index) => (
                <Box
                  key={index}
                  width="100%"
                  sx={{
                    background: "#fff",
                    borderRadius: "10px",
                    padding: "15px",
                  }}
                >
                  <SkeletonLoader count={1} width="80%" title />
                </Box>
              ))}
            </Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : boards.length === 0 ? (
            <Grid container justifyContent="center">
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                    py: 4,
                    px: 3,
                    bgcolor: "white",
                    borderRadius: 2,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    mb: 4,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h6" sx={{ color: "#666" }}>
                    No boards found
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#888" }}>
                    Create a new board to get started with your projects
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={4} sx={{ mb: 4 }}>
              {boards
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .map((board) => (
                  <Grid item xs={12} sm={6} md={4} key={board.id}>
                    <BoardCard
                      onClick={() => navigate(`/kanban-board/${board.id}`)}
                    >
                      <CardContent>
                        <Typography
                          variant="h6"
                          sx={{ color: "#0e182b", fontWeight: "bold" }}
                        >
                          {board.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#0e182b" }}>
                          Created At: {new Date(board.createdAt).toDateString()}
                        </Typography>
                      </CardContent>
                    </BoardCard>
                  </Grid>
                ))}
            </Grid>
          )}

          <Grid container spacing={3} sx={{ mb: 4 }}>
            {["To Do", "In Progress", "Done"].map((status) => (
              <Grid item xs={12} sm={6} md={3.6} key={status}>
                <TaskColumn>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                      pb: 2,
                      borderBottom: "1px solid rgba(0,0,0,0.1)",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#0e182b",
                        fontWeight: 600,
                      }}
                    >
                      {status}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#666666",
                        bgcolor: "rgba(0,0,0,0.05)",
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                      }}
                    >
                      {tasks.filter((task) => task.status === status).length}
                    </Typography>
                  </Box>
                  {tasksLoading ? (
                    <>
                      {[1].map((_, index) => (
                        <Box
                          key={index}
                          width="100%"
                          sx={{
                            background: "#fff",
                            borderRadius: "10px",
                            margin: "5px",
                            padding: "20px",
                          }}
                        >
                          <SkeletonLoader count={4} width="80%" title />
                        </Box>
                      ))}
                    </>
                  ) : tasksError ? (
                    <Typography
                      color="error"
                      sx={{ textAlign: "center", py: 2 }}
                    >
                      {tasksError}
                    </Typography>
                  ) : (
                    <Box sx={{ minHeight: 200 }}>
                      {tasks
                        .filter((task) => task.status === status)
                        .map((task) => (
                          <Card
                            key={task.id}
                            sx={{
                              mb: 2,
                              border: "1px solid rgba(0,0,0,0.1)",
                              boxShadow: "none",
                              position: "relative",
                              "&:hover": {
                                boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
                                "& .edit-actions": {
                                  opacity: 1,
                                },
                              },
                            }}
                          >
                            <CardContent sx={{ p: 2 }}>
                              {editingTask?.id === task.id ? (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                  <TextField
                                    fullWidth
                                    value={editedTitle}
                                    onChange={(e) => setEditedTitle(e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(e, task.id)}
                                    size="small"
                                    autoFocus
                                  />
                                  <FormControl size="small" fullWidth>
                                    <Select
                                      value={editedPriority}
                                      onChange={(e) => setEditedPriority(e.target.value)}
                                      onKeyDown={(e) => handleKeyDown(e, task.id)}
                                    >
                                      <MenuItem value="high">High</MenuItem>
                                      <MenuItem value="medium">Medium</MenuItem>
                                      <MenuItem value="low">Low</MenuItem>
                                    </Select>
                                  </FormControl>
                                  <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
                                    Press Enter to save or Escape to cancel
                                  </Typography>
                                </Box>
                              ) : (
                                <>
                                  <Typography
                                    sx={{
                                      color: "#0e182b",
                                      fontWeight: 500,
                                      mb: 1,
                                    }}
                                  >
                                    {task.title}
                                  </Typography>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Typography variant="caption" sx={{ color: "#666666" }}>
                                      Due: {new Date(task.dueDate).toLocaleDateString()}
                                    </Typography>
                                    <Box sx={{ display: "flex", gap: 1 }}>
                                      <Chip
                                        label={task.priority}
                                        size="small"
                                        sx={{
                                          bgcolor:
                                            task.priority === "high"
                                              ? "#fee2e2"
                                              : task.priority === "medium"
                                              ? "#fef3c7"
                                              : "#ecfdf5",
                                          color:
                                            task.priority === "high"
                                              ? "#dc2626"
                                              : task.priority === "medium"
                                              ? "#d97706"
                                              : "#059669",
                                          fontWeight: 500,
                                          fontSize: "0.75rem",
                                        }}
                                      />
                                    </Box>
                                  </Box>
                                  <Box
                                    className="edit-actions"
                                    sx={{
                                      position: 'absolute',
                                      top: 8,
                                      right: 8,
                                      opacity: 0,
                                      transition: 'opacity 0.2s',
                                      display: 'flex',
                                      gap: 0.5,
                                    }}
                                  >
                                    <IconButton
                                      size="small"
                                      onClick={() => handleStartEdit(task)}
                                      sx={{ color: '#666666' }}
                                    >
                                      <MdEdit />
                                    </IconButton>
                                  </Box>
                                </>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                    </Box>
                  )}
                </TaskColumn>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={5}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, color: "#0e182b" }}>
                    Recent Activity
                  </Typography>
                  <List>
                    {activities.map((activity) => (
                      <ListItem key={activity.id}>
                        <ListItemAvatar>
                          <Avatar>{activity.user[0]}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`${activity.user} ${activity.action} "${activity.target}"`}
                          secondary={activity.timestamp}
                        />
                      </ListItem>
                    ))}
                  </List>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      mt: 2,
                    }}
                  >
                    <IconButton>
                      <MdNavigateBefore style={{ color: "#0e182b" }} />
                    </IconButton>
                    <Typography sx={{ mx: 2, color: "#0e182b" }}>
                      6 / 8
                    </Typography>
                    <IconButton>
                      <MdNavigateNext style={{ color: "#0e182b" }} />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, color: "#0e182b" }}>
                    Productivity Insights
                  </Typography>
                  <Box
                    sx={{
                      height: 200,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "#f8fafa",
                      borderRadius: 1,
                    }}
                  >
                    <Typography color="#0e182b">Productivity Graph</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
