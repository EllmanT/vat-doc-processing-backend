import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY, // set this in .env.local
});
export async function parsePdf({ pdfUrl }) {
  const response = await anthropic.messages.create({
    model: 'claude-3-7-sonnet-latest',
    max_tokens: 2048,
    temperature: 0,
    tools: [
      {
        name: "extract_registration_info",
        description: "Extract structured registration data from a ZIMRA VAT or TIN registration certificate.",
        input_schema: {
          type: "object",
          properties: {
            docType: { type: "string", enum: ["VAT_CERTIFICATE", "TIN_CERTIFICATE"] },
            taxPayerName: { type: "string" },
            tradeName: { type: "string" },
            tinNumber: { type: "string" },
            vatNumber: { type: "string" }
          },
          required: ["docType", "taxPayerName", "tradeName", "tinNumber"]
        }
      }
    ],
    tool_choice: { type: "auto" },
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `
You are a document classifier and extractor.

First: **Determine if this document is either**:
- a VAT REGISTRATION CERTIFICATE ("VAT Certificate") issued by ZIMRA (Zimbabwe Revenue Authority), or
- a ZIMRA TIN / Taxpayer Registration Certificate ("TIN certificate").

Reject any other documents like invoices, generic Tax Certificates that are not TIN registration certificates, receipts, or credit notes, or any others.

Second: If and only if it is one of these two supported certificate types, extract and return the following using the extract_registration_info tool:
- docType: Use "VAT_CERTIFICATE" for VAT registration certificates and "TIN_CERTIFICATE" for TIN registration certificates.
- Tax Payer Name: Look for labels like "Taxpayer Name" or "Name of Registered Operator".
- Trade Name: Often labeled as "Trade Name" or "Trading As".
- TIN Number: Must be a 10-digit number starting with 200 or 100.
- VAT Number: For VAT certificates only, must be a 9-digit number starting with 220. For TIN certificates there is no VAT Number, so do NOT guess or fabricate one; if no VAT Number is present, leave this field empty.

Use OCR tolerance, correct common scan errors, and ignore invalid or incomplete documents. Do not guess. If the certificate is not valid or not one of the supported certificate types, DO NOT call the tool.
`
          },
          {
            type: 'document',
            source: {
              type: 'url',
              url: pdfUrl
            }
          }
        ]
      }
    ]
  });

  const toolUse = response.content.find(block => block.type === 'tool_use');

  if (!toolUse || !toolUse.input) {
    throw new Error("Document rejected or not a supported certificate type (VAT or TIN).");
  }

  const data = toolUse.input;

  return {
    docType: data.docType,
    regOperator: data.taxPayerName,
    regTradeName: data.tradeName,
    tinNumber: data.tinNumber,
    vatNumber: data.vatNumber && data.vatNumber.trim() !== "" ? data.vatNumber : null
  };
}
