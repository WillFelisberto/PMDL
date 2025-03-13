'use client';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

type XmlPreviewProps = {
  xml: string;
};

export const XmlPreview = ({ xml }: XmlPreviewProps) => {
  return (
    <div className="mt-8 space-y-4">
      <h3 className="text-lg font-semibold text-gray-700">Preview do XML PMDL</h3>

      <div className="rounded-lg overflow-hidden border border-gray-200 relative">
        <button
          onClick={() => navigator.clipboard.writeText(xml)}
          className="absolute right-2 top-2 bg-gray-800 text-white px-3 py-1 rounded-md text-sm hover:bg-gray-700 transition-colors"
        >
          Copiar
        </button>

        <SyntaxHighlighter
          language="xml"
          style={atomDark}
          data-testid="xml-preview"
          customStyle={{
            padding: '1.5rem',
            fontSize: '0.875rem',
            lineHeight: '1.5',
            margin: 0
          }}
        >
          {xml}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};
