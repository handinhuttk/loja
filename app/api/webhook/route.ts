import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // A maioria dos gateways envia um JSON no corpo (body) da requisição
    const payload = await request.json();
    
    console.log('📦 Webhook Recebido da Sync Pay:', payload);

    // Aqui você processaria a lógica de aprovação. Por exemplo:
    // 1. Pegar o ID do pedido no payload
    // 2. Verificar o status (ex: status === 'approved' ou 'paid')
    // 3. Atualizar o banco de dados marcando o pedido como pago
    // 4. Disparar email/mensagem no WhatsApp para o cliente

    const status = payload.status || payload.event;

    if (status === 'approved' || status === 'paid' || status === 'pix_paid') {
      console.log('✅ Pagamento PIX aprovado com sucesso!');
      // Atualize o status do pedido no seu banco de dados
    }

    // É OBRIGATÓRIO responder com status 200 rapidamente
    // para que o Gateway saiba que você recebeu a notificação.
    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error('Erro ao processar o Webhook:', error);
    // Mesmo em caso de erro, às vezes é bom retornar 200 para o gateway não ficar repetindo indefinidamente,
    // mas o padrão HTTP para erro é 500 ou 400.
    return NextResponse.json({ error: 'Erro no servidor' }, { status: 500 });
  }
}
