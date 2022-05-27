import { MClassification } from '@shared/models/classification.model';
import { Organization } from '@shared/models/user-management/organization.model';

export class MUser {
  id: string;
  name: string;
  email: string;
  userRole: string;
  createdAt: string;
  status: string;

  constructor(user: any) {
    this.id = user?.id;
    this.name = user?.profile?.fullName;
    this.email = user?.email;
    this.userRole = user?.primaryRole?.name;
    this.createdAt = user?.createdAt;
    this.status = user?.status;
  }
}

export interface IUserPayload {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  organizationId?: any;
  projectIds: string[];
  organization?: Partial<Organization>;
}

export class MUserDetail {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  projectIds: string[];
  organizationId: string;
  organization: Organization;

  constructor(user: any) {
    this.id = user?.id || '';
    this.fullName = user?.profile?.fullName || '';
    this.email = user?.email || '';
    this.phone = user?.phone || '';
    this.role = user?.primaryRole?.code;
    this.projectIds = user?.projects?.map(
      (project: MClassification) => project?.id,
    ) || [''];
    this.organizationId = user?.organization?.id || '';
    this.organization = new Organization(user?.organization);
  }
}

export interface IUpdateUserPayload {
  id: string;
  body: IUserPayload;
}
