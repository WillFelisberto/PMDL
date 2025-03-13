'use client';
import { Promotion } from '@/types/promotion';
import { Prism as ReactSyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { formatXmlToSingleLine } from 'utils/formatXML';
import { generatePmdl } from 'utils/generatePmdl';

type JsonPreviewProps = {
  promotion: Promotion;
};

export const JsonPreview = ({ promotion }: JsonPreviewProps) => {
  const isValidPromotion = () => {
    return (
      promotion.displayName.trim() !== '' &&
      promotion.description.trim() !== '' &&
      promotion.priority !== null &&
      promotion.offer.discountStructures.length > 0 &&
      promotion.offer?.discountStructures?.[0]?.target?.trim() !== ''
    );
  };

  const generateOccPayload = () => {
    return {
      displayName: promotion.displayName,
      description: promotion.description,
      enabled: true,
      priority: promotion.priority,
      templatePath: promotion.offer.discountStructures[0].target,
      templateName: 'rawPmdlTemplate',
      sites: [
        {
          repositoryId: 'siteUS'
        }
      ],
      templateValues: {
        pmdl: {
          xml: formatXmlToSingleLine(generatePmdl(promotion))
        }
      }
    };
  };

  // Só exibe o JSON se todos os campos estiverem preenchidos
  if (!isValidPromotion()) {
    return null;
  }

  const jsonString = JSON.stringify(generateOccPayload(), null, 2);

  return (
    <div className="mt-8 space-y-4">
      <h3 className="text-lg font-semibold text-gray-700">Payload OCC (JSON)</h3>

      <div className="rounded-lg overflow-hidden border border-gray-200 relative">
        <button
          data-testid="copy-button"
          onClick={() => navigator.clipboard.writeText(jsonString)}
          className="absolute right-2 top-2 bg-gray-800 text-white px-3 py-1 rounded-md text-sm hover:bg-gray-700 transition-colors"
        >
          Copiar
        </button>

        <ReactSyntaxHighlighter
          language="json"
          style={atomDark}
          data-testid="json-preview"
          customStyle={{
            padding: '1.5rem',
            fontSize: '0.875rem',
            lineHeight: '1.5',
            margin: 0
          }}
        >
          {jsonString}
        </ReactSyntaxHighlighter>
      </div>
    </div>
  );
};
