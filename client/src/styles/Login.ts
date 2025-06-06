import styled from "styled-components";
import { TextField, Button, Typography } from "@mui/material";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Container = styled.div`
  display: flex;
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

const FormBox = styled.div`
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

const TabContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;
`;

const Tab = styled.div<{ active?: boolean }>`
  font-size: 18px;
  font-weight: 600;
  padding: 10px 0;
  width: 50%;
  text-align: center;
  cursor: pointer;
  border-bottom: ${(props) => (props.active ? "2px solid black" : "none")};
`;

const ErrorText = styled(Typography)`
  color: red;
  font-size: 14px;
  text-align: center;
`;

const StyledTextField = styled(TextField)`
  margin-top: 10px;
  background: #ffff;
`;

const FormActions = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 10px;
`;

const ForgotPasswordText = styled(Typography)`
  font-size: 14px;
  color: #1976d2;
  cursor: pointer;
`;

const SubmitButton = styled(Button)`
  color: white;
  width: 100%;
  text-decoration: none;
  margin-top: 10px;
  padding: 10px;
  background: balck;
  &:hover {
    background: #f0f0f0;
  }
`;

const DividerText = styled(Typography)`
  margin: 15px 0;
  font-size: 14px;
`;

const OAuthButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  width: 100%;
`;

const OAuthButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  width: 48%;
  border: 2px solid #f0f0f0 !important;
  background: white;
  text-transform: none;
  &:hover {
    background: #f0f0f0;
  }
`;

export {
  Wrapper,
  Container,
  FormBox,
  TabContainer,
  Tab,
  ErrorText,
  StyledTextField,
  FormActions,
  ForgotPasswordText,
  SubmitButton,
  DividerText,
  OAuthButtons,
  OAuthButton,
};
