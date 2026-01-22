declare module "react-modal" {
  import * as React from "react";

  export interface ReactModalProps {
    isOpen: boolean;
    onRequestClose?: (event?: React.SyntheticEvent) => void;
    contentLabel?: string;
    className?: string;
    overlayClassName?: string;
    ariaHideApp?: boolean;
    children?: React.ReactNode;
  }

  export default class Modal extends React.Component<React.PropsWithChildren<ReactModalProps>> {
    static setAppElement(element: string | HTMLElement): void;
  }
}
