import { BannerMediaType, EStatus } from '@shared/enum';
import { MLocaleParent } from './common.model';

export class Banner {
  id: string;
  locale?: MLocaleParent | null;
  name: string;
  status: string;
  type?: BannerMediaType;
  url: string;

  constructor(data: any) {
    this.id = data.id ?? data.fileId;
    this.locale = data?.locale ? new MLocaleParent(data.locale) : null;
    this.name = data.name ?? '';
    this.status = data.status ?? EStatus.ACTIVE;
    this.type = data.type ?? BannerMediaType.IMAGE;
    this.url = data.imageUrl ?? data.fileUrl ?? data.url;
  }
}
