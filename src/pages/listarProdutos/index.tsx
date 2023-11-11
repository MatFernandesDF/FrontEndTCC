import React, { useState, useContext, useEffect } from 'react';
import { cansSSRAuth } from '../../utils/canSSRAuth';
import Head from 'next/head';
import Header from '../../components/ui/head/index';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../../../styles/home.module.scss';
import { setupAPIClient } from '../../servicos/api';
import { AutenticarContext } from '../../contexts/AutenticarContext';
import Link from 'next/link';

import { useRouter } from 'next/router';
const Categoria = ({ produtos, categoriaId }) => {
  const { user } = useContext(AutenticarContext);
  const [ProdutoList, setProdutoList] = useState(produtos || []);
  const [categorias, setCategorias] = useState([]);
  const router = useRouter();


 

  useEffect(() => {
    async function fetchCategorias() {
      const apiClient = setupAPIClient();
      const response = await apiClient.get('/categorias');
      setCategorias(response.data);
    }

    fetchCategorias();
  }, []);

  return (
    <div>
      <Head>
        <style>{`
          .product-card {
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 10px;
            margin: 5px;
            text-align: center;
            cursor: pointer;
          }

          .product-card:hover {
            background-color: #f5f5f5;
          }
          .glasscontent {
            margin-top: 50px;
            backdrop-filter: blur(10px);
            border-radius: 10px;
            padding: 20px;
            text-align: center;
            width: 75%;
          }
        `}</style>
      </Head>
      <Header />
      <div id={styles.content} className="content">
        <main className={styles.conteudo}>
          <div className="glasscontent">
            <h2>Selecione um produto</h2>
            {ProdutoList.length === 0 && (
              <span>
                <h5>Nenhum produto foi encontrado</h5>
              </span>
            )}
            <div className="row">
              {ProdutoList.map((produto) => (
                <div className="col-lg-3 col-md-6 col-sm-12 mb-4" key={produto.id}>
                  <div className="card product-card">
                    <div className="image-container">
                      <img
                        src={`http://localhost:3333/files/${produto.banner}`}
                        style={{ height: '190px' }}
                        alt={produto.nome}
                        className="card-img-top product-image img-fluid" 
                      />
                    </div>
                    <div className="card-body">
                      <h5 className="card-title">{produto.nome}</h5>
                      <p className="card-text"><strong>Preço:</strong> R${produto.valor}</p>
                      <p className="card-text">{produto.descricao}</p>
                    </div>
                    <div className="mt-2 text-center">
                      <Link href="/formadeconsumo" className="btn btn-success mr-2">
                         Pedir agora
                      </Link>
                      </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export const getServerSideProps = cansSSRAuth(async (ctx) => {
  const { categoria_id } = ctx.query; 
  const apiClient = setupAPIClient(ctx);
  const response = await apiClient.get(`/categorias/produtos?categoria_id=${categoria_id}`);
  return {
    props: {
      produtos: response.data.filter((produto) => produto.disponibilidade === true), // Filtrando apenas produtos com disponibilidade:true
      categoriaId: categoria_id,
    },
  };
});

export default Categoria;