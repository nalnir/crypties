// tailwind.config.js
const { join } = require('path');

module.exports = {
	presets: [require('./tailwind-workspace-preset.js')],
	content: [
		'./node_modules/flowbite/**/*.js',
		'./node_modules/flowbite-react/**/*.js',
		join(__dirname, './src/**/*.{js,ts,jsx,tsx}')
	],
	theme: {
		extend: {},
	},
};
