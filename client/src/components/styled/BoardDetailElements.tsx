import styled from 'styled-components';
import { Paper, Typography, Chip, CircularProgress as MuiCircularProgress, MenuItem, Button } from '@mui/material';

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #F9FAFB;
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

export const FilterChip = styled(Chip)<{ $selected?: boolean }>`
  &.MuiChip-root {
    height: 30px;
    font-size: 0.8rem;
    font-weight: 500;
    padding: 6px 12px;
    border-radius: 16px;
    transition: all 0.2s ease-in-out;
    background: ${({ $selected }) => ($selected ? "linear-gradient(90deg, #6a11cb, #2575fc)" : "#f8f9fa")};
    color: ${({ $selected }) => ($selected ? "white" : "#495057")};
    border: ${({ $selected }) => ($selected ? "none" : "1px solid #dee2e6")};
    cursor: pointer;
  }

  &:hover {
    background: ${({ $selected }) => ($selected ? "#5b0dcd" : "#e9ecef")};
    transform: scale(1.05);
  }

  &.active {
    background: linear-gradient(90deg, #6a11cb, #2575fc);
    color: white;
  }
`;


export const FilterContainer = styled(Paper)`
  margin-top: 12px;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
  background: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const FilterTitle = styled(Typography)`
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
`;
export const AssignedFilterChip = styled(Chip)<{ $selected?: boolean }>`
  &.MuiChip-root {
    height: 30px;
    font-size: 0.8rem;
    font-weight: 500;
    padding: 6px 12px;
    border-radius: 16px;
    transition: all 0.2s ease-in-out;
    background: ${({ $selected }) => ($selected ? "linear-gradient(90deg, #34d399, #059669)" : "#f8f9fa")};
    color: ${({ $selected }) => ($selected ? "white" : "#495057")};
    border: ${({ $selected }) => ($selected ? "none" : "1px solid #dee2e6")};
    cursor: pointer;
  }

  &:hover {
    background: ${({ $selected }) => ($selected ? "#059669" : "#e9ecef")};
    transform: scale(1.05);
  }

  &.active {
    background: linear-gradient(90deg, #34d399, #059669);
    color: white;
  }
`;

export const FilterMenuButton = styled(Button)`
  && {
    background: #ffffff;
    color: #333;
    border: 1px solid #dee2e6;
    text-transform: none;
    font-weight: 500;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    gap: 6px;
    border-radius: 8px;
    transition: all 0.2s ease-in-out;

    &:hover {
      background: #f1f3f5;
    }
  }
`;

export const FilterMenuPaper = styled(Paper)`
  min-width: 180px;
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
`;

export const FilterMenuItem = styled(MenuItem)<{ $selected?: boolean }>`
  && {
    padding: 8px 16px;
    font-size: 0.9rem;
    font-weight: ${({ $selected }) => ($selected ? "600" : "400")};
    background: ${({ $selected }) => ($selected ? "#e9ecef" : "transparent")};
    transition: all 0.2s ease-in-out;
    
    &:hover {
      background: #e9ecef;
    }
  }
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
