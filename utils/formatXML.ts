export const formatXmlToSingleLine = (xml: string): string => {
  return xml
    .replace(/<\?xml.*?\?>/, '') // Remove o cabeçalho <?xml version="1.0"?>
    .replace(/\n/g, '') // Remove quebras de linha
    .replace(/\s{2,}/g, ''); // Remove espaços extras entre as tags
};
