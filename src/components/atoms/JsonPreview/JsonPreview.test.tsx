import { JsonPreview } from '@/components/atoms/JsonPreview';
import { render, screen, fireEvent } from '@/tests/test-utils';
import { Promotion } from '@/types/promotion';

jest.mock('@/utils/generatePmdl', () => ({
  generatePmdl: jest.fn(() => '<pmdl>Mocked XML</pmdl>')
}));

describe('JsonPreview Component', () => {
  // Mock completo e válido
  const validMockPromotion: Promotion = {
    displayName: 'Promoção Teste',
    description: 'Descrição válida',
    enabled: true,
    priority: 1,
    conditions: [],
    qualifier: undefined,
    offer: {
      discountStructures: [
        {
          calculatorType: 'standard',
          discountType: 'percentOff',
          adjuster: 10,
          target: 'order'
        }
      ]
    },
    sites: []
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Deve renderizar corretamente o título do JSON Preview', () => {
    const { container } = render(<JsonPreview promotion={validMockPromotion} />);

    expect(screen.getByText('Payload OCC (JSON)')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('Deve gerar corretamente o JSON com os valores da promoção', () => {
    render(<JsonPreview promotion={validMockPromotion} />);

    const jsonElement = screen.getByTestId('json-preview');

    expect(jsonElement).toHaveTextContent('"displayName": "Promoção Teste"');
    expect(jsonElement).toHaveTextContent('"priority": 1');
    expect(jsonElement).toHaveTextContent('"templatePath": "order"');
    expect(jsonElement).toHaveTextContent('"templateName": "rawPmdlTemplate"');
  });

  it('Deve copiar o JSON ao clicar no botão', async () => {
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn()
      }
    });

    render(<JsonPreview promotion={validMockPromotion} />);

    const copyButton = await screen.findByTestId('copy-button');
    fireEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      expect.stringContaining('"displayName": "Promoção Teste"')
    );
  });
});
