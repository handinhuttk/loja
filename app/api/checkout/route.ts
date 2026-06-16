import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, cpf, email, telefone, cep, logradouro, numero, bairro, localidade, uf } = body;

    const publicKey = process.env.PAYSHARK_PUBLIC_KEY;
    const secretKey = process.env.PAYSHARK_SECRET_KEY;

    if (!publicKey || !secretKey) {
      return NextResponse.json({ error: 'Credenciais da Payshark não configuradas no servidor.' }, { status: 500 });
    }

    // Limpar document e phone (apenas números)
    const cleanDocument = cpf?.replace(/\D/g, '') || '';
    const cleanPhone = telefone?.replace(/\D/g, '') || '';
    const cleanCep = cep?.replace(/\D/g, '') || '';

    // Valor fixo R$ 68,30 em centavos = 6830
    const amountInCents = 6830;

    const paysharkPayload = {
      amount: amountInCents,
      paymentMethod: "pix",
      customer: {
        name: nome,
        email: email,
        document: {
          type: "cpf",
          number: cleanDocument
        },
        phone: cleanPhone,
        street: logradouro || "",
        number: numero || "",
        neighborhood: bairro || "",
        city: localidade || "",
        state: uf || "",
        zipCode: cleanCep
      },
      items: [
        {
          title: "Produto da Loja",
          unitPrice: amountInCents,
          quantity: 1,
          tangible: false
        }
      ]
    };

    const authHeader = 'Basic ' + Buffer.from(`${publicKey}:${secretKey}`).toString('base64');

    const response = await fetch(`https://api.paysharkgateway.com.br/v1/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(paysharkPayload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro da Payshark:", data);
      return NextResponse.json({ error: 'Erro ao gerar pagamento via Payshark.', details: data }, { status: 400 });
    }

    const pixData = data.pix || {};
    const copiaECola = pixData.qrcode || ''; // A Payshark retorna a string do Pix Copia e Cola no campo qrcode
    
    if (!copiaECola) {
      return NextResponse.json({ error: 'Resposta da Payshark sem dados de PIX válidos.', details: data }, { status: 400 });
    }

    // A Payshark não parece retornar a URL da imagem do QRCode, então geramos uma via API
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(copiaECola)}`;

    return NextResponse.json({
      success: true,
      message: 'PIX Gerado com sucesso via Payshark',
      pix: {
        copiaECola: copiaECola,
        qrCodeUrl: qrCodeUrl,
        expiresIn: 86400, // 24 horas
        transactionHash: data.id || data.secureId || 'hash_desconhecido'
      }
    });

  } catch (error) {
    console.error("Erro ao processar checkout:", error);
    return NextResponse.json({ error: 'Erro interno ao processar o pagamento.' }, { status: 500 });
  }
}
