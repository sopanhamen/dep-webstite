import { MClassification } from '@shared/models/classification.model';

export class Organization {
  bgColor?: string;
  description?: string;
  icon?: string;
  imageUrl?: string;
  id?: string;
  name?: string;
  pillar?: string;
  sector?: string[];
  status: string;
  type?: string;
  website?: string;
  metadata?: any;
  imageId?: string;
  sectors?: string[];
  label?: string;
  value?: string;

  constructor(data: any) {
    this.bgColor = data?.metadata?.colorCode ?? '#06237a';
    this.description = data?.description || '';
    this.icon = data?.icon || '';
    this.id = data?.id || '';
    this.name = data?.name || '';
    this.pillar = data?.pillar?.code || '';
    this.sector = data?.sectors?.map((e: any) => e.name) || '';
    this.status = data?.status || '';
    this.type = data?.type?.code || '';
    this.website = data?.website || '';
    this.metadata = data?.metadata || '';
    this.imageUrl = data?.imageUrl || '';
    this.imageId = data?.imageId || '';
    this.sectors = data?.sectors?.map(
      (sector: MClassification) => sector?.code,
    );
    this.label = data?.name;
    this.value = data?.id;
  }
}
