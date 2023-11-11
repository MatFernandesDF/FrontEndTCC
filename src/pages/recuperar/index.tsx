import { useContext, FormEvent, useState } from "react";
import React from "react";
import Head from "next/head";
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Image from 'next/image';
import logoImg from '../../../public/logo.svg';
import Link from "next/link";
import { AutenticarContext } from '../../contexts/AutenticarContext'
import { canSSRGuest } from '../../utils/canSSRGuest'
import stylelogin from '../../../styles/homelogin.module.scss';

export default function Recuperar() {
  const { recuperar } = useContext(AutenticarContext);
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRecuperar(event: FormEvent) {
    event.preventDefault();

    if (email === '') {
      alert("PREENCHA TODOS OS CAMPOS")
      return;
    }

    setLoading(true);

    let data = {
      email
    };

    try {
      await recuperar(data);
    } finally {
      setLoading(false);
    }
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
                <Image src={logoImg} alt="Digifood" />
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col md={6} lg={5}>
                <div id={stylelogin.loginwrap} className="login-wrap p-4 p-md-5">
                  <div className="icon d-flex align-items-center justify-content-center">
                    <div id={stylelogin.purplecircle} className="rounded-circle purple-circle">
                      <span className="fa fa-lock"></span>
                    </div>
                  </div>
                  <h3 className="text-center mb-4">Recuperar Senha</h3>
                  <Form onSubmit={handleRecuperar} className="login-form" id={stylelogin.loginform}>
                    <Form.Group controlId="formEmail">
                      <Form.Control
                        type="email"
                        placeholder="Email"
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </Form.Group>
                    <div id={stylelogin.formgroup} className="form-group">
                      <div id={stylelogin.centercontent} className="center-content">
                        <Link href="/Login" legacyBehavior>
                          <a suppressHydrationWarning >Lembrou a senha?</a>
                        </Link>
                        <Button id={stylelogin.btnprimary} variant="primary" type="submit" disabled={loading}>
                          {loading ? "Recuperando..." : "Recuperar"}
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
  )
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
  return {
    props: {}
  }
})