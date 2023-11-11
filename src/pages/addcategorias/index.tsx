import { useState, ChangeEvent, FormEvent, useContext,useEffect, } from 'react';
import { cansSSRAuth } from '../../utils/canSSRAuth';
import Header from '../../components/ui/head/index';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "../../../styles/home.module.scss";
import Button from '../../components/ui/button/index';
import { setupAPIClient } from '../../servicos/api'
import { toast } from 'react-toastify'
import { AutenticarContext } from '../../contexts/AutenticarContext'
import { useRouter } from 'next/router';


export default function AddCategoria() {
  const { user } = useContext(AutenticarContext);
  const [nome, setNome] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [imageAvatar, setImageAvatar] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (user && user.nivel_acesso === 1) {
      router.push('/clienteInicial');
    }
  }, [user]);

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
      setAvatarUrl(URL.createObjectURL(e.target.files[0]));
    }
  }

  async function handleRegister(event: FormEvent) {
    event.preventDefault();
    try {
      const data = new FormData();

      if (nome === '' || imageAvatar === null) {
        toast.error('Preencha todos os dados');
        return;
      }

      data.append('nome', nome);
      data.append('imagem', imageAvatar);

      const apiClient = setupAPIClient();

      await apiClient.post('/categorias1', data);
      toast.success('Cadastrado com sucesso!');
    } catch (err) {
      console.log(err);
      toast.error('Ops, erro ao cadastrar!');
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
            <h2>Cadastrar Categoria</h2>
            <form className="mt-4" onSubmit={handleRegister}>
              {!avatarUrl && <h5 style={{ margin: '0', padding: '0' }}>Upload da Imagem da Categoria</h5>}
              <div id={styles.customfile} className="mb-3 d-flex flex-column align-items-center justify-content-center custom-file">
                <input type="file" className="form-control visually-hidden" id="categoryImage" accept=".jpg, .jpeg, .png" onChange={handleFile} />
                {avatarUrl && (
                  <img
                    className={styles.previw}
                    src={avatarUrl}
                    alt="Imagem da categoria"
                    width={250}
                    height={250}
                  />
                )}
                <label id={styles.botaoimg} htmlFor="categoryImage" className="btn btn-primary mb-2" style={{ flexShrink: 0 }}>
                  <i className="fa-solid fa-file-arrow-up fa-beat-fade"></i>
                </label>
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="categoryName"
                  placeholder="Nome da Categoria"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>
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