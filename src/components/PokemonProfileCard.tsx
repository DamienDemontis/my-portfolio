import React from 'react';
import { useTranslation } from 'react-i18next';
import ProfileCard from '../blocks/Components/ProfileCard/ProfileCard';
import '../blocks/Components/ProfileCard/ProfileCard.css';

interface PokemonProfileCardProps {
  onContactClick?: () => void;
  className?: string;
  isSmiling?: boolean;
}

export const PokemonProfileCard: React.FC<PokemonProfileCardProps> = ({
  onContactClick,
  className = "",
  isSmiling = false
}) => {
  const { t } = useTranslation();

  // Pokemon card gradients - more subtle and less blinding
  const pokemonBehindGradient = `
    radial-gradient(farthest-side circle at var(--pointer-x) var(--pointer-y),
      hsla(200,60%,80%,calc(var(--card-opacity)*0.3)) 4%,
      hsla(200,40%,70%,calc(var(--card-opacity)*0.2)) 10%,
      hsla(200,20%,60%,calc(var(--card-opacity)*0.1)) 50%,
      hsla(200,10%,50%,0) 100%
    ),
    radial-gradient(35% 52% at 55% 20%, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0) 100%),
    radial-gradient(100% 100% at 50% 50%, rgba(99, 102, 241, 0.15) 1%, rgba(99, 102, 241, 0) 76%),
    conic-gradient(from 45deg at 50% 50%, rgba(139, 69, 19, 0.1) 0%, rgba(160, 82, 45, 0.15) 40%, rgba(160, 82, 45, 0.15) 60%, rgba(139, 69, 19, 0.1) 100%)
  `;

  const pokemonInnerGradient = `
    linear-gradient(145deg, rgba(248, 250, 252, 0.8) 0%, rgba(241, 245, 249, 0.6) 100%)
  `;

  // Custom styles for Pokemon card
  const pokemonCardStyles = `
    .pokemon-card-wrapper .pc-card {
      background: linear-gradient(135deg, 
        rgba(248, 250, 252, 0.9) 0%,
        rgba(241, 245, 249, 0.95) 25%,
        rgba(226, 232, 240, 0.9) 50%,
        rgba(248, 250, 252, 0.85) 100%
      );
      border: 2px solid rgba(100, 116, 139, 0.3);
      box-shadow: 
        0 8px 32px rgba(0, 0, 0, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.4);
    }

    .pokemon-card-wrapper .pc-details h3 {
      font-family: 'Inter', system-ui, sans-serif;
      font-weight: 800;
      font-size: 1.5rem;
      color: #1e293b;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
      margin-bottom: 0.25rem;
    }

    .pokemon-card-wrapper .pc-details p {
      font-family: 'Inter', system-ui, sans-serif;
      font-weight: 600;
      font-size: 0.9rem;
      color: #dc2626;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 0.5rem;
    }

    .pokemon-card-wrapper .pc-user-info {
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid rgba(100, 116, 139, 0.2);
      border-radius: 8px;
      padding: 0.75rem;
      margin-top: 1rem;
      backdrop-filter: blur(10px);
    }

    .pokemon-card-wrapper .pc-handle {
      font-weight: 700;
      color: #334155;
      font-size: 0.85rem;
    }

    .pokemon-card-wrapper .pc-status {
      color: #059669;
      font-weight: 600;
      font-size: 0.75rem;
      text-transform: uppercase;
    }

    .pokemon-card-wrapper .pc-contact-btn {
      display: none !important;
    }

    .pokemon-card-wrapper .avatar {
      border: 3px solid rgba(100, 116, 139, 0.4);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    }

    .pokemon-card-wrapper .pc-mini-avatar img {
      border: 2px solid rgba(100, 116, 139, 0.3);
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .pokemon-card-wrapper .pc-details h3 {
        font-size: 1.25rem;
      }
      
      .pokemon-card-wrapper .pc-details p {
        font-size: 0.8rem;
      }
      
      .pokemon-card-wrapper .pc-user-info {
        padding: 0.5rem;
        margin-top: 0.75rem;
      }
    }

    @media (max-width: 480px) {
      .pokemon-card-wrapper .pc-details h3 {
        font-size: 1.1rem;
      }
      
      .pokemon-card-wrapper .pc-details p {
        font-size: 0.75rem;
      }
      
      .pokemon-card-wrapper .pc-handle {
        font-size: 0.8rem;
      }
      
      .pokemon-card-wrapper .pc-status {
        font-size: 0.7rem;
      }
    }
  `;

  return (
    <div className={`pokemon-card-wrapper ${className}`}>
      <style dangerouslySetInnerHTML={{ __html: pokemonCardStyles }} />

      <ProfileCard
        avatarUrl={isSmiling ? "/about_pfp_smiling.png" : "/about_pfp.png"}
        iconUrl="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg"
        name={t('pokemonCard.name')}
        title={t('pokemonCard.type')}
        handle={t('pokemonCard.catchyStats')}
        status={t('pokemonCard.status')}
        contactText={t('pokemonCard.contactText')}
        behindGradient={pokemonBehindGradient}
        innerGradient={pokemonInnerGradient}
        showBehindGradient={true}
        showUserInfo={true}
        enableTilt={true}
        enableMobileTilt={true}
        mobileTiltSensitivity={3}
        onContactClick={onContactClick}
        className="pokemon-card"
      />
    </div>
  );
}; 