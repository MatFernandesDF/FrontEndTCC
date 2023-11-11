import Button from '../../components/ui/button/index';
import { useState, useContext, useEffect } from 'react';
import Head from 'next/head';
import { cansSSRAuth } from '../../utils/canSSRAuth';
import Header from '../../components/ui/head/index';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "../../../styles/home.module.scss";
import { setupAPIClient } from '../../servicos/api'
import { AutenticarContext } from '../../contexts/AutenticarContext'
import { useRouter } from 'next/router';
import Link from "next/link";
import Card from 'react-bootstrap/Card';
import { toast } from 'react-toastify'
interface OrdemProps {
  id: string;
  mesa: string | number;
  status: boolean;
  rascunho: boolean;
  nome: string | null;
}

interface HomeProps {
  ordens: OrdemProps[];
}

export type OrdemItemProps = {
  id: string;
  mesa: number;
  ordem_id: string;
  quantia: number;
  produto_id: string;
  criado_em: string;
  produto: {
    id: string;
    nome: string;
    descricao: string;
    valor: string;
    banner: string;
  }
  ordem: {
    id: string;
    mesa: string | number;
    status: boolean;
    nome: string | null;
    criado_em: string;
    valor_pago: string;
  }
}

export default function Painel({ ordens }: HomeProps) {
  const [OrdemList, setOrdemList] = useState(ordens || []);
  const [selectedOrder, setSelectedOrder] = useState<OrdemItemProps | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const { user } = useContext(AutenticarContext);
  const router = useRouter();

  useEffect(() => {
    if (user && user.nivel_acesso === 1) {
      router.push('/clienteInicial');
    }
  }, [user]);

  async function handleOpenOrderDetails(id: string) {
    const apiClient = setupAPIClient();
    try {
      const response = await apiClient.get('/ordens/detalhar', {
        params: {
          ordem_id: id,
        }
      });
      setSelectedOrder(response.data);
    } catch (error) {
      console.error('Erro ao buscar detalhes da ordem:', error);
    }
  }
  async function handleFinshItem(id: string) {
    try {
      const apiClient = setupAPIClient();
      await apiClient.put('ordens/finalizar', {
        ordem_id: id,
      });
      toast.success('Ordem finalizada com sucesso!');
      window.location.reload();
    } catch (error) {
      toast.error('Erro ao finalizar a ordem.');
    }
  }
  async function handleRefreshOrders() {
    const apiClient = setupAPIClient();
    try {
      const response = await apiClient.get('/ordens/listar');
      setOrdemList(response.data);
    } catch (error) {
      console.error('Erro ao buscar lista de ordens:', error);
    }
  }

  const handleSearch = (value: string) => {
    setSearchValue(value);
    const filtered = ordens.filter((ordem) =>
      ordem.id.includes(value)
    );
    setOrdemList(filtered);
  };

  return (
    <div>
      <Head>
      </Head>
      <Header />
      <div id={styles.content} className="content">
        <main className={styles.conteudo}>
          <div className="content">
            <div className="container mt-5">
              <div className="row">
                <div className="col-md-6">
                  <div className="content">
                    <div className="d-flex justify-content-end mb-3">
                      <Link href="/listar" legacyBehavior>
                        <a className="btn btn-primary" style={{ backgroundColor: '#8D448B', borderColor: '#FFFFbl' }}>
                          <i className="fa-solid fa-chevron-left"></i>Pedidos Concluidos
                        </a>
                      </Link>
                    </div>
                  </div>
                  <h1 className="fade-in">Bem vindo ao painel principal</h1>
                  <p className="fade-in">Aqui estão os últimos pedidos</p>
                  <h2>
                    Recarregar<Button onClick={handleRefreshOrders} className="btn black-icon"><i className="fas fa-sync-alt" id="reload-icon"></i></Button>
                  </h2>
                  <div className="d-flex justify-content-between mb-3">
                    <div className="d-flex"     style={{width:"100%"}}>
                      <input
                        type="text"
                        placeholder="Digite o numero do pedido "
                        className="form-control"
                        onChange={(e) => handleSearch(e.target.value)}
                        value={searchValue}
                    
                      />
                    </div>
                  </div>
                  <div className={`orderListScroll ${styles.orderListScroll}`}>
                    {OrdemList.map(item => (
                      <ul id={styles.lisgroup} className="list-group" key={item.id}>
                        <li id={styles.listgroupitem} className={`list-group-item orderListItem ${styles.orderListItem} ${selectedOrder?.id === item.id ? 'active' : ''}`}>
                            
                          <div className="row">
                            <div className="col">{String(item.id).slice(0, 5)}</div>
                            <div className="col">{item.status ? 'Concluído' : 'Não Concluído'}</div>
                            <div className="col"><button onClick={() => handleOpenOrderDetails(item.id)} className="btn btn-primary mr-2" style={{ backgroundColor: '#8D448B' }}>Detalhes</button></div>
                          </div>
                        </li>
                      </ul>
                    ))}
                  </div>
                </div>
                <div className="col-md-6">
                  {selectedOrder && (
                    <Card>
                      <Card.Body>
                        <Card.Title>Detalhes da Ordem</Card.Title>
                        {selectedOrder[0].ordem.mesa !== null ? (
                          <Card.Text>Mesa: {selectedOrder[0].ordem.mesa}</Card.Text>
                        ) : (
                          <Card.Text>Pedido para viagem</Card.Text>
                        )}
                        <Card.Text>Nome do cliente:{selectedOrder[0].ordem.nome}</Card.Text>
                        <Card.Text>Nome do Produto: {selectedOrder[0].produto.nome}</Card.Text>
                        <Card.Text>Descrição do Produto: {selectedOrder[0].produto.descricao}</Card.Text>
                        <Card.Text>Valor do Produto: {selectedOrder[0].produto.valor}</Card.Text>
                        <Card.Text>Valor pago:R${selectedOrder[0].ordem.valor_pago},00</Card.Text>
                        <div className="col text-center mt-2">
                          <Button onClick={() => handleFinshItem(selectedOrder[0].ordem_id)} size="large" style={{ backgroundColor: '#8D448B', borderColor: '#FFFFbl' }}>
                            Concluir pedido
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export const getServerSideProps = cansSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  try {
    const response = await apiClient.get('/ordens/listar');
    return {
      props: {
        ordens: response.data
      }
    };
  } catch (error) {
    console.error('Erro ao buscar lista de ordens:', error);
    return {
      props: {
        ordens: []
      }
    };
  }
});