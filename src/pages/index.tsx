import React from 'react';
import { Container, Row, Col, Navbar, Nav, Button, Card, Form } from 'react-bootstrap';
import DarkVariantCarousel from '../components/ui/CarroselInicial/index'
import Link from "next/link";
import { AutenticarContext } from '../contexts/AutenticarContext'
import { useContext, FormEvent, useState } from "react";
import { canSSRGuest } from '../utils/canSSRGuest'
import Produto1 from '../../public/pizza.jpg';
import Produto2 from '../../public/hamburguer.jpg';
import Produto3 from '../../public/sobremesas.jpg';
import Image from 'next/image';

export default function Inicio() {
  const { contato } = useContext(AutenticarContext);
  const [email, setEmail] = useState('')
  const [nome, setNome] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleContato(event: FormEvent) {
    event.preventDefault();

    if (email === '' || nome === '' || mensagem === '') {
      alert("PREENCHA TODOS OS CAMPOS")
      return;
    }

    setLoading(true);

    let data = {
      email, nome, mensagem
    };

    try {
      await contato(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
        <Container>
          <Navbar.Brand href="#inicio">DIGIFOOD</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <Nav.Link href="#inicio">Início</Nav.Link>
              <Nav.Link href="#cardapio">Cardápio</Nav.Link>
              <Nav.Link href="#contato">Contato</Nav.Link>
            </Nav>
          </Navbar.Collapse>
          <Nav.Link href="/Login" className="ml-auto" style={{ color: 'white' }}>Login</Nav.Link>
        </Container>
      </Navbar>
      <section id="inicio">
        <DarkVariantCarousel />
      </section>
      <section id="inicio" className="bg text-white text-center py-5" style={{ background: 'black' }}>
  <Container>
    <Row className="justify-content-center">
      <Col>
        <div className="d-flex align-items-center justify-content-center">
          <h1 className="section-title">Bem-vindo ao DigiFood</h1>
          <a href="Login" style={{ background: '#8D448B', border:'none', padding:'15px 30px', fontSize:'20px', borderRadius:'250px',margin:'20px', textDecoration:'none', color:'white' }}>
            Peça agora<i className="fa-solid fa-angle-right" style={{color:' #ffffff', marginLeft:'10px'}}></i>
          </a>
        </div>
      </Col>
    </Row>
  </Container>
</section>
      <section id="cardapio" className="py-5">
      <Container>
  <h2 className="section-title text-center mb-5">Cardápio</h2>
  <Row className="justify-content-center text-center">
    <Col xs={12} sm={5} md={3} className="mb-3" >
      <Card style={{ background: 'none', border:'3px' }}>
        <Image
          src={Produto1}
          alt="Prato 1"
          width={300}
          height={300}
          
        />
        <Card.Body>
          <Card.Title className="card-title">Deliciosas Pizzas</Card.Title>
          <Card.Text className="card-text">
            Pizzas variadas
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
    <Col xs={12} sm={6} md={3} className="mb-4">
      <Card style={{ background: 'none', border:'3px' }}>
        <Image
          src={Produto3}
          alt="Prato 1"
          width={300}
          height={300}
         
        />
        <Card.Body>
          <Card.Title className="card-title">Sobremesas deliciosas</Card.Title>
          <Card.Text className="card-text">
            Sobremesas de dar agua na boca
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
    <Col xs={12} sm={6} md={3} className="mb-4">
      <Card style={{ background: 'none', border:'3px' }}>
        <Image
          src={Produto2}
          alt="Prato 1"
          width={300}
          height={300}
        
        />
        <Card.Body>
          <Card.Title className="card-title"> Hamburgues deleciosos</Card.Title>
          <Card.Text className="card-text">
               Variados sabores
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  </Row>
</Container>
      </section>
      <Container>
  <section id="contato" className="py-5" style={{ background: "#f5f5f5" }}>
  <Container>
  <section id="contato" className="py-5" style={{ background: "#f5f5f5" }}>
    <Container>
      <Row>
        <Col>
          <h2 className="section-title">Contato</h2>
          <p>Entre em contato conosco para mais informações.</p>
          <Form onSubmit={handleContato}>
            <Form.Group controlId="formName">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                placeholder="Seu nome"
                value={nome}
                required
                onChange={(e) => setNome(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Seu email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formMessage">
              <Form.Label>Mensagem</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Sua mensagem"
                value={mensagem}
                required
                onChange={(e) => setMensagem(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={loading} style={{ background: "black", padding: "10px 30px" }}>
              {loading ? "Enviando..." : "Enviar"}
            </Button>
          </Form>
          <div className="text-center"> 
            <a
              href="https://api.whatsapp.com/send?phone=61992486297"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="success"><h5>Fale conosco</h5></Button>
              
            </a>
          </div>
        </Col>
      </Row>
    </Container>
  </section>
</Container>
  </section>
</Container>
      <footer className="bg-dark text-light py-3">
        <Container>
          <Row>
            <Col md={4}>
              <h3>Contato</h3>
              <p>Quadra 205, Conjunto 12, Casa 34</p>
              <p>Email: DigiFood@gmail.com</p>
              <p>Telefone: (61) 98384-5756</p>
            </Col>
            <Col md={4}>
              <h3>Sobre Nós</h3>
              <p>
                A DigiFood é uma plataforma inovadora que revoluciona a maneira como as pessoas acessam e pedem comida. Com a DigiFood, você pode desfrutar de uma experiência de alimentação conveniente e eficiente, tudo na ponta dos seus dedos.
              </p>
            </Col>
            <Col md={4}>
              <h3>Redes Sociais</h3>
              <ul className="list-unstyled">
                <li>
                  <a href="#">Facebook</a>
                </li>
                <li>
                  <a href="#">Twitter</a>
                </li>
                <li>
                  <a href="#">Instagram</a>
                </li>
              </ul>
            </Col>
          </Row>
        </Container>
        <div className="text-center py-2">
          © {new Date().getFullYear()} DigiFood. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}
export const getServerSideProps = canSSRGuest(async (ctx) => {
  return {
    props: {}
  }
});