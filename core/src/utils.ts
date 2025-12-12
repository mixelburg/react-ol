import { Feature } from "ol";
import BaseLayer from "ol/layer/Base";
import { StyleLike } from "ol/style/Style";
import { ReactNode } from "react";
import ReactDOMServer from "react-dom/server";

export type MapLayersMap = Record<string, BaseLayer>;

export type Coordinates = {
  long: number;
  lat: number;
};

export type BaseFeatureProps = {
  style?: StyleLike;
  properties?: Record<string, any>;
  visible?: boolean;
  onClick?: (feature: Feature, event: any) => void;
  onMouseEnter?: (feature: Feature, event: any) => void;
  onMouseExit?: (feature: Feature, event: any) => void;
  hoverStyle?: StyleLike;
};

export const reactIconToSrc = (element: ReactNode) => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(ReactDOMServer.renderToStaticMarkup(element))}`;
};
