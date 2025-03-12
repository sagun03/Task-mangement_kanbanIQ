import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  styled as muiStyled,
  MenuItem,
  Select,
  SelectChangeEvent,
  Autocomplete,
  Avatar,
} from "@mui/material";
import { MdLock, MdPublic, MdFileUpload, MdArrowBack } from "react-icons/md";
import "@fontsource/open-sans/700.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../config/axiosInstance"; // Add this import at the top
import styled from 'styled-components';

// Styled components
const CoverOption = muiStyled(Paper)(({ theme }) => ({
  width: "100%",
  height: 80,
  cursor: "pointer",
  border: "2px solid transparent",
  transition: "border-color 0.3s ease",
  "&:hover": {
    borderColor: theme.palette.primary.main,
  },
  "&.selected": {
    borderColor: theme.palette.primary.main,
  },
}));

const BoardPreviewContainer = styled(Box)`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  width: 100%;
  max-width: 400px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 150px;
  background: #f4f4f4;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #b0b0b0;
`;

const PlaceholderText = styled.div`
  height: 12px;
  background: #f4f4f4;
  border-radius: 4px;
  margin: 8px 0;
  width: ${({ width }) => width || "100%"};
`;

const AvatarContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
`;

const MoreUsersBadge = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-left: 4px;
`;

const AvatarCircle = styled(Box)(({ theme }) => ({
  width: 32,
  height: 32,
  borderRadius: "50%",
  backgroundColor: theme.palette.grey[300],
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginRight: theme.spacing(0.5),
  color: theme.palette.text.secondary,
  fontSize: 12,
  fontWeight: "bold",
}));

interface CreateBoardProps {
  onSubmit?: (boardData: any) => void;
}

const CreateBoard: React.FC<CreateBoardProps> = () => {
  const [boardName, setBoardName] = useState("");
  const [description, setDescription] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id){
    api
      .get(`/users/getOtherUsers/${user?.id}`)
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users:", error));
    }
  }, [user?.id]);

  const handleUserChange = (event, newValue) => {
    setSelectedUsers(newValue);
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!boardName.trim()) {
      alert("Board name is required");
      return;
    }

    try {
      const boardData = {
        name: boardName,
        adminId: user?.userId,
        invitedUserIds: selectedUsers.map((user) => user.id),
        columnNames: ["To-do", "In-progress", "Complete"],
      };

      const response = await api.post("/boards", boardData);
      console.log("Board created:", response.data);

      // Redirect to dashboard after successful creation
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating board:", error);
      alert("Failed to create board. Please try again.");
    }
  };

  const navigate = useNavigate();
  return (
    <div style={{ background: "#f8fafa", minHeight: "100vh" }}>
      <Container maxWidth="md">
        {/* Back Button */}
        <Box sx={{ mt: 2, mb: 2, display: "flex", alignItems: "center" }}>
          <IconButton
            onClick={() => navigate("/dashboard")}
            sx={{ color: "#0e182b", mr: 1 }}
          >
            <MdArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ color: "#0e182b" }}>
            Back to Dashboard
          </Typography>
        </Box>

        <Card
          sx={{
            p: 4,
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: 2,
          }}
        >
          <form onSubmit={handleSubmit} style={{ display: "flex", justifyContent: "center", flexDirection: "column", margin: "20px auto", maxWidth: "750px"}}>
            <Typography
              fontWeight="bold"
              gutterBottom
              sx={{
                fontSize: "25px",
                fontFamily: "Open Sans",
                textAlign: "left",
                marginBottom: 3,
              }}
            >
              Create New Board
            </Typography>
{/* 
            <Grid container spacing={4}> */}
              {/* Left Column */}
              <Box display="flex" justifyContent="center" flexDirection="column" >
                {/* Board Name */}
                <Box mb={3}>
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    mb={1}
                    sx={{ fontFamily: "Open Sans", textAlign: "left" }}
                  >
                    Board Name
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter board name"
                    variant="outlined"
                    value={boardName}
                    onChange={(e) => setBoardName(e.target.value)}
                    sx={{
                      backgroundColor: "white",
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "#ced4da",
                        },
                        "&:hover fieldset": {
                          borderColor: "black",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "black",
                        },
                      },
                    }}
                  />
                </Box>

                {/* Description */}
                <Box mb={3}>
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    mb={1}
                    sx={{ fontFamily: "Open Sans", textAlign: "left" }}
                  >
                    Description
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Add a description"
                    multiline
                    rows={3}
                    variant="outlined"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    sx={{
                      backgroundColor: "white",
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "#ced4da",
                        },
                        "&:hover fieldset": {
                          borderColor: "black",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "black",
                        },
                      },
                    }}
                  />
                </Box>

                {/* Invite Team Members */}
                <div>
                  <h4>Invite Team Members</h4>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <Autocomplete
                      multiple
                      options={users}
                      getOptionLabel={(option) => option.email}
                      value={selectedUsers}
                      onChange={handleUserChange}
                      renderInput={(params) => (
                        <TextField {...params} label="Enter email address" />
                      )}
                      style={{ flex: 1 }}
                    />
                    {/* <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddTeamMember}
                    sx={{ ml: 1, textTransform: 'none', maxHeight: 40,   minWidth: 80, backgroundColor: 'black', '&:hover': { backgroundColor: '#333' } }}
                  >
                    Invite
                  </Button> */}
                  </div>

                  {/* Avatars Preview */}
                  <AvatarContainer>
                    {selectedUsers.slice(0, 3).map((user, index) => (
                      <Avatar
                        key={index}
                        src={user.avatar || "https://via.placeholder.com/32"}
                        alt={user.name}
                        style={{ width: 32, height: 32, marginRight: 4 }}
                      />
                    ))}
                    {selectedUsers.length > 3 && (
                      <MoreUsersBadge>
                        +{selectedUsers.length - 3}
                      </MoreUsersBadge>
                    )}
                  </AvatarContainer>
                </div>

                 {/* Action Buttons */}
                 <Box display="flex" gap={4} mt={4} justifyContent="center">
                  <Button
                    variant="contained"
                    type="submit"
                    sx={{
                      textTransform: "none",
                      backgroundColor: "black",
                      color: "white",
                      "&:hover": { backgroundColor: "#333" },
                    }}
                  >
                    Create Board
                  </Button>
                </Box>
              </Box>

              {/* Right Column */}
          
            {/* </Grid> */}
          </form>
        </Card>
      </Container>
    </div>
  );
};

export default CreateBoard;
