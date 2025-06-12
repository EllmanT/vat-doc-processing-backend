import fetch from "node-fetch";
import {api} from "../convex/_generated/api.js"
import convex from "../config/convex.js";
import { getFileDownloadUrl } from "../utils/file.util.js";
import { parsePdf } from "../services/parsePdf.js";



// POST handler
 export const processDocument= async( req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, error: "No file provided" });
    }

    if (
      !file.mimetype.includes("pdf") &&
      !file.originalname.toLowerCase().endsWith(".pdf")
    ) {
      return res.status(400).json({ success: false, error: "Only PDF files allowed" });
    }

    const uploadUrl = await convex.mutation(api.docs.generateUploadUrl, {});

    const uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "Content-Type": file.mimetype,
      },
      body: file.buffer,
    });

    if (!uploadResponse.ok) {
      throw new Error(`Failed to upload file: ${uploadResponse.statusText}`);
    }

    const { storageId } = await uploadResponse.json();
    const fileUrl = await getFileDownloadUrl(storageId);


    const data = await parsePdf({ pdfUrl: fileUrl.downloadUrl });

    return res.status(200).json({
      message: "Document processed successfully",
      success: true,
      data,
    });

  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

