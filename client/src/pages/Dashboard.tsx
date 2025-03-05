import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
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
  InputBase,
  Drawer,
  List as MuiList,
  ListItemIcon,
  ListItemButton,
  createTheme,
  ThemeProvider,
  CssBaseline,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  MdSearch,
  MdAdd,
  MdHome,
  MdFormatListBulleted,
  MdTimeline,
  MdGroups,
  MdNavigateNext,
  MdNavigateBefore,
  MdMenu,
  MdNotifications,
  MdLogout,
} from "react-icons/md";
import "@fontsource/open-sans/600.css";
import { FaLayerGroup } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

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
    boxShadow: "0px 0 6px -2px rgba(0, 0, 0, 0.1)"
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
  height: 200,
  display: "flex",
  flexDirection: "column",
  cursor: "pointer",
  "&:hover": {
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
});

const TaskColumn = styled(Paper)(({ theme }) => ({
  padding: 16,
  backgroundColor: "#f8fafa",
  borderRadius: 8,
  height: "100%",
  [theme.breakpoints.down("sm")]: {
    marginBottom: theme.spacing(2),
  },
}));

interface Board {
  _id: string;
  name: string;
  description: string;
}

interface Task {
  id: string;
  title: string;
  status: string;
  dueDate?: string;
  progress?: number;
}

interface ActivityItem {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
}

export default function Dashboard() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const {user, logout} = useAuth();

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await axios.get('http://localhost:8082/api/boards');
        if (Array.isArray(response.data)) {
          setBoards(response.data);
        } else {
          setError('Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching boards:', error);
        setError('Failed to fetch boards');
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, []);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const tasks: Task[] = [
    { id: "1", title: "Task 1 - Due Tomorrow", status: "pending-tasks", dueDate: "tomorrow" },
    { id: "2", title: "Task 2 - Due in 3 days", status: "pending-tasks", dueDate: "3 days" },
    { id: "3", title: "Task 3 - 50% Complete", status: "in-progress", progress: 50 },
    { id: "4", title: "Task 4 - 75% Complete", status: "in-progress", progress: 75 },
    { id: "5", title: "Task 5 - Completed", status: "completed" },
    { id: "6", title: "Task 6 - Completed", status: "completed" },
  ];

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
  console.log(boards);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", bgcolor: "#f8fafa" }}>
        {isSmallScreen ? (
          <Drawer
            variant="temporary"
            open={drawerOpen}
            onClose={toggleDrawer}
            ModalProps={{ keepMounted: true }}
          >
            <Box sx={{ p: 2, width: drawerWidth }}>
              <Typography sx={{ mb: 4, color: "#0e182b" }}>
                <ListItemButton>
                  <ListItemIcon>
                    <FaLayerGroup style={{ color: "#0e182b", fontSize: '26px' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="KanbanIQ" 
                    primaryTypographyProps={{ style: { fontSize: '26px' } }} 
                  />
                </ListItemButton>
              </Typography>
              <MuiList>
                <ListItemButton selected>
                  <ListItemIcon>
                    <MdHome style={{ color: "#0e182b", fontSize: '24px' }} />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItemButton>
                <ListItemButton>
                  <ListItemIcon>
                    <MdTimeline style={{ color: "#0e182b", fontSize: '24px' }} />
                  </ListItemIcon>
                  <ListItemText primary="My Boards" />
                </ListItemButton>
                <ListItemButton>
                  <ListItemIcon>
                    <MdFormatListBulleted style={{ color: "#0e182b", fontSize: '24px' }} />
                  </ListItemIcon>
                  <ListItemText primary="Tasks" />
                </ListItemButton>
                <ListItemButton>
                  <ListItemIcon>
                    <MdGroups style={{ color: "#0e182b", fontSize: '24px' }} />
                  </ListItemIcon>
                  <ListItemText primary="Team Collaboration" />
                </ListItemButton>
              </MuiList>
            </Box>
          </Drawer>
        ) : (
          <StyledDrawer variant="permanent">
            <Box sx={{ p: 2 }}>
              <Typography sx={{ mb: 4, color: "#0e182b" }}>
                <ListItemButton>
                  <ListItemIcon>
                    <FaLayerGroup style={{ color: "#0e182b", fontSize: '26px' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="KanbanIQ" 
                    primaryTypographyProps={{ style: { fontSize: '26px' } }} 
                  />
                </ListItemButton>
              </Typography>
              <MuiList>
                <ListItemButton selected>
                  <ListItemIcon>
                    <MdHome style={{ color: "#0e182b", fontSize: '24px' }} />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItemButton>
                <ListItemButton>
                  <ListItemIcon>
                    <MdTimeline style={{ color: "#0e182b", fontSize: '24px' }} />
                  </ListItemIcon>
                  <ListItemText primary="My Boards" />
                </ListItemButton>
                <ListItemButton>
                  <ListItemIcon>
                    <MdFormatListBulleted style={{ color: "#0e182b", fontSize: '24px' }} />
                  </ListItemIcon>
                  <ListItemText primary="Tasks" />
                </ListItemButton>
                <ListItemButton>
                  <ListItemIcon>
                    <MdGroups style={{ color: "#0e182b", fontSize: '24px' }} />
                  </ListItemIcon>
                  <ListItemText primary="Team Collaboration" />
                </ListItemButton>
                <ListItemButton onClick={logout}>
                <ListItemIcon><MdLogout style={{ color: "#0e182b", fontSize: '24px' }} /></ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
              </MuiList>
            </Box>
          </StyledDrawer>
        )}

        <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: "#f8fafa" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
            {isSmallScreen && (
              <IconButton onClick={toggleDrawer}>
                <MdMenu style={{ color: "#0e182b" }} />
              </IconButton>
            )}
            <SearchBar>
              <InputBase
                sx={{ ml:1, flex: 1, color: "#0e182b" }}
                placeholder="Search tasks, boards..."
                inputProps={{ "aria-label": "search" }}
              />
              <IconButton type="button" aria-label="search">
                <MdSearch style={{ color: "#0e182b" }} />
              </IconButton>
            </SearchBar>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconButton size="large">
                <MdNotifications style={{ color: "#0e182b" }} />
              </IconButton>
              <Avatar style={{cursor: "pointer"}}>S</Avatar>
            </Box>
          </Box>

          <Typography variant="h4" sx={{ mb: 3, color: "#0e182b", textAlign: "left" }}>
            Welcome back, {user?.email}!
          </Typography>

          <Box sx={{ mb: 4, display: "flex", justifyContent: "flex-start", flexWrap: "wrap", gap: 2 }}>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#0e182b", textTransform: "none" }}
              startIcon={<MdAdd style={{ color: "white" }} />}
              onClick={() => navigate('/createboard')}
            >
              Create New Board
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#0e182b", textTransform: "none" }}
              startIcon={<MdAdd style={{ color: "white" }} />}
            >
              Add New Task
            </Button>
          </Box>

          <Typography variant="h6" sx={{ mb: 2, color: "#0e182b", textAlign: "left" }}>
            Active Boards
          </Typography>
          {loading ? (
            <Typography>Loading boards...</Typography>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <Grid container spacing={4} sx={{ mb: 4 }}>
              {boards.map((board) => (
                <Grid item xs={12} sm={6} md={2} key={board._id}>
                  <BoardCard>
                    <CardContent>
                      <Typography variant="h6" sx={{ color: "#0e182b" }}>
                        {board.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#0e182b" }}>
                        {board}
                      </Typography>
                    </CardContent>
                  </BoardCard>
                </Grid>
              ))}
            </Grid>
          )}

          <Grid container spacing={3} sx={{ mb: 4 }}>
            {["Pending tasks", "In Progress", "Completed"].map((status, index) => (
              <Grid item xs={12} sm={6} md={3.6} key={index}>
                <TaskColumn>
                  <Typography variant="h6" sx={{ mb: 2, color: "#0e182b" }}>
                    {status}
                  </Typography>
                  {tasks
                    .filter((t) => t.status === status.toLowerCase().replace(" ", "-"))
                    .map((task) => (
                      <Card key={task.id} sx={{ mb: 1 }}>
                        <CardContent>
                          <Typography sx={{ color: "#0e182b" }}>{task.title}</Typography>
                        </CardContent>
                      </Card>
                    ))}
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
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 2 }}>
                    <IconButton>
                      <MdNavigateBefore style={{ color: "#0e182b" }} />
                    </IconButton>
                    <Typography sx={{ mx: 2, color: "#0e182b" }}>6 / 8</Typography>
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