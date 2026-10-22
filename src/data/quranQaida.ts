export interface QaidaItem {
  arabic: string;
  transliteration: string;
  audio: string;
}

export interface QaidaLesson {
  id: number;
  title: string;
  description: string;
  rules: string[];
  items: QaidaItem[];
}

export interface QaidaQnA {
  q: string;
  a: string;
}

export const quranQaidaData: QaidaLesson[] = [
  {
    id: 1,
    title: "Lesson 1: Huroof Mufridat",
    description: "Individual Arabic Letters",
    rules: [
      "There are 29 Mufridat letters.",
      "7 letters are always pronounced with a thick voice (Musta'aliyah): خ، ص، ض، غ، ط، ظ، ق",
      "Only 4 letters are pronounced from the lips: ب، ف، م، و",
      "3 letters produce a whistle-like sound (Safeeriyah): س، ص، ز"
    ],
    items: [
      { arabic: "ا", transliteration: "Alif", audio: "/audio/qaida/lesson1/01.m4a" },
      { arabic: "ب", transliteration: "Baa", audio: "/audio/qaida/lesson1/02.m4a" },
      { arabic: "ت", transliteration: "Taa", audio: "/audio/qaida/lesson1/03.m4a" },
      { arabic: "ث", transliteration: "Thaa", audio: "/audio/qaida/lesson1/04.m4a" },
      { arabic: "ج", transliteration: "Jeem", audio: "/audio/qaida/lesson1/05.m4a" },
      { arabic: "ح", transliteration: "Haa", audio: "/audio/qaida/lesson1/06.m4a" },
      { arabic: "خ", transliteration: "Khaa", audio: "/audio/qaida/lesson1/07.m4a" },
      { arabic: "د", transliteration: "Daal", audio: "/audio/qaida/lesson1/08.m4a" },
      { arabic: "ذ", transliteration: "Zaal", audio: "/audio/qaida/lesson1/09.m4a" },
      { arabic: "ر", transliteration: "Raa", audio: "/audio/qaida/lesson1/10.m4a" },
      { arabic: "ز", transliteration: "Zaa", audio: "/audio/qaida/lesson1/11.m4a" },
      { arabic: "س", transliteration: "Seen", audio: "/audio/qaida/lesson1/12.m4a" },
      { arabic: "ش", transliteration: "Sheen", audio: "/audio/qaida/lesson1/13.m4a" },
      { arabic: "ص", transliteration: "Saad", audio: "/audio/qaida/lesson1/14.m4a" },
      { arabic: "ض", transliteration: "Dhaad", audio: "/audio/qaida/lesson1/15.m4a" },
      { arabic: "ط", transliteration: "Taa (Heavy)", audio: "/audio/qaida/lesson1/16.m4a" },
      { arabic: "ظ", transliteration: "Zaa (Heavy)", audio: "/audio/qaida/lesson1/17.m4a" },
      { arabic: "ع", transliteration: "Ain", audio: "/audio/qaida/lesson1/18.m4a" },
      { arabic: "غ", transliteration: "Ghain", audio: "/audio/qaida/lesson1/19.m4a" },
      { arabic: "ف", transliteration: "Faa", audio: "/audio/qaida/lesson1/20.m4a" },
      { arabic: "ق", transliteration: "Qaaf", audio: "/audio/qaida/lesson1/21.m4a" },
      { arabic: "ك", transliteration: "Kaaf", audio: "/audio/qaida/lesson1/22.m4a" },
      { arabic: "ل", transliteration: "Laam", audio: "/audio/qaida/lesson1/23.m4a" },
      { arabic: "م", transliteration: "Meem", audio: "/audio/qaida/lesson1/24.m4a" },
      { arabic: "ن", transliteration: "Noon", audio: "/audio/qaida/lesson1/25.m4a" },
      { arabic: "و", transliteration: "Waw", audio: "/audio/qaida/lesson1/26.m4a" },
      { arabic: "ه", transliteration: "Haa", audio: "/audio/qaida/lesson1/27.m4a" },
      { arabic: "ء", transliteration: "Hamza", audio: "/audio/qaida/lesson1/28.m4a" },
      { arabic: "ي", transliteration: "Yaa", audio: "/audio/qaida/lesson1/29.m4a" }
    ]
  },
  {
    id: 2,
    title: "Lesson 2: Huroof Murakkabat",
    description: "Compound Letters",
    rules: [
      "Two or more letters join to form a Murakkab.",
      "Pronounce each letter separately like Mufridat.",
      "When joined, the shape changes.",
      "Identify letters by the number and position of dots."
    ],
    items: [
      { arabic: "بَ", transliteration: "Baa", audio: "/audio/qaida/lesson2/01.mp3" },
      { arabic: "تَ", transliteration: "Taa", audio: "/audio/qaida/lesson2/02.mp3" },
      { arabic: "ثَ", transliteration: "Thaa", audio: "/audio/qaida/lesson2/03.mp3" },
      { arabic: "جَ", transliteration: "Jeem", audio: "/audio/qaida/lesson2/04.mp3" },
      { arabic: "حَ", transliteration: "Haa", audio: "/audio/qaida/lesson2/05.mp3" },
      { arabic: "خَ", transliteration: "Khaa", audio: "/audio/qaida/lesson2/06.mp3" }
    ]
  },
  {
    id: 3,
    title: "Lesson 3: Harakat",
    description: "Fathah, Kasrah, Dammah",
    rules: [
      "Fathah (Zabar): Open mouth.",
      "Kasrah (Zayr): Drop voice.",
      "Dammah (Paysh): Round lips.",
      "Pronounce without stretching."
    ],
    items: [
      { arabic: "اَ", transliteration: "A", audio: "/audio/qaida/lesson3/01.mp3" },
      { arabic: "اِ", transliteration: "I", audio: "/audio/qaida/lesson3/02.mp3" },
      { arabic: "اُ", transliteration: "U", audio: "/audio/qaida/lesson3/03.mp3" },
      { arabic: "بَ", transliteration: "Ba", audio: "/audio/qaida/lesson3/04.mp3" },
      { arabic: "بِ", transliteration: "Bi", audio: "/audio/qaida/lesson3/05.mp3" },
      { arabic: "بُ", transliteration: "Bu", audio: "/audio/qaida/lesson3/06.mp3" }
    ]
  },
  {
    id: 4,
    title: "Lesson 4: Harakat Practice",
    description: "Reading words with Harakat",
    rules: [
      "Read Rawan (without spelling).",
      "Pronounce Harakaat correctly.",
      "Differentiate similar letters."
    ],
    items: [
      { arabic: "اَحَدٌ", transliteration: "Ahadun", audio: "/audio/qaida/lesson4/01.mp3" },
      { arabic: "كَتَبَ", transliteration: "Kataba", audio: "/audio/qaida/lesson4/02.mp3" },
      { arabic: "عَلِمَ", transliteration: "Alima", audio: "/audio/qaida/lesson4/03.mp3" }
    ]
  },
  {
    id: 5,
    title: "Lesson 5: Tanween",
    description: "Double Harakat",
    rules: [
      "Fathatayn, Kasratayn, Dammatayn are Tanween.",
      "Sounds like Noon Saakinah at the end."
    ],
    items: [
      { arabic: "بًا", transliteration: "Ban", audio: "/audio/qaida/lesson5/01.mp3" },
      { arabic: "بٍ", transliteration: "Bin", audio: "/audio/qaida/lesson5/02.mp3" },
      { arabic: "بٌ", transliteration: "Bun", audio: "/audio/qaida/lesson5/03.mp3" }
    ]
  }
];

export const quranQaidaQnA: QaidaQnA[] = [
  { q: "How many Mufridat letters are there?", a: "There are 29 Mufridat letters." },
  { q: "How many Musta'aliyah letters are there?", a: "There are 7 Musta'aliyah letters: خ، ص، ض، غ، ط، ظ، ق." },
  { q: "How are Musta'aliyah letters pronounced?", a: "Always with a thicker voice." },
  { q: "How many letters are pronounced by lips?", a: "4 letters: ب، ف، م، و." },
  { q: "How many Safeeriyah letters are there?", a: "3 letters: س، ص، ز." },
  { q: "What is meant by Harakaat?", a: "Fathah, Kasrah, and Dammah are Harakaat." },
  { q: "How are Harakaat pronounced?", a: "In Arabic accent without stretching or pausing." },
  { q: "What is Tanween?", a: "Fathatayn, Kasratayn, and Dammatayn are Tanween." }
];
