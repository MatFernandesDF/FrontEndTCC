import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import styles from './styles.module.scss'; // Importe seu arquivo de estilos
import logo from '../CarroselInicial/pizza.jpg';
import logo2 from '../CarroselInicial/pizza2.jpg';
import Image from 'next/image';

function DarkVariantCarousel() {
  return (
    <Carousel data-bs-theme="dark" className={styles.carousel} interval={3000}>
     <Carousel.Item>
  <Image
    className={`d-block w-100 ${styles.carouselImage}`} 
    src={logo} 
    alt="First slide"
  />
  <Carousel.Caption className={styles.carouselCaption}>
  <h5 style={{ color: "white" }}>Aberto todos os dias </h5>
          <p style={{ color: "white" }}>  Priorizando o consumidor.</p>
  </Carousel.Caption>
</Carousel.Item>
      <Carousel.Item>
        <Image
          className={`d-block w-100 ${styles.carouselImage}`}
          src={logo2} 
          alt="Logo"
        />
        <Carousel.Caption className={styles.carouselCaption}>
          <h5 style={{ color: "white" }}>Aberto todos os dias </h5>
          <p style={{ color: "white" }}>  Priorizando o consumidor.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className={`d-block w-100 ${styles.carouselImage}`}
          src="https://www.teveoenmadrid.com/wp-content/uploads/2020/10/restaurante-propaganda-sala-te-veo-en-madrid.jpg"
          alt="Third slide"
        />
        <Carousel.Caption className={styles.carouselCaption}>
          <h5 style={{ color: "white" }}>Aberto todos os dias </h5>
          <p style={{ color: "white" }}>
            Priorizando o consumidor.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default DarkVariantCarousel;