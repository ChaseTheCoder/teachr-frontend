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
  user: string;
  title: string;
  body: string | null;
  timestamp: string;
  upvotes: number;
  downvotes: number;
  has_upvoted: boolean | null;
  has_downvoted: boolean | null;
  comments: number;
  grades: IGrade[];
  tags: ITag[];
  group: IGroupPost | null;
  is_public: boolean;
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

export interface IGroup {
  id: string;
  title: string;
  about: string;
  created_at: string;
  is_public: boolean;
  member_count: number;
  is_member: boolean;
  is_admin: boolean;
  is_pending: boolean;
  profile_pic: string | null;
  profile_pic_url: string | null;
}

export type IGroupList = IGroup[];

export interface IGroupPost {
  id: string;
  title: string;
  is_public: boolean;
}

export interface IGroupDetail {
  id: string;
  title: string;
  about: string;
  created_at: string;
  is_public: boolean;
  member_count: number;
  admins: IProfileBatch[];
  is_member: boolean;
  is_admin: boolean;
  is_pending: boolean;
  profile_pic: string | null;
  profile_pic_url: string | null;
}

export interface IGroupMembers {
  admins?: IProfileBatch[];
  members: IProfileBatch[];
  pending?: IProfileBatch[];
}