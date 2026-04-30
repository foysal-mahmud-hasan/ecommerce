import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

const stroke = 1.6;

export function IconSearch({ size = 18, color = '#000' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={11} cy={11} r={7} stroke={color} strokeWidth={stroke} strokeLinecap="round" />
      <Path d="M20 20l-3.5-3.5" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
    </Svg>
  );
}

export function IconBag({ size = 18, color = '#000' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 8h14l-1 12H6L5 8z" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M9 8V6a3 3 0 116 0v2" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function IconUser({ size = 18, color = '#000' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={8} r={3.5} stroke={color} strokeWidth={stroke} strokeLinecap="round" />
      <Path d="M4 21c1.5-4.5 5-6 8-6s6.5 1.5 8 6" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
    </Svg>
  );
}

export function IconHome({ size = 20, color = '#000' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 11l8-7 8 7v9a1 1 0 01-1 1h-5v-6h-4v6H5a1 1 0 01-1-1v-9z" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function IconHeart({ size = 20, color = '#000', filled = false }) {
  const d = 'M12 20s-7-4.5-9-9c-1.5-3 0-6.5 3.5-6.5 2 0 3.5 1 4.5 2.5 1-1.5 2.5-2.5 4.5-2.5C19 4.5 20.5 8 19 11c-2 4.5-7 9-7 9z';
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'}>
      <Path d={d} stroke={color} strokeWidth={stroke} strokeLinejoin="round" />
    </Svg>
  );
}

export function IconChevR({ size = 16, color = '#000' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 6l6 6-6 6" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function IconChevL({ size = 16, color = '#000' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M15 6l-6 6 6 6" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function IconChevD({ size = 14, color = '#000' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 9l6 6 6-6" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function IconPlus({ size = 14, color = '#000' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5v14M5 12h14" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function IconMinus({ size = 14, color = '#000' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 12h14" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function IconX({ size = 14, color = '#000' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 6l12 12M18 6L6 18" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

export function IconSliders({ size = 18, color = '#000' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 7h10M18 7h2M4 17h2M10 17h10" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
      <Circle cx={16} cy={7} r={2} stroke={color} strokeWidth={stroke} />
      <Circle cx={8} cy={17} r={2} stroke={color} strokeWidth={stroke} />
    </Svg>
  );
}

export function IconSwap({ size = 14, color = '#000' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M7 7h13l-3-3M17 17H4l3 3" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function IconCheck({ size = 14, color = '#000' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 13l4 4L19 7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function IconTruck({ size = 18, color = '#000' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M2 7h11v10H2zM13 10h5l3 3v4h-8z" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx={6} cy={18} r={2} stroke={color} strokeWidth={stroke} />
      <Circle cx={17} cy={18} r={2} stroke={color} strokeWidth={stroke} />
    </Svg>
  );
}

export function IconShield({ size = 18, color = '#000' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function IconSpark({ size = 14, color = '#000' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 3v4M12 17v4M5 12H1M23 12h-4M6 6l3 3M18 18l-3-3M6 18l3-3M18 6l-3 3" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function IconGrid({ size = 18, color = '#000' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={4} y={4} width={7} height={7} rx={1.5} stroke={color} strokeWidth={stroke} />
      <Rect x={13} y={4} width={7} height={7} rx={1.5} stroke={color} strokeWidth={stroke} />
      <Rect x={4} y={13} width={7} height={7} rx={1.5} stroke={color} strokeWidth={stroke} />
      <Rect x={13} y={13} width={7} height={7} rx={1.5} stroke={color} strokeWidth={stroke} />
    </Svg>
  );
}

export function IconUpload({ size = 18, color = '#000' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 16V4M7 9l5-5 5 5" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function IconCart({ size = 18, color = '#000' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 4h2l2.5 11h11l2-8H6" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx={9} cy={20} r={1.5} stroke={color} strokeWidth={stroke} />
      <Circle cx={17} cy={20} r={1.5} stroke={color} strokeWidth={stroke} />
    </Svg>
  );
}

export function IconStar({ size = 12, color = '#000', filled = true }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 12 12" fill={filled ? color : 'none'}>
      <Path d="M6 1l1.5 3.2L11 4.7l-2.5 2.4.6 3.4L6 8.9 2.9 10.5l.6-3.4L1 4.7l3.5-.5L6 1z" stroke={color} strokeWidth={0.8} strokeLinejoin="round" />
    </Svg>
  );
}
