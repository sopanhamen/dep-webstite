export interface IUserPermission extends IRole {
  roles?: IRole[];
  type?: string;
}

export interface IRole {
  permissionId?: string;
  code?: string;
  description?: string;
  has?: boolean;
  id: string;
  name?: string;
  sequence?: number;
  status?: string;
}
