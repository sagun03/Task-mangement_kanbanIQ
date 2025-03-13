import React from "react";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  count?: number;
  title?: boolean;
  variant?: "text" | "circular" | "rectangular" | "rounded";
}

const SkeletonLoader: React.FC<SkeletonProps> = ({
  width = "100%",
  height = 20,
  count = 1,
  title = false,
  variant = "text",
}) => {
  return (
    <Box display="flex" width="100%" flexDirection="column" gap={2}>
      {title && <Skeleton variant="text" width="30%" height={24} />}
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton
          key={index}
          variant={variant}
          width={width}
          height={height}
          animation="wave"
        />
      ))}
    </Box>
  );
};

export default SkeletonLoader;
