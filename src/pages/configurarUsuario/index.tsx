import React, { useContext, useState, FormEvent } from 'react';
import Head from 'next/head';
import { cansSSRAuth } from '../../utils/canSSRAuth';
import Header from '../../components/ui/head/index';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../../../styles/home.module.scss'; 
import Button from '../../components/ui/button/index'; 
import { AutenticarContext } from '../../contexts/AutenticarContext';
import { toast } from 'react-toastify';

export default function ConfigurarUsuario() {
  const { user, alterarSenha } = useContext(AutenticarContext);
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);

  function validarSenha(senha) {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/;
    return regex.test(senha);
  }

  async function handleAlterar(event: FormEvent) {
    event.preventDefault();
    if (novaSenha === '' || confirmarSenha === '') {
      toast.error('Preencha todos os campos');
      return;
    }

    if (!validarSenha(novaSenha)) {
      toast.error('A senha deve ter pelo menos 8 caracteres, uma letra maiúscula, um número e um caractere especial.');
      return;
    }
   
    if (novaSenha !== confirmarSenha) {
      toast.error('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    let data = {
      user_id: user?.id,
      novasenha: novaSenha,
      confirmarsenha: confirmarSenha,
    };
    
    try {
      await alterarSenha(data);
      toast.success('Senha alterada com sucesso!');
     
      setNovaSenha('');
      setConfirmarSenha('');
    } catch (error) {
      toast.error('Erro ao alterar a senha.');
    
      console.error(error);
    } finally {
      setLoading(false);
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
            <h2>Alterar sua senha</h2>
            <form onSubmit={handleAlterar} className="mt-4">
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Nova senha"
                  value={novaSenha}
                  required
                  onChange={(e) => setNovaSenha(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Confirmar senha"
                  value={confirmarSenha}
                  required
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                loading={loading}
                size="large"
                style={{ backgroundColor: '#8D448B', borderColor: '#FFFFF1', fontSize: '1.5em', padding: '5px 7px' }}
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