import * as React from "react";
import createDetectElementResize from "./vendor/detectElementResize";

type H = (s: string) => void;


declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // extends React's HTMLAttributes
    classStyle?: string;
  }
}

export type Size = {
  height: number;
  width: number;
};


export type Props = {
  /** Function responsible for rendering children.*/
  children: (arg0: Size) => React.ReactElement<any>;

  /** Optional custom CSS class name to attach to root AutoSizer element.  */
  className?: string;

  /** Default height to use for initial render; useful for SSR */
  defaultHeight?: number;

  /** Default width to use for initial render; useful for SSR */
  defaultWidth?: number;

  /** Disable dynamic :height property */
  disableHeight: boolean;

  /** Disable dynamic :width property */
  disableWidth: boolean;

  /** Nonce of the inlined stylesheet for Content Security Policy */
  nonce?: string;

  /** Callback to be invoked on-resize */
  onResize: (arg0: Size) => void;

  /** Optional inline style */
  style: Record<string, any> | null | undefined;
};
type State = {
  height: number;
  width: number;
};
export type ResizeHandler = (element: HTMLElement, onResize: () => void) => void;
export type DetectElementResize = {
  addResizeListener: ResizeHandler;
  removeResizeListener: ResizeHandler;
};
export default class AutoSizer extends React.PureComponent<Props, State> {
  static defaultProps: {
    disableHeight: boolean;
    disableWidth: boolean;
    onResize: () => void;
    style: {};
  } = {
    onResize: () => {},
    disableHeight: false,
    disableWidth: false,
    style: {}
  };
  state: State = {
    height: this.props.defaultHeight || 0,
    width: this.props.defaultWidth || 0
  };
  _parentNode: HTMLElement | null | undefined;
  _autoSizer: HTMLElement | null | undefined;
  _detectElementResize: DetectElementResize;

  componentDidMount() {
    const {
      nonce
    } = this.props;

    // optional ch
    if (this._autoSizer?.parentNode?.ownerDocument?.defaultView && this._autoSizer.parentNode instanceof this._autoSizer.parentNode.ownerDocument.defaultView.HTMLElement) {
      // Delay access of parentNode until mount.
      // This handles edge-cases where the component has already been unmounted before its ref has been set,
      // As well as libraries like react-lite which have a slightly different lifecycle.
      this._parentNode = this._autoSizer.parentNode;
      // Defer requiring resize handler in order to support server-side rendering.
      // See issue #41
      this._detectElementResize = createDetectElementResize(nonce);

      this._detectElementResize.addResizeListener(this._parentNode, this._onResize);

      this._onResize();
    }
  }

  componentWillUnmount() {
    if (this._detectElementResize && this._parentNode) {
      this._detectElementResize.removeResizeListener(this._parentNode, this._onResize);
    }
  }

  render(): React.ReactElement<React.ComponentProps<"div">, "div"> {
    const {
      children,
      className,
      disableHeight,
      disableWidth,
      style
    } = this.props;
    const {
      height,
      width
    } = this.state;
    // Outer div should not force width/height since that may prevent containers from shrinking.
    // Inner component should overflow and use calculated width/height.
    // See issue #68 for more information.
    const outerStyle: Record<string, any> = {
      overflow: 'visible'
    };
    const childParams: Record<string, any> = {};
    // Avoid rendering children before the initial measurements have been collected.
    // At best this would just be wasting cycles.
    let bailoutOnChildren = false;

    if (!disableHeight) {
      if (height === 0) {
        bailoutOnChildren = true;
      }

      outerStyle.height = 0;
      childParams.height = height;
    }

    if (!disableWidth) {
      if (width === 0) {
        bailoutOnChildren = true;
      }

      outerStyle.width = 0;
      childParams.width = width;
    }

    

 //   @ts-ignore
    return <div className={className} ref={this._setRef} classStyle={{ ...outerStyle,
      ...style
    }} {...this.props}>
      {/** @ts-ignore  */}
        {!bailoutOnChildren && children(childParams)}
      </div>;
  }

  _onResize: () => void = () => {
    const {
      disableHeight,
      disableWidth,
      onResize
    } = this.props;

    if (this._parentNode) {
      // Guard against AutoSizer component being removed from the DOM immediately after being added.
      // This can result in invalid style values which can result in NaN values if we don't handle them.
      // See issue #150 for more context.
      const {
        height = 0,
        width = 0
      } = this._parentNode.getBoundingClientRect();

      const style = window.getComputedStyle(this._parentNode) || {};
      const paddingLeft = parseInt(style.paddingLeft, 10) || 0;
      const paddingRight = parseInt(style.paddingRight, 10) || 0;
      const paddingTop = parseInt(style.paddingTop, 10) || 0;
      const paddingBottom = parseInt(style.paddingBottom, 10) || 0;
      const newHeight = height - paddingTop - paddingBottom;
      const newWidth = width - paddingLeft - paddingRight;

      if (!disableHeight && this.state.height !== newHeight || !disableWidth && this.state.width !== newWidth) {
        this.setState({
          height: height - paddingTop - paddingBottom,
          width: width - paddingLeft - paddingRight
        });
        onResize({
          height,
          width,
       //   Record: undefined
        });
      }
    }
  };
  _setRef: (autoSizer: HTMLElement | null | undefined) => void = (autoSizer: HTMLElement | null | undefined) => {
    this._autoSizer = autoSizer;
  };
}