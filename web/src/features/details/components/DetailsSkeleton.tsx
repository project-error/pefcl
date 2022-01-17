import React from 'react';
import { Skeleton, Stack, Box } from '@mui/material';

const DetailsSkeleton: React.FC = () => (
  <Stack direction="row" spacing={4}>
    <Box>
      <Box sx={{ mt: -1 }}>
        <Skeleton variant="text" height={20} width={200} />
      </Box>
      <Skeleton variant="text" height={30} width={250} />
    </Box>
  </Stack>
);

export default DetailsSkeleton;
