import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import createDetectElementResize from "./vendor/detectElementResize";
export default class AutoSizer extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            height: this.props.defaultHeight || 0,
            width: this.props.defaultWidth || 0
        };
        this._onResize = () => {
            const { disableHeight, disableWidth, onResize } = this.props;
            if (this._parentNode) {
                const { height = 0, width = 0 } = this._parentNode.getBoundingClientRect();
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
                    });
                }
            }
        };
        this._setRef = (autoSizer) => {
            this._autoSizer = autoSizer;
        };
    }
    componentDidMount() {
        var _a, _b, _c;
        const { nonce } = this.props;
        if (((_c = (_b = (_a = this._autoSizer) === null || _a === void 0 ? void 0 : _a.parentNode) === null || _b === void 0 ? void 0 : _b.ownerDocument) === null || _c === void 0 ? void 0 : _c.defaultView) && this._autoSizer.parentNode instanceof this._autoSizer.parentNode.ownerDocument.defaultView.HTMLElement) {
            this._parentNode = this._autoSizer.parentNode;
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
    render() {
        const { children, className, disableHeight, disableWidth, style } = this.props;
        const { height, width } = this.state;
        const outerStyle = {
            overflow: 'visible'
        };
        const childParams = {};
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
        return _jsx("div", Object.assign({ className: className, ref: this._setRef, classStyle: Object.assign(Object.assign({}, outerStyle), style) }, this.props, { children: !bailoutOnChildren && children(childParams) }));
    }
}
AutoSizer.defaultProps = {
    onResize: () => { },
    disableHeight: false,
    disableWidth: false,
    style: {}
};
//# sourceMappingURL=lib.js.map