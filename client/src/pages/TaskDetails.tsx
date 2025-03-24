/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Avatar,
  TextField,
  CircularProgress,
  Breadcrumbs,
  Link as MuiLink,
  Grid,
  Box,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import styled from "styled-components";
import { useKanban } from "../context/KanbanContext";
import { fetchTaskById } from "../services/api";
import { ActionButton } from "./KanbanBoard";
import { Close, Edit } from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useAuth } from "../context/AuthContext";
import LoadingOverlay from "../components/Loader";
import SomethingWentWrong from "../components/Error";

// Styled Components
const TaskDetailContainer = styled(Container)`
  margin: 0 auto;
  background-color: #f9fafb;
`;

const BoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  background-color: #f9fafb;
  align-items: center;
  min-height: calc(100vh - 100px);
`;

const StyledPaper = styled(Paper)`
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
`;

const HeaderTitle = styled(Typography)`
  font-size: 24px;
  font-weight: bold;
  text-align: left;
  align-items: center;
`;

const SectionLabel = styled(Typography)`
  font-size: 14px;
  font-weight: 600;
  color: #666;
  width: 100px;
  text-align: left;
`;

const SectionValue = styled(Typography)`
  font-size: 16px;
`;

const CommentForm = styled.form`
  margin-top: 5px;
`;

const CommentInput = styled(TextField)`
  && {
    margin-bottom: 12px;
  }
`;

const CommentWrapper = styled(Box)`
  margin-top: 12px;
`;

const CommentItem = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  gap: 4px;
  margin-bottom: 16px;
  border: 1px solid #f1f5f9;
  background-color: #f9fafb;
  padding: 12px;
  border-radius: 8px;
`;

const EditContainer = styled(Box)`
  display: flex;
  gap: 4px;
  width: 100%;
`;

const TaskDetail: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const {
    users,
    boards,
    loading,
    updateTask,
    deleteTask,
    task,
    setTask,
    error,
  } = useKanban();
  const { user } = useAuth();
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<string>("");
  const [priority, setPriority] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [taskError, setTaskError] = useState("");

  const fetchTask = async () => {
    try {
      const task = await fetchTaskById(taskId);
      setTask(task);
    } catch (error) {
      console.error("Error fetching task:", error);
      setTaskError("Failed to fetch task details");
    }
  };

  useEffect(() => {
    if (error) {
      setTaskError(error);
    }
  }, [error]);

  useEffect(() => {
    if (task) {
      setStatus(task.status);
      setPriority(task.priority);
      setTaskTitle(task.title);
      setAssignedTo(task.assignedTo);
      setDescription(task?.description || "");
      setDueDate(task.dueDate ? new Date(task.dueDate) : null);
      setIsUpdated(false);
    }
  }, [task]);

  useEffect(() => {
    if (!taskId) {
      navigate("/dashboard");
      return;
    }
    if (isSubmitting) setIsSubmitting(false);
    fetchTask();
  }, [taskId, navigate, isUpdated]);

  console.log("error", taskError);

  if (taskError) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="80vh"
      >
        <SomethingWentWrong />
      </Box>
    );
  }

  if (loading || !task) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress sx={{ color: "black" }} />
      </Box>
    );
  }

  const getUser = (userId: string) => {
    return users.find((user) => user.id === userId);
  };

  const getBoard = (boardId: string) => {
    return boards.find(
      (board) => (board._id?.toString() || board.id?.toString()) === boardId
    );
  };
  const handleSaveTitle = async () => {
    if (taskTitle.trim() && taskId) {
      setIsSubmitting(true);
      await updateTask(taskId, {
        title: taskTitle,
      });
      setIsEditing(false);
      setIsUpdated(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveTitle();
    } else if (e.key === "Escape") {
      setTaskTitle(task.title);
      setIsEditing(false);
    }
  };

  const assignedUser = getUser(task.assignedTo);
  const assignedByUser = getUser(task.assignedBy);
  const board = getBoard(task.boardOriginalId);

  // const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  // const formattedDueDate = dueDate
  //   ? format(dueDate, "yyyy-MM-dd")
  //   : "No due date";

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Comment submitted:", comment);
    if (comment.trim() && taskId) {
      setIsSubmitting(true);
      await updateTask(taskId, {
        comments: [
          ...(task.comments || []),
          {
            text: comment,
            commentedBy: user.id,
            createdAt: new Date(),
          },
        ],
      });
      setIsUpdated(true);
    }

    setComment("");
  };

  const handleDueDate = async (date: Date | null) => {
    setDueDate(date);
    if (date && taskId) {
      setIsSubmitting(true);
      await updateTask(taskId, { dueDate: date });
      setIsUpdated(true);
    }
  };

  const handleStatusChange = async (event: any) => {
    setStatus(event.target.value);
    if (taskId) {
      setIsSubmitting(true);
      await updateTask(taskId, { status: event.target.value });
      setIsUpdated(true);
    }
  };

  const handleDescriptionChange = async (value: string) => {
    if (taskId) {
      setIsSubmitting(true);
      await updateTask(taskId, { description: value });
      setIsUpdated(true);
    }
  };

  const handleAssignedToChange = async (event: any) => {
    setAssignedTo(event.target.value);
    if (taskId) {
      setIsSubmitting(true);
      await updateTask(taskId, { assignedTo: event.target.value });
      setIsUpdated(true);
    }
  };

  const handlePriorityChange = async (event: any) => {
    setPriority(event.target.value);
    if (taskId) {
      setIsSubmitting(true);
      await updateTask(taskId, { priority: event.target.value });
      setIsUpdated(true);
    }
  };

  const handleEdit = () => {
    // Handle edit logic here
    setIsEditing(true);
  };

  const handleDelete = async () => {
    // Handle delete logic here
    console.log("Delete task");
    if (taskId) {
      setIsSubmitting(true);
      await deleteTask(taskId);
      navigate(`/kanban-board/${task.boardOriginalId}`);
      setIsUpdated(true);
    }
  };

  return (
    <BoardContainer>
      <TaskDetailContainer>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <MuiLink
            underline="hover"
            color="inherit"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/dashboard");
            }}
          >
            Boards
          </MuiLink>
          {board && (
            <MuiLink
              underline="hover"
              color="inherit"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate(`/kanban-board/${board._id || board.id}`);
              }}
            >
              {board.name}
            </MuiLink>
          )}
          <Typography color="text.primary">Task Details</Typography>
        </Breadcrumbs>

        <StyledPaper elevation={3}>
          <Grid container spacing={2} sx={{ mb: 3 }} alignItems="center">
            {/* Task Title */}
            <Grid item xs={12} sm={3}>
              {isEditing ? (
                <EditContainer>
                  <TextField
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    onBlur={handleSaveTitle}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    size="medium"
                    fullWidth
                    variant="outlined"
                    sx={{
                      backgroundColor: "white",
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "black" },
                        "&:hover fieldset": { borderColor: "black" },
                        "&.Mui-focused fieldset": { borderColor: "black" },
                      },
                    }}
                    inputProps={{
                      style: {
                        height: "20px",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        padding: "8px 12px",
                      },
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => {
                      // setTitle(column.title);
                      setIsEditing(false);
                    }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </EditContainer>
              ) : (
                <HeaderTitle variant="h5">{task.title}</HeaderTitle>
              )}
            </Grid>

            {/* Actions */}
            <Grid item xs={12} sm={9} display="flex" justifyContent="flex-end">
              <ActionButton
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => handleEdit()}
                sx={{ height: 40, mr: 2 }}
              >
                Edit
              </ActionButton>
              {/* <ActionButton
                variant="outlined"
                startIcon={ <CheckCircle size={16} style={{ marginRight: 8 }} />}
                onClick={() => handleMarkAsDone()}
                sx={{ height: 40, mr: 2 }}
              >
                 Mark as Done
              </ActionButton> */}

              <IconButton onClick={handleDelete}>
                <Trash2 size={20} />
              </IconButton>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            {/* Status */}
            <Grid
              item
              xs={12}
              display="flex"
              justifyContent="flex-start"
              alignItems="center"
              gap="30px"
              sm={6}
            >
              <SectionLabel variant="body2">Status</SectionLabel>
              {/* <StatusSelect > */}
              <Select
                value={status}
                onChange={handleStatusChange}
                sx={{
                  width: "fit-content",
                  minWidth: "120px",
                  borderRadius: "20px",
                  backgroundColor: "#FAFBFC",
                  "& .MuiSelect-select": {
                    padding: "5px 10px",
                    borderRadius: "20px",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "black",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "black",
                    borderWidth: "1.2px",
                  },
                }}
              >
                {board?.columns.map(({ name }, index) => (
                  <MenuItem value={name} key={index}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
              {/* </StatusSelect> */}
            </Grid>

            {/* Priority */}
            <Grid
              item
              xs={12}
              sm={6}
              display="flex"
              justifyContent="flex-start"
              alignItems="center"
              gap="30px"
            >
              <SectionLabel variant="body2">Priority</SectionLabel>
              {/* <StatusSelect > */}
              <Select
                labelId="priority-label"
                value={priority}
                onChange={handlePriorityChange}
                sx={{
                  width: "fit-content",
                  minWidth: "120px",
                  borderRadius: "20px",
                  backgroundColor: "#FAFBFC",
                  "& .MuiSelect-select": {
                    padding: "5px 10px",
                    borderRadius: "20px",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "black",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "black",
                    borderWidth: "1.2px",
                  },
                }}
              >
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </Select>
              {/* </StatusSelect> */}
            </Grid>

            {/* Due Date */}
            <Grid
              display="flex"
              justifyContent="flex-start"
              alignItems="center"
              gap="30px"
              item
              xs={12}
              sm={6}
            >
              <SectionLabel variant="body2">Due Date</SectionLabel>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={dueDate}
                  onChange={(date) => handleDueDate(date)}
                  sx={{
                    width: "fit-content",
                    minWidth: "120px",
                    borderRadius: "20px",
                    backgroundColor: "#FAFBFC",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "black" },
                      "&:hover fieldset": { borderColor: "black" },
                      "&.Mui-focused fieldset": { borderColor: "black" },
                    },
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: "outlined",
                      sx: {
                        width: "fit-content",
                        minWidth: "120px",
                        borderRadius: "20px !important",
                        backgroundColor: "#FAFBFC",
                        "& .MuiInputBase-root": {
                          maxWidth: "170px",
                          borderRadius: "20px !important",
                          "& fieldset": { borderColor: "black" },
                          "&:hover fieldset": { borderColor: "black" },
                          "&.Mui-focused fieldset": { borderColor: "black" },
                          "& .MuiInputBase-input": {
                            padding: "5px 10px",
                          },
                        },
                      },
                    },
                  }}
                />
              </LocalizationProvider>
              {/* <SectionValue variant="body1">
                <CalendarDays size={18} style={{ marginRight: 8 }} />
                {formattedDueDate}
              </SectionValue> */}
            </Grid>

            {/* Assigned To */}
            <Grid
              display="flex"
              justifyContent="flex-start"
              alignItems="center"
              gap="30px"
              item
              xs={12}
              sm={6}
            >
              <SectionLabel variant="body2">Assigned To</SectionLabel>
              <Box display="flex" alignItems="center">
                <Avatar
                  alt={assignedUser?.name || "User"}
                  src=""
                  sx={{ width: 24, height: 24, mr: 1 }}
                >
                  {(() => {
                    const user = getUser(assignedTo);
                    const value = user?.name || user?.email;
                    return value?.charAt(0).toUpperCase();
                  })()}
                </Avatar>
                {/* <SectionValue variant="body1">
                  {assignedUser?.name || assignedUser?.email || "Unknown user"}
                </SectionValue> */}
                <Select
                  value={assignedTo}
                  onChange={handleAssignedToChange}
                  sx={{
                    width: "fit-content",
                    minWidth: "120px",
                    borderRadius: "20px",
                    backgroundColor: "#FAFBFC",
                    "& .MuiSelect-select": {
                      padding: "5px 10px",
                      borderRadius: "20px",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "black",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "black",
                      borderWidth: "1.2px",
                    },
                  }}
                >
                  {board?.acceptedUserIds?.map((id) => {
                    const user = getUser(id);
                    const value = user?.name || user?.email || "Unknown user";
                    return (
                      <MenuItem key={id} value={id}>
                        {value}
                      </MenuItem>
                    );
                  })}
                </Select>
              </Box>
            </Grid>

            {/* Assigned By */}
            <Grid
              display="flex"
              justifyContent="flex-start"
              alignItems="center"
              gap="30px"
              item
              xs={12}
              sm={6}
            >
              <SectionLabel variant="body2">Assigned By</SectionLabel>
              <Box display="flex" alignItems="center">
                <Avatar
                  alt={assignedByUser?.name || "User"}
                  src=""
                  sx={{ width: 24, height: 24, mr: 1 }}
                >
                  {assignedByUser?.name
                    ? assignedByUser.name.charAt(0).toUpperCase()
                    : "U"}
                </Avatar>
                <SectionValue variant="body1">
                  {assignedByUser?.name ||
                    assignedByUser?.email ||
                    "Unknown user"}
                </SectionValue>
              </Box>
            </Grid>

            {/* Description */}
            <Grid item xs={12} mt={2}>
              <SectionLabel mb={1} variant="body2">
                Description
              </SectionLabel>
              <TextField
                multiline
                rows={4}
                fullWidth
                value={description || ""}
                onBlur={() => handleDescriptionChange(description)}
                onChange={(e) => setDescription(e.target.value)}
                sx={{
                  backgroundColor: "white",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "black" },
                    "&:hover fieldset": { borderColor: "black" },
                    "&.Mui-focused fieldset": { borderColor: "black" },
                  },
                }}
              />
            </Grid>

            {/* Comments */}
            <Grid item xs={12}>
              <SectionLabel variant="body2">Comments</SectionLabel>
              {/* Comment Form */}
              <CommentForm
                onSubmit={handleCommentSubmit}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <CommentInput
                  placeholder="Add a comment..."
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={2}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  sx={{
                    backgroundColor: "white",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "black" },
                      "&:hover fieldset": { borderColor: "black" },
                      "&.Mui-focused fieldset": { borderColor: "black" },
                    },
                  }}
                />
                <ActionButton
                  variant="outlined"
                  type="submit"
                  // onClick={() => hahandleCommentSubmitndleEdit()}
                  sx={{ height: 40, mr: 2, width: 100 }}
                  style={!comment.trim() ? { cursor: "not-allowed" } : {}}
                >
                  Comment
                </ActionButton>
              </CommentForm>
              <CommentWrapper>
                {task.comments && task.comments.length > 0 ? (
                  task.comments
                    .sort(
                      (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                    )
                    .map((comment, index) => {
                      const commentUser = getUser(comment.commentedBy);
                      const value = commentUser?.name || commentUser?.email;
                      const commentDate = new Date(comment.createdAt);

                      return (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            width: "100%",
                            gap: "20px",
                            mt: 4,
                          }}
                        >
                          <Avatar
                            alt={commentUser?.name || "User"}
                            src=""
                            sx={{ width: 32, height: 32 }}
                          >
                            {value?.charAt(0).toUpperCase()}
                          </Avatar>

                          <CommentItem key={index}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                width: "100%",
                              }}
                            >
                              <Typography
                                sx={{ fontWeight: "bold" }}
                                variant="body2"
                              >
                                {value}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {format(commentDate, "MMM d, yyyy h:mm a")}
                              </Typography>
                            </Box>
                            <Box sx={{ mt: 1, width: "100%", display: "flex" }}>
                              <Typography variant="body2">
                                {comment.text}
                              </Typography>
                            </Box>
                          </CommentItem>
                        </Box>
                      );
                    })
                ) : (
                  <Typography
                    sx={{ textAlign: "left" }}
                    variant="body2"
                    color="text.secondary"
                  >
                    No comments yet.
                  </Typography>
                )}
              </CommentWrapper>
            </Grid>
          </Grid>
        </StyledPaper>
      </TaskDetailContainer>
      <LoadingOverlay loading={isSubmitting} />
    </BoardContainer>
  );
};

export default TaskDetail;
