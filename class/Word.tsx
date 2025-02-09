export class Word {
  private id: number;
  private partOfSpeech: string;
  private word: string;
  private category: string;
  private meaning_en: string;
  private meaning_mm: string;
  private meaning_ch: string;
  private meaning_kr: string;
  private furigana: string;
  private romaji: string;
  private tags: string[];
  private favorite: boolean | null;

  constructor(
    id: number,
    word: string,
    category: string,
    meaning_en: string,
    meaning_mm: string,
    meaning_ch: string,
    meaning_kr: string,
    furigana: string,
    romaji: string,
    tags: string[],
    favorite: boolean | null,
    partOfSpeech: string
  ) {
    this.id = id;
    this.word = word;
    this.category = category;
    this.meaning_en = meaning_en;
    this.meaning_mm = meaning_mm;
    this.meaning_kr = meaning_kr;
    this.meaning_ch = meaning_ch;
    this.furigana = furigana;
    this.romaji = romaji;
    this.tags = tags;
    this.favorite = favorite;
    this.partOfSpeech = partOfSpeech;
  }
}

export class FlashCard extends Word {
  private image: string;
  private audio: string;
  private lastReviewed: string;
  private exampleSentences: string;

  constructor(
    id: number,
    word: string,
    category: string,
    meaning_en: string,
    meaning_mm: string,
    meaning_kr: string,
    meaning_ch: string,
    furigana: string,
    romaji: string,
    tags: string[],
    favorite: boolean | null,
    partOfSpeech: string,
    image: string,
    audio: string,
    lastReviewed: string,
    exampleSentences: string
  ) {
    super(
      id,
      word,
      category,
      meaning_en,
      meaning_mm,
      meaning_ch,
      meaning_kr,
      furigana,
      romaji,
      tags,
      favorite,
      partOfSpeech
    );
    this.image = image;
    this.audio = audio;
    this.lastReviewed = lastReviewed;
    this.exampleSentences = exampleSentences;
  }
}
