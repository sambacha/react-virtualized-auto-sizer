"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var React = require("react");
var detectElementResize_1 = require("./vendor/detectElementResize");
var AutoSizer = /** @class */ (function (_super) {
    __extends(AutoSizer, _super);
    function AutoSizer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            height: _this.props.defaultHeight || 0,
            width: _this.props.defaultWidth || 0
        };
        _this._onResize = function () {
            var _a = _this.props, disableHeight = _a.disableHeight, disableWidth = _a.disableWidth, onResize = _a.onResize;
            if (_this._parentNode) {
                // Guard against AutoSizer component being removed from the DOM immediately after being added.
                // This can result in invalid style values which can result in NaN values if we don't handle them.
                // See issue #150 for more context.
                var _b = _this._parentNode.getBoundingClientRect(), _c = _b.height, height = _c === void 0 ? 0 : _c, _d = _b.width, width = _d === void 0 ? 0 : _d;
                var style = window.getComputedStyle(_this._parentNode) || {};
                var paddingLeft = parseInt(style.paddingLeft, 10) || 0;
                var paddingRight = parseInt(style.paddingRight, 10) || 0;
                var paddingTop = parseInt(style.paddingTop, 10) || 0;
                var paddingBottom = parseInt(style.paddingBottom, 10) || 0;
                var newHeight = height - paddingTop - paddingBottom;
                var newWidth = width - paddingLeft - paddingRight;
                if (!disableHeight && _this.state.height !== newHeight || !disableWidth && _this.state.width !== newWidth) {
                    _this.setState({
                        height: height - paddingTop - paddingBottom,
                        width: width - paddingLeft - paddingRight
                    });
                    onResize({
                        height: height,
                        width: width
                    });
                }
            }
        };
        _this._setRef = function (autoSizer) {
            _this._autoSizer = autoSizer;
        };
        return _this;
    }
    AutoSizer.prototype.componentDidMount = function () {
        var _a, _b, _c;
        var nonce = this.props.nonce;
        // optional ch
        if (((_c = (_b = (_a = this._autoSizer) === null || _a === void 0 ? void 0 : _a.parentNode) === null || _b === void 0 ? void 0 : _b.ownerDocument) === null || _c === void 0 ? void 0 : _c.defaultView) && this._autoSizer.parentNode instanceof this._autoSizer.parentNode.ownerDocument.defaultView.HTMLElement) {
            // Delay access of parentNode until mount.
            // This handles edge-cases where the component has already been unmounted before its ref has been set,
            // As well as libraries like react-lite which have a slightly different lifecycle.
            this._parentNode = this._autoSizer.parentNode;
            // Defer requiring resize handler in order to support server-side rendering.
            // See issue #41
            this._detectElementResize = (0, detectElementResize_1["default"])(nonce);
            this._detectElementResize.addResizeListener(this._parentNode, this._onResize);
            this._onResize();
        }
    };
    AutoSizer.prototype.componentWillUnmount = function () {
        if (this._detectElementResize && this._parentNode) {
            this._detectElementResize.removeResizeListener(this._parentNode, this._onResize);
        }
    };
    AutoSizer.prototype.render = function () {
        var _a = this.props, children = _a.children, className = _a.className, disableHeight = _a.disableHeight, disableWidth = _a.disableWidth, style = _a.style;
        var _b = this.state, height = _b.height, width = _b.width;
        // Outer div should not force width/height since that may prevent containers from shrinking.
        // Inner component should overflow and use calculated width/height.
        // See issue #68 for more information.
        var outerStyle = {
            overflow: 'visible'
        };
        var childParams = {};
        // Avoid rendering children before the initial measurements have been collected.
        // At best this would just be wasting cycles.
        var bailoutOnChildren = false;
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
        return <div className={className} ref={this._setRef} classStyle={__assign(__assign({}, outerStyle), style)} {...this.props}>
      {/** @ts-ignore  */}
        {!bailoutOnChildren && children(childParams)}
      </div>;
    };
    AutoSizer.defaultProps = {
        onResize: function () { },
        disableHeight: false,
        disableWidth: false,
        style: {}
    };
    return AutoSizer;
}(React.PureComponent));
exports["default"] = AutoSizer;
