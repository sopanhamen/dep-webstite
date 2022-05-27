export class ActivityStream {
  activities: Activity[];
  createdAt: string;
  id: string;
  name: string;
  role: string;

  constructor(data: any) {
    this.activities = data.activities?.map((e: any) => new Activity(e));
    this.createdAt = data.createdAt;
    this.id = data.id;
    this.name = data.profile?.fullName;
    this.role = data.primaryRole?.name;
  }
}

class Activity {
  action: string;
  createdAt: string;
  referenceType: string;

  constructor(data: any) {
    this.action = data.action;
    this.createdAt = data.createdAt;
    this.referenceType = data.referenceType;
  }
}
