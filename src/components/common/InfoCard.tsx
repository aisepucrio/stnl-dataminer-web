'use client'

import { Box, Typography, Skeleton } from '@mui/material';

type InfoCardProps = {
  label: string;
  value: number;
  isLoading?: boolean;
};

const InfoCard = ({ label, value, isLoading = false }: InfoCardProps) => {
  return (
    <Box
      sx={{
        width: 1446,
        height: 1020,
        borderRadius: '50px',
        bgcolor: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: 3,
      }}
    >
      {isLoading ? (
        <>
          <Skeleton variant="rectangular" width={1016} height={187} />
          <Skeleton
            variant="rectangular"
            width={459}
            height={275}
            sx={{ mt: 4 }}
          />
        </>
      ) : (
        <>
          <Box
            sx={{
              width: 1016,
              height: 187,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography variant="h4" color="text.secondary">
              {label}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 459,
              height: 275,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mt: 4,
            }}
          >
            <Typography variant="h2" color="text.primary">
              {value}
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
};

export default InfoCard;
