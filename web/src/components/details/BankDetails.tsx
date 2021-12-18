import React from 'react';
import { Button, Grid, Paper, Stack, Typography } from "@mui/material";

const BankDetails: React.FC = () => {
	return (
		<Grid item xs={8}>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Paper variant="outlined" sx={{ padding: 1 }}>
						<Stack direction="row" spacing={2}>
							<Button variant="contained">Permissions</Button>
							<Button variant="contained">See transactions</Button>
						</Stack>
					</Paper>
				</Grid>
				<Grid item xs={12}>
					<Paper variant="outlined" sx={{ padding: 1 }}>
						<Typography variant="h6">Recent transactions</Typography>
					</Paper>
				</Grid>
			</Grid>
		</Grid>
	)
}

export default BankDetails;