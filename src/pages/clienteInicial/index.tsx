import { useContext } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { cansSSRAuth } from '../../utils/canSSRAuth';
import { AutenticarContext } from '../../contexts/AutenticarContext';
import { FaList, FaUtensils, FaPlusCircle } from 'react-icons/fa';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Header from '../../components/ui/head/index'; 
import styles from '../../../styles/home.module.scss'; 

export default function Listar() {
  const { user } = useContext(AutenticarContext);

  return (
    <div>
      <Head>
        <style>{`
          .card:hover  {
            background-color: #8D448B;
            color: white;
          }
          
          .card:hover .card-title {
            color: white;
          }
          
          .card:hover svg path { 
            fill: white; 
          }
          
          .card {
            border-radius: 15px;
          }
        `}</style>
      </Head>

      <Header />
      <div id={styles.content} className="content">
        <main className={styles.conteudo}>
          <Container className="d-flex justify-content-center align-items-center" style={{ height: '600px' }}>
            <Row className="justify-content-center mb-5">
              <Col xs={12} className="text-center">
                <h4>Bem vindo {user?.nome.split(' ')[0]}, escolha o que quer fazer</h4>
              </Col>
              <Col xs={12} md={4} className="mb-4" >
                <Link href="/listarOrdemAtuaisUsuarios" passHref>
                  <Card className="card h-100 text-center" style={{ cursor: 'pointer', padding:'30px'}}>
                    <Card.Body>
                      <FaList size={64} color="#8D448B" />
                      <Card.Title>Últimos pedidos</Card.Title>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>

              <Col xs={12} md={4} className="mb-4">
                <Link href="/listarCategorias" passHref>
                  <Card className="card h-100 text-center" style={{ cursor: 'pointer',padding:'30px' }}>
                    <Card.Body>
                      <FaUtensils size={64} color="#8D448B" />
                      <Card.Title>Cardápio</Card.Title>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>

              <Col xs={12} md={4} className="mb-4">
                <Link href="/formadeconsumo" passHref>
                  <Card className="card h-100 text-center" style={{ cursor: 'pointer',padding:'30px' }}>
                    <Card.Body>
                      <FaPlusCircle size={64} color="#8D448B" />
                      <Card.Title>Pedir agora</Card.Title>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            </Row>
          </Container>
          
        </main>
        
      </div>
     
    </div>
    
  );
}

export const getServerSideProps = cansSSRAuth(async (ctx) => {

  return {
    props: {},
  };
});