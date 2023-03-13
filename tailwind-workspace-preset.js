module.exports = {
	darkMode: 'class', // or 'media' or 'class'
	theme: {
		extend: {
			maxHeight: {
				'1/10': '10%',
				'2/10': '20%',
				'3/10': '30%',
				'4/10': '40%',
				'5/10': '50%',
				'6/10': '60%',
				'7/10': '70%',
				'8/10': '80%',
				'9/10': '90%',
			},
		},
		colors: {
			// TODO: Once we have defined all the colors, refactor this
			black: '#000000',
			white: '#FFFFFF',
			transparent: 'transparent',
			primary: {
				400: "#409ECA",
				500: "#1E6A8D"
			},
			secondary: {
				400: "#FFDB58"
			},
			green: {
				300: "#51CF66"
			}
		},
	},

	variants: {
		extend: {},
	},
	plugins: [],
	mode: 'jit',
};
