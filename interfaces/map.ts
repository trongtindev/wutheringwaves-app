export interface IMarker {
  id: number;
  type: string;
  lng: number;
  lat: number;
}

export interface IMapCategory {
  type: 'self' | 'characters' | 'markers';
  name: string;
  items?: string[];
}
