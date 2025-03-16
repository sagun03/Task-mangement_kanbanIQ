/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Container,
  IconButton,
  TextField,
  Typography,
  Autocomplete,
  Avatar,
} from "@mui/material";
import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../config/axiosInstance";
import styled from "styled-components";
import { useToast } from "../context/ToastProvider";
import LoadingOverlay from "../components/Loader";
import { useForm, Controller } from "react-hook-form";

const AvatarContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
  gap: 4px;
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

const CreateBoard: React.FC = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // React Hook Form
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (user?.id) {
      api
        .get(`/users/getOtherUsers/${user?.id}`)
        .then((response) => {
          setUsers(response.data);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
          showToast("Error fetching Email addressess", "error");
        });
    }
  }, [user?.id]);

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);

      const boardData = {
        name: data.boardName,
        description: data.description,
        adminId: user?.id,
        invitedUserIds: selectedUsers.map((user) => user?.id),
        acceptedUserIds: [user?.id],
        columnNames: ["To Do", "In Progress", "Completed"],
      };

      const response = await api.post("/boards", boardData);
      console.log("Board created:", response.data);

      showToast("Board created successfully!", "success");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating board:", error);
      showToast("Failed to create board. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
            <form
              onSubmit={handleSubmit(onSubmit)}
              style={{
                display: "flex",
                flexDirection: "column",
                margin: "20px auto",
                maxWidth: "750px",
              }}
            >
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

              {/* Board Name */}
              <Box mb={3}>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  mb={1}
                  sx={{ fontFamily: "Open Sans", textAlign: "left" }}
                >
                  Board Name{" "}
                  <Typography component="span" color="error">
                    *
                  </Typography>
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter board name"
                  variant="outlined"
                  {...register("boardName", {
                    required: "Board name is required",
                  })}
                  error={!!errors.boardName}
                  helperText={errors.boardName?.message}
                  sx={{
                    backgroundColor: "white",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#ced4da" },
                      "&:hover fieldset": { borderColor: "black" },
                      "&.Mui-focused fieldset": { borderColor: "black" },
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
                  Description{" "}
                  <Typography component="span" color="error">
                    *
                  </Typography>
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Add a description"
                  multiline
                  rows={3}
                  variant="outlined"
                  {...register("description", {
                    required: "Description is required",
                  })}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  sx={{
                    backgroundColor: "white",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#ced4da" },
                      "&:hover fieldset": { borderColor: "black" },
                      "&.Mui-focused fieldset": { borderColor: "black" },
                    },
                  }}
                />
              </Box>

              {/* Invite Team Members */}
              <div>
                <h4>
                  Invite Team Members{" "}
                  <Typography component="span" color="error">
                    *
                  </Typography>
                </h4>
                <div
                  style={{ display: "flex", gap: "8px", alignItems: "center" }}
                >
                  <Controller
                    name="selectedUsers"
                    control={control}
                    rules={{ required: "At least one user is required" }} // Use rules instead of register
                    render={({ field, fieldState }) => (
                      <Autocomplete
                        multiple
                        options={users}
                        getOptionLabel={(option) => option?.email || ""}
                        value={field.value || []} // Ensure controlled behavior
                        onChange={(event, newValue) => {
                          field.onChange(newValue);
                          setSelectedUsers(newValue); // Optional, only if needed elsewhere
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Enter email address"
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                          />
                        )}
                        sx={{
                          flex: 1,
                          backgroundColor: "white",
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": { borderColor: "#ced4da" },
                            "&:hover fieldset": { borderColor: "black" },
                            "&.Mui-focused fieldset": { borderColor: "black" },
                          },
                        }}
                      />
                    )}
                  />
                </div>

                {/* Avatars Preview */}
                <AvatarContainer>
                  {selectedUsers?.slice(0, 3).map((user, index) => (
                    <Avatar
                      key={index}
                      src={user?.name || "https://via.placeholder.com/32"}
                      alt={user?.name}
                    >
                      {user?.email[0]?.toUpperCase()}
                    </Avatar>
                  ))}
                  {selectedUsers.length > 3 && (
                    <MoreUsersBadge>+{selectedUsers.length - 3}</MoreUsersBadge>
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
            </form>
          </Card>
        </Container>
        <LoadingOverlay loading={loading} />
      </div>
    </>
  );
};

export default CreateBoard;
