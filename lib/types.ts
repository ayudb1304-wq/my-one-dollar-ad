export interface PixelBlock {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  image_url: string | null;
  color: string | null;
  display_name: string | null;
  destination_url: string | null;
}

export interface PixelSelection {
  x: number;
  y: number;
  width: number;
  height: number;
}
