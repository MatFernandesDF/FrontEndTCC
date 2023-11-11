import React, { useState, useContext, useEffect } from 'react';
import { cansSSRAuth } from '../../utils/canSSRAuth';
import Head from "next/head";
import Header from '../../components/ui/head/index';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "../../../styles/home.module.scss";
import { setupAPIClient } from '../../servicos/api';
import { AutenticarContext } from '../../contexts/AutenticarContext'
import Button from '../../components/ui/button/index';
import { toast } from 'react-toastify'
import Link from "next/link";
import { useRouter } from 'next/router';
interface ProdutoProps {
  id: string;
  nome: string;
  descricao: string;
  valor: string;
  imagem: string;
  banner: string;
  categoria_id: string;
  disponibilidade: boolean; 
}

interface HomeProps {
  produtos: ProdutoProps[];
}

export default function PainelAdmin({ produtos }: HomeProps) {
  const { user } = useContext(AutenticarContext)
  const [searchValue, setSearchValue] = useState('');
  const [ProdutoList, setProdutoList] = useState<ProdutoProps[]>(produtos || []);
  const [categorias, setCategorias] = useState([]);
  const router = useRouter();
  
  async function handleListarPorCategoria(categoriaId) {
    const apiClient = setupAPIClient();
    const response = await apiClient.get('/categorias/produtos', {
      params: { categoria_id: categoriaId }
    });

    setProdutoList(response.data);
  }



  async function handleDesativarProduto(id: string) {
    const confirmation = window.confirm("Tem certeza de que deseja desativar este produto?");

    if (!confirmation) {
      return;
    }

    const apiClient = setupAPIClient();
    window.location.reload();
    try {
      await apiClient.put('/Produtos/DesativarProduto', {
        produto_id: id,
      });
      toast.success("Produto desativado com sucesso!");
      router.reload();
    } catch (error) {
      toast.error("Erro ao desativar usuário.");
    }
  }

  async function handleAtivarProduto(id: string) {
    const confirmation = window.confirm("Tem certeza de que deseja ativar este produto?");

    if (!confirmation) {
      return;
    }

    const apiClient = setupAPIClient();

    try {
      await apiClient.put('/Produtos/AtivarProduto', {
        produto_id: id,
      });

      toast.success("Produto ativado com sucesso!");
      window.location.reload();
    } catch (error) {
      toast.error("Erro ao ativar produto.");
    }
  }

  const handleSearch = (value: string) => {
    setSearchValue(value);
    const filtered = produtos.filter((produto) => produto.nome.includes(value));
    setProdutoList(filtered);
  };
  
  async function handleRefreshProdutos() {
    const apiClient = setupAPIClient();
    const response = await apiClient.get('/listar/Produtos');
    setProdutoList(response.data);
  }

  useEffect(() => {
    async function fetchCategorias() {
      const apiClient = setupAPIClient();
      const response = await apiClient.get('/categorias');
      setCategorias(response.data);
    }

    fetchCategorias();
  }, []);

  useEffect(() => {
    async function fetchProdutos() {
      const apiClient = setupAPIClient();
      const response = await apiClient.get('/listar/Produtos');
      setProdutoList(response.data);
    }
  
    fetchProdutos();
  }, [user]);

  return (
    <div>
      <Head>
        <style>{`
          .image-container {
            position: relative;
          }
          
          .btn-details {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            border-radius: 0;
          }
          
          .card-img-top {
            width: 100%;
            height: auto;
          }
        `}</style>
      </Head>
      <Header />
      <div id={styles.content} className="content">
        <main className={styles.conteudo}>
          <div className={styles.glasscontent}>
          <div className="content">
              <div className="d-flex justify-content-end mb-3">
                <Link href="/addproduto" legacyBehavior>
                  <a className="btn btn-primary" style={{ backgroundColor: '#8D448B', borderColor: '#8D448B' }}>
                    <i className="fas fa-plus me-2"></i> Novo Produto
                  </a>
                </Link>
              </div>

            </div>
            <h2>Bem vindo ao cardápio</h2>
            <h2>
              Procurar novos produtos<Button onClick={handleRefreshProdutos} className="btn black-icon"><i className="fas fa-sync-alt" id="reload-icon"></i></Button>
            </h2>
            {ProdutoList.length === 0 && (
              <span>
                <h5>Nenhum produto foi encontrado</h5>
              </span>
            )}
            <div className="form-group mb-3">
              <label className="form-label">
                <select
                  style={{
                    float: "right",
                    borderRadius: "20px",
                    fontFamily: "Arial",
                    fontSize: "20px",
                    padding: "5px 10px",
                    margin: "30px"
                  }}
                  onChange={(e) => handleListarPorCategoria(e.target.value)}
                >
                  <option value="">Selecione uma categoria</option>
                  {categorias.map(categoria => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nome}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="d-flex justify-content-between mb-3">
              <div className="d-flex" style={{width:'100%'}}>
                <input
                  type="text"
                  placeholder="Digite o nome do produto"
                  className="form-control"
                  onChange={(e) => handleSearch(e.target.value)}
                  value={searchValue}
                />
              </div>
            </div>

            <div className="row">
              {ProdutoList.map((produto) => (
                <div className="col-4 mb-4" key={produto.id}>
                  <div className="card">
                    <div className="image-container">
                      <img
                        src={`http://localhost:3333/files/${produto.banner}`}
                        style={{ height: '250px' }}
                        alt={produto.nome}
                        className="card-img-top product-image"
                      />
                    </div>
                    <div className="card-body">
                      <h5 className="card-title">{produto.nome}</h5>
                      <p className="card-text"><strong>Preço:</strong> ${produto.valor}</p>
                    </div>
                  </div>
                
                    <div className="mt-2 text-center">
                      <Link href={{ pathname: '/editarProduto', query: { produto_id: produto.id } }} className="btn btn-warning mr-2" style={{ margin: '3' }}>
                        <i className="fas fa-edit"></i> Editar
                      </Link>
                      {
                        produto.disponibilidade?
                          (
                            <button className="btn btn-danger" onClick={() => handleDesativarProduto(produto.id)}>
                              <i className="fas fa-trash"></i> Desativar
                            </button>
                          ) :
                          (
                            <button className="btn btn-success" onClick={() => handleAtivarProduto(produto.id)}>
                              <i className="fas fa-check"></i> Ativar
                            </button>
                          )
                      }
                    </div>
                </div>
              ))}
             
            </div>
          </div>
        </main>
      </div>
      <script src="script.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    </div>
  )
}

export const getServerSideProps = cansSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const response = await apiClient.get('/listar/Produtos');
  return {
    props: {
      produtos: response.data,
    },
  };
});