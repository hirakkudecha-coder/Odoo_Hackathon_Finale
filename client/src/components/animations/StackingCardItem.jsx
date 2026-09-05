import React from 'react';

/**
 * StackingCardItem — Single card within the scroll-driven stacking deck
 * Directly follows https://scroll-driven-animations.style/demos/stacking-cards/css/
 */
export const StackingCardItem = ({
  children,
  index,
  totalCards = 4,
}) => {
  const cardIndex = index + 1;

  return (
    <li
      className="stacking-card"
      style={{
        '--index': cardIndex,
        zIndex: cardIndex,
      }}
    >
      <div className="stacking-card-inner w-full">
        {children}
      </div>
    </li>
  );
};

export default StackingCardItem;
