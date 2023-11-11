import { useState, FormEvent,useContext,useEffect } from 'react';
import Head from 'next/head';
import { cansSSRAuth } from '../../utils/canSSRAuth';
import Header from '../../components/ui/head/index';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "../../../styles/home.module.scss";
import Link from 'next/link';
import Button from '../../components/ui/button/index';
import { setupAPIClient } from '../../servicos/api'
import { toast } from 'react-toastify'
import{AutenticarContext} from '../../contexts/AutenticarContext'
import { useRouter } from 'next/router';
export default function AddCategoria() {
  const [nome, setNome] = useState('')
  const { user } = useContext(AutenticarContext);
  const router = useRouter();

  useEffect(() => {
    if (user && user.nivel_acesso === 1) {
        router.push('/clienteInicial');
    }
    
}, [user]);
  async function handleRegister(event: FormEvent) {
    event.preventDefault();

    if (nome === '') {
      return;
    }
    const apiClient = setupAPIClient();
    await apiClient.post('/categorias', {
      nome: nome
    })

    toast.success('Categoria cadastrada com sucesso!')
    setNome('');
  }
  
  return (
    <div>
      <Head>

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
            <h2>
              Cadastrar Categoria
            </h2>
            <form className="mt-4" onSubmit={handleRegister}>
              
              <div className="mb-3">
                
                <input
                  type="text"
                  className="form-control"
                  id="productValue"
                  placeholder="Nome da categoria"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>
              <Link href="/" legacyBehavior>
                  <a className="btn btn-secondary" style={{ backgroundColor: '#333', borderColor: '#333', margin:'3px' }}>
                    <i className="fa-solid fa-chevron-left fa-beat-fade me-2"></i>Página Inicial
                  </a>
                </Link>
              <Button type="submit" className="btn btn-success">Cadastrar</Button>
            </form>
          </div>
        </main>
      </div>

      <script src="script.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    </div>
  );
};

export const getServerSideProps = cansSSRAuth(async (ctx) => {
  return {
    props: {}
  };
});