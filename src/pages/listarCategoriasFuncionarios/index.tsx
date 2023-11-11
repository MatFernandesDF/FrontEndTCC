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

interface CategoriaProps {
  id: string;
  nome: string;
  descricao: string;
  banner: string;
  situacao: boolean;
}

interface HomeProps {
  categorias: CategoriaProps[];
}

export default function PainelAdmin({ categorias }: HomeProps) {
  const { user } = useContext(AutenticarContext)
  const [searchValue, setSearchValue] = useState('');
  const [CategoriaList, setCategoriaList] = useState<CategoriaProps[]>(categorias || []);
  const router = useRouter();

  async function handleAtivarCategoria(id: string) {
    const confirmation = window.confirm("Tem certeza de que deseja ativar esta categoria?");
  
    if (!confirmation) {
      return;
    }
  
    const apiClient = setupAPIClient();
  
    try {
      await apiClient.put('/Categorias/AtivarCategoria', {
        categoria_id: id,
      });
  
      toast.success("Categoria ativada com sucesso!");
  
      
      console.log("Antes de atualizar o estado:", CategoriaList);
      
      const updatedCategorias = CategoriaList.map((categoria) => {
        if (categoria.id === id) {
          return { ...categoria, situacao: false };
        }
        return categoria;
      });
      
      console.log("Dados atualizados:", updatedCategorias);
  
      setCategoriaList(updatedCategorias);
      window.location.reload();
    } catch (error) {
      toast.error("Erro ao ativar categoria.");
    }
  }

  async function handleDesativarCategoria(id: string) {
    const confirmation = window.confirm("Tem certeza de que deseja desativar esta categoria?");

    if (!confirmation) {
      return;
    }

    const apiClient = setupAPIClient();

    try {
      await apiClient.put('/Categorias/DesativarCategoria', {
        categoria_id: id,
      });

      toast.success('Categoria desativada com sucesso!');
      const updatedCategorias = CategoriaList.map((categoria) => {
        if (categoria.id === id) {
          return { ...categoria, situacao: false };
        }
        return categoria;
      });
      setCategoriaList(updatedCategorias);
      window.location.reload();
    } catch (error) {
      toast.error('Erro ao desativar categoria.');
    }
  }

  const handleSearch = (value: string) => {
    setSearchValue(value);
    const filtered = categorias.filter((categoria) => categoria.nome.includes(value));
    setCategoriaList(filtered);
  };

  async function handleRefreshCategorias() {
    const apiClient = setupAPIClient();
    const response = await apiClient.get('/categoriasFuncionarios');
    setCategoriaList(response.data);
  }

  useEffect(() => {
    async function fetchCategorias() {
      const apiClient = setupAPIClient();
      const response = await apiClient.get('/categoriasFuncionarios');
      setCategoriaList(response.data);
    }

    fetchCategorias();
  }, []);

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
                <Link href="/addcategorias" legacyBehavior>
                  <a className="btn btn-primary" style={{ backgroundColor: '#8D448B', borderColor: '#8D448B' }}>
                    <i className="fas fa-plus me-2"></i> Nova Categoria
                  </a>
                </Link>
              </div>
            </div>
            <h2>Bem vindo às categorias</h2>
            <h2>
              Procurar novas categorias<Button onClick={handleRefreshCategorias} className="btn black-icon"><i className="fas fa-sync-alt" id="reload-icon"></i></Button>
            </h2>
            {CategoriaList.length === 0 && (
              <span>
                <h5>Nenhuma categoria foi encontrada</h5>
              </span>
            )}
            <div className="d-flex justify-content-between mb-3">
              <div className="d-flex" style={{width:'100%'}}>
                <input
                  type="text"
                  placeholder="Digite o nome da categoria"
                  className="form-control"
                  onChange={(e) => handleSearch(e.target.value)}
                  value={searchValue}
                />
              </div>
            </div>

            <div className="row">
              {CategoriaList.map((categoria) => (
                <div className="col-4 mb-4" key={categoria.id}>
                  <div className="card">
                    <div className="image-container">
                      <img
                        src={`http://localhost:3333/files/${categoria.banner}`}
                        style={{ height: '250px' }}
                        alt={categoria.nome}
                        className="card-img-top category-image"
                      />
                    </div>
                    <div className="card-body">
                      <h5 className="card-title">{categoria.nome}</h5>
                      <p className="card-text">{categoria.descricao}</p>
                    </div>
                    <div className="mt-2 text-center">
                      <Link href={{ pathname: '/editarCategoria', query: { categoria_id: categoria.id } }} className="btn btn-warning mr-2">
                        <i className="fas fa-edit"></i> Editar
                      </Link>
                      {categoria.situacao ? (
                        <button className="btn btn-danger" onClick={() => handleDesativarCategoria(categoria.id)}>
                          <i className="fas fa-trash"></i> Desativar
                        </button>
                      ) : (
                        <button className="btn btn-success" onClick={() => handleAtivarCategoria(categoria.id)}>
                          <i className="fas fa-check"></i> Ativar
                        </button>
                      )}
                    </div>
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
  const response = await apiClient.get('/categoriasFuncionarios');
  return {
    props: {
      categorias: response.data,
    },
  };
});