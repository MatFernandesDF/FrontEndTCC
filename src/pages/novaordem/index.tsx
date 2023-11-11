import React, { useState, useEffect, useContext } from 'react';
import Header from '../../components/ui/head/index';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "../../../styles/home.module.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import { setupAPIClient } from '../../servicos/api';
import { toast } from 'react-toastify';
import Head from "next/head";
import { AutenticarContext } from '../../contexts/AutenticarContext'

export default function NovaOrdem({ listarCategoria }) {
    const [categorias, setCategorias] = useState(listarCategoria);
    const [produtos, setProdutos] = useState([]);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
    const [loading, setLoading] = useState(false);
    const apiClient = setupAPIClient();
    const router = useRouter();
    const { mesa, ordem_id } = router.query;
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);
    const [quantia, setQuantia] = useState('1');
    const [itens, setItens] = useState([]);
    const [produtoSelecionadoDisabled, setProdutoSelecionadoDisabled] = useState(null);
    const { user } = useContext(AutenticarContext);

    useEffect(() => {
        async function carregarProdutosIniciais() {
            if (categoriaSelecionada) {
                const response = await apiClient.get('/categorias/produtos', {
                    params: { categoria_id: categoriaSelecionada }
                });

                const produtosDisponiveis = response.data.filter((produto) => produto.disponibilidade === true);

                setProdutos(produtosDisponiveis);
            }
        }

        carregarProdutosIniciais();
    }, [categoriaSelecionada]);

    const handleCategoriaChange = async (e) => {
        const categoriaId = e.target.value;
        setCategoriaSelecionada(categoriaId);
        setProdutoSelecionado(null);
        setProdutoSelecionadoDisabled(false);

        if (categoriaId) {
            const response = await apiClient.get('/categorias/produtos', {
                params: { categoria_id: categoriaId }
            });
            setProdutos(response.data);
        }
    };

    const fecharOrdem = async () => {
        try {
            await apiClient.delete("/ordens", {
                params: {
                    ordem_id: ordem_id
                },
            });
            toast.success("Pedido cancelado com sucesso :)");
            router.back();
        } catch (error) {
            toast.error("Desculpa, não foi possível excluir o pedido :("), error;
        }
    };

    const handleAddItem = async (produtoId) => {
        try {
            const response = await apiClient.post("/ordens/adicionar-item", {
                ordem_id: ordem_id,
                produto_id: produtoId,
                quantia: Number(quantia),
            });

            const produtoAdicionado = produtos.find(p => p.id === produtoId);
            const data = {
                id: response.data.id,
                produto_id: produtoId,
                nome: produtoAdicionado?.nome,
                valor: produtoAdicionado?.valor,
                quantia: quantia,
                banner: produtoAdicionado?.banner,
            };

            setItens(prevItens => [...prevItens, data]);
            toast.success("Item adicionado com sucesso :)");

        } catch (error) {
            toast.error("Erro ao adicionar item:", error);
        }
    };

    const handleRemoveItem = (itemId) => {
        apiClient.delete('/ordens/remover-item', {
            params: {
                item_id: itemId
            }
        }).then(() => {
            let removerItem = itens.filter(item => item.id !== itemId);
            setItens(removerItem);
        }).catch((error) => {
            console.error("Erro ao remover item: ", error);
        });
    };

    const calcularValorTotal = () => {
        return itens.reduce((total, item) => {
            const quantia = parseFloat(item.quantia); // Certifique-se de usar parseFloat para tratar valores decimais
            const valor = parseFloat(item.valor); // Certifique-se de usar parseFloat para tratar valores decimais
    
            if (!isNaN(quantia) && !isNaN(valor)) {
                return total + (quantia * valor);
            }
    
            return total;
        }, 0);
    };
    

    function handleAvancar() {
        if (itens.length === 0) {
            return;
        }

        const total = calcularValorTotal();

        const queryParams = `mesa=${router.query?.mesa || ''}&ordem_id=${router.query?.ordem_id || ''}&valorTotal=${total.toFixed(2)}`;
        window.location.href = `/finalizarPedido?${queryParams}`;
    }

    return (
        <div>
            <Header />
            <Head>
                <style>{`
                    .item-list {
                        background-color: #f2f2f2;
                        padding: 20px;
                        margin: 10px 0;
                        border-radius: 5px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        font-size:30px;
                    }
                    .dropdown1 {
                        position: relative;
                        display: inline-block;
                        width: 100%; 
                    }
                    
                    .dropdown-content {
                        display: none;
                        position: absolute;
                        width: 100%;
                        z-index: 1;
                        background-color: #f9f9f9;
                        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
                        padding: 5px;
                        overflow: auto;
                        width: 100$;        
                        max-height: 300px;   
                        padding: 10px;
                        align-items: flex-start;    
                    }
                    .dropdown-content div {
                        padding: 10px;
                        cursor: pointer;
                        display: flex;          
                        flex-direction: row;  
                        align-items: center; 
                        justify-content: flex-start; 
                    }
                    .form-select {
                        width: 300px;       
                    }
                    
                    .dropdown-content div img {
                        width: 200px;         
                        height: 100px;        
                        margin-right: 10px;
                    }
                    .dropdown-content div {
                        padding: 10px;
                        cursor: pointer;
                        text-align: left;
                        font-size:30px;
                        font-family: 'Kanit', sans-serif;
                    }
                    .dropdown-button {
                        text-align: left; /* Alinhar o texto à esquerda */
                    }
                    .dropdown-content div:hover {
                        background-color: #ddd;
                    }
                    
                    .show {
                        display: block;
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

                    .total-bar {
                        background-color: purple;
                        color: #fff;
                        padding: 10px;
                        text-align: center;
                        font-size: 30px;
                        font-family: 'Kanit', sans-serif;
                    }
                `}</style>
            </Head>

            <div id={styles.content} className="content">
                <main className={styles.conteudo}>
                    <div className={styles.glasscontent}>
                        <div className="d-flex align-items-center justify-content-center my-4">
                            <h2 style={{ fontSize: '2em' }}>
                                {mesa ? `Mesa: ${mesa}` : 'Pedido para Viagem'}
                            </h2>
                            {itens.length === 0 && (
                                <button
                                    onClick={fecharOrdem}
                                    className="ml-3"
                                    style={{ background: 'none', border: 'none' }}
                                >
                                    <FontAwesomeIcon
                                        icon={faTrashAlt}
                                        style={{
                                            cursor: 'pointer',
                                            fontSize: '2em',
                                            color: 'red',
                                            width: '20px',
                                            height: '40px',
                                        }}
                                    />
                                </button>
                            )}
                        </div>

                        <div className="my-4">
    <div style={{ display: 'flex', gap: '20px' }}>
        <div className="w-50" style={{ overflowY: 'auto' }}>
        <select
        className="form-select mb-1"
        style={{ fontSize: '1.5em', padding: '15px 12px' }}
        onChange={(e) => handleCategoriaChange(e)}
        value={categoriaSelecionada}
    >
        <option value="">Selecione uma categoria</option>
        {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
                {categoria.nome}
            </option>
        ))}
    </select>
    {categoriaSelecionada ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', maxHeight: '300px', overflowY: 'auto' }}>
            {produtos.map((produto) => (
                <div key={produto.id} style={{ flex: '0 0 calc(33.33% - 20px)' }}>
                    <div>
                        <img src={`http://localhost:3333/files/${produto.banner}`} alt={produto.nome} width="200px" height="px" />
                        {produto.nome}<br />
                        {produto.descricao}<br />
                        R$ {produto.valor}
                    </div>
                    <button
                        className="btn btn-primary"
                        style={{ fontSize: '1.5em', padding: '5px 10px', margin: '4px' }}
                        onClick={() => handleAddItem(produto.id)}
                    >
                        Adicionar
                    </button>
                </div>
            ))}
        </div>
    ) : (
        <p>Selecione uma categoria para ver os produtos.</p>
    )}
    <div className="d-flex align-items-center mb-3">
        <span style={{ fontSize: '1.5em', marginRight: '10px' }}>Quantidade</span>
        <input
            type="text"
            className="form-control"
            style={{ fontSize: '1.5em', padding: '15px 12px', flex: '1', marginRight: '10px' }}
            placeholder="Adicional"
            value={quantia}
            onChange={(e) => setQuantia(e.target.value)}
        />
    </div>
</div>

        <div className="w-50">
            {/* Código do carrinho */}
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {itens.map((item) => (
                    <div key={item.id} className="item-list d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                            <img src={`http://localhost:3333/files/${item.banner}`} alt={item.nome} width="90px" height="90px" />
                            <div className="ms-3">
                                <p className="mb-1">{item.nome}</p>
                                <p className="mb-1">Quantidade: {item.quantia}</p>
                                <p>Valor: R${item.valor}</p>
                            </div>
                        </div>
                        <button onClick={() => handleRemoveItem(item.id)} className="btn-remove">
                            Remover
                        </button>
                    </div>
                ))}
            </div>

            <div className="total-bar">
                Total: R${calcularValorTotal().toFixed(2)}
            </div>
            <button
                className="btn btn-success"
                style={{ fontSize: '1.5em', padding: '19px 80px', margin: '4px' }}
                onClick={handleAvancar}
                disabled={itens.length === 0}
            >
                Pagar
            </button>
        </div>
    </div>
</div>
</div>             </main>
            </div>
            <script src="script.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
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