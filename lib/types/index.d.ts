export type Startup = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string | null | undefined;
  pitch: string;
  industry: string;
  fundingStage:
    | "pre-seed"
    | "seed"
    | "series-a"
    | "series-b"
    | "series-c"
    | "established";
  location: string;
  website?: string;
  founderId: string;
  founderName: string;
  teamSize: number;
  createdAt: string;
  updatedAt: string;
};