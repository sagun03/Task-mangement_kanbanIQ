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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { MdAdd } from "react-icons/md";
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
  const [myBoards, setMyBoards] = useState<IBoard[]>([]);
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
      const response = await getTasksByUserId(user.id);
      setTasks(response);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasksError("Failed to fetch tasks");
    } finally {
      setTasksLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

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

          <Typography variant="h6" sx={{ mb: 2, color: "#0e182b" }}>
            Task Analytics
          </Typography>
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
                {tasksLoading ? (
                  <Typography variant="body1" sx={{ color: "#666" }}>
                    Loading tasks...
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
