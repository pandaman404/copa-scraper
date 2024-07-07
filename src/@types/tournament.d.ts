export interface Team {
  name: string;
  image: string;
}

export interface Tournament {
  [group: string]: Team[];
}
