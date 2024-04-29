import { CoinType } from '../type/type';

/**
 * 북마크 여부 판별
 */
export function checkBookMark(bookmarkJson: string, id: string) {
  return JSON.parse(bookmarkJson).filter((item: CoinType) => item.id === id).length > 0 ? true : false;
}
