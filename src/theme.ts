export interface Theme {
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  accent: string;
  accentSoft: string;
  success: string;
  danger: string;
  border: string;
}

export const lightTheme: Theme = {
  background: '#F7FAFD',
  card: '#FFFFFF',
  text: '#10222E',
  textSecondary: '#5B7386',
  accent: '#1E88E5',
  accentSoft: '#DEEFFB',
  success: '#2E9E6B',
  danger: '#D64545',
  border: '#E1EAF2',
};

export const darkTheme: Theme = {
  background: '#0E1620',
  card: '#18232F',
  text: '#EAF2F8',
  textSecondary: '#8FA7B8',
  accent: '#4DA8F0',
  accentSoft: '#17324A',
  success: '#4CC38A',
  danger: '#E5686B',
  border: '#243342',
};
