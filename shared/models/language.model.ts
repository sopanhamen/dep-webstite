export class MLanguage {
  code: string;
  id: string;
  imageUrl: string;
  locale: string;
  name: string;

  constructor(language: MLanguage) {
    this.code = language?.code || '';
    this.id = language?.id || '';
    this.imageUrl = language?.imageUrl || '';
    this.locale = language?.locale || '';
    this.name = language?.name || '';
  }
}
