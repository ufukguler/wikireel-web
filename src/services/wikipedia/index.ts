import axios from 'axios';

export interface WikiItem {
  title: string;
  extract: string;
  fullurl: string | null;
  imageUrl: string;
}

interface WikiItemResponse {
  title: string;
  extract: string;
  fullurl?: string;
  canonicalurl?: string;
  original: {
    source: string;
  };
}

let currentLanguage = 'en';

export const setWikipediaLanguage = (languageCode: string) => {
  currentLanguage = languageCode;
};

async function fetchAndParseWikipediaContent(): Promise<WikiItem[]> {
  try {
    const response = await axios.get(`https://${currentLanguage}.wikipedia.org/w/api.php`, {
      params: {
        action: 'query',
        format: 'json',
        generator: 'random',
        grnnamespace: 0,
        grnlimit: 50,
        prop: 'extracts|pageimages|info',
        inprop: 'url',
        explaintext: 1,
        exintro: 1,
        exsectionformat: 'plain',
        piprop: 'original|thumbnail',
        pithumbsize: 1000,
        origin: '*'
      }
    });

    const pages: WikiItemResponse[] = response.data.query?.pages || [];
    const results: WikiItem[] = [];

    for (const pageId in pages) {
      const page = pages[pageId];
      if (page.title && page.extract && page.original && page.original.source) {
        results.push({
          title: page.title,
          extract: page.extract,
          fullurl: page.fullurl || page.canonicalurl || null,
          imageUrl: page.original.source
        });
      }
    }

    return results;
  } catch (error) {
    console.error('Error fetching Wikipedia data:', error);
    return [];
  }
}

export {fetchAndParseWikipediaContent};