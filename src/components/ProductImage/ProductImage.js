import React, { useId } from 'react';
import { View, Text } from 'react-native';
import Svg, { Defs, Pattern, Rect, RadialGradient, Stop, G } from 'react-native-svg';
import { styles } from './ProductImage.styles';

// Recreates the editorial striped placeholder used in the original web design.
// `aspectRatio` controls the box; `fit` makes it fill its parent instead.
export default function ProductImage({
  product,
  aspectRatio = 1,
  radius = 12,
  showLabel = false,
  fit = false,
  style,
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  if (!product) return null;
  const palette = (Array.isArray(product.palette) && product.palette.length === 2)
    ? product.palette
    : ['#E8DFD1', '#C9B99B'];
  const [bg, fg] = palette;
  const patternId = `pat-${uid}`;
  const gradId = `grad-${uid}`;

  const containerStyle = [
    styles.box,
    { borderRadius: radius, backgroundColor: bg },
    fit ? styles.fit : { width: '100%', aspectRatio },
    style,
  ];

  return (
    <View style={containerStyle}>
      <Svg width="100%" height="100%" style={styles.svgFill}>
        <Defs>
          <Pattern
            id={patternId}
            patternUnits="userSpaceOnUse"
            width={36}
            height={36}
            patternTransform="rotate(-22)"
          >
            <Rect width={36} height={36} fill={bg} />
            <Rect width={1.2} height={36} fill={fg} fillOpacity={0.18} />
          </Pattern>
          <RadialGradient id={gradId} cx="50%" cy="40%" r="65%">
            <Stop offset="0%" stopColor={fg} stopOpacity={0.28} />
            <Stop offset="100%" stopColor={fg} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <G>
          <Rect width="100%" height="100%" fill={`url(#${patternId})`} />
          <Rect width="100%" height="100%" fill={`url(#${gradId})`} />
        </G>
      </Svg>
      {showLabel && (
        <View style={styles.labelBox}>
          <Text style={[styles.labelText, { color: fg }]}>
            [ {product.name.toLowerCase()} ]
          </Text>
        </View>
      )}
    </View>
  );
}
