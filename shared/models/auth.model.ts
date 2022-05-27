export interface IUser {
  createdAt?: string;
  deletedAt?: string;
  deletedBy?: string;
  email?: string;
  id?: string;
  isAllowLogin?: number;
  lastChangedPasswordAt?: string;
  permissions?: string[];
  phone?: string;
  positionId?: string;
  profile?: IProfile;
  role?: IRole;
  securityNumber?: number;
  status?: string;
  updatedAt?: string;
}

export interface IProfile {
  address?: string;
  addressString?: string;
  city?: string;
  country?: string;
  dob?: string;
  firstName?: string;
  fullName?: string;
  gender?: string;
  height?: string;
  lastName?: string;
  middleName?: string;
  profileImage?: string;
  state?: string;
  weight?: string;
  zipCode?: string;
}

export interface IRole {
  code?: string;
  id?: string;
  name?: string;
  status?: string;
}
