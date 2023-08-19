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
		extend: {
			height: {
				'120': '30rem', // Example custom height value
				// Add more custom height values as needed
			},
		},
	},
};
