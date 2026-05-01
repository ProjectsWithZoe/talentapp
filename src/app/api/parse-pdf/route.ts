import { NextRequest, NextResponse } from "next/server";
import { getDocumentProxy, extractText } from "unpdf";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength) > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "File too large. Maximum size is 5MB." }, { status: 413 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "File too large. Maximum size is 5MB." }, { status: 413 });
  }

  if (file.type !== "application/pdf") {
    return NextResponse.json({ error: "Only PDF files are accepted" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await getDocumentProxy(new Uint8Array(arrayBuffer));
  const { text } = await extractText(pdf, { mergePages: true });

  if (!text || text.trim().length < 50) {
    return NextResponse.json(
      { error: "Could not extract text from this PDF. Try copying and pasting your resume instead." },
      { status: 422 }
    );
  }

  return NextResponse.json({ text: text.trim() });
}
