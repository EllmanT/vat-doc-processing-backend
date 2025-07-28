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
        description: "Extract structured registration data from a ZIMRA VAT certificate.",
        input_schema: {
          type: "object",
          properties: {
            taxPayerName: { type: "string" },
            tradeName: { type: "string" },
            tinNumber: { type: "string" },
            vatNumber: { type: "string" }
          },
          required: ["taxPayerName", "tradeName", "tinNumber", "vatNumber"]
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

First: **Determine if this document is a VAT REGISTRATION CERTIFICATE**, also known as "VAT Certificate", issued by ZIMRA (Zimbabwe Revenue Authority). Reject any other documents like invoices, Tax Certificate, receipts, or credit notes or any others.

Second: If and only if it is a VAT certificate, extract and return the following using the extract_registration_info tool:
- Tax Payer Name: Look for labels like "Taxpayer Name" or "Name of Registered Operator"
- Trade Name: Often labeled as "Trade Name" or "Trading As"
- TIN Number: Must be a 10-digit number starting with 200
- VAT Number: Must be a 9-digit number starting with 220

Use OCR tolerance, correct common scan errors, and ignore invalid documents. Do not guess. If the certificate is not valid or complete, DO NOT call the tool.
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
    throw new Error("Document rejected or not a valid VAT certificate.");
  }

  const data = toolUse.input;

  return {
    regOperator: data.taxPayerName,
    regTradeName: data.tradeName,
    tinNumber: data.tinNumber,
    vatNumber: data.vatNumber
  };
}
