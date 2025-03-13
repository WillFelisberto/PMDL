import PromotionBuilder from 'pages/PromotionBuilder';

import { headers } from 'next/headers';

export async function generateMetadata() {
  const host = (await headers()).get('host');
  const baseUrl = `https://${host}`;

  return {
    title: 'Gerador de Promoções PMDL',
    description: 'Crie e gerencie promoções PMDL com qualificadores, condições e descontos.',
    openGraph: {
      title: 'Gerador de Promoções PMDL',
      description: 'Crie e gerencie promoções PMDL com qualificadores, condições e descontos.',
      url: baseUrl,
      images: [
        {
          url: `${baseUrl}/imagem-preview.png`,
          width: 1200,
          height: 630,
          alt: 'Gerador de Promoções PMDL'
        }
      ]
    }
  };
}

export default function Page() {
  return <PromotionBuilder />;
}
