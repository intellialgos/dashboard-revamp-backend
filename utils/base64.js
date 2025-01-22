export function decodeBase64(base64String) {
    if (!base64String) {
      console.error("Input base64 string is empty or undefined.");
      return null;
    }
  
    try {
      // Decode the Base64 string
      const decodedString = Buffer.from(base64String, "base64").toString("utf-8");
  
      // Parse the decoded string as JSON
      return JSON.parse(decodedString);
    } catch (error) {
      console.error("Failed to decode or parse Base64 string:", error.message);
      return null;
    }
}

export function encodeBase64(jsonObject) {
    if (!jsonObject || typeof jsonObject !== "object") {
        console.error("Input must be a valid JSON object.");
        return null;
    }

    try {
        // Convert the object to a JSON string
        const jsonString = JSON.stringify(jsonObject);

        // Encode the JSON string to Base64
        return Buffer.from(jsonString, "utf-8").toString("base64");
    } catch (error) {
        console.error("Failed to encode JSON object to Base64:", error.message);
        return null;
    }
}  