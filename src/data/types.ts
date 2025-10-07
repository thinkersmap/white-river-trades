export type ConstituencyMetaOverrides = {
  metaTitle?: string;
  metaDescription?: string;
  shortDescription?: string;
};

export type ConstituencyMeta = {
  code: string;
  name: string;
  slug: string;
  region: string;
  overrides?: ConstituencyMetaOverrides;
};