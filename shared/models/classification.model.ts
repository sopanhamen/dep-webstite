export class MClassification {
  code: string;
  id: string;
  imageUrl: string;
  locale: string;
  metadata: string;
  name: string;
  // these two field was create to use with select
  value: string;
  label: string;

  constructor(classification: MClassification) {
    this.id = classification?.id;
    this.code = classification?.code;
    this.imageUrl = classification?.imageUrl;
    this.locale = classification?.locale;
    this.metadata = classification?.metadata;
    this.name = classification?.name;
    this.value = classification?.code;
    this.label = classification?.name;
  }
}
