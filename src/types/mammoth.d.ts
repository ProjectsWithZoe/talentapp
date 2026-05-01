declare module "mammoth/mammoth.browser" {
  interface ExtractResult {
    value: string;
    messages: Array<{ type: string; message: string }>;
  }
  export function extractRawText(options: { arrayBuffer: ArrayBuffer }): Promise<ExtractResult>;
}
