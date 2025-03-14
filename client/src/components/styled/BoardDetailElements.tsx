import styled from 'styled-components';
import { Paper, Typography, Chip, CircularProgress as MuiCircularProgress } from '@mui/material';

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f7fb;
`;

export const ContentContainer = styled.div`
  width: 100%;
  max-width: 100%;
  padding: 16px 24px;
`;

export const BoardHeader = styled.div`
  margin-bottom: 24px;
`;

export const BoardTitle = styled(Typography)`
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 1.5rem;
  color: #343a40;
`;

export const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #e9ecef;
`;

export const MemberAvatarGroup = styled.div`
  display: flex;
  margin-right: 12px;
`;

export const MemberAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #fff;
  margin-right: -8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  object-fit: cover;
`;

export const MemberCount = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: #495057;
  border: 2px solid #fff;
  font-weight: 500;
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

export const SearchFilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
`;

export const SearchContainer = styled.div`
  position: relative;
  flex-grow: 1;
  max-width: 400px;
`;

export const SearchIconWrapper = styled.div`
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: #adb5bd;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const FilterChip = styled(Chip)`
  &.MuiChip-root {
    height: 28px;
    font-size: 0.75rem;
    font-weight: 500;
  }
  
  &.active {
    background: linear-gradient(90deg, #9b87f5 0%, #7E69AB 100%);
    color: white;
  }
`;

export const FilterContainer = styled(Paper)`
  margin-top: 8px;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

export const FilterTitle = styled(Typography)`
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 8px;
  color: #495057;
`;

export const CircularProgress = styled(MuiCircularProgress)`
  color: #9b87f5;
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 64px);
`;

export const ErrorContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  text-align: center;
`;

export const ErrorMessage = styled.div`
  color: #d32f2f;
  font-weight: 500;
  margin-bottom: 16px;
`;
