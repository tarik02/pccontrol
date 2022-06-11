export type CommonBuildConfig = {
  context: string;
  publicUrl: string;
};

export type DevelopmentBuildConfig = CommonBuildConfig & {
  mode: 'development';
};

export type ProductionBuildConfig = CommonBuildConfig & {
  mode: 'production';
};

export type BuildConfig =
| DevelopmentBuildConfig
| ProductionBuildConfig;
