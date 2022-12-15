import React, { memo } from 'react';
import { Typography, Box } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { BoxInput, Helper, LabelHelper, Required, InputSelectSearch } from './style';

const colors = {
	white: '#FFFFFF',
	green: '#336666',
	textSecondary: '#66788A',
	red: '#ED4740',
	border: '#DFE3E8',
	tableHead: '#E9ECEF',
	disabledBackground: '#E0E0E0'
};
<<<<<<< Updated upstream
function FormSelectWithSearch(props) {
	const {
		name,
		label,
		placeholder,
		labelHelper,
		value,
		onChange,
		error,
		disabled,
		options,
		labelColor = colors.textSecondary,
		helperColor = colors.red,
		required = false,
		onFocus,
		onBlur,
		getOptionLabel
	} = props;
=======

function FormSelectWithSearch({
	name,
	label,
	placeholder,
	labelHelper,
	value,
	onChange,
	error,
	disabled,
	options,
	labelColor = colors.textSecondary,
	helperColor = colors.red,
	required = false,
	onFocus,
	onBlur,
	getOptionLabel
}) {
>>>>>>> Stashed changes
	return (
		<BoxInput>
			<Box display='flex' flexDirection='row'>
				<Typography title={label} variant='h6'>
					{label}
				</Typography>
				{required && <Required>*</Required>}
				{labelHelper && (
					<LabelHelper labelcolor={labelColor} title={labelHelper}>
						( {labelHelper} )
					</LabelHelper>
				)}
			</Box>
<<<<<<< Updated upstream
			<Autocomplete
				options={options}
=======

			<Autocomplete
				multiple
>>>>>>> Stashed changes
				getOptionLabel={
					getOptionLabel ? (
						getOptionLabel
					) : (
						() => {
<<<<<<< Updated upstream
							option => options.label;
						}
					)
				}
=======
							options => options.label;
						}
					)
				}
				options={options}
>>>>>>> Stashed changes
				disabled={disabled}
				onChange={onChange}
				onFocus={onFocus}
				onBlur={onBlur}
				value={value}
				{...name}
<<<<<<< Updated upstream
				{...props}
=======
>>>>>>> Stashed changes
				style={{
					padding: '0px !important',
					paddingRight: '62px !important',
					height: 40
				}}
				renderInput={params => (
					<InputSelectSearch
						{...params}
						placeholder={placeholder}
						error={error}
						variant='outlined'
						margin='dense'
						fullwidth
					/>
				)}
			/>
			{error && <Helper helpercolor={helperColor}>{error}</Helper>}
		</BoxInput>
	);
}

const testName = (prev, next) => {
	return (
		prev.name.value === next.name.value &&
		prev.value === next.value &&
		prev.error === next.error &&
		prev.disabled === next.disabled &&
		prev.options === next.options &&
		prev.onChange === next.onChange
	);
};

const testValue = (prev, next) => {
	return (
		prev.name === next.name &&
		prev.value === next.value &&
		prev.error === next.error &&
		prev.disabled === next.disabled &&
		prev.options === next.options &&
		prev.onChange === next.onChange
	);
};

const arePropsEqual = (prev, next) => {
	if (prev.name && next.name) {
		return testName(prev, next);
	}

	return testValue(prev, next);
};

<<<<<<< Updated upstream
export default memo(FormSelectWithSearch, arePropsEqual);
=======
export { FormSelectWithSearch, arePropsEqual };
>>>>>>> Stashed changes
