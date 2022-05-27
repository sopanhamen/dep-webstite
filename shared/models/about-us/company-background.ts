export class MCompanyBackground {
  id: string;
  titleKh: string;
  titleEn: string;
  descriptionKh: string;
  descriptionEn: string;
  imageUrl: string;
  imageId?: string;

  constructor(companyBackground: any) {
    this.id = companyBackground?.id || '';
    this.titleKh = companyBackground?.locale?.km?.title || '';
    this.titleEn = companyBackground?.locale?.en?.title || '';
    this.descriptionKh = companyBackground?.locale?.km?.description || '';
    this.descriptionEn = companyBackground?.locale?.en?.description || '';
    this.imageUrl = companyBackground?.imageUrl || '';
    this.imageId = companyBackground?.imageId || '';
  }
}
