import { useEffect, useState, ChangeEvent, FormEvent, useContext } from 'react';
import Head from 'next/head';
import { cansSSRAuth } from '../../utils/canSSRAuth';
import Header from '../../components/ui/head/index';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "../../../styles/home.module.scss";
import Button from '../../components/ui/button/index';
import { setupAPIClient } from '../../servicos/api'
import { toast } from 'react-toastify'
import { AutenticarContext } from '../../contexts/AutenticarContext'
import { useRouter } from 'next/router';

type ItemProps = {
  id: string;
  nome: string;
}

interface CategoriaProps {
  listarCategoria: ItemProps[];
}

export default function AddProduto({ listarCategoria }: CategoriaProps) {
  const { user } = useContext(AutenticarContext);
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [produto, setProduto] = useState(null);
  const [imageAvatar, setImageAvatar] = useState(null);
  const [categorias, setCategorias] = useState(listarCategoria || [])
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('0');
  const router = useRouter();
  const novoNome = nome || (produto ? produto.nome : '');
  const novoValor = valor || (produto ? produto.valor : '');
  const novaDescricao = descricao || (produto ? produto.descricao : '');

  useEffect(() => {
    if (user && user.nivel_acesso === 1) {
        router.push('/clienteInicial');
    }
    
}, [user]);
  useEffect(() => {
    async function loadProduto() {
      const { produto_id } = router.query;
      if (produto_id) {
        const apiClient = setupAPIClient();
        try {
          const response = await apiClient.get('/DetalharProdutos', {
            params: {
              produto_id: produto_id,
            },
          });
          setProduto(response.data);
          setCategoriaSelecionada(response.data.categoria_id || '0');
        } catch (error) {
          console.error('Erro ao carregar o produto', error);
        }
      }
    }

    loadProduto();
  }, [router.query]);

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) {
      return;
    }

    const image = e.target.files[0];

    if (!image) {
      return;
    }

    if (image.type === 'image/jpeg' || image.type === 'image/png') {
      setImageAvatar(image);
      setAvatarUrl(URL.createObjectURL(e.target.files[0]))
    }
  }

  function handleChangeCategoria(event) {
    const selectedCategoria = event.target.value;
    setCategoriaSelecionada(selectedCategoria);
  }

  async function handleEditarProduto(event: FormEvent) {
    event.preventDefault();
  
    try {
      const data = new FormData();
      data.append('id', produto.id);
  
      if (novoNome !== produto.nome) {
        data.append('nome', novoNome);
      }
  
      if (novoValor !== produto.valor) {
        data.append('valor', novoValor);
      }
  
      if (novaDescricao !== produto.descricao) {
        data.append('descricao', novaDescricao);
      }
  
      if (imageAvatar) {
        data.append('imagem', imageAvatar);
      }
  
      const apiClient = setupAPIClient();
      await apiClient.put('/EditarProdutos', data);
      router.reload();
      toast.success('Produto editado com sucesso!');
    } catch (err) {
      console.error(err);
      toast.error('Ops, erro ao editar o produto!');
    }
    setNome('');
    setValor('');
    setImageAvatar(null);
    setDescricao('');
    setAvatarUrl('');
  }
  return (
    <div>
      <Header />
      <div id={styles.content} className="content">
        <main className={styles.conteudo}>
          <div className={styles.glasscontent}>
            <h2>
              Editar Produto
            </h2>
            <form className="mt-4" onSubmit={handleEditarProduto}>
              {!avatarUrl && <h5 style={{ margin: "0", padding: "0" }}>Upload da Imagem do Produto</h5>}
              <div id={styles.customfile} className="mb-3 d-flex flex-column align-items-center justify-content-center custom-file">
                <input type="file" className="form-control visually-hidden" id="productImage" accept=".jpg, .jpeg, .png" onChange={handleFile} />
                {(avatarUrl || produto?.banner) && (
                  <img
                    className={styles.previw}
                    src={avatarUrl || `http://localhost:3333/files/${produto?.banner}`}
                    alt="Foto do produto"
                    width={250}
                    height={250}
                  />
                )}
                <label id={styles.botaoimg} htmlFor="productImage" className="btn btn-primary mb-2" style={{ flexShrink: 0 }}>
                  <i className="fa-solid fa-file-arrow-up fa-beat-fade"></i>
                </label>
              </div>
              <div className="mb-3">
                <select className="form-select" id="category" value={categoriaSelecionada} onChange={handleChangeCategoria}>
                  {categorias.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="productName"
                  placeholder="Nome do Produto"
                  value={nome || produto?.nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input type="text" className="form-control" id="productValue" placeholder="Valor do Produto" value={valor || produto?.valor} onChange={(e) => setValor(e.target.value)} />
              </div>
              <div className="mb-3">
                <textarea className="form-control" id="productDescription" rows={4} placeholder="Descrição do Produto" value={descricao || produto?.descricao} onChange={(e) => setDescricao(e.target.value)} />
              </div>
              <Button type="submit" className="btn btn-success">Salvar Alterações</Button>
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
  const apiClient = setupAPIClient(ctx)


  const response = await apiClient.get('/categorias');

  console.log(response.data);
  return {
    props: {
      listarCategoria: response.data
    }
  };
});