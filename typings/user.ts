export type UserDTO = {
  name?: string;
  source: number;
  identifier?: string;
};

export interface User {
  name: string;
  identifier: string;
}

export interface OnlineUser extends User {
  source: number;
}
