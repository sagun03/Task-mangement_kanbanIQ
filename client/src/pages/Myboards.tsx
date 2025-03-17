import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { MdAdd, MdDelete } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import api from "../config/axiosInstance";
import { IBoard } from "../types/kanban";

const BoardCard = styled(Card)({
  height: 220,
  display: "flex",
  flexDirection: "column",
  cursor: "pointer",
  position: "relative",
  backgroundColor: "#ffffff",
  transition: "all 0.2s ease-in-out",
  boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
  borderRadius: "16px",
  border: "none",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 12px 24px rgba(0,0,0,0.08)",
  },
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
    backgroundColor: "rgba(255, 59, 48, 0.1)",
    opacity: 1,
    color: "#ff3b30",
  },
});

export default function Myboards() {
  const [boards, setBoards] = useState<IBoard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<IBoard | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchBoards();
  }, [user?.userId]);

  const fetchBoards = async () => {
    try {
      const response = await api.get("/boards");
      if (Array.isArray(response.data)) {
        const userBoards = response.data.filter(
          (board) => board.adminId === user?.id
        );
        setBoards(userBoards);
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

  const handleDeleteClick = (board: Board, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent card click when clicking delete button
    setSelectedBoard(board);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedBoard) {
      try {
        await api.delete(`/boards/${selectedBoard.id}`);
        setBoards(boards.filter((board) => board.id !== selectedBoard.id));
        setDeleteDialogOpen(false);
        setSelectedBoard(null);
      } catch (error) {
        console.error("Error deleting board:", error);
        setError("Failed to delete board");
      }
    }
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
              mb: 2,
            }}
          >
            My Boards
          </Typography>
        </Box>
      </Box>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
          }}
        >
          <Typography
            sx={{
              color: "#666666",
              fontSize: "1.1rem",
            }}
          >
            Loading your boards...
          </Typography>
        </Box>
      ) : error ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
          }}
        >
          <Typography color="error" sx={{ fontSize: "1.1rem" }}>
            {error}
          </Typography>
        </Box>
      ) : boards.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "400px",
            background: "linear-gradient(to bottom, #ffffff, #f8fafa)",
            borderRadius: 4,
            py: 8,
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              bgcolor: "#f8fafa",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 3,
            }}
          >
            <MdAdd style={{ fontSize: "40px", color: "#666666" }} />
          </Box>
          <Typography
            variant="h5"
            sx={{
              color: "#000000",
              fontWeight: 600,
              mb: 2,
            }}
          >
            No boards yet
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#666666",
              mb: 4,
              textAlign: "center",
              maxWidth: "400px",
            }}
          >
            Create your first board to start organizing your tasks and boost
            your productivity
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {boards.map((board) => (
            <Grid item xs={12} sm={6} md={4} key={board.id}>
              <BoardCard>
                <DeleteButton
                  onClick={(e) => handleDeleteClick(board, e)}
                  aria-label="delete"
                >
                  <MdDelete />
                </DeleteButton>
                <CardContent
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    p: 3,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#000000",
                      fontWeight: 600,
                      fontSize: "1.1rem",
                      mb: 2,
                    }}
                  >
                    {board.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#666666",
                      mb: "auto",
                    }}
                  >
                    {board.columns.map(({ name }) => name).join(" • ")}
                  </Typography>
                  <Box
                    sx={{
                      mt: 3,
                      pt: 2,
                      borderTop: "1px solid rgba(0,0,0,0.08)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#999999",
                        fontSize: "0.75rem",
                      }}
                    >
                      Last updated:{" "}
                      {new Date(board.updatedAt).toLocaleDateString()}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#000000",
                        opacity: 0.5,
                        fontSize: "0.75rem",
                      }}
                    >
                      {board.columns.length} Columns
                    </Typography>
                  </Box>
                </CardContent>
              </BoardCard>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{
            pb: 1,
            color: "#000000",
            fontWeight: 600,
          }}
        >
          Delete Board
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography sx={{ color: "#666666" }}>
            Are you sure you want to delete "{selectedBoard?.name}"? This action
            cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1.5 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{
              color: "#666666",
              "&:hover": {
                bgcolor: "rgba(0, 0, 0, 0.05)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            sx={{
              color: "#ffffff",
              bgcolor: "#ff3b30",
              "&:hover": {
                bgcolor: "#ff2d20",
              },
            }}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
