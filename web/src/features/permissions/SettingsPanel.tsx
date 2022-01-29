import React from 'react';
import { Typography } from "@mui/material";
import IconLabelButton from "../../components/IconLabelButton";
import DeleteIcon from '@mui/icons-material/Delete';

const SettingsPanel: React.FC = () => {
	return (
		<div>
			<IconLabelButton variant="contained" icon={<DeleteIcon />}>
				Delete
			</IconLabelButton>
		</div>
	)
}

export default SettingsPanel;