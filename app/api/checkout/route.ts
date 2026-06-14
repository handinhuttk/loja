import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, cpf, email } = body;

    const clientId = process.env.GATEWAY_CLIENT_ID;
    const clientSecret = process.env.GATEWAY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: 'Credenciais do Gateway não configuradas.' }, { status: 500 });
    }

    // AQUI ENTRA A INTEGRAÇÃO REAL COM O GATEWAY
    // Como você ainda não informou qual é a empresa do gateway (Ex: Efí, Asaas, etc),
    // estamos simulando o tempo de processamento de uma requisição HTTP real para a API deles.
    
    // Simula a latência da rede com a API bancária (1.5 segundos)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Exemplo de Payload de Sucesso do Gateway (Simulado para a UI funcionar agora)
    const mockPixCopiaECola = `00020101021126580014br.gov.bcb.pix0136${clientId}520400005303986540568.305802BR5913${nome?.substring(0,10) || 'Loja'}6009Sao Paulo62070503***63041A2B`;
    
    // Usando uma API pública para gerar a imagem do QR Code baseada no Copia e Cola
    const mockQrCodeImage = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(mockPixCopiaECola)}`;

    return NextResponse.json({
      success: true,
      message: 'PIX Gerado com sucesso via Gateway',
      pix: {
        copiaECola: mockPixCopiaECola,
        qrCodeUrl: mockQrCodeImage,
        expiresIn: 3600 // 1 hora
      }
    });

  } catch (error) {
    console.error("Erro ao processar checkout:", error);
    return NextResponse.json({ error: 'Erro interno ao processar o pagamento.' }, { status: 500 });
  }
}
