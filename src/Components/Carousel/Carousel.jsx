import { useState } from 'react';

const Carousel = ({ images, alt }) => {
  const [current, setCurrent] = useState(0);

  if (!images || images.length === 0) return null;

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));

  return (
    <div className="carousel">
      <div className="carousel-viewport">
        <img
          src={`http://localhost:5092/${images[current].imageUrl}`}
          alt={images[current].altTxt || alt || ''}
        />
      </div>

      {images.length > 1 && (
        <>
          <button className="carousel-btn carousel-prev" onClick={prev}>&#8249;</button>
          <button className="carousel-btn carousel-next" onClick={next}>&#8250;</button>
          <div className="carousel-dots">
            {images.map((_, i) => (
              <button
                key={i}
                className={`carousel-dot${i === current ? ' active' : ''}`}
                onClick={() => setCurrent(i)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Carousel;
