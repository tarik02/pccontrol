import path from 'node:path';
import { Config } from 'tailwindcss/types/config';

import { BuildConfig } from './BuildConfig';


const themeColor = (name: string): any => ({}: { opacityValue?: number }) => {
  return `var(--color-${name})`;
};

export default async (config: BuildConfig): Promise<Config> => ({
  content: [
    path.join(config.context, './src/**/*.{js,jsx,ts,tsx}'),
  ],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        primary: themeColor('primary'),
        secondary: themeColor('secondary'),
      },
    },
  },
  plugins: [],
});
