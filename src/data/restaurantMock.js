// Sandra Food restaurant mock. Shaped like the live API response so the same
// splash normalizer ingests it. Future real endpoint replaces this file.
//
// Image URLs are Unsplash-hosted (free for commercial use, no auth). They're
// fetched at runtime by expo-image — switch to local assets if you need
// fully-offline demo support.

const dish = (id, name, category_id, category, price, sales_price, image, description) => ({
  id,
  stock_id: id,
  product_id: id,
  status: 1,
  product_name: name,
  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  category_id,
  category,
  unit_id: 1,
  unit_name: 'Plate',
  quantity: 999,
  price,
  sales_price,
  feature_image: image,
  measurements: [],
  description,
});

export const restaurantSplashMock = {
  user_id: 1,
  domain_config: {
    id: 1,
    name: 'Sandra Food',
    slug: 'sandra-food',
    company_name: 'Sandra Food',
    short_name: 'Sandra',
    license_no: 'sandra-demo',
    business_model_id: 100,
    inventory_config: {
      currency: { id: 1, code: 'BDT', symbol: '৳', name: 'BD' },
    },
  },
  category: [
    { id: 1, name: 'Pizza', slug: 'pizza', item: 5 },
    { id: 2, name: 'Burgers', slug: 'burgers', item: 5 },
    { id: 3, name: 'Pasta', slug: 'pasta', item: 5 },
    { id: 4, name: 'Salads', slug: 'salads', item: 5 },
    { id: 5, name: 'Drinks', slug: 'drinks', item: 5 },
    { id: 6, name: 'Desserts', slug: 'desserts', item: 5 },
  ],
  product: [
    // Pizza
    dish(101, 'Margherita Pizza', 1, 'Pizza', 480, 420, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800', 'Tomato, mozzarella, basil — wood-fired thin crust.'),
    dish(102, 'Pepperoni Classic', 1, 'Pizza', 560, 520, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800', 'Spicy pepperoni, mozzarella, oregano.'),
    dish(103, 'Four Cheese', 1, 'Pizza', 620, 580, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800', 'Mozzarella, gorgonzola, parmesan, ricotta.'),
    dish(104, 'BBQ Chicken', 1, 'Pizza', 640, 590, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800', 'Smoked chicken, red onion, BBQ glaze.'),
    dish(105, 'Veggie Garden', 1, 'Pizza', 520, 480, 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=800', 'Bell pepper, olive, mushroom, corn.'),
    // Burgers
    dish(201, 'Classic Beef Burger', 2, 'Burgers', 380, 340, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800', 'Smashed beef, cheddar, pickles, secret sauce.'),
    dish(202, 'Double Bacon', 2, 'Burgers', 480, 440, 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=800', 'Two patties, smoked bacon, american cheese.'),
    dish(203, 'Crispy Chicken', 2, 'Burgers', 360, 320, 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800', 'Buttermilk-fried chicken, slaw, mayo.'),
    dish(204, 'Mushroom Swiss', 2, 'Burgers', 420, 380, 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=800', 'Sautéed mushrooms, swiss, garlic aioli.'),
    dish(205, 'Spicy Jalapeño', 2, 'Burgers', 400, 360, 'https://images.unsplash.com/photo-1550317138-10000687a72b?w=800', 'Pepper-jack, jalapeño, sriracha mayo.'),
    // Pasta
    dish(301, 'Spaghetti Bolognese', 3, 'Pasta', 420, 380, 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800', 'Slow-simmered beef ragu, parmesan.'),
    dish(302, 'Penne Arrabiata', 3, 'Pasta', 380, 340, 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800', 'Spicy tomato, garlic, chili flakes.'),
    dish(303, 'Carbonara', 3, 'Pasta', 460, 420, 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800', 'Egg, pancetta, pecorino, black pepper.'),
    dish(304, 'Fettuccine Alfredo', 3, 'Pasta', 480, 440, 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=800', 'Cream, butter, parmesan, fresh herbs.'),
    dish(305, 'Pesto Linguine', 3, 'Pasta', 440, 400, 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800', 'Basil pesto, pine nuts, sundried tomato.'),
    // Salads
    dish(401, 'Caesar Salad', 4, 'Salads', 320, 280, 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=800', 'Romaine, parmesan, croutons, anchovy dressing.'),
    dish(402, 'Greek Salad', 4, 'Salads', 300, 260, 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800', 'Feta, kalamata, cucumber, red onion.'),
    dish(403, 'Quinoa Bowl', 4, 'Salads', 360, 320, 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=800', 'Quinoa, avocado, chickpea, lemon dressing.'),
    dish(404, 'Caprese', 4, 'Salads', 280, 240, 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=800', 'Buffalo mozzarella, tomato, basil, balsamic.'),
    dish(405, 'Asian Slaw', 4, 'Salads', 260, 220, 'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=800', 'Cabbage, carrot, sesame-ginger dressing.'),
    // Drinks
    dish(501, 'Iced Latte', 5, 'Drinks', 180, 160, 'https://images.unsplash.com/photo-1517959105821-eaf2591984ca?w=800', 'Double-shot espresso, cold milk, ice.'),
    dish(502, 'Fresh Lemonade', 5, 'Drinks', 140, 120, 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=800', 'House-pressed lemon, mint, soda.'),
    dish(503, 'Mango Smoothie', 5, 'Drinks', 200, 180, 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=800', 'Alphonso mango, yogurt, honey.'),
    dish(504, 'Cold Brew', 5, 'Drinks', 200, 180, 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=800', '12hr cold-extracted, served black.'),
    dish(505, 'Berry Cooler', 5, 'Drinks', 220, 200, 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=800', 'Mixed berries, basil, sparkling water.'),
    // Desserts
    dish(601, 'Tiramisu', 6, 'Desserts', 280, 240, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800', 'Espresso-soaked savoiardi, mascarpone.'),
    dish(602, 'Chocolate Lava', 6, 'Desserts', 320, 280, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800', 'Warm dark chocolate, vanilla bean ice cream.'),
    dish(603, 'Cheesecake', 6, 'Desserts', 260, 240, 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800', 'New York style, berry compote.'),
    dish(604, 'Crème Brûlée', 6, 'Desserts', 300, 280, 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=800', 'Vanilla custard, torched sugar crust.'),
    dish(605, 'Affogato', 6, 'Desserts', 240, 220, 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=800', 'Vanilla gelato drowned in espresso.'),
  ],
};
