import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontSize: {
				// Standard heading sizes (industry standard)
				'h1': ['40px', { lineHeight: '1.2' }], // 30pt = ~40px
				'h2': ['30px', { lineHeight: '1.3' }], // 22pt = ~30px  
				'h3': ['24px', { lineHeight: '1.4' }], // 18pt = ~24px
				// Typography scale for proportional font sizing
				'story-xs': ['0.75rem', { lineHeight: '1.2' }],
				'story-sm': ['0.875rem', { lineHeight: '1.3' }],
				'story-base': ['1rem', { lineHeight: '1.5' }],
				'story-lg': ['1.125rem', { lineHeight: '1.5' }],
				'story-xl': ['1.25rem', { lineHeight: '1.6' }],
				'story-2xl': ['1.5rem', { lineHeight: '1.6' }],
				'story-3xl': ['1.875rem', { lineHeight: '1.7' }],
				'story-4xl': ['2.25rem', { lineHeight: '1.8' }],
				// Heading typography scale for h3 elements
				'story-h3-xs': ['1rem', { lineHeight: '1.3' }],
				'story-h3-sm': ['1.125rem', { lineHeight: '1.4' }],
				'story-h3-base': ['1.25rem', { lineHeight: '1.5' }],
				'story-h3-lg': ['1.5rem', { lineHeight: '1.5' }],
				'story-h3-xl': ['1.875rem', { lineHeight: '1.6' }],
				'story-h3-2xl': ['2.25rem', { lineHeight: '1.7' }],
				'story-h3-3xl': ['2.625rem', { lineHeight: '1.7' }],
				'story-h3-4xl': ['3rem', { lineHeight: '1.8' }],
				// Standard 21px font sizes
				'21px': ['21px', { lineHeight: '1.5' }],
				// Legacy system font classes
				'24-system': ['24px', { lineHeight: '1.4' }],
				'30-system': ['30px', { lineHeight: '1.3' }],
				'40-system': ['40px', { lineHeight: '1.2' }],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				tooltip: {
					DEFAULT: 'hsl(var(--tooltip))',
					foreground: 'hsl(var(--tooltip-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Story content semantic colors
				story: {
					text: 'hsl(var(--story-text))',
					'text-muted': 'hsl(var(--story-text-muted))',
					background: 'hsl(var(--story-background))'
				},
				// Status indicator colors
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))'
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))'
				},
				info: {
					DEFAULT: 'hsl(var(--info))',
					foreground: 'hsl(var(--info-foreground))'
				},
				'brand-brown': 'hsl(var(--medium-brown))'
			},
			fontFamily: {
				'handwritten': ['Kalam', 'Comic Sans MS', 'Arial', 'sans-serif'],
				'fun': ['Kalam', 'Comic Sans MS', 'Arial', 'sans-serif'],
				'georgia': ['Georgia', 'Times New Roman', 'serif'],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'slide-in-right': {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(0)' }
				},
				'slide-out-right': {
					'0%': { transform: 'translateX(0)' },
					'100%': { transform: 'translateX(100%)' }
				},
				'slide-in-left': {
					'0%': { transform: 'translateX(-100%)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'slide-in-right': 'slide-in-right 0.3s ease-out',
				'slide-out-right': 'slide-out-right 0.3s ease-out'
			},
			perspective: {
				'1000': '1000px',
			},
			transformStyle: {
				'preserve-3d': 'preserve-3d',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
	safelist: [
		// Ensure all typography scale classes are compiled
		'text-h1', 'text-h2', 'text-h3',
		'text-story-xs', 'text-story-sm', 'text-story-base', 'text-story-lg', 
		'text-story-xl', 'text-story-2xl', 'text-story-3xl', 'text-story-4xl',
		'text-story-h3-xs', 'text-story-h3-sm', 'text-story-h3-base', 'text-story-h3-lg',
		'text-story-h3-xl', 'text-story-h3-2xl', 'text-story-h3-3xl', 'text-story-h3-4xl',
		// Standard 21px classes and legacy system classes
		'text-21px', 'text-24-system', 'text-30-system', 'text-40-system', 'font-fun', 'font-georgia',
	],
} satisfies Config;
