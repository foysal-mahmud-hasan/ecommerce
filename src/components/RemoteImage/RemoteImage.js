import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import ProductImage from '../ProductImage';
import { paletteFor } from '../../utils/palette';

// Renders a real product photo when `image` URL is present, otherwise falls
// back to the editorial SVG placeholder (with a deterministic palette derived
// from the product's name, so re-renders stay consistent).
//
// Errors loading the URL also fall back to the SVG.
export default function RemoteImage({
  product,
  aspectRatio = 1,
  radius = 12,
  fit = false,
  showLabel = false,
  style,
  contentFit = 'cover',
}) {
  const [errored, setErrored] = useState(false);
  const placeholderProduct = useMemo(() => {
    if (!product) return null;
    if (Array.isArray(product.palette) && product.palette.length === 2) return product;
    return { ...product, palette: paletteFor(product.name || product.id) };
  }, [product]);

  const url = !errored && product?.image ? product.image : null;

  if (!url) {
    return (
      <ProductImage
        product={placeholderProduct}
        aspectRatio={aspectRatio}
        radius={radius}
        fit={fit}
        showLabel={showLabel}
        style={style}
      />
    );
  }

  const dims = fit
    ? { flex: 1 }
    : { width: '100%', aspectRatio };

  return (
    <View style={[{ borderRadius: radius, overflow: 'hidden' }, dims, style]}>
      <Image
        source={{ uri: url }}
        style={{ width: '100%', height: '100%' }}
        contentFit={contentFit}
        transition={200}
        cachePolicy="memory-disk"
        recyclingKey={String(product?.id || url)}
        onError={() => setErrored(true)}
      />
    </View>
  );
}
