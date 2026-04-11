import type { ProductAnalytics } from '../types';

export const getSmartInsight = (data: ProductAnalytics) => {
    const { performance } = data;
    const rating = performance.avaliacao_media;
    const sales = performance.total_vendas;

    if (rating > 0 && rating < 2.5) {
        return {
            text: "🚨 RISCO CRÍTICO: Produto com altíssima rejeição. Verifique se o anúncio condiz com o item enviado ou se há defeitos de lote.",
            type: 'danger'
        };
    }
    if (rating >= 2.5 && rating < 3.8) {
        return {
            text: "⚠️ DESEMPENHO BAIXO: Feedback mediano. Clientes apontam pontos de melhoria. Possível redução de margem para evitar churn.",
            type: 'warning'
        };
    }
    if (sales > 50 && rating >= 4.5) {
        return {
            text: "🏆 ESTRELA DO CATÁLOGO: Alta conversão e satisfação máxima. Considere aumentar o investimento em marketing.",
            type: 'success'
        };
    }
    if (sales === 0) {
        return {
            text: "❄️ ITEM CONGELADO: Sem vendas registradas. Reavalie o preço ou a visibilidade na vitrine principal.",
            type: 'info'
        };
    }
    return {
        text: "📊 PERFORMANCE ESTÁVEL: Fluxo recorrente com avaliações dentro da normalidade operacional.",
        type: 'default'
    };
};
