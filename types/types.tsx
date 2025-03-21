export interface IGrade {
  id: string;
  grade: string;
}

export interface ITag {
  id: string;
  tag: string;
}

export interface IPost {
  id: string;
  title: string;
  body: string | null;
  timestamp: string;
  user: string;
  upvotes: number;
  downvotes: number;
  has_upvoted: boolean | null;
  has_downvoted: boolean | null;
  comments: number;
  grades: IGrade[];
  tags: ITag[];
}

export interface IProfileBatch {
  id: string;
  teacher_name: string;
  title: string;
  verified: boolean;
  profile_pic_url: string | null;
}

export interface IProfile {
  id: string;
  auth0_id: string;
  first_name: string;
  last_name: string;
  teacher_name: string;
  title: string;
  profile_pic: string;
  verified: boolean;
  email_domain: string;
  verified_email: string;
  profile_pic_url: string | null;
}

export interface EditorProps {
  onChange: (data: string) => void;
  value: string;
  placeholder?: string;
  setIsTextFieldFocused?: (focused: boolean) => void;
}