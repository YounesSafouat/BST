import React from 'react';
import { useRouter } from 'next/navigation';

interface TestimonialCardProps {
     title: string;
     description: string;
     videoThumbnail: string;
     logo?: string;
     solution?: string;
     interviewee?: string;
     variant: 'primary' | 'secondary';
     className?: string;
     size?: 'small' | 'medium' | 'large';
     slug?: string;
     onClick?: () => void;
     hidePlayIcon?: boolean;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
     title,
     description,
     videoThumbnail,
     logo,
     solution,
     interviewee,
     variant,
     className = "",
     size = 'medium',
     slug,
     onClick,
     hidePlayIcon = false
}) => {
     const router = useRouter();
     const buttonColor = 'var(--color-main)'; // Use CSS variable for primary color

     const handleCardClick = () => {
          if (onClick) {
               onClick();
          } else if (slug) {
               router.push(`/cas-client/${slug}`);
          }
     };

     const getSizeStyles = () => {
          switch (size) {
               case 'small':
                    return {
                         height: '180px', // YouTube-like 16:9 aspect ratio for small cards
                         titleFontSize: '24px',
                         textFontSize: '12px',
                         arrowFontSize: '20px'
                    };
               case 'large':
                    return {
                         height: '400px', // YouTube-like 16:9 aspect ratio for large cards
                         titleFontSize: '48px',
                         textFontSize: '16px',
                         arrowFontSize: '32px'
                    };
               default: // medium
                    return {
                         height: '300px', // YouTube-like 16:9 aspect ratio for medium cards
                         titleFontSize: '36px',
                         textFontSize: '14px',
                         arrowFontSize: '24px'
                    };
          }
     };

     const sizeStyles = getSizeStyles();

     return (
          <div className={`testimonial-card ${className}`} onClick={handleCardClick}>
               <style jsx>{`
         .testimonial-card {
           position: relative;
           width: 100%;
           height: ${sizeStyles.height};
           background-image: url("https://144151551.fs1.hubspotusercontent-eu1.net/hubfs/144151551/WEBSITE%20-%20logo/Screenshot%202025-09-10%20122142.png");
           background-size: cover;
           background-position: center;
           overflow: hidden;
           margin-bottom: 16px;
           border-radius: 12px;
           border: 1px solid #e5e7eb;
           box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
           transition: all 0.3s ease;
         }
        
        .testimonial-card:hover {
          box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          transform: translateY(-2px);
        }
        
        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.4);
          transition: background 0.3s ease;
          z-index: 10;
        }
        
        
        .card-title {
          z-index: 60;
          font-family: 'Poppins', sans-serif;
          position: absolute;
          bottom: 35px;
          left: 20px;
          font-size: ${sizeStyles.titleFontSize};
          font-weight: 700;
          color: #fff;
          pointer-events: none;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          height: 20px;
        }
        
         .arrow-container {
           z-index: 60;
           position: absolute;
           right: 20px;
           bottom: 20px;
           display: flex;
           align-items: center;
           gap: 8px;
           opacity: 0;
           transform: translateX(-10px);
           transition: all 0.3s ease;
         }
         
         .arrow {
           font-size: ${sizeStyles.arrowFontSize};
           cursor: pointer;
           color: #fff;
           transition: color 0.3s ease;
         }
         
         .arrow-text {
           font-size: 14px;
           color: #fff;
           font-weight: 500;
           cursor: pointer;
           transition: color 0.3s ease;
           z-index: 60;
         }
        
         .card-text {
           z-index: 50;
           position: absolute;
           top: 50%;
           right: 20px;
           transform: translateY(-50%);
           color: #fff;
           opacity: 0;
           font-size: ${sizeStyles.textFontSize};
           letter-spacing: 0.5px;
           max-width: 300px;
           text-align: right;
           line-height: 1.4;
           transition: all 0.3s ease;
         }
        
        
        
         .play-button {
           position: absolute;
           top: 50%;
           left: 50%;
           transform: translate(-50%, -50%);
           width: 80px;
           height: 80px;
           background-color: rgba(255, 255, 255, 0.2);
           backdrop-filter: blur(10px);
           border: 2px solid rgba(255, 255, 255, 0.3);
           border-radius: 50%;
           cursor: pointer;
           outline: none;
           transition: all 0.3s ease;
           z-index: 50;
           display: flex;
           align-items: center;
           justify-content: center;
           opacity: 1;
         }
         
         .play-icon {
           width: 0;
           height: 0;
           border-left: 20px solid white;
           border-top: 12px solid transparent;
           border-bottom: 12px solid transparent;
           margin-left: 4px;
         }
         
         .expand-button {
           position: absolute;
           right: 14px;
           bottom: 14px;
           width: 40px;
           height: 40px;
           background-color: ${buttonColor};
           border: none;
           border-radius: 40px;
           cursor: pointer;
           outline: none;
           transition: all 0.3s ease;
           mix-blend-mode: hard-light;
           z-index: 50;
         }
         
        
        .logo {
          position: absolute;
          top: 20px;
          left: 20px;
          width: 60px;
          height: 60px;
          background-image: url("${logo}");
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          z-index: 50;
          opacity: 0;
          transition: all 0.3s ease;
        }
        
        
        
         .testimonial-card:hover .card-text {
           opacity: 1;
           transform: translateY(-50%);
         }
        
         .testimonial-card:hover .arrow-container {
           opacity: 1;
           transform: translateX(0);
         }
        
         .testimonial-card:hover .overlay {
           background: rgba(0, 0, 0, 0.6);
         }
         
         .arrow-container:hover .arrow-text {
           color: var(--color-secondary);
         }
         
         .arrow-container:hover .arrow {
           color: var(--color-secondary);
         }
         
         .testimonial-card:hover .play-button {
           opacity: 0;
         }
         
         .testimonial-card:hover .logo {
           opacity: 1;
         }
         
         .testimonial-card:hover .expand-button {
           transform: scale(16.5);
         }
         
        
      `}</style>

               <div className="overlay"></div>
               {!hidePlayIcon && (
                    <button className="play-button" title="Voir la vidéo" onClick={(e) => { e.stopPropagation(); handleCardClick(); }}>
                         <div className="play-icon"></div>
                    </button>
               )}
               {logo && <div className="logo"></div>}
               <h2 className="card-title">{title}</h2>
               <div className="arrow-container" onClick={(e) => { e.stopPropagation(); handleCardClick(); }}>
                    <span className="arrow-text">Voir la vidéo</span>
                    <div className="arrow">→</div>
               </div>
               <p className="card-text">{description}</p>
               <button className="expand-button" title="Voir la vidéo" onClick={(e) => { e.stopPropagation(); handleCardClick(); }}></button>
          </div>
     );
};

export default TestimonialCard;