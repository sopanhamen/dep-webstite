export class UserRole {
  createdAt: string;
  id: string;
  name: string;
  status: string;

  constructor(data: any) {
    this.createdAt = data.createdAt;
    this.id = data.id;
    this.name = data.name;
    this.status = data.status;
  }
}
