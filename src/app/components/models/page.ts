export interface Page<T> {
  content: T[];
  pageable: any;
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
  sort: any;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
