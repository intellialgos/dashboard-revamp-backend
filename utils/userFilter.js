import { decodeBase64 } from "./base64.js";

export function userFilter (request) {
    const user = request.session.get('user');
    return decodeBase64(user?.filter);
}