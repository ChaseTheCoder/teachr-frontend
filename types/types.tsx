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

export interface IProfile {
  id: string;
  auth0_id: string;
  first_name: string;
  last_name: string;
  teacher_name: string;
  title: string;
  profile_pic: string;
}

export interface EditorProps {
  onChange: (data: string) => void;
  value: string;
  placeholder?: string;
  setIsTextFieldFocused?: (focused: boolean) => void;
}