import React, { useState } from 'react';
import { Container, Row, Col, Navbar, Nav, Button, Card, Form } from 'react-bootstrap';
const Footer: React.FC = () => {

  return (

      <footer className=" bg-dark footer navbar-fixed-bottom">
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
  );
};

export default Footer;