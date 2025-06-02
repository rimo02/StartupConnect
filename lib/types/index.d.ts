export type Startup = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
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
  founderName: string;
  teamSize: number;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
};