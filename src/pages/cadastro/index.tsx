import React, { useState, FormEvent, useContext } from "react";
import { Button, Form, Col } from "react-bootstrap"; 
import { AutenticarContext } from "../../contexts/AutenticarContext";
import { toast } from "react-toastify";
import stylelogin from "../../../styles/homelogin.module.scss";
import InputMask from "react-input-mask";
import zxcvbn from "zxcvbn";
import { canSSRGuest } from "../../utils/canSSRGuest";
import Link from 'next/link';
import Head from 'next/head';
export default function Cadastro() {
  const { cadastro } = useContext(AutenticarContext);
  const [id, setId] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const passwordStrengthDescriptions = [
    "Muito Fraca",
    "Fraca",
    "Média",
    "Forte",
    "Muito Forte",
  ];

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    const result = zxcvbn(password);
    setPasswordStrength(result.score);
  };

  async function handleCadastro(event: FormEvent) {
    event.preventDefault();

    if (id === "" || nome === "" || email === "" || senha === "" || confirmarSenha === "") {
      toast.warning("Preencha todos os dados");
      return;
    }

    if (senha !== confirmarSenha) {
      toast.error("As senhas não coincidem");
      return;
    }

    setLoading(true);

    let data = {
      id,
      nome,
      email,
      senha,
      confirmarSenha,
    };
    try {
      await cadastro(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
           <Head>
        <style>{`
               .password-strength-meter {
                  width: 100%;
                  height: 10px;
                  background-color: #ddd;
                  border-radius: 5px;
                  margin-botton: 10px;
                  position: relative;
                  overflow: hidden;
                }

                .password-strength-bar {
                  height: 100%;
                  border-radius: 5px;
                  transition: width 0.3s ease;
                }

                .strength-0 {
                  background-color: #ff5959; /* Muito Fraca */
                }

                .strength-1 {
                  background-color: #ffa659; /* Fraca */
                }

                .strength-2 {
                  background-color: #ffd659; /* Média */
                }

                .strength-3 {
                  background-color: #0A77BA; /* Forte */
                }

                .strength-4 {
                  background-color: #45BA0A; /* Muito Forte */
                }
              `}</style>
      </Head>

      <main>
        <section id={stylelogin.myftcosection} className="ftco-section">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-6 text-center mb-5">
              
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-md-6 col-lg-5">
                <div id={stylelogin.loginwrap} className="login-wrap p-4 p-md-5">
                  <div className="icon d-flex align-items-center justify-content-center">
                    <div id={stylelogin.purplecircle} className="rounded-circle purple-circle">
                      <span className="fa fa-user-plus"></span>
                    </div>
                  </div>

                  <h3 className="text-center mb-4">Criar Conta</h3>

                  <Form onSubmit={handleCadastro} id={stylelogin.loginform} className="login-form">
                    <Form.Group>
                      <InputMask
                        type="text"
                        mask="999.999.999-99"
                        placeholder="CPF"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Control
                        type="text"
                        placeholder="Nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Control
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Control
                        type="password"
                        placeholder="Senha"
                        value={senha}
                        onChange={(e) => {
                          setSenha(e.target.value);
                          handlePasswordChange(e);
                        }}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Control
                        type="password"
                        placeholder="Confirmar Senha"
                        value={confirmarSenha}
                        onChange={(e) => setConfirmarSenha(e.target.value)}
                      />
                    </Form.Group>
                    <div className="password-strength-meter">
                      <div className={`password-strength-bar strength-${passwordStrength}`}></div>
                    </div>

                    <div id={stylelogin.formgroup} className="form-group">
                      <div id={stylelogin.centercontent} className="center-content">
                        <Button id={stylelogin.btnprimary} type="submit" disabled={loading}>
                          Cadastre-se
                        </Button>
                        <Link href="/Login" legacyBehavior>
                          <a>Já tem uma conta? Faça login aqui</a>
                        </Link>
                      </div>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
  return {
    props: {},
  };
});