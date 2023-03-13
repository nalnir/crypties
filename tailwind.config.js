// tailwind.config.js
const { join } = require('path');

module.exports = {
  presets: [
		require('./tailwind-workspace-preset.js'),
	],
  content: [
    join(__dirname, './src/**/*.{js,ts,jsx,tsx}'),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
