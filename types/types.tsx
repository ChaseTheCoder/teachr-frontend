export interface IPost {
  id: string;
  title: string;
  body: string | null;
  timestamp: string;
  user: string;
}

export interface IProfileBatch {
  id: string;
  teacher_name: string;
  title: string;
}