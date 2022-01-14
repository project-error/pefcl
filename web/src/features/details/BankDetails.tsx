import React from 'react';
import { Button, Grid, Paper, Stack, Typography, Box } from '@mui/material';
import { useParams } from 'react-router-dom';

const BankDetails: React.FC = () => {
  const { id } = useParams();
  console.log('account id', id);

  return (
    <Grid item xs={8}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ padding: 1 }}>
            <Stack direction="row" spacing={2} alignItems="center" display="flex">
              <Box>
                <Typography sx={{ color: 'text.primary' }}>Bank ID: {id}</Typography>
              </Box>
              <Button variant="contained">Permissions</Button>
              <Button variant="contained">See transactions</Button>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} style={{ marginTop: 20 }}>
          <Paper variant="outlined" sx={{ padding: 1 }}>
            <Typography variant="h6">Recent transactions</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default BankDetails;
