import React, { useContext, useState, useEffect, FormEvent } from 'react';
import Head from 'next/head';
import { cansSSRAuth } from '../../utils/canSSRAuth';
import Header from '../../components/ui/head/index';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../../../styles/home.module.scss';
import Button from '../../components/ui/button/index';
import { AutenticarContext } from '../../contexts/AutenticarContext';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { setupAPIClient } from '../../servicos/api';

export default function ConfigurarUsuario() {
  const { user } = useContext(AutenticarContext);
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [nivel, setNivel] = useState(0);
  const [senha, setSenha] = useState('');


  useEffect(() => {
    async function loadUsuario() {
      if (user) {
        const apiClient = setupAPIClient();
        try {
          const response = await apiClient.get('/usuarios/detalhar', {
            params: {
              usuario_id: user.id,
            },
          });
          setNome(response.data.nome || '');
          setEmail(response.data.email || '');
          setNivel(response.data.id ? parseInt(response.data.nivel_acesso) : null);
        } catch (error) {
          console.error('Erro ao carregar o usuário', error);
        }
      }
    }

    loadUsuario();
  }, [user]);

  async function handleAlterar(event: FormEvent) {
    event.preventDefault();
    if (nivel < 1 || nivel > 3) {
      toast.error('O nível deve estar entre 1 e 3.');
      return;
    }

    const apiClient = setupAPIClient();

    try {
      await apiClient.put('/AlterarDados', {
        id: user.id,
        nome: nome,
        email: email,
        senha: senha,
      });

      toast.success('Usuário alterado com sucesso!');
      setNome('');
      setEmail('');
      setNivel(0);
      setSenha('');
    } catch (err) {
      console.error(err);
      toast.error('Ops, erro ao editar o usuário!');
    }
  }

  return (
    <div>
      <Head>
        <title>Configurar Usuário</title>
      </Head>
      <Header />
      <div id={styles.content} className="container">
        <main className={styles.conteudo}>
          <div className={styles.glasscontent}>
            <h2>Altere seus dados</h2>
            <form onSubmit={handleAlterar} className="mt-4">
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                size="large"
                style={{
                  backgroundColor: '#8D448B',
                  borderColor: '#FFFFF1',
                  fontSize: '1.5em',
                  padding: '5px 7px',
                }}
              >
                Alterar
              </Button>
            </form>
          </div>
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
