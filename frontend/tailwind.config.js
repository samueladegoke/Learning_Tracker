/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				primary: {
					'50': '#fefce8',
					'100': '#fef9c3',
					'200': '#fef08a',
					'300': '#fde047',
					'400': '#facc15',
					'500': '#eab308',
					'600': '#ca8a04',
					'700': '#a16207',
					'800': '#854d0e',
					'900': '#713f12',
					'950': '#422006',
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				accent: {
					'50': '#fdf4ff',
					'100': '#fae8ff',
					'200': '#f5d0fe',
					'300': '#f0abfc',
					'400': '#e879f9',
					'500': '#d946ef',
					'600': '#c026d3',
					'700': '#a21caf',
					'800': '#86198f',
					'900': '#701a75',
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				surface: {
					'50': '#f8fafc',
					'100': '#f1f5f9',
					'200': '#e2e8f0',
					'300': '#cbd5e1',
					'400': '#94a3b8',
					'500': '#64748b',
					'600': '#475569',
					'700': '#334155',
					'800': '#1e293b',
					'900': '#0f172a',
					'950': '#020617'
				},
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			borderColor: {
				border: 'hsl(var(--border))'
			},
			fontFamily: {
				display: [
					'Outfit',
					'system-ui',
					'sans-serif'
				],
				body: [
					'DM Sans',
					'system-ui',
					'sans-serif'
				],
				mono: [
					'JetBrains Mono',
					'Fira Code',
					'monospace'
				]
			},
			animation: {
				'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				float: 'float 6s ease-in-out infinite',
				glow: 'glow 2s ease-in-out infinite alternate'
			},
			keyframes: {
				float: {
					'0%, 100%': {
						transform: 'translateY(0)'
					},
					'50%': {
						transform: 'translateY(-10px)'
					}
				},
				glow: {
					'0%': {
						boxShadow: '0 0 5px rgb(250 204 21 / 0.4), 0 0 20px rgb(250 204 21 / 0.2)'
					},
					'100%': {
						boxShadow: '0 0 10px rgb(250 204 21 / 0.6), 0 0 40px rgb(250 204 21 / 0.3)'
					}
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
}

