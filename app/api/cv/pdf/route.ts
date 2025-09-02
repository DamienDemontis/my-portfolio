import { NextResponse } from 'next/server';
import { pdf } from '@react-pdf/renderer';
import cv from '@/data/cv.json';
import { Document, Page, Text } from '@react-pdf/renderer';

function CVDoc() {
  return (
    <Document>
      <Page>
        <Text>{cv.name}</Text>
        {cv.experiences.map((exp) => (
          <Text key={exp.company}>{`${exp.role} - ${exp.company}`}</Text>
        ))}
      </Page>
    </Document>
  );
}

export async function GET() {
  const pdfBuffer = await pdf(<CVDoc />).toBuffer();
  return new NextResponse(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=cv.pdf',
    },
  });
}
