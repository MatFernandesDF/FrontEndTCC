import React, { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { cansSSRAuth } from '../../utils/canSSRAuth';
import Header from '../../components/ui/head/index';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "../../../styles/home.module.scss";
import { setupAPIClient } from '../../servicos/api'
import Link from "next/link";
import { AutenticarContext } from '../../contexts/AutenticarContext'
import { toast } from 'react-toastify';
import { Container, Row, Form, Button, Col } from 'react-bootstrap';

export default function ComerNaLoja() {
    const router = useRouter();
    const { user } = useContext(AutenticarContext);
    const firstName = user?.nome.split(' ')[0];
    const [nome, setNome] = useState('');
    const [mesa, setMesa] = useState<number | null>(null);

    async function handleNovaOrdem() {
        if (nome === '') {
            alert("Campos vazios");
            return;
        }
        try {
            const apiClient = setupAPIClient();
            const response = await apiClient.post('/ordens', {
                nome: nome,
                mesa: mesa,
                usuario_id: user.id
            });

            if (response.data && response.data.id) {
                router.push(`/novaordem?ordem_id=${response.data.id}&mesa=${mesa}`);
                toast.success("Mesa aberta com sucesso :)");
            } else {
                toast.error("Não foi possível abrir a mesa :(");
            }
        } catch (error) {
            console.error("Erro ao abrir a mesa:", error);
            toast.error("Não foi possível abrir a mesa :(");
        }
    }

    return (
        <div>
            <Head>
                <title>Comer na Loja</title>
            </Head>
            <Header />
            <Container className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <Row className="w-100 justify-content-center">
                    <Form.Group as={Col} md={6} lg={4} xl={5}>
                        <div className="glasscontent p-4">
                            <h2 className={`${styles.welcomeMessage} mb-4 text-center`}>
                                Legal, vai ser para viagem :)
                            </h2>
                            <Form.Control
                                size="lg"
                                type="text"
                                placeholder="Como quer ser chamado?"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                className="mb-3"

                            />
                                 <Form.Control
                                size="lg"
                                type="text"
                                placeholder="Digite o numero da mesa"
                                value={mesa}
                                onChange={(e) => setMesa(e.target.value ? Number(e.target.value) : null)}
                                className="mb-3"

                            />
                            <div className="d-flex flex-column align-items-center">
                                
                                <Button 
                                    variant="primary"
                                    style={{ padding: '5px 30px', fontSize: '0.8em' }}
                                    
                                    onClick={handleNovaOrdem}
                                    className="mb-2">
                                    Abrir mesa
                                </Button>
                                <Link legacyBehavior href="/formadeconsumo" passHref>
                                    <Button variant="danger" size="lg" style={{ padding: '5px 20px', fontSize: '0.8em' }}>
                                        Cancelar
                                    </Button>
                                </Link>
                                </div>
                              
                        
                        </div>
                    </Form.Group>
                </Row>
            </Container>
        </div>
    );
};

export const getServerSideProps = cansSSRAuth(async (ctx) => {
    return {
        props: {}
    };
});