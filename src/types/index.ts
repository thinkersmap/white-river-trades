export type ConstituencyMeta = {
  code: string;
  name: string;
  slug: string;
  region: string;
  overrides?: {
    metaTitle?: string;
    metaDescription?: string;
    shortDescription?: string;
  };
};
