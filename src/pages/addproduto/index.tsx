import { useEffect,useState, ChangeEvent, FormEvent,useContext } from 'react';
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
  const [imageAvatar, setImageAvatar] = useState(null);
  const [categorias, setCategorias] = useState(listarCategoria || [])
  const [categoriaSelecionada, setCategoriaSelecioada] = useState(0)
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
      setAvatarUrl(URL.createObjectURL(e.target.files[0]))

    }
  }

  function handleChangeCategoria(event) {
    setCategoriaSelecioada(event.target.value)
  }
  async function handleRegister(event: FormEvent) {
    event.preventDefault();
    try {
      const data = new FormData();
      if (nome === '' || valor === '' || descricao === '' || imageAvatar === null) {
        toast.error("Preencha todos os dados")
        return;
      }
      data.append('nome', nome);
      data.append('valor', valor);
      data.append('descricao', descricao);
      data.append('imagem', imageAvatar);
      data.append('categoria_id', categorias[categoriaSelecionada].id);



      const apiClient = setupAPIClient();

      await apiClient.post('/produtos', data)
      toast.success('cadastrado com sucesso!')
    } catch (err) {
      console.log(err);
      toast.error("Ops erro ao cadastrar!")
    }
    setNome('');
    setValor('');
    setImageAvatar(null);
    setDescricao('');
    setAvatarUrl('');

  }
  
  return (
    <div>

      <Head>

      </Head>

      <Header />

      <div id={styles.content} className="content">
        <main className={styles.conteudo}>
          <div className={styles.glasscontent}>
            <h2>
              Cadastrar Produto

            </h2>
            <form className="mt-4" onSubmit={handleRegister}>
              {!avatarUrl && <h5 style={{ margin: "0", padding: "0" }}>Upload da Imagem do Produto</h5>}
              <div id={styles.customfile} className="mb-3 d-flex flex-column align-items-center justify-content-center custom-file">
                <input type="file" className="form-control visually-hidden" id="productImage" accept=".jpg, .jpeg, .png" onChange={handleFile} />
                {avatarUrl && (<img
                  className={styles.previw}
                  src={avatarUrl}
                  alt="Foto do produto"
                  width={250}
                  height={250}
                />)}
                <label id={styles.botaoimg} htmlFor="productImage" className="btn btn-primary mb-2" style={{ flexShrink: 0 }}>

                  <i className="fa-solid fa-file-arrow-up fa-beat-fade"></i>
                </label>


              </div>
              <div className="mb-3">
                <select className="form-select" id="category" value={categoriaSelecionada} onChange={handleChangeCategoria}>
                  {categorias.map((item, index) => {
                    return (
                      <option key={item.id} value={index}>
                        {item.nome}
                      </option>
                    )
                  })}
                </select>
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="productName"
                  placeholder="Nome do Produto"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />

              </div>
              <div className="mb-3">
                <input type="text"
                  className="form-control"
                  id="productValue"
                  placeholder="Valor do Produto"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <textarea
                  className="form-control"
                  id="productDescription"
                  rows={4} placeholder="Descrição do Produto"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
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
  const apiClient = setupAPIClient(ctx)


  const response = await apiClient.get('/categorias');

  console.log(response.data);
  return {
    props: {
      listarCategoria: response.data
    }
  };
});