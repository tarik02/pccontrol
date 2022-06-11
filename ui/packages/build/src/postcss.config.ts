import autoprefixer from 'autoprefixer';
import tailwind from 'tailwindcss';

import { BuildConfig } from './BuildConfig';
import tailwindConfig from './tailwind.config';


export default async (config: BuildConfig) => ({
  plugins: [
    tailwind(
      await tailwindConfig(config)
    ),
    autoprefixer,
  ],
});
