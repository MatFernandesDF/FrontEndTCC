import { createContext, ReactNode, useState, useEffect, useContext } from 'react';
import { api } from '../servicos/apiClient';
import { destroyCookie, parseCookies, setCookie } from 'nookies';
import Router from 'next/router';
import { toast } from 'react-toastify'
import { cpf } from 'cpf-cnpj-validator';
const validator = require('validator');
import zxcvbn from 'zxcvbn';

type AutenticarContextData = {
  user: UserProps | null;
  autorizado: boolean;
  entrar: (credentials: EntrarProps) => Promise<void>;
  sair: () => void;
  cadastro: (credentials: CadastroProps) => Promise<void>;
  recuperar: (credentials: AlterarProps) => Promise<void>;
  alterarSenha: (credentials: MudarSenhaProps) => Promise<void>;
  alterarDados: (credentials: AlterarDadosProps) => Promise<void>;
  alterarProdutos:(Credentials:AlterarProdutosProps) => Promise<void>;
  contato:(Credentials:ContatoProps) => Promise<void>;
};

type UserProps = {
  id: string;
  nome: string;
  email: string;
  nivel_acesso: number;
}
type CadastroProps = {
  id: string;
  email: string;
  senha: string;
  nome: string;
  confirmarSenha: string;
}
type EntrarProps = {
  email: string;
  senha: string;
}
type AlterarProps = {
  email: string;
}
type ContatoProps = {
  nome: string
  mensagem:string
  email: string;
}
type MudarSenhaProps = {
  user_id: string;
  novasenha: string;
  confirmarsenha: string;
}

type AlterarDadosProps = {
  id: string;
  nome: string;
  email: string;
  senha: string;
  confirmarsenha: string;
  nivel_acesso: number;
}
type AlterarProdutosProps = {
  id: string;
  nome: string;
  valor: string;
  imagem: string;
  categoria_id: string;
  descricao: string;
}
type AutenticarProviderProps = {
  children: ReactNode;
}

export const AutenticarContext = createContext({} as AutenticarContextData);

export function sair() {
  try {
    destroyCookie(undefined, '@digifood.token');
    Router.push('/Login');
    toast.success('Deslogado com sucesso'); 
  } catch {
    console.log('erro ao deslogar');
  }
}

export function AutenticarProvider({ children }: AutenticarProviderProps) {
  const [user, setUser] = useState<UserProps | null>(null);
  const autorizado = !!user;

  useEffect(() => {
    const { '@digifood.token': token } = parseCookies();

    if (token) {
      api.get('/perfil').then(response => {
        const { id, nome, email, nivel_acesso } = response.data;

        setUser({
          id,
          nome,
          email,
          nivel_acesso
        })
      })
        .catch(() => {
          sair();
        })
    }

  }, [])

  async function entrar({ email, senha }: EntrarProps) {
    try {
      const response = await api.post('/login', {
        email,
        senha,
      })

      const { id, nome, token, nivel_acesso } = response.data;

      setCookie(null, '@digifood.token', token, {
        maxAge: 60 * 60 * 24 * 30,
        path: '/'
      })

      setUser({
        id,
        nome,
        email,
        nivel_acesso,
      })

      api.defaults.headers['Authorization'] = `Bearer ${token}`;

      toast.success('logado com sucesso')
        Router.push('/clienteInicial'); 
    
    } catch (err) {
      toast.error('Usuario ou senha errada')
      console.log('ERRO AO ACESSAR ', err);
    }
  }

  async function cadastro({
    id,
    nome,
    email,
    senha,
    confirmarSenha,
  }: CadastroProps) {
    try {
      if (!cpf.isValid(id)) {
        toast.error('CPF inválido');
        return;
      }

      if (!validator.isEmail(email)) {
        toast.error('Endereço de email inválido');
        return;
      }

      const dominiosPermitidos = ['gmail.com', 'yahoo.com', 'outlook.com'];
      const dominioEmail = email.split('@')[1];

      if (!dominiosPermitidos.includes(dominioEmail)) {
        toast.error('Email inválido. Use um email válido.');
        return;
      }

      const resultadoSenha = zxcvbn(senha);
      if (resultadoSenha.score < 3) {
        toast.error('Senha fraca. Escolha uma senha mais forte.');
        return;
      }

      if (!validator.isLength(nome, { min: 1 })) {
        toast.error('O nome não pode estar vazio.');
        return;
      }

      if (!validator.isAlpha(nome.replace(/ /g, ''))) {
        toast.error('O nome deve conter apenas letras.');
        return;
      }

      if (!validator.isLength(nome, { min: 8, max: 20 })) {
        toast.error('O nome deve ter entre 8 e 20 caracteres.');
        return;
      }

      const response = await api.post('/usuarios', {
        id,
        nome,
        email,
        senha,
        confirmarSenha,
      });

      toast.success('Cadastrado com sucesso');
    } catch (error) {
      toast.error('Usuario já existe');
    }
  }

  async function recuperar({
    email
  }: AlterarProps) {
    if (!email) {

      return;
    }

    try {
      const response = await api.post('/recuperar', {
        email
      });
      console.log('Enviada por email !');
      toast.success('Email enviado com sucesso ')
    } catch (error) {
      toast.error('Usuario não existe')
    }


  }
  async function contato({
    nome,
    mensagem,
    email
  }: ContatoProps) {
    if (!email) {

      return;
    }

    try {
      const response = await api.post('/Contato', {
        email,nome,mensagem
      });
      console.log('Enviada por email !');
      toast.success('Email enviado com sucesso ')
    } catch (error) {
      toast.error('Não foi possivel enviar o email')
    }


  }
  async function alterarSenha({ novasenha, confirmarsenha }: Omit<MudarSenhaProps, 'user_id'>) {
    const user_id = user?.id; 
    if (!user_id || !novasenha || !confirmarsenha) {
      toast.error('Dados incompletos para alteração de senha.');
      return;
    }

    if (novasenha !== confirmarsenha) {
      toast.error('Senhas não coincidem.');
      return;
    }

    try {
      await api.put('/alterar', {
        user_id,
        novasenha,
        confirmarsenha
      });
      toast.success('Senha alterada com sucesso.');
    } catch (error) {
      toast.error('Não foi possível alterar a senha.');
    }
  }
  async function alterarDados({ id, nome, email, nivel_acesso, senha, confirmarsenha }: AlterarDadosProps) {
    if (!id || !nome || !email || !nivel_acesso || !senha || !confirmarsenha) {
      toast.error('Dados incompletos para alteração.');
      return;
    }

    if (senha !== confirmarsenha) {
      toast.error('Senhas não coincidem.');
      return;
    }

    try {
      await api.put('/AlterarDados', {
        id,
        nome,
        email,
        nivel_acesso,
        senha

      });
      toast.success('Dados alterados com sucesso.');
    } catch (error) {
      toast.error('Não foi possível alterar os dados.');
    }
  }
  async function alterarProdutos({ id, nome, valor, imagem, descricao, categoria_id }: AlterarProdutosProps) {

    try {
      await api.put('/EditarProdutos', {
        id,
        nome,
        valor,
        imagem,
        descricao,
        categoria_id,

      });
      toast.success('Dados alterados com sucesso.');
    } catch (error) {
      toast.error('Não foi possível alterar os dados.');
    }
  }
  return (
    <AutenticarContext.Provider
      value={{ user, autorizado, entrar, sair, cadastro, recuperar, alterarSenha, alterarDados,alterarProdutos,contato }}
    >
      {children}
    </AutenticarContext.Provider>
  );
}