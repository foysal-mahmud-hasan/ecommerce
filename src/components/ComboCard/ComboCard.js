import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { fragComboSavings } from '../../data/combos';
import { fragProductMap } from '../../data/products';
import { useTheme } from '../../theme';
import { styles } from './ComboCard.styles';
import { FlatlayComposition, LookComposition, StackComposition } from './Compositions';

export default function ComboCard({ combo, onPress, layout = 'flatlay', visualHeight = 240 }) {
  const t = useTheme();
  const { sum, save, pct } = fragComboSavings(combo);
  const items = combo.items.map((id) => fragProductMap[id]);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: t.ink, opacity: pressed ? 0.94 : 1 },
      ]}
    >
      <View
        style={[
          styles.visual,
          {
            height: visualHeight,
            backgroundColor: t.surfaceAlt,
          },
        ]}
      >
        {/* gradient hint via overlay color blocks — RN has no easy linear-gradient
            without a separate package; the surfaceAlt + Deep contrast approximates it */}
        <View style={[styles.gradientBlock, { backgroundColor: t.surfaceDeep }]} />

        {layout === 'flatlay' && <FlatlayComposition items={items} />}
        {layout === 'stack' && <StackComposition items={items} />}
        {layout === 'look' && <LookComposition items={items} />}

        <View style={styles.eyebrowRow}>
          <View style={[styles.eyebrowDot, { backgroundColor: t.terra }]} />
          <Text style={[styles.eyebrowText, { color: t.ink2 }]}>
            The Combo · {combo.occasion}
          </Text>
        </View>

        <View style={styles.savingsBox}>
          <View style={[styles.savingsPill, { backgroundColor: t.terra }]}>
            <Text style={[styles.savingsText, { color: t.white }]}>SAVE ${save}</Text>
          </View>
          <Text style={[styles.savingsMeta, { color: t.ink2 }]}>
            {items.length} PIECES · {pct}% OFF
          </Text>
        </View>
      </View>

      <View style={styles.info}>
        <View style={styles.infoLeft}>
          <Text style={[styles.title, { color: t.bg }]} numberOfLines={2}>
            {combo.name}
          </Text>
          <Text style={[styles.tagline, { color: t.ink3 }]} numberOfLines={2}>
            {combo.tagline}
          </Text>
        </View>
        <View style={styles.infoRight}>
          <Text style={[styles.price, { color: t.bg }]}>${combo.price}</Text>
          <Text style={[styles.was, { color: t.ink3 }]}>${sum}</Text>
        </View>
      </View>
    </Pressable>
  );
}
