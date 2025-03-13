import { XmlPreview } from './XmlPreview';

import { render, screen } from '@/tests/test-utils';

describe('XmlPreview', () => {
  const mockXml = `<pricing-model>
  <qualifier>
    <equals>
      <value>order.total</value>
      <constant>
        <data-type>number</data-type>
        <string-value>100</string-value>
      </constant>
    </equals>
  </qualifier>
</pricing-model>`;

  it('Deve renderizar corretamente o título do preview', () => {
    const { container } = render(<XmlPreview xml={mockXml} />);

    const heading = screen.getByRole('heading', { name: /preview do xml pmdl/i });
    expect(heading).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  it('Deve exibir o XML corretamente', async () => {
    render(<XmlPreview xml={mockXml} />);

    const xmlElement = screen.getByTestId('xml-preview');

    expect(xmlElement).toBeInTheDocument();

    expect(screen.getByText('order.total')).toBeInTheDocument();
  });
});
