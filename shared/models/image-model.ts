import { ICON_URL } from '@shared/constant';

export class MFile {
  id: string;
  name: string;
  originalName?: string;
  status?: string;
  url: string;
  fileId?: string;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.originalName = data.originalName;
    this.status = data.status;
    this.url = data.url ?? ICON_URL.BROKEN;
    this.fileId = data.id;
  }
}

export class MDocument extends MFile {}

export class MVideo extends MFile {}

export class MImage extends MFile {}
