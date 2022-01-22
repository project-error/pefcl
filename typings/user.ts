export type UserDTO = {
  source: number;
  identifier?: string;
};

export interface User {
  source: number;
  identifier: string;
}
