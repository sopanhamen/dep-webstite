export class UserVerification {
  description: string;
  email: string;
  fullName: string;
  id: string;
  organizationIcon: string;
  organizationName: string;
  organizationPillar: string;
  organizationSector: string[];
  organizationType: string;
  phoneNumber: string;
  projectOwner: string;
  status: string;
  userRole: string;
  website: string;

  constructor(data: any) {
    this.description = data.organization?.description;
    this.email = data.email;
    this.fullName = data.profile.fullName;
    this.id = data.id;
    this.organizationIcon = data.organization?.imageUrl;
    this.organizationName = data.organization?.name;
    this.organizationPillar = data.organization?.name;
    this.organizationSector = data.organization?.sectors?.map(
      (e: any) => e.name,
    );
    this.organizationType = data.organization?.type?.name;
    this.phoneNumber = data.phone;
    this.projectOwner = data.projects?.map((e: any) => e.name);
    this.status = data.status;
    this.userRole = data.primaryRole?.name;
    this.website = data.organization?.website;
  }
}
