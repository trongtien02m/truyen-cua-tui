import decryptContent from '@/helpers/decryptContent';

export const fetchChapterContent = async (
  bookSlug: string,
  chapter: number
) => {
  console.log('fetch Chapter Content', bookSlug, chapter);

  try {
    const url = `https://metruyencv.com/truyen/${bookSlug}/chuong-${chapter}`;
    const response = await fetch(url);
    const html = await response.text();
    const match = html.match(/content:\s*"(.*?)"/);

    if (match && match[1]) {
      let encryptContent = match[1];
      encryptContent = encryptContent.replace(/\\\//g, '/');
      encryptContent = encryptContent.replace(/\\n/g, '\n');
      encryptContent = encryptContent.replace(/\\t/g, '\t');
      encryptContent = encryptContent.replace(/\\"/g, '"');
      encryptContent = encryptContent.replace(/\\\\/g, '\\');

      let content = decryptContent(encryptContent);
      content = content.map((item: string) =>
        item
          .replace(/"/g, '')
          .replace('·', '')
          .replace(/(\d\.)\s(\d)/g, '$1$2')
      );

      return content;
    }
  } catch (err) {
    console.error('Error fetching chapter content:', err);
  }
};
