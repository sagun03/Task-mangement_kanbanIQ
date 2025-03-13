import { Backdrop, CircularProgress } from "@mui/material";
import styled from "styled-components";

const StyledBackdrop = styled(Backdrop)`
  color: #fff;
  z-index: 1301;
`;

const LoadingOverlay = ({ loading }: { loading: boolean }) => {
  return (
    <StyledBackdrop open={loading}>
      <CircularProgress color="inherit" />
    </StyledBackdrop>
  );
};

export default LoadingOverlay;
