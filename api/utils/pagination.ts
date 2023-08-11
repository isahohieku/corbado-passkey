export const paginate = <T>(
  array: T[] = [],
  page_size = 10,
  page_number = 1
): T[] => {
  return array.slice((page_number - 1) * page_size, page_number * page_size);
};
