import colors from './colors';

const {
	white,
	black,
	neutral,
	muted,
	oficial,
	light,
	dark,
	green,
	lightGreen,
	darkGreen,
	blue,
	lightBlue,
	darkBlue,
	orange,
	lightOrange,
	darkOrange,
	red,
	lightRed,
	darkRed,
	textPrimary,
	textSecondary,
	textDisabled,
	bgPrimary,
	bgSecondary,
	border,
	secondary,
	lightSecondary,
	darkSecondary,
	tableHead,
	backgroundMessasge,
	colorMessage
} = colors;

export default {
	common: {
		black,
		white,
		neutral,
		muted
	},
	primary: {
		contrastText: white,
		main: oficial,
		light: light,
		dark: dark
	},
	secondary: {
		contrastText: white,
		main: secondary,
		light: lightSecondary,
		dark: darkSecondary
	},
	success: {
		contrastText: white,
		main: green,
		light: lightGreen,
		dark: darkGreen
	},
	info: {
		contrastText: white,
		main: blue,
		light: lightBlue,
		dark: darkBlue
	},
	warning: {
		contrastText: white,
		main: orange,
		light: lightOrange,
		dark: darkOrange
	},
	danger: {
		contrastText: white,
		main: red,
		light: lightRed,
		dark: darkRed
	},
	text: {
		primary: textPrimary,
		secondary: textSecondary,
		disabled: textDisabled
	},
	background: {
		default: bgPrimary,
		dark: bgSecondary,
		paper: white
	},
	table: {
		tableHead,
		tableRowPrimary: bgPrimary,
		tableRowSecondary: white
	},
	message: {
		background: backgroundMessasge,
		color: colorMessage
	},
	border,
	divider: border
};
