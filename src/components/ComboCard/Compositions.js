import React from 'react';
import { View } from 'react-native';
import ProductImage from '../ProductImage';
import { compositionStyles as styles } from './ComboCard.styles';

export function FlatlayComposition({ items }) {
  const cols = items.length <= 2 ? 2 : items.length === 3 ? 3 : 2;
  const visible = items.slice(0, cols * (items.length > 3 ? 2 : 1));
  return (
    <View style={styles.flatlayWrap}>
      {visible.map((p, i) => (
        <View
          key={p.id}
          style={[
            styles.flatlayCell,
            { width: `${100 / cols - 2}%` },
            { transform: [{ rotate: i % 2 ? '-1.5deg' : '1deg' }] },
          ]}
        >
          <ProductImage product={p} aspectRatio={cols === 3 ? 0.8 : 1} radius={8} />
        </View>
      ))}
    </View>
  );
}

const stackOffsets = [
  { x: '-26%', y: '8%', rot: '-8deg', z: 1 },
  { x: '0%', y: '-8%', rot: '2deg', z: 3 },
  { x: '26%', y: '8%', rot: '8deg', z: 2 },
];

export function StackComposition({ items }) {
  return (
    <View style={styles.stackWrap}>
      {items.slice(0, 3).map((p, i) => {
        const o = stackOffsets[i] || { x: '0%', y: '0%', rot: '0deg', z: 0 };
        return (
          <View
            key={p.id}
            style={[
              styles.stackCard,
              {
                transform: [{ translateX: o.x }, { translateY: o.y }, { rotate: o.rot }],
                zIndex: o.z,
              },
            ]}
          >
            <ProductImage product={p} aspectRatio={0.78} radius={12} />
          </View>
        );
      })}
    </View>
  );
}

export function LookComposition({ items }) {
  const hero = items[0];
  const rest = items.slice(1);
  return (
    <View style={styles.lookWrap}>
      <ProductImage product={hero} fit radius={0} />
      <View style={styles.lookPins}>
        {rest.map((p) => (
          <View key={p.id} style={styles.lookPin}>
            <ProductImage product={p} fit radius={0} />
          </View>
        ))}
      </View>
    </View>
  );
}
