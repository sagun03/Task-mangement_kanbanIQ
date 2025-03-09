import React, { useState } from 'react';
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
  styled,
  MenuItem,
  Select,
  SelectChangeEvent
} from '@mui/material';
import { 
  MdLock, 
  MdPublic, 
  MdFileUpload,
  MdArrowBack,
} from 'react-icons/md';
import "@fontsource/open-sans/700.css";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../config/axiosInstance'; // Add this import at the top
// Styled components
const CoverOption = styled(Paper)(({ theme }) => ({
  width: '100%',
  height: 80,
  cursor: 'pointer',
  border: '2px solid transparent',
  transition: 'border-color 0.3s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
  },
  '&.selected': {
    borderColor: theme.palette.primary.main,
  }
}));

const AvatarCircle = styled(Box)(({ theme }) => ({
  width: 32,
  height: 32,
  borderRadius: '50%',
  backgroundColor: theme.palette.grey[300],
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: theme.spacing(0.5),
  color: theme.palette.text.secondary,
  fontSize: 12,
  fontWeight: 'bold',
}));

interface CreateBoardProps {
  onSubmit?: (boardData: any) => void;
}

const CreateBoard: React.FC<CreateBoardProps> = () => {
  const [boardName, setBoardName] = useState('');
  const [description, setDescription] = useState('');
  const [privacy, setPrivacy] = useState('public');
  const [selectedCover, setSelectedCover] = useState(0);
  const [email, setEmail] = useState('');
  const [teamMembers, setTeamMembers] = useState<string[]>(['John', 'Jane']);
  
  const {user} = useAuth();

  // Cover options with different shades of gray
  const coverOptions = [
    '#1e2533', // Dark blue-gray
    '#2c3444', // Medium blue-gray
    '#474f61', // Medium gray
    '#737888', // Light gray
  ];

  const handleAddTeamMember = () => {
    if (email && !teamMembers.includes(email)) {
      setTeamMembers([...teamMembers, email]);
      setEmail('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!boardName.trim()) {
      alert('Board name is required');
      return;
    }

    try {
      const boardData = {
        name: boardName,
        adminId: user?.userId,
        invitedUserIds: [], // Empty array for now
        columnNames: ['To-do', 'In-progress', 'Complete']
      };

      const response = await api.post('/boards', boardData);
      console.log('Board created:', response.data);
      
      // Redirect to dashboard after successful creation
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating board:', error);
      alert('Failed to create board. Please try again.');
    }
  };
 
  const navigate = useNavigate();
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
        <form onSubmit={handleSubmit}>
          <Typography fontWeight="bold" gutterBottom sx={{fontSize: "25px", fontFamily: 'Open Sans', textAlign: "left", marginBottom: 3 }}>
            Create New Board
          </Typography>

          <Grid container spacing={4}>
            {/* Left Column */}
            <Grid item xs={12} md={6}>
              {/* Board Name */}
              <Box mb={3}>
                <Typography variant="body1" fontWeight="bold" mb={1} sx={{ fontFamily: 'Open Sans', textAlign: "left" }}>
                  Board Name
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter board name"
                  variant="outlined"
                  value={boardName}
                  onChange={(e) => setBoardName(e.target.value)}
                  sx={{
                    backgroundColor: 'white',
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#ced4da',
                      },
                      '&:hover fieldset': {
                        borderColor: 'black',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'black',
                      },
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
                  placeholder="Add a description"
                  multiline
                  rows={3}
                  variant="outlined"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  sx={{
                    backgroundColor: 'white',
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#ced4da',
                      },
                      '&:hover fieldset': {
                        borderColor: 'black',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'black',
                      },
                    },
                  }}
                />
              </Box>

              {/* Privacy Settings */}
              <Box mb={3}>
                <Typography variant="body1" fontWeight="bold" mb={1} sx={{ fontFamily: 'Open Sans', textAlign: "left" }}>
                  Privacy Settings
                </Typography>
                <FormControl component="fieldset" fullWidth sx={{ textAlign: 'left' }}>
                  <RadioGroup
                    value={privacy}
                    onChange={(e) => setPrivacy(e.target.value)}
                  >
                    <Box sx={{ mb: 1, p: 1.5, border: '1px solid #ced4da', borderRadius: 1 }}>
                      <FormControlLabel
                        value="public"
                        control={<Radio sx={{ color: 'black', '&.Mui-checked': { color: 'black' } }} />}
                        label={
                          <Box display="flex" alignItems="center">
                            <MdPublic style={{ marginRight: 8 }} />
                            <Box>
                              <Typography variant="body1" fontWeight="bold" sx={{ fontFamily: 'Open Sans' }}>Public</Typography>
                              <Typography variant="body2" color="text.secondary">
                                Anyone with the link can view
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </Box>
                    <Box sx={{ p: 1.5, border: '1px solid #ced4da', borderRadius: 1 }}>
                      <FormControlLabel
                        value="private"
                        control={<Radio sx={{ color: 'black', '&.Mui-checked': { color: 'black' } }} />}
                        label={
                          <Box display="flex" alignItems="center">
                            <MdLock style={{ marginRight: 8 }} />
                            <Box>
                              <Typography variant="body1" fontWeight="bold" sx={{ fontFamily: 'Open Sans' }}>Private</Typography>
                              <Typography variant="body2" color="text.secondary">
                                Only invited members can access
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </Box>
                  </RadioGroup>
                </FormControl>
              </Box>

              
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} md={6}>
              {/* Board Cover */}
              <Box mb={3}>
                <Typography variant="body1" fontWeight="bold" mb={1} sx={{ fontFamily: 'Open Sans', textAlign: "left" }}>
                  Board Cover
                </Typography>
                <Grid container spacing={1} mb={2}>
                  {coverOptions.map((color, index) => (
                    <Grid item xs={3} key={index}>
                      <CoverOption
                        className={selectedCover === index ? 'selected' : ''}
                        onClick={() => setSelectedCover(index)}
                        sx={{ backgroundColor: color }}
                      />
                    </Grid>
                  ))}
                </Grid>
                
                <Button
                  variant="outlined"
                  startIcon={<MdFileUpload />}
                  sx={{ textTransform: 'none', color: 'black', borderColor: 'black', '&:hover': { borderColor: 'black', backgroundColor: '#f5f5f5' } }}
                >
                  Upload Custom Cover
                </Button>
              </Box>

              {/* Invite Team Members */}
              <Box mb={3}>
                <Typography variant="body1" fontWeight="bold" mb={1} sx={{ fontFamily: 'Open Sans', textAlign: "left" }}>
                  Invite Team Members
                </Typography>
                <Box display="flex" mb={2}>
                  <TextField
                    fullWidth
                    placeholder="Enter email address"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{
                      backgroundColor: 'white',
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#ced4da',
                        },
                        '&:hover fieldset': {
                          borderColor: 'black',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'black',
                        },
                      },
                    }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddTeamMember}
                    sx={{ ml: 1, textTransform: 'none', minWidth: 80, backgroundColor: 'black', '&:hover': { backgroundColor: '#333' } }}
                  >
                    Invite
                  </Button>
                </Box>
                
              </Box>

              {/* Action Buttons */}
              <Box display="flex" gap={4} mt={4}>
                
                <Button
                  variant="contained"
                  type="submit"
                  sx={{ 
                    textTransform: 'none', 
                    backgroundColor: 'black', 
                    color: 'white',
                    '&:hover': { backgroundColor: '#333' }
                  }}
                >
                  Create Board
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Card>
    </Container>
  );
};

export default CreateBoard;