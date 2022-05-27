import { ELanguage } from '@shared/enum';

export class MEvent {
  description: string;
  endDate: string;
  id: string;
  imageUrl: string;
  locationLink: string;
  meetingLink: string;
  startDate: string;
  status: string;
  title: string;

  constructor(data: any, language?: ELanguage) {
    this.description =
      language === ELanguage.KHMER
        ? data?.locale?.km?.description
        : data.description;
    this.endDate = data.endDate;
    this.id = data.id;
    this.imageUrl = data.imageUrl;
    this.locationLink = data.locationLink;
    this.meetingLink = data.meetingLink;
    this.startDate = data.startDate;
    this.status = data.status;
    this.title =
      language === ELanguage.KHMER ? data?.locale?.km?.title : data.title;
  }
}
