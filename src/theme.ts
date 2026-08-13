export interface Theme {
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  accent: string;
  accentSoft: string;
  /** Pressed-state variant of accentSoft: darker in light mode, lighter in
   *  dark mode so pressed feedback stays visible on dark backgrounds. */
  accentSoftPressed: string;
  success: string;
  danger: string;
  border: string;
}

export const lightTheme: Theme = {
  background: '#F7FAFD',
  card: '#FFFFFF',
  text: '#10222E',
  textSecondary: '#5B7386',
  // 4.88:1 on accentSoft, 5.75:1 on card — AA for the selected-chip and
  // today-column text that sits on accentSoft (was #1E88E5 at 3.1:1).
  accent: '#1565C0',
  accentSoft: '#DEEFFB',
  accentSoftPressed: '#C7E1F5',
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
  accentSoftPressed: '#1F4260',
  success: '#4CC38A',
  danger: '#E5686B',
  border: '#243342',
};
