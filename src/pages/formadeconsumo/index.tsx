import { useContext } from 'react';
import Head from 'next/head';
import { cansSSRAuth } from '../../utils/canSSRAuth';
import { useRouter } from 'next/router'; 
import { AutenticarContext } from '../../contexts/AutenticarContext';
import { FaUtensils, FaShoppingBag } from 'react-icons/fa';
import styles from '../../../styles/home.module.scss';
import Header from '../../components/ui/head/index';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function Listar() {
  const { user } = useContext(AutenticarContext);
const router = useRouter(); 

  const handleComerNaLojaClick = () => {
    router.push('/comernaloja'); 
  };

  const handlePedirParaViagemClick = () => {
    router.push('/viagem'); 
  };

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
          <div>
            <Container className="d-flex justify-content-center align-items-center" style={{ height: '800px', borderRadius: '30px' }}>
              <Row className="justify-content-center mb-5">
                <Col xs={12} className="text-center">
                  <h2>Escolha a forma de consumo</h2>
                </Col>
                <Col xs={12} md={6} className="mb-3">
                  <a onClick={handleComerNaLojaClick} style={{ cursor: 'pointer' }}>
                    <Card className="card h-100" style={{ borderRadius: '20px', alignItems: 'center', padding: '40px' }}>
                      <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                        <FaUtensils size={64} color="#8D448B" />
                        <Card.Title>Comer na loja</Card.Title>
                      </Card.Body>
                    </Card>
                  </a>
                </Col>

                <Col xs={12} md={6} className="mb-3">
                  <a onClick={handlePedirParaViagemClick} style={{ cursor: 'pointer' }}>
                    <Card className="card h-100" style={{ borderRadius: '20px', alignItems: 'center', padding: '40px' }}>
                      <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                        <FaShoppingBag size={64} color="#8D448B" />
                        <Card.Title>Pedir para viagem</Card.Title>
                      </Card.Body>
                    </Card>
                  </a>
                </Col>
              </Row>
            </Container>
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