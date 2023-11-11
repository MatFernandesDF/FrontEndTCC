import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import styles from './styles.module.scss'; // Importe seu arquivo de estilos

function DarkVariant() {
  return (
    <Carousel data-bs-theme="dark" className={styles.carousel} interval={3000}>
     <Carousel.Item>
  <img
    className={`d-block w-100 ${styles.carouselImage}`} // Aplicando a classe de tamanho personalizado
    src="https://edit.org/photos/img/blog/2018100111-menu-restaurante-apetitoso.jpg-1300.jpg"
    alt="First slide"
  />
  <Carousel.Caption className={styles.carouselCaption}>
  <h5>Aberto todos os dias </h5>
          <p>  Priorizando o consumidor.</p>
  </Carousel.Caption>
</Carousel.Item>
      <Carousel.Item>
        <img
          className={`d-block w-100 ${styles.carouselImage}`}
          src="https://www.designi.com.br/images/preview/10619901.jpg"
          alt="Second slide"
        />
        <Carousel.Caption className={styles.carouselCaption}>
          <h5 style={{ color: "white" }}>Aberto todos os dias </h5>
          <p>  Priorizando o consumidor.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className={`d-block w-100 ${styles.carouselImage}`}
          src="https://www.teveoenmadrid.com/wp-content/uploads/2020/10/restaurante-propaganda-sala-te-veo-en-madrid.jpg"
          alt="Third slide"
        />
        <Carousel.Caption className={styles.carouselCaption}>
          <h5>Aberto todos os dias </h5>
          <p>
            Priorizando o consumidor.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default DarkVariant;