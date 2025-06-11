import { api } from "@/convex/_generated/api";
import convex from "@/lib/convexClient";
import { NextResponse } from "next/server";
import { getFileDownloadUrl } from "@/lib/actions/getFileDownloadUrl";
import { parsePdf } from "@/lib/parsePdf";

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*", // Or set to specific origin
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function POST(req: Request) {

  try {
    const formData = await req.formData();
    const file = formData.get("tax_certificate") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    if (
      !file.type.includes("pdf") &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      return NextResponse.json(
        { success: false, error: "Only PDF files allowed" },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Generate upload URL
    const uploadUrl = await convex.mutation(api.docs.generateUploadUrl, {});
    const arrayBuffer = await file.arrayBuffer();

    // Upload file to Convex storage
    const uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "Content-Type": file.type,
      },
      body: new Uint8Array(arrayBuffer),
    });

    if (!uploadResponse.ok) {
      throw new Error(`Failed to upload file: ${uploadResponse.statusText}`);
    }

    const { storageId } = await uploadResponse.json();
    const fileUrl = await getFileDownloadUrl(storageId);

    const data = await parsePdf({ pdfUrl: fileUrl.downloadUrl! });
    console.log("PDF parse result:", data);

    return NextResponse.json(
      {
        message:"Document processed successfully",
        success: true,
        data,
      },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error("Upload error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}
