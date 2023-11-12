import styles from './styles.module.scss'; // Importe o arquivo de estilo
import React, { useContext, useState } from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { AutenticarContext } from '../../../contexts/AutenticarContext';
import { NavDropdown } from 'react-bootstrap';

function Header() {
  const { user, sair } = useContext(AutenticarContext);

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto"> 
            <Nav.Link href="/clienteInicial" style={{ fontSize: '24px' }}>Início</Nav.Link>
            <Nav.Link href="/listarCategorias" style={{ fontSize: '24px' }}>Cardápio</Nav.Link>
              {user?.nivel_acesso === 2 && (
            <Nav.Link href="/painelAdmin" style={{ fontSize: '24px' }}>Administrativo</Nav.Link>
            )}
            {user?.nivel_acesso === 2 && (
            <Nav.Link href="/listarProdutosFuncionarios" style={{ fontSize: '24px' }}>Produtos</Nav.Link>
            )}
              {user?.nivel_acesso === 2 && (
            <Nav.Link href="/listarCategoriasFuncionarios" style={{ fontSize: '24px' }}>Categorias</Nav.Link>
            )}
                {user?.nivel_acesso === 2 && (
            <Nav.Link href="/listar" style={{ fontSize: '24px' }}>Pedidos</Nav.Link>
            )}
             <Nav.Item>

      </Nav.Item>
          </Nav>
          <NavDropdown 
    title={<span className="text-white my-auto">{user?.nome.split(' ')[0]}</span>} 
    
    id="basic-nav-dropdown" 
    className={styles['custom-dropdown']}
    drop="down"
    renderMenuOnMount={true} 
    style={{ fontSize: '24px' }}
>
  
    <div style={{ width: '300px' }}> 
        <NavDropdown.Item href="/alterarUsuarioCliente">Altere seus dados</NavDropdown.Item>
        <NavDropdown.Item onClick={sair}>Sair</NavDropdown.Item>
    </div>
</NavDropdown>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;