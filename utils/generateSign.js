import crypto from 'crypto';
import dotenv from 'dotenv';
import { API_SECRET_KEY, APP_ID } from '../config/const.js';
// import stringify from 'safe-stable-stringify';
dotenv.config();

// function simpleStringify(object) {
//     const simpleObject = {};
//     for (const prop in object) {
//         if (!object.hasOwnProperty(prop)) {
//             continue;
//         }
//         if (typeof(object[prop]) == 'object') {
//             continue;
//         }
//         if (typeof(object[prop]) == 'function') {
//             continue;
//         }
//         simpleObject[prop] = object[prop];
//     }
//     return JSON.stringify(simpleObject);
// }

// Function to generate a signature
export function generateSignature({payload, timestamp}) {
    const stringPayload = JSON.stringify(payload);
    const stringToSign = `${stringPayload}.${APP_ID}.${timestamp}.${API_SECRET_KEY}`;
    const signature = crypto.createHash("sha256").update(stringToSign).digest("hex").toLowerCase();
    console.log("STRING PAYLOAD: ", stringPayload);

    console.log("SIGNATURE: ", signature);

    return signature;
}