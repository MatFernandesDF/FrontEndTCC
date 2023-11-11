import React from 'react';
import { Card } from 'react-bootstrap';
import { OrdemItemProps } from '../../../pages/painel/index';


const OrderDetailsList = ({ ordens }: { ordens: OrdemItemProps[] }) => {
    if (!ordens || ordens.length === 0) {
      return <p>Selecione um pedido para ver os detalhes.</p>;
    }
  
    return (
      <div>
        {ordens.map((ordem, index) => (
          <Card key={index}>
            <Card.Header>Detalhes do Pedido {ordem.id}</Card.Header>
            <Card.Body>
              <Card.Title>{ordem.produto.nome}</Card.Title>
              <Card.Text>
                Quantidade: {ordem.quantia}
              </Card.Text>
              {/* Adicione mais detalhes conforme necessário */}
            </Card.Body>
          </Card>
        ))}
      </div>
    );
  };
  
  export default OrderDetailsList;