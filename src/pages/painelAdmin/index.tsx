import React, { useState, useContext, useEffect } from 'react';
import { cansSSRAuth } from '../../utils/canSSRAuth';
import Header from '../../components/ui/head/index';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../../../styles/home.module.scss';
import { setupAPIClient } from '../../servicos/api';
import { AutenticarContext } from '../../contexts/AutenticarContext';
import Button from '../../components/ui/button/index';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface UsuarioProps {
  id: string;
  nome: string;
  email: string;
  nivel_acesso: number;
  senha: string;
  confirmarSenha: string;
  situacao: boolean;
}

interface HomeProps {
  usuarios: UsuarioProps[];
}

export default function PainelAdmin({ usuarios }: HomeProps) {
  const { user } = useContext(AutenticarContext);
  const [searchValue, setSearchValue] = useState('');
  const [UsuarioList, setUsuarioList] = useState(usuarios || []);
  const router = useRouter();

  useEffect(() => {
    if (user && user.nivel_acesso === 1) {
      router.push('/clienteInicial');
    }
  }, [user]);

  async function handleDesativarUsuario(id: string) {
    const confirmation = window.confirm('Tem certeza de que deseja desativar este usuário?');

    if (!confirmation) {
      return;
    }

    const apiClient = setupAPIClient();

    try {
      await apiClient.put('/DesativarUsuario', {
        user_id: id,
      });

      toast.success('Usuário desativado com sucesso!');

      const response = await apiClient.get('/ListarUsuarios');
      setUsuarioList(response.data);
    } catch (error) {
      toast.error('Erro ao desativar usuário.');
    }
  }

  async function handleAtivarUsuario(id: string) {
    const confirmation = window.confirm('Tem certeza de que deseja ativar este usuário?');

    if (!confirmation) {
      return;
    }

    const apiClient = setupAPIClient();

    try {
      await apiClient.put('/AtivarUsuario', {
        user_id: id,
      });

      toast.success('Usuário ativado com sucesso!');

      const response = await apiClient.get('/ListarUsuarios');
      setUsuarioList(response.data);
    } catch (error) {
      toast.error('Erro ao ativar usuário.');
    }
  }

  const handleSearch = (value: string) => {
    setSearchValue(value);
    const filtered = usuarios.filter((usuario) => usuario.id.includes(value));
    setUsuarioList(filtered);
  };

 

  async function handleRefreshUsers() {
    const apiClient = setupAPIClient();
    const response = await apiClient.get('/ListarUsuarios');
    setUsuarioList(response.data);
  }
  return (
    <div>
      <Header />
      <div id={styles.content} className="content">
        <main className={styles.conteudo}>
          <div className={styles.glasscontent}>
            <h2>Lista de Usuários</h2>
            <h2>
              Recarregar<Button onClick={handleRefreshUsers} className="btn black-icon"><i className="fas fa-sync-alt" id="reload-icon"></i></Button>
            </h2>
            {UsuarioList.length === 0 && (
              <span>
                <h5>Nenhum usuário foi encontrado</h5>
              </span>
            )}
            <div className="d-flex justify-content-between mb-3">
              <div className="d-flex" style={{width:'100%'}}>
                <input
                  type="text"
                  placeholder="Digite o CPF"
                  className="form-control"
                  onChange={(e) => handleSearch(e.target.value)}
                  value={searchValue}
                />
              </div>
            </div>
            <ul className="list-group">
              <div className="row">
                <div className="col">ID</div>
                <div className="col">Nome</div>
                <div className="col">Situação</div>
                <div className="col"></div>
              </div>
              {UsuarioList.map((user) => (
                <li className="list-group-item" key={user.id}>
                  <div className="row">
                    <div className="col">{user.id}</div>
                    <div className="col">
                      {user.nome}
                    </div>
                    <div className="col">
                      {user.situacao ? 'Ativado' : 'Desativado'}
                    </div>
                    <div className="col">
                    <Link href={{ pathname: '/alterarUsuario', query: { usuario_id: user.id } }} className="btn btn mr-2" style={{ margin: '3' }}>
                    <i className="fa-solid fa-edit" style={{color: 'blue', background:'none'}}></i>
                      </Link>
                      {
                        user.situacao ?
                          (
                            <button className=""   style={{border: '0px', backgroundColor:'none'}} onClick={() => handleDesativarUsuario(user.id)}>

                              <i className="fa-solid fa-trash" style={{color: '#b30000'}}></i>
                            </button>
                          ) :
                          (
                            <button className=""  style={{border: '0px', backgroundColor:'none'}} onClick={() => handleAtivarUsuario(user.id)}>
                              <i className="fa-solid fa-check" style={{color: 'green'}}></i>
                            </button>
                          )
                      }
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
      <script src="script.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    </div>
  );
}

export const getServerSideProps = cansSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const response = await apiClient.get('/ListarUsuarios');
  return {
    props: {
      usuarios: response.data,
    },
  };
});