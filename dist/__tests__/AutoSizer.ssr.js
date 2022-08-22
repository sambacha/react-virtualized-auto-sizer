import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { renderToString } from 'react-dom/server';
import AutoSizer from '../index';
test('should render content with default widths and heights initially', () => {
    const rendered = renderToString(_jsx(AutoSizer, Object.assign({ defaultHeight: 100, defaultWidth: 200 }, { children: ({ height, width }) => _jsx("div", { children: `height:${height};width:${width}` }) })));
    expect(rendered).toContain('height:100');
    expect(rendered).toContain('width:200');
});
//# sourceMappingURL=AutoSizer.ssr.js.map