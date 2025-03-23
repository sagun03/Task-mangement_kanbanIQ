import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  createTheme,
  ThemeProvider,
  CssBaseline,
  useMediaQuery,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { MdAdd, MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import "@fontsource/open-sans/600.css";
import { useAuth } from "../context/AuthContext";
import SkeletonLoader from "../components/SkeletonLoader";
import { IBoard, ITask } from "../types/kanban";
import { useKanban } from "../context/KanbanContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import SomethingWentWrong from "../components/Error";

const theme = createTheme({
  typography: {
    fontFamily: "'Open Sans', sans-serif",
    fontWeightRegular: 400,
  },
});

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

export default function Dashboard() {
  const [boards, setBoards] = useState<IBoard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [tasksError, setTasksError] = useState<string>("");
  const [tasksLoading, setTasksLoading] = useState(true);
  const { boards, getTasksByUserId, error: dataError } = useKanban();

  useEffect(() => {
    if (dataError) {
      setError(dataError);
    }
  }, [dataError]);

  useEffect(() => {
    const userBoards = boards.filter(
      (board) =>
        board.adminId === user?.id || board?.acceptedUserIds?.includes(user?.id)
    );
    setMyBoards(userBoards);
    setLoading(false);
  }, [boards]);

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

  const uniqueStatuses = [...new Set(tasks.map((task) => task.status))];

  const taskStats = uniqueStatuses.map((status) => ({
    status,
    count: tasks.filter((task) => task.status === status).length,
  }));

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
            <SomethingWentWrong />
            </Box>
          ) : myBoards.length === 0 ? (
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
                    No myBoards found
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#888" }}>
                    Create a new board to get started with your projects
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={4} sx={{ mb: 4 }}>
              {myBoards
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
                              "&:hover": {
                                boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
                              },
                            }}
                          >
                            <CardContent sx={{ p: 2 }}>
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
                                <Typography
                                  variant="caption"
                                  sx={{ color: "#666666" }}
                                >
                                  Due:{" "}
                                  {new Date(task.dueDate).toLocaleDateString()}
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    gap: 1,
                                  }}
                                >
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
                ) : tasksError ? (
                  <SomethingWentWrong />
                ) : taskStats.length === 0 ? (
                  <Typography variant="body1" sx={{ color: "#666" }}>
                    No tasks available.
                  </Typography>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={taskStats}>
                      <XAxis dataKey="status" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#0e182b" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
