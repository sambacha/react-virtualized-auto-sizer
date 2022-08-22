/// <reference types="@types/react" />
import * as React from "react";
declare module 'react' {
    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
        classStyle?: string;
    }
}
export declare type Size = {
    height: number;
    width: number;
};
export declare type Props = {
    children: (arg0: Size) => React.ReactElement<any>;
    className?: string;
    defaultHeight?: number;
    defaultWidth?: number;
    disableHeight: boolean;
    disableWidth: boolean;
    nonce?: string;
    onResize: (arg0: Size) => void;
    style: Record<string, any> | null | undefined;
};
declare type State = {
    height: number;
    width: number;
};
export declare type ResizeHandler = (element: HTMLElement, onResize: () => void) => void;
export declare type DetectElementResize = {
    addResizeListener: ResizeHandler;
    removeResizeListener: ResizeHandler;
};
export default class AutoSizer extends React.PureComponent<Props, State> {
    static defaultProps: {
        disableHeight: boolean;
        disableWidth: boolean;
        onResize: () => void;
        style: {};
    };
    state: State;
    _parentNode: HTMLElement | null | undefined;
    _autoSizer: HTMLElement | null | undefined;
    _detectElementResize: DetectElementResize;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): React.ReactElement<React.ComponentProps<"div">, "div">;
    _onResize: () => void;
    _setRef: (autoSizer: HTMLElement | null | undefined) => void;
}
export {};
