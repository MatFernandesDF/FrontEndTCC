import { useEffect, useState, ChangeEvent, FormEvent, useContext } from 'react';
import Head from 'next/head';
import { cansSSRAuth } from '../../utils/canSSRAuth';
import Header from '../../components/ui/head/index';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "../../../styles/home.module.scss";
import Link from 'next/link';
import Button from '../../components/ui/button/index';
import { setupAPIClient } from '../../servicos/api'
import { toast } from 'react-toastify'
import { AutenticarContext } from '../../contexts/AutenticarContext'
import { useRouter } from 'next/router';


export default function EditarCategorias() {
  const { user } = useContext(AutenticarContext);
  const [nome, setNome] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [categoria, setProduto] = useState(null);
  const [imageAvatar, setImageAvatar] = useState(null);
  const router = useRouter();
  const novoNome = nome || (categoria ? categoria.nome : '');


  useEffect(() => {
    if (user && user.nivel_acesso === 1) {
        router.push('/clienteInicial');
    }
    
}, [user]);
  useEffect(() => {
    async function loadProduto() {
      const { categoria_id } = router.query;
      if (categoria_id) {
        const apiClient = setupAPIClient();
        try {
          const response = await apiClient.get('/DetalharCategorias', {
            params: {
              categoria_id: categoria_id,
            },
          });
          setProduto(response.data);
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

  async function handleEditarProduto(event: FormEvent) {
    event.preventDefault();
  
    

  
    try {
      const data = new FormData();
      data.append('id', categoria.id);
  
      if (novoNome !== categoria.nome) {
        data.append('nome', novoNome);
      }
  
      if (imageAvatar) {
        data.append('imagem', imageAvatar);
      }
  
      const apiClient = setupAPIClient();
      await apiClient.put('/EditarCategorias', data);
      router.reload();
      toast.success('Produto editado com sucesso!');
    } catch (err) {
      console.error(err);
      toast.error('Ops, erro ao editar o produto!');
    }
    setNome('');
    setImageAvatar(null);
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
                {(avatarUrl || categoria?.banner) && (
                  <img
                    className={styles.previw}
                    src={avatarUrl || `http://localhost:3333/files/${categoria?.banner}`}
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
                <input
                  type="text"
                  className="form-control"
                  id="categoriaName"
                  placeholder="Nome da Categoria"
                  value={nome || categoria?.nome}
                  onChange={(e) => setNome(e.target.value)}
                />
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
  return {
      props: {}
  };
});