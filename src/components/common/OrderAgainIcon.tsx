import React from 'react';
import Svg, { G, Path } from 'react-native-svg';

interface OrderAgainIconProps {
  size?: number;
  color?: string;
}

/**
 * iconmind:order-again-duotone-thin icon
 * Exact duotone vector representation for the Reorder tab
 */
export const OrderAgainIcon: React.FC<OrderAgainIconProps> = ({
  size = 20,
  color = 'currentColor',
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      >
        <Path
          fill={color}
          d="M3 5.5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2H5a2 2 0 0 1 -2 -2Z"
          opacity={0.25}
          stroke="none"
        />
        <Path
          fill={color}
          d="M6.5 19.5a1 1 0 1 0 2 0 1 1 0 1 0 -2 0"
          opacity={0.25}
          stroke="none"
        />
        <Path
          fill={color}
          d="M15.5 19.5a1 1 0 1 0 2 0 1 1 0 1 0 -2 0"
          opacity={0.25}
          stroke="none"
        />
        <Path d="M3 5.5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2H5a2 2 0 0 1 -2 -2Z" />
        <Path d="M6.5 19.5a1 1 0 1 0 2 0 1 1 0 1 0 -2 0" />
        <Path d="M15.5 19.5a1 1 0 1 0 2 0 1 1 0 1 0 -2 0" />
        <Path d="M8.5 13V8h7v5" />
        <Path d="m13 10.5 2.5 2.5 2.5 -2.5" />
      </G>
    </Svg>
  );
};
