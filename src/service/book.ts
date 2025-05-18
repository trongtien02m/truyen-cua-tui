import decryptContent from '@/helpers/decryptContent';
// import { mappingBook } from '@/helpers/mappingType';
import { getToken } from '@/service/login';
// import mappingType from '@/helpers/mappingType';

export const searchBook = async ({
  query,
  page,
}: {
  query: string;
  page: number;
}) => {
  try {
    const url = `https://backend.metruyencv.com/api/books/search?keyword=${encodeURIComponent(
      query
    )}&page=${page}`;
    const response = await fetch(url);
    const data = await response.json();

    // const refinedData = data.data.map((d: any) => mappingBook(d));
    // console.log("🚀 ~ refinedData:", refinedData)

    return {
      data: data.data || [],
      totalPage: data.pagination.last,
    };
  } catch {
    return {
      error: 'Có lỗi xảy ra khi tìm kiếm',
    };
  }
};

export const fetchChapterContent = async (
  bookSlug: string,
  chapter: number
) => {
  try {
    const token = await getToken();
    const url = `https://metruyencv.com/truyen/${bookSlug}/chuong-${chapter}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Cookie: `accessToken=${token}`,
      },
    });
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
      content = content
        .map((item: string) =>
          item
            .replace(/"/g, '')
            .replace(/·/g, '')
            .replace(/(\d\.)\s(\d)/g, '$1$2')
        )
        .filter(
          (item: string) =>
            item.trim().length &&
            ![...item].every(
              (char) => char === '.' || [...item].every((char) => char === '-')
            )
        );

      return content;
    }
  } catch (err) {
    console.error('Error fetching chapter content:', err);
  }
};
