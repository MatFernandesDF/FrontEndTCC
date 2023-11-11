import React, { useState, useContext, useEffect } from 'react';
import { cansSSRAuth } from '../../utils/canSSRAuth';
import Head from "next/head";
import Header from '../../components/ui/head/index';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "../../../styles/home.module.scss";
import { setupAPIClient } from '../../servicos/api';
import { AutenticarContext } from '../../contexts/AutenticarContext';
import Link from "next/link";
import { useRouter } from 'next/router';

interface CategoriaProps {
  id: string;
  nome: string;
  banner: string;
}

interface HomeProps {
  categorias: CategoriaProps[];
}

export default function PainelAdmin({ categorias }: HomeProps) {
  const { user } = useContext(AutenticarContext);
  const [searchValue, setSearchValue] = useState('');
  const [categoriasList, setCategoriasList] = useState<CategoriaProps[]>(categorias || []);
  const router = useRouter();

  const handleSearch = (value: string) => {
    setSearchValue(value);

    const lowerCaseValue = value.toLowerCase();

    const filtered = categorias.filter((categoria) =>
      categoria.nome.toLowerCase().includes(lowerCaseValue)
    );
    setCategoriasList(filtered);
  };

  return (
    <div>
        <Head>
            <style>{`
             .category-card img {
                max-height: 170px;
            }
                @media (max-width: 767px) {
                    .category-card img {
                        height: 200px;
                    }
                }
                .category-card {
                    border: 1px solid #ccc;
                    border-radius: 8px;
                    padding: 0px;
                    margin: 5px;
                    text-align: center;
                    cursor: pointer;
                }
                .category-card:hover {
                    background-color: #f5f5f5;
                }
               
                .glasscontent {
                  margin-top:50px;
                  backdrop-filter: blur(10px);

                  border-radius: 10px;
                  padding: 20px;
                  text-align: center;
                  width: 50%;
                }
            `}</style>
        </Head>

        <Header />
        <div id={styles.content} className="content">
            <main className={styles.conteudo}>

                <div className="glasscontent">
                    <div className="content">
                        <div className="d-flex justify-content-end mb-3">
                            <Link href="/clienteInicial" legacyBehavior>
                                <a className="btn btn-primary" style={{ backgroundColor: '#8D448B', borderColor: '#8D448B', padding: '15px 40px' }}>
                                    <i className="fa-solid fa-chevron-left"></i>Voltar
                                </a>
                            </Link>
                        </div>
                    </div>

                    <h2>Bem-vindo ao cardápio</h2>
                    <h3>Selecione uma categoria</h3>

                    <div className="d-flex flex-column flex-md-row justify-content-between mb-3">
                        <input
                            type="text"
                            placeholder="Digite o nome da categoria"
                            className="form-control mb-2 mb-md-0"
                            onChange={(e) => handleSearch(e.target.value)}
                            value={searchValue}
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div className="form-group mb-3">
                        {categoriasList.length === 0 ? (
                            <h5>Nenhuma categoria foi encontrada</h5>
                        ) : (
                            <div className="row">
                                {categoriasList.map((categoria) => (
                                    <div className="col-12 col-sm-6 col-md-4" key={categoria.id}>
                                        <Link href={`/listarProdutos?categoria_id=${categoria.id}`} passHref>
                                            <div className="category-card" style={{ borderRadius: '10px', overflow: 'hidden', textAlign: 'center', boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.3)' }}>
                                                <img
                                                    src={`http://localhost:3333/files/${categoria.banner}`}
                                                    alt={categoria.nome}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                                <h3 style={{ margin: '10px 0', color:'gray' }}>{categoria.nome}</h3>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
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
  const response = await apiClient.get('/categorias');
  return {
    props: {
      categorias: response.data,
    },
  };
});