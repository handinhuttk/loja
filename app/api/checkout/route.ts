import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, cpf, email, telefone, cep, logradouro, numero, bairro, localidade, uf } = body;

    const apiToken = process.env.FORTPAY_API_TOKEN;
    const offerHash = process.env.FORTPAY_OFFER_HASH;
    const productHash = process.env.FORTPAY_PRODUCT_HASH;

    if (!apiToken || !offerHash || !productHash) {
      return NextResponse.json({ error: 'Credenciais da FortPay não configuradas no servidor.' }, { status: 500 });
    }

    // Limpar document e phone (apenas números)
    const cleanDocument = cpf?.replace(/\D/g, '') || '';
    const cleanPhone = telefone?.replace(/\D/g, '') || '';
    const cleanCep = cep?.replace(/\D/g, '') || '';

    // Valor fixo R$ 68,30 em centavos = 6830
    const amountInCents = 6830;

    const fortpayPayload = {
      amount: amountInCents,
      offer_hash: offerHash,
      payment_method: "pix",
      customer: {
        name: nome,
        email: email,
        phone_number: cleanPhone,
        document: cleanDocument,
        street_name: logradouro || "",
        number: numero || "",
        neighborhood: bairro || "",
        city: localidade || "",
        state: uf || "",
        zip_code: cleanCep
      },
      cart: [
        {
          product_hash: productHash,
          title: "Produto da Loja",
          price: amountInCents,
          quantity: 1,
          operation_type: 1,
          tangible: false
        }
      ],
      expire_in_days: 1,
      transaction_origin: "api",
      postback_url: "https://ofertacopadomundobr.vercel.app/api/webhook"
    };

    const response = await fetch(`https://api.fortpayplataforma.com.br/api/public/v1/transactions?api_token=${apiToken}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fortpayPayload)
    });

    const data = await response.json();

    // A FortPay pode retornar o objeto da transação diretamente ou dentro de um wrapper
    const transaction = data.data || data;

    if (!response.ok || !transaction.hash) {
      console.error("Erro da FortPay:", data);
      return NextResponse.json({ error: 'Erro ao gerar pagamento via FortPay.', details: data }, { status: 400 });
    }

    // Extrair os dados do PIX
    const copiaECola = transaction.pix?.pix_qr_code || transaction.pix_code || '';
    
    // Se a API não devolver a imagem base64, nós geramos a imagem a partir do código Copia e Cola
    const qrCodeUrl = transaction.pix?.qr_code_base64 
      ? `data:image/png;base64,${transaction.pix.qr_code_base64}` 
      : transaction.qr_code 
        ? transaction.qr_code
        : `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(copiaECola)}`;

    return NextResponse.json({
      success: true,
      message: 'PIX Gerado com sucesso via FortPay',
      pix: {
        copiaECola: copiaECola,
        qrCodeUrl: qrCodeUrl,
        expiresIn: 86400, // 24 horas
        transactionHash: transaction.hash
      }
    });

  } catch (error) {
    console.error("Erro ao processar checkout:", error);
    return NextResponse.json({ error: 'Erro interno ao processar o pagamento.' }, { status: 500 });
  }
}
