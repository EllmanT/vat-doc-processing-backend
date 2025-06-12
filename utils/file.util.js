import {api} from "../convex/_generated/api.js"

import convex from "../config/convex.js";


export async function getFileDownloadUrl(fileId) {
  try {
    // Ensure fileId is of correct Convex Id type
    const downloadUrl = await convex.query(api.docs.getDocDownloadUrl, {
      fileId: fileId,
    });

    if (!downloadUrl) {
      throw new Error("Could not generate download URL");
    }

    return {
      success: true,
      downloadUrl,
    };

  } catch (error) {
    console.error("Error generating download URL", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

