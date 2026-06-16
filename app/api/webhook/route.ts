import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    
    console.log('📦 Webhook Recebido da Payshark:', payload);

    // O status e dados podem variar de acordo com o webhook da Payshark
    const status = payload.status;
    const transactionId = payload.id || payload.transaction_hash;
    const amount = payload.amount || 6830;
    
    // Na Payshark/Shield, status aprovado costuma ser "paid" ou "approved"
    if (status === 'paid' || status === 'approved') {
      console.log(`✅ Pagamento PIX da transação ${transactionId} aprovado com sucesso!`);
      
      // Aqui você atualizaria o status do pedido no seu banco de dados
      // Exemplo: await db.orders.update({ where: { hash: transactionId }, data: { status: 'PAID' } })

      // Enviar evento de Purchase para a API de Conversões do Meta (CAPI)
      const accessToken = process.env.META_ACCESS_TOKEN;
      const pixelId = '1328054679432373';
      
      if (accessToken) {
        const valueInReais = (amount / 100).toFixed(2);
        
        const capiPayload = {
          data: [
            {
              event_name: 'Purchase',
              event_time: Math.floor(Date.now() / 1000),
              action_source: 'website',
              custom_data: {
                currency: 'BRL',
                value: parseFloat(valueInReais),
              }
              // Opcional: enviar event_id para desduplicação e user_data (email, fbp, fbc) para maior precisão
            }
          ]
        };

        try {
          const fbRes = await fetch(`https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(capiPayload)
          });
          
          const fbData = await fbRes.json();
          console.log("CAPI Response:", fbData);
        } catch (fbErr) {
          console.error("Erro ao enviar para API de Conversões:", fbErr);
        }
      } else {
        console.log("⚠️ META_ACCESS_TOKEN não configurado. Evento Purchase (CAPI) não foi enviado.");
      }
    }

    // É OBRIGATÓRIO responder com status 200 para a Payshark saber que recebemos
    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error('Erro ao processar o Webhook da Payshark:', error);
    return NextResponse.json({ error: 'Erro no servidor' }, { status: 500 });
  }
}
