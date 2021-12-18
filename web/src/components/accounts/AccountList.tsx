import React, { memo } from 'react';
import { List, ListItem, ListItemText, ListSubheader } from "@mui/material";
import { Account, AccountType } from "../../../../typings/accounts";

interface AccountListProps {
	accounts: Account[];
	handleChangeAccount: (id: string) => void;
}

const AccountList: React.FC<AccountListProps> = ({ accounts, handleChangeAccount }) => {
	return (
		<>
			<List
				disablePadding
				subheader={
					<ListSubheader
						style={{
							backgroundColor: '#FAFAFA'
						}}
					>
						Personal
					</ListSubheader>}
			>
				{accounts.filter((a) => a.type === AccountType.Personal).map((account) => (
					<ListItem divider button onClick={() => handleChangeAccount(account.id)}>
						<ListItemText primary={account.accountName} secondary={`$${account.balance}`}/>
					</ListItem>
				))}
			</List>
			<List
				disablePadding
				subheader={
					<ListSubheader
						style={{
							backgroundColor: '#FAFAFA'
						}}
					>
						Shared
					</ListSubheader>}
			>
				{accounts.filter((a) => a.type === AccountType.Shared).map((account) => (
					<ListItem divider button>
						<ListItemText primary={account.accountName} secondary={`$${account.balance}`}/>
					</ListItem>
				))}
			</List>
		</>
	)
}

export default memo(AccountList);