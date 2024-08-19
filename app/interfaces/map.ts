import type * as L from 'leaflet';

export interface IPin {
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

export interface IMapSettings {
  opacity: number;
  pinCluster: boolean;
  hideMarkedPins: boolean;
}

export interface IMapMarker {
  type: string;
  marker: L.Marker;
  opacity?: number;
  hidden?: boolean;
}

export interface IMapPinSummary {
  content?: string;
}
