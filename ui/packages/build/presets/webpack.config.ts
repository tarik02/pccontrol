import createWebpackConfig from '@pccontrol/build/src/webpack.config';
import path from 'node:path';


export default async (env: any, argv: any) => createWebpackConfig({
  mode: argv.mode ?? 'development',
  context: path.resolve(__dirname, '../../ui'),
  publicUrl: '',
});
