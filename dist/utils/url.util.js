"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlUtil = void 0;
class UrlUtil {
    static getQuery(url, queryKey) {
        const queryString = url.split('?')[1];
        const queryObject = {};
        if (queryString) {
            const queryArray = queryString.split('&');
            queryArray.forEach((item) => {
                const key = item.split('=')[0];
                const value = item.split('=')[1];
                if (key && value !== undefined) {
                    queryObject[key] = decodeURIComponent(value);
                }
            });
        }
        return queryKey ? queryObject[queryKey] : queryObject;
    }
    static buildQueryString(params) {
        const queryArray = [];
        for (const [key, value] of Object.entries(params)) {
            if (value !== null && value !== undefined) {
                queryArray.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
            }
        }
        return queryArray.length > 0 ? `?${queryArray.join('&')}` : '';
    }
}
exports.UrlUtil = UrlUtil;
//# sourceMappingURL=url.util.js.map