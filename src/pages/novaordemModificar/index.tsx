import React, { useState, useEffect, useContext } from 'react';
import Header from '../../components/ui/head/index';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "../../../styles/home.module.scss";
import { useRouter } from 'next/router';
import { setupAPIClient } from '../../servicos/api';
import { toast } from 'react-toastify';
import Head from "next/head";
import { AutenticarContext } from '../../contexts/AutenticarContext';

export default function NovaOrdem({ listarCategoria }) {
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const [categorias, setCategorias] = useState(listarCategoria);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [produtos, setProdutos] = useState([]);
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);
    const [quantia, setQuantia] = useState(1); 
    const [itens, setItens] = useState([]);
    const [produtoSelecionadoDisabled, setProdutoSelecionadoDisabled] = useState(true);

    const apiClient = setupAPIClient();
    const router = useRouter();
    const { mesa, ordem_id } = router.query;
    const { user } = useContext(AutenticarContext);

    useEffect(() => {
        async function carregarProdutosIniciais() {
            const apiClient = setupAPIClient();
            const response = await apiClient.get('/categorias/produtos', {
                params: { categoria_id: selectedCategory }
            });

            
            const produtosDisponíveis = response.data.filter((produto) => produto.disponibilidade === true);

            setProdutos(produtosDisponíveis);
        }

        carregarProdutosIniciais();
    }, [selectedCategory]);

    const handleCategoriaChange = async (e) => {
        const categoriaId = e.target.value;
        setSelectedCategory(categoriaId);
        setProdutoSelecionado(null);
        setProdutoSelecionadoDisabled(false);

        const apiClient = setupAPIClient();
        const response = await apiClient.get('/categorias/produtos', {
            params: { categoria_id: categoriaId }
        });
        setProdutos(response.data);
    };

    const fecharOrdem = async () => {
        try {
            const apiClient = setupAPIClient();
            await apiClient.delete("/ordens", {
                params: {
                    ordem_id: ordem_id
                },
            });
            toast.success("Pedido cancelado com sucesso :)");
            router.back();
        } catch (error) {
            toast.error("Desculpa, não foi possível excluir o pedido :)", error);
        }
    };

    const addItem = async (produtoId) => {
        try {
            const existingItem = cart.find(item => item.produto_id === produtoId);

            if (existingItem) {
                
                existingItem.quantia += 1; 
            } else {
                const response = await apiClient.post("/ordens/adicionar-item", {
                    ordem_id: ordem_id,
                    produto_id: produtoId,
                    quantia: 1, 
                });

                const produtoAdicionado = produtos.find(p => p.id === produtoId);
                const data = {
                    id: response.data.id,
                    produto_id: produtoId,
                    nome: produtoAdicionado?.nome,
                    valor: produtoAdicionado?.valor,
                    quantia: 1, 
                };

                setCart([...cart, data]);
                toast.success("Item adicionado com sucesso :)");
            }
        } catch (error) {
            toast.error("Erro ao adicionar item:", error);
        }
    };

    const removeItem = (item_id) => {
        const api = setupAPIClient();
        api.delete('/ordens/remover-item', {
            params: {
                item_id: item_id
            }
        }).then(() => {
            let updatedCart = cart.filter(item => item.id !== item_id);
            setCart(updatedCart);
        }).catch((error) => {
            console.error("Erro ao remover item: ", error);
        });
    };

    const calcularValorTotal = () => {
        return cart.reduce((total, item) => total + (item.quantia * item.valor), 0);
    };

    const handleAvançar = () => {
        if (cart.length === 0) {
            return;
        }

        const total = calcularValorTotal();

        const queryParams = `mesa=${router.query?.mesa || ''}&ordem_id=${router.query?.ordem_id || ''}&valorTotal=${total.toFixed(2)}`;
        window.location.href = `/finalizarPedido?${queryParams}`;
    }

    return (
        <div>
            <Head>
                <style>{`
          .item-list {
            background-color: #f2f2f2;
            padding: 10px;
            margin: 10px 0;
            border-radius: 5px;
            display: flex;
            justify-content: space between;
            align-items: center;
          }

          .btn-remove {
            background-color: #ff4c4c;
            color: #fff;
            border: none;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
          }

          .btn-remove:hover {
            background-color: #d62c2c;
          }

          .btn-add {
            background-color: green;
            color: #fff;
            border: none;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
          }

          .btn-remove:hover {
            background-color: #d62c2c;
          }
          .total-bar {
            background-color: purple;
            color: #fff;
            padding: 10px;
            text-align: right;
          }
          #content {
            display: flex;
            flex: 1;
          }
          .conteudo {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
          }
          .conteudo a {
            text-decoration: none;
            color: #8D448B;
          }
          .glasscontent {
            margin-top: 50px;
            background-color: #fdfdfd;
            backdrop-filter: blur(10px);
            border: 2px solid rgba(187, 31, 31, 0.3);
            border-radius: 10px;
            padding: 20px;
            text-align: center;
            width: 75%;
            box-shadow: 0px 0px 90px rgba(0, 0, 0, 0.5);
          }
          .glasscontent .container {
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 10px;
          }
          .listgroupitem {
            position: relative;
            border-radius: 0px;
            border: 2px solid transparent;
            margin-bottom: 15px;
            transition: background-color 0.3s;
          }

          .custom-file {
            width: 100%;
            height: 229px;
            border: 2px solid #ccc;
            border-radius: 10px;
            overflow: hidden;
          }

          .add-button {
            background-color: #8D448B;
            color: white;
            border: none;
            border-radius: 5px;
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
            display: flex;
            align-items: center;
          }

          .add-button i {
            margin right: 10px;
          }

          .add-button:hover {
            background-color: #66346D;
          }
          #customfile {
            border: 4px solid #898B8E;
            height: 260px;
            box-shadow: 0px 0px 90px rgba(0, 0, 0, 0.3);
          }
          .previw {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          #botaoimg {
            position: fixed;
          }
          #shoppingCartContainer {
            height: 500px;
            display: flex;
            background-color: #F0F8FF;
            flex-direction: column;
            justify-content: space-between;
          }

          #totalSection {
            background: white;
            padding: 5px;
            border-top: 1px solid #ddd;
            display: flex;
           
            flex-direction: column;
            
            align-items: center;
            
            justify-content: center;
         
          }

          #shoppingCart {
            overflow-y: auto;
            flex: 1;
          }

          .product-card {
            border: 1px solid #e0e0e0;
            margin: 10px;
            border-radius: 5px;
            overflow: hidden;
          }

          .product-card img {
            max-width: 100%;
            height: 200px;
            object-fit: cover;
          }

          .product-card .card-body {
            text-align: center;
          }
            `}
                </style>
            </Head>
            <Header />
            <div id={styles.content} className="content">
                <main className={styles.conteudo}>
                    <div className="glasscontent">
                        <div className="container mt-5">
                            <div className="row">
                                <div className="col-md-8">
                                    <h2 style={{ fontSize: '2em' }}>
                                        {mesa ? `Mesa: ${mesa}` : 'Pedido para Viagem'}
                                    </h2>
                                    <h4>Produtos</h4>
                                    <select
                                        className="form-select mb-3"
                                        value={selectedCategory}
                                        onChange={handleCategoriaChange}
                                    >
                                        <option value="">Todas as Categorias</option>
                                        {categorias.map((categoria) => (
                                            <option key={categoria.id} value={categoria.id}>
                                                {categoria.nome}
                                            </option>
                                        ))}
                                    </select>
                                    <div
                                        className="row"
                                        id="productsContainer"
                                        style={{ maxHeight: '500px', overflowY: 'auto' }}
                                    >
                                        {produtos.map((produto) => (
                                            <div className="col-md-6" key={produto.id}>
                                                <div className="product-card">
                                                    <img
                                                        src={`http://localhost:3333/files/${produto.banner}`}
                                                        alt={produto.nome}
                                                    />
                                                    <div className="card-body">
                                                        <h5 className="card-title">{produto.nome}</h5>
                                                        <p className="card-text">Preço: ${produto.valor}</p>
                                                        <button
                                                            onClick={() => addItem(produto.id)}
                                                            className="btn btn-success"
                                                        >
                                                            Adicionar ao Carrinho
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <h4>Carrinho</h4>
                                    <div id="shoppingCartContainer">
                                        <ul className="list-group mb-3" id="shoppingCart">
                                            {cart.map((item) => (
                                                <li key={item.id} className="list-group-item">
                                                    <div className="item-list">
                                                        <span>{item.nome}</span>
                                                        <span>${item.valor}</span>
                                                        <button
                                                            onClick={() => removeItem(item.id)}
                                                            className="btn-remove"
                                                        >
                                                            -
                                                        </button>
                                                        <span>{item.quantia}</span>
                                                        <button
                                                            onClick={addItem}
                                                            className="btn-add"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                        <div id="totalSection" className="text-right mb-3">
                                            <strong>Total: ${total.toFixed(2)}</strong>
                                            <button
                                                className="btn btn-success btn-block mt-2"
                                                onClick={handleAvançar}
                                            >
                                                Finalizar Pedido
                                            </button>
                                            <button
                                                onClick={fecharOrdem}
                                                className="btn btn-danger btn-block mt-1"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export const getServerSideProps = async (ctx) => {
    const apiClient = setupAPIClient(ctx);

    const response = await apiClient.get('/categorias');

    return {
        props: {
            listarCategoria: response.data
        }
    };
}; 