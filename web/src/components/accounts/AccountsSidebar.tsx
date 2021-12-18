import React, { useCallback } from 'react';
import { useAccountsValue } from "../../state/accounts.state";
import { Box, Grid, Input } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AccountList from "./AccountList";

const AccountsSidebar: React.FC = () => {
	const accounts = useAccountsValue();
	
	const navigate = useNavigate();
	
	const handleChangeAccount = useCallback((id: string) => {
		navigate(`/account/${id}`)
	}, [accounts, navigate]);
	
	return (
		<Grid item xs={3}>
			<Box sx={{
				display: 'flex',
				justifyContent: 'flex-start',
				paddingLeft: 2,
			}}
			>
				<Input fullWidth placeholder="Search for accounts"/>
			</Box>
			<AccountList
				accounts={accounts}
				handleChangeAccount={handleChangeAccount}
			/>
		</Grid>
	)
}

export default AccountsSidebar;