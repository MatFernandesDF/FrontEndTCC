import React, { useContext, FormEvent, useState } from "react";
import Head from "next/head";
import { Container, Row, Col, Form } from 'react-bootstrap';
import Image from 'next/image';
import logoImg from '../../../public/logo.svg';
import stylelogin from '../../../styles/homelogin.module.scss';
import { AutenticarContext } from "../../contexts/AutenticarContext";
import Link from 'next/link';
import { canSSRGuest } from '../../utils/canSSRGuest';
import Button from '../../components/ui/button/index';
import { toast } from 'react-toastify';

export default function Login() {
  const { entrar } = useContext(AutenticarContext);
  const [email, setEmail] = useState('');
  const [senha, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    const trimmedEmail = email.trim();
    const trimmedSenha = senha.trim();

    if (!trimmedEmail || !trimmedSenha) {
      toast.error('Preencha todos os campos');
      return;
    }

    setLoading(true);
    let data = {
      email: trimmedEmail,
      senha: trimmedSenha
    };

    await entrar(data);
    setLoading(false);
  }

  return (
    <>
      <Head>
    
      </Head>
      <main>
        <section id={stylelogin.myftcosection} className="ftco-section">
          <Container>
            <Row className="justify-content-center">
              <Col md={6} className="text-center mb-5">
                <Image src={logoImg} alt="DigiFood" width={400} height={120} />
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col md={6} lg={5}>
                <div id={stylelogin.loginwrap} className="login-wrap p-4 p-md-5">
                  <div className="icon d-flex align-items-center justify-content-center">
                    <div id={stylelogin.purplecircle} className="rounded-circle purple-circle">
                      <span className="fa fa-user-o"></span>
                    </div>
                  </div>
                  <h3 className="text-center mb-4">Entrar</h3>
                  <Form onSubmit={handleLogin} className="login-form" id={stylelogin.loginform}>
                    <Form.Group controlId="formEmail">
                      <Form.Control
                        type="text"
                        id="email"
                        placeholder="Email"
                        value={email} required
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                      />
                    </Form.Group>
                    <Form.Group controlId="formSenha">
                      <Form.Control
                        type="password"
                        id="senha"
                        autoComplete="current-password"
                        value={senha}
                        placeholder="Senha"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </Form.Group>
                    <div id={stylelogin.formgroup} className="form-group">
                      <div id={stylelogin.centercontent} className="center-content">
                        <Link href="/cadastro" legacyBehavior>
                          <a suppressHydrationWarning >Cadastre-se</a>
                        </Link>
                        <Link href="/recuperar" legacyBehavior>
                          <a suppressHydrationWarning >Esqueci minha senha</a>
                        </Link>
                        <Button id={stylelogin.btnprimary} loading={loading} size="large">
                          Logar
                        </Button>
                      </div>
                    </div>
                  </Form>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </main>
    </>
  );
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
  return {
    props: {}
  }
});