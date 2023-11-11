import React, { useContext, useState, useEffect } from 'react';
import Head from 'next/head';
import { AutenticarContext } from '../../contexts/AutenticarContext';
import Header from '../../components/ui/head/index';
import styles from "../../../styles/home.module.scss";
import { useRouter } from 'next/router';
import { cansSSRAuth } from '../../utils/canSSRAuth';
import { setupAPIClient } from '../../servicos/api';
import { getStripeJS } from '../../servicos/stripe-js';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPizzaSlice } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';


interface PagamentoProps {
    pago: boolean;
}

export default function FinalizarPedido({ pago }: PagamentoProps) {
    const { user } = useContext(AutenticarContext);
    const router = useRouter();
    const { valorTotal, ordem_id, status } = router.query;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [paymentSuccess, setPaymentSuccess] = useState(false);


    useEffect(() => {
        if (status === 'success') {
            toast.success('pagamento finalizado com sucesso :)')
            setPaymentSuccess(true);
            setTimeout(() => {

            }, 2000);
        } else if (status === 'failed') {
            toast.error("Houve um erro ao processar o pagamento. Por favor, tente novamente.");
        }
    }, [status]);

    const handlePagamento = async () => {
        setError(null);
        if (pago) {
            return;
        }
        setLoading(true);
        if (!ordem_id) {
            console.error("ordem_id is not defined");
            return;
        }
        try {
            const valorEmCentavos = Number(valorTotal) * 100;
            const apiClient = setupAPIClient();
            const response = await apiClient.post('/pagamento', { valor: valorEmCentavos, user_id: user?.id, ordem_id: ordem_id });
            const { sessionId } = response.data;
            const stripe = await getStripeJS();
            await stripe.redirectToCheckout({ sessionId: sessionId });
        } catch (err) {
            console.log(err);
            setError("Erro ao processar o pagamento. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Header />
            <div id={styles.content} className="content">
                <main className={styles.conteudo}>
                    <div className={styles.glasscontent}>
                        <div className="content d-flex flex-column justify-content-center align-items-center" style={{ height: '410px' }}>
                            {paymentSuccess ? (
                                <>
                                    <FontAwesomeIcon icon={faPizzaSlice} size="3x" className="my-3" />
                                    <h1>Pedido está sendo preparado!</h1>
                                    <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2em' }}></i>
                                    <Link legacyBehavior href="/listarOrdemAtuaisUsuarios">

                                        <a
                                            className="btn btn-primary"
                                            style={{ backgroundColor: '#8D448B', borderColor: '#FFFFbl', fontSize: '1.5em', padding: '15px 50px' }}
                                        >
                                            Vizualizar seus ultimos pedidos
                                        </a>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <h2 className={styles.welcomeMessage}>
                                        <br />
                                        Finalize seu pedido
                                    </h2>
                                    {error && <p style={{ color: 'red' }}>{error}</p>}
                                    <p style={{ fontSize: '1.5em', marginBottom: '20px' }}>Tudo certo :) agora vamos finalizar seu pedido</p>
                                    <p style={{ fontSize: '1.5em', marginBottom: '20px' }}>O valor Total é: R${valorTotal}</p>
                                    <p style={{ fontSize: '1.5em', marginBottom: '20px' }}>Pressione o botão abaixo para efetuar o pagamento.</p>
                                    <button
                                        className="btn btn-primary"
                                        style={{ backgroundColor: '#8D448B', borderColor: '#FFFFbl', fontSize: '1.5em', padding: '15px 50px' }}
                                        onClick={handlePagamento}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <i className="fa-solid fa-credit-card fa-beat-fade"></i> Processando...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fa-solid fa-credit-card fa-beat-fade"></i> Fazer pagamento
                                            </>
                                        )}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export const getServerSideProps = cansSSRAuth(async (ctx) => {
    return {
        props: {}
    };
});