export default function createDetectElementResize(nonce: any): {
    addResizeListener: (element: any, fn: any) => void;
    removeResizeListener: (element: any, fn: any) => void;
};
