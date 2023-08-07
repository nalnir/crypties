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
				400: '#409ECA',
				500: '#1E6A8D',
			},
			secondary: {
				400: '#FFDB58',
			},
			green: {
				300: '#51CF66',
			},
			purple: {
				100: '#C9A0DC',
				300: '#7D3C98',
			},
			card: {
				common: '#A0A0A0',
				rare: '#4A80D9',
				epic: '#9B59B6',
				legendary: '#F5B041',
				mythical: '#E74C3C',
				cosmic: '#17A589',
				transcendent: '#FF5733',
			}
		},
	},

	variants: {
		extend: {},
	},
	plugins: [],
	mode: 'jit',
};
