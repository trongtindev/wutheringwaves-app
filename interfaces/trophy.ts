export interface ITrophy {
  slug: string;
  name: string;
  group: string;
  category: string;
  description: string;
  hidden?: string;
  dependOn?: string;
}

export interface ITrophyGroup {
  slug: string;
  name: string;
  total: number;
}

export interface ITrophyCategory {
  slug: string;
  name: string;
  total: number;
}
