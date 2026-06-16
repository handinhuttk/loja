import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    
    console.log('📦 Webhook Recebido da FortPay:', payload);

    // Na FortPay, o status de sucesso vem como "paid"
    const status = payload.status;
    const transactionHash = payload.transaction_hash;

    if (status === 'paid') {
      console.log(`✅ Pagamento PIX da transação ${transactionHash} aprovado com sucesso!`);
      // Aqui você atualiza o status do pedido no seu banco de dados
      // Exemplo: await db.orders.update({ where: { hash: transactionHash }, data: { status: 'PAID' } })
    }

    // É OBRIGATÓRIO responder com status 200 para a FortPay saber que recebemos
    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error('Erro ao processar o Webhook da FortPay:', error);
    return NextResponse.json({ error: 'Erro no servidor' }, { status: 500 });
  }
}
