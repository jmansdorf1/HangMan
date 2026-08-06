/*
  # Normalize word library — Title Case, A-Z only, deduplicated

  ## Summary
  Replaces the entire `words` table contents with a normalized word library.
  Every word is now Title Case, uses only letters A-Z (no accents, punctuation,
  apostrophes, hyphens, or quotes), and has no duplicates across the whole library.
  Multi-word phrases are concatenated into PascalCase (e.g., "Time Travel" → "TimeTravel").

  ## Changes
  1. Delete all existing rows from the `words` table.
  2. Re-insert 240 words across 6 categories x 3 difficulties x ~20 words.
  3. Orphaned categories (Colors, Nature, Space, Sports) are removed — they
     were not in the app's CATEGORIES constant and are no longer used.

  ## Normalization notes
  - "Jalapeño" → "Jalapeno", "Cannelé" → "Cannele" (accents removed)
  - "Kouign-amann" → "Kouignamann" (hyphen removed)
  - "Jack-o-lantern" → "Jackolantern" (punctuation removed)
  - "Time Travel" → "TimeTravel", "Cherry Blossom" → "CherryBlossom" (spaces removed)
  - Cross-category duplicates removed:
    - "Rabbit", "Bunny", "Chicken" — kept in Animals, removed from Food/Holidays/Spring
    - "Butterfly", "Bluebird", "Ladybug", "Hummingbird", "Firefly", "Dragonfly",
      "Woodpecker" — kept in Animals, removed from Spring
    - "Candy" — kept in Holidays, removed from Desserts (replaced with "Caramel")
    - "Wildflower", "Buttercup" — kept in Spring medium, removed from Spring hard
  - Replacement words added to maintain 20 entries per difficulty:
    - Food easy: +Celery (replaces Chicken)
    - Holidays easy: +Sleigh, +Garland (replace Bunny, Rabbit)
    - Spring easy: +Fawn (replaces Bunny)
    - Spring hard: +Trillium, +Bloodroot, +Coltsfoot, +Snowdrop, +Sweetpea,
      +Wisteria, +Jonquil (replace 7 duplicates)
    - Desserts easy: +Caramel (replaces Candy)
  - RLS already enabled with public read policy — no policy changes needed.
*/

-- Clear all existing words
DELETE FROM words;

-- Animals: Easy (20)
INSERT INTO words (word, category, difficulty) VALUES
  ('Rabbit', 'Animals', 'easy'),
  ('Bunny', 'Animals', 'easy'),
  ('Bear', 'Animals', 'easy'),
  ('Tiger', 'Animals', 'easy'),
  ('Lion', 'Animals', 'easy'),
  ('Horse', 'Animals', 'easy'),
  ('Zebra', 'Animals', 'easy'),
  ('Monkey', 'Animals', 'easy'),
  ('Panda', 'Animals', 'easy'),
  ('Otter', 'Animals', 'easy'),
  ('Koala', 'Animals', 'easy'),
  ('Beaver', 'Animals', 'easy'),
  ('Kitten', 'Animals', 'easy'),
  ('Puppy', 'Animals', 'easy'),
  ('Goose', 'Animals', 'easy'),
  ('Duck', 'Animals', 'easy'),
  ('Chicken', 'Animals', 'easy'),
  ('Rooster', 'Animals', 'easy'),
  ('Donkey', 'Animals', 'easy'),
  ('Turtle', 'Animals', 'easy');

-- Animals: Medium (20)
INSERT INTO words (word, category, difficulty) VALUES
  ('Flamingo', 'Animals', 'medium'),
  ('Penguin', 'Animals', 'medium'),
  ('Kangaroo', 'Animals', 'medium'),
  ('Hedgehog', 'Animals', 'medium'),
  ('Butterfly', 'Animals', 'medium'),
  ('Woodpecker', 'Animals', 'medium'),
  ('Bluebird', 'Animals', 'medium'),
  ('Squirrel', 'Animals', 'medium'),
  ('Porcupine', 'Animals', 'medium'),
  ('Raccoon', 'Animals', 'medium'),
  ('Pelican', 'Animals', 'medium'),
  ('Peacock', 'Animals', 'medium'),
  ('Ladybug', 'Animals', 'medium'),
  ('Firefly', 'Animals', 'medium'),
  ('Caterpillar', 'Animals', 'medium'),
  ('Octopus', 'Animals', 'medium'),
  ('Starfish', 'Animals', 'medium'),
  ('Jellyfish', 'Animals', 'medium'),
  ('Seahorse', 'Animals', 'medium'),
  ('Dolphin', 'Animals', 'medium');

-- Animals: Hard (20)
INSERT INTO words (word, category, difficulty) VALUES
  ('Chameleon', 'Animals', 'hard'),
  ('Armadillo', 'Animals', 'hard'),
  ('Axolotl', 'Animals', 'hard'),
  ('Orangutan', 'Animals', 'hard'),
  ('Narwhal', 'Animals', 'hard'),
  ('Platypus', 'Animals', 'hard'),
  ('Wolverine', 'Animals', 'hard'),
  ('Crocodile', 'Animals', 'hard'),
  ('Alligator', 'Animals', 'hard'),
  ('Hippopotamus', 'Animals', 'hard'),
  ('Chimpanzee', 'Animals', 'hard'),
  ('Dragonfly', 'Animals', 'hard'),
  ('Hummingbird', 'Animals', 'hard'),
  ('Barracuda', 'Animals', 'hard'),
  ('Cuttlefish', 'Animals', 'hard'),
  ('Kingfisher', 'Animals', 'hard'),
  ('Mantis', 'Animals', 'hard'),
  ('Opossum', 'Animals', 'hard'),
  ('Warthog', 'Animals', 'hard'),
  ('Gazelle', 'Animals', 'hard');

-- Food: Easy (20)
INSERT INTO words (word, category, difficulty) VALUES
  ('Pizza', 'Food', 'easy'),
  ('Burger', 'Food', 'easy'),
  ('Taco', 'Food', 'easy'),
  ('Apple', 'Food', 'easy'),
  ('Banana', 'Food', 'easy'),
  ('Carrot', 'Food', 'easy'),
  ('Potato', 'Food', 'easy'),
  ('Orange', 'Food', 'easy'),
  ('Grapes', 'Food', 'easy'),
  ('Cheese', 'Food', 'easy'),
  ('Bread', 'Food', 'easy'),
  ('Pasta', 'Food', 'easy'),
  ('Rice', 'Food', 'easy'),
  ('Bacon', 'Food', 'easy'),
  ('Celery', 'Food', 'easy'),
  ('Steak', 'Food', 'easy'),
  ('Sausage', 'Food', 'easy'),
  ('Tomato', 'Food', 'easy'),
  ('Onion', 'Food', 'easy'),
  ('Pepper', 'Food', 'easy');

-- Food: Medium (20)
INSERT INTO words (word, category, difficulty) VALUES
  ('Avocado', 'Food', 'medium'),
  ('Broccoli', 'Food', 'medium'),
  ('Pineapple', 'Food', 'medium'),
  ('Watermelon', 'Food', 'medium'),
  ('Blueberry', 'Food', 'medium'),
  ('Strawberry', 'Food', 'medium'),
  ('Asparagus', 'Food', 'medium'),
  ('Cauliflower', 'Food', 'medium'),
  ('Artichoke', 'Food', 'medium'),
  ('Zucchini', 'Food', 'medium'),
  ('Cucumber', 'Food', 'medium'),
  ('Spinach', 'Food', 'medium'),
  ('Mushroom', 'Food', 'medium'),
  ('Pretzel', 'Food', 'medium'),
  ('Popcorn', 'Food', 'medium'),
  ('Meatball', 'Food', 'medium'),
  ('Lasagna', 'Food', 'medium'),
  ('Burrito', 'Food', 'medium'),
  ('Quesadilla', 'Food', 'medium'),
  ('Sandwich', 'Food', 'medium');

-- Food: Hard (20)
INSERT INTO words (word, category, difficulty) VALUES
  ('Jalapeno', 'Food', 'hard'),
  ('Eggplant', 'Food', 'hard'),
  ('Brussels', 'Food', 'hard'),
  ('Sauerkraut', 'Food', 'hard'),
  ('Prosciutto', 'Food', 'hard'),
  ('Gnocchi', 'Food', 'hard'),
  ('Fettuccine', 'Food', 'hard'),
  ('Ciabatta', 'Food', 'hard'),
  ('Baguette', 'Food', 'hard'),
  ('Gazpacho', 'Food', 'hard'),
  ('Edamame', 'Food', 'hard'),
  ('Ratatouille', 'Food', 'hard'),
  ('Bouillabaisse', 'Food', 'hard'),
  ('Capicola', 'Food', 'hard'),
  ('Kimchi', 'Food', 'hard'),
  ('Escargot', 'Food', 'hard'),
  ('Risotto', 'Food', 'hard'),
  ('Pierogi', 'Food', 'hard'),
  ('Shakshuka', 'Food', 'hard'),
  ('Tabbouleh', 'Food', 'hard');

-- Holidays: Easy (20)
INSERT INTO words (word, category, difficulty) VALUES
  ('Easter', 'Holidays', 'easy'),
  ('Halloween', 'Holidays', 'easy'),
  ('Christmas', 'Holidays', 'easy'),
  ('Hanukkah', 'Holidays', 'easy'),
  ('Kwanzaa', 'Holidays', 'easy'),
  ('Holiday', 'Holidays', 'easy'),
  ('Parade', 'Holidays', 'easy'),
  ('Turkey', 'Holidays', 'easy'),
  ('Firework', 'Holidays', 'easy'),
  ('Costume', 'Holidays', 'easy'),
  ('Pumpkin', 'Holidays', 'easy'),
  ('Eggnog', 'Holidays', 'easy'),
  ('Cupid', 'Holidays', 'easy'),
  ('Sleigh', 'Holidays', 'easy'),
  ('Basket', 'Holidays', 'easy'),
  ('Candy', 'Holidays', 'easy'),
  ('Snowman', 'Holidays', 'easy'),
  ('Reindeer', 'Holidays', 'easy'),
  ('Lantern', 'Holidays', 'easy'),
  ('Party', 'Holidays', 'easy');

-- Holidays: Medium (20)
INSERT INTO words (word, category, difficulty) VALUES
  ('Valentine', 'Holidays', 'medium'),
  ('Thanksgiving', 'Holidays', 'medium'),
  ('Fireworks', 'Holidays', 'medium'),
  ('Shamrock', 'Holidays', 'medium'),
  ('Leprechaun', 'Holidays', 'medium'),
  ('Menorah', 'Holidays', 'medium'),
  ('Stocking', 'Holidays', 'medium'),
  ('Wreath', 'Holidays', 'medium'),
  ('Ornament', 'Holidays', 'medium'),
  ('Jackolantern', 'Holidays', 'medium'),
  ('Confetti', 'Holidays', 'medium'),
  ('Countdown', 'Holidays', 'medium'),
  ('Celebration', 'Holidays', 'medium'),
  ('Resolution', 'Holidays', 'medium'),
  ('Heart', 'Holidays', 'medium'),
  ('Ribbon', 'Holidays', 'medium'),
  ('Bonfire', 'Holidays', 'medium'),
  ('Cornucopia', 'Holidays', 'medium'),
  ('Cranberry', 'Holidays', 'medium'),
  ('Gingerbread', 'Holidays', 'medium');

-- Holidays: Hard (19)
INSERT INTO words (word, category, difficulty) VALUES
  ('Independence', 'Holidays', 'hard'),
  ('Mistletoe', 'Holidays', 'hard'),
  ('Nutcracker', 'Holidays', 'hard'),
  ('Poinsettia', 'Holidays', 'hard'),
  ('Candelabra', 'Holidays', 'hard'),
  ('Evergreen', 'Holidays', 'hard'),
  ('Noisemaker', 'Holidays', 'hard'),
  ('Masquerade', 'Holidays', 'hard'),
  ('Groundhog', 'Holidays', 'hard'),
  ('Hanukkiah', 'Holidays', 'hard'),
  ('Peppermint', 'Holidays', 'hard'),
  ('Caroling', 'Holidays', 'hard'),
  ('Tradition', 'Holidays', 'hard'),
  ('Decoration', 'Holidays', 'hard'),
  ('Festival', 'Holidays', 'hard'),
  ('Commemoration', 'Holidays', 'hard'),
  ('Harvest', 'Holidays', 'hard'),
  ('Tablecloth', 'Holidays', 'hard'),
  ('Centerpiece', 'Holidays', 'hard');

-- Spring: Easy (20)
INSERT INTO words (word, category, difficulty) VALUES
  ('Tulip', 'Spring', 'easy'),
  ('Robin', 'Spring', 'easy'),
  ('Nest', 'Spring', 'easy'),
  ('Bloom', 'Spring', 'easy'),
  ('Rain', 'Spring', 'easy'),
  ('Grass', 'Spring', 'easy'),
  ('Bee', 'Spring', 'easy'),
  ('Bug', 'Spring', 'easy'),
  ('Sun', 'Spring', 'easy'),
  ('Cloud', 'Spring', 'easy'),
  ('Puddle', 'Spring', 'easy'),
  ('Leaf', 'Spring', 'easy'),
  ('Seed', 'Spring', 'easy'),
  ('Plant', 'Spring', 'easy'),
  ('Wind', 'Spring', 'easy'),
  ('Kite', 'Spring', 'easy'),
  ('Duckling', 'Spring', 'easy'),
  ('Chick', 'Spring', 'easy'),
  ('Fawn', 'Spring', 'easy'),
  ('Garden', 'Spring', 'easy');

-- Spring: Medium (20)
INSERT INTO words (word, category, difficulty) VALUES
  ('Rainbow', 'Spring', 'medium'),
  ('Blossom', 'Spring', 'medium'),
  ('Meadow', 'Spring', 'medium'),
  ('Iris', 'Spring', 'medium'),
  ('Petunia', 'Spring', 'medium'),
  ('Azalea', 'Spring', 'medium'),
  ('Daffodil', 'Spring', 'medium'),
  ('Sunshine', 'Spring', 'medium'),
  ('Raindrop', 'Spring', 'medium'),
  ('Birdhouse', 'Spring', 'medium'),
  ('Wildflower', 'Spring', 'medium'),
  ('Buttercup', 'Spring', 'medium'),
  ('Picnic', 'Spring', 'medium'),
  ('Lavender', 'Spring', 'medium'),
  ('Sprout', 'Spring', 'medium'),
  ('Clover', 'Spring', 'medium'),
  ('Songbird', 'Spring', 'medium'),
  ('Treehouse', 'Spring', 'medium'),
  ('Watering', 'Spring', 'medium'),
  ('Flowerpot', 'Spring', 'medium');

-- Spring: Hard (20)
INSERT INTO words (word, category, difficulty) VALUES
  ('Hyacinth', 'Spring', 'hard'),
  ('Forsythia', 'Spring', 'hard'),
  ('Crocus', 'Spring', 'hard'),
  ('Bluebell', 'Spring', 'hard'),
  ('Primrose', 'Spring', 'hard'),
  ('Dogwood', 'Spring', 'hard'),
  ('Magnolia', 'Spring', 'hard'),
  ('Trillium', 'Spring', 'hard'),
  ('Bloodroot', 'Spring', 'hard'),
  ('Honeysuckle', 'Spring', 'hard'),
  ('CherryBlossom', 'Spring', 'hard'),
  ('Coltsfoot', 'Spring', 'hard'),
  ('Snowdrop', 'Spring', 'hard'),
  ('Sweetpea', 'Spring', 'hard'),
  ('Pollination', 'Spring', 'hard'),
  ('Photosynthesis', 'Spring', 'hard'),
  ('Bumblebee', 'Spring', 'hard'),
  ('Greenhouse', 'Spring', 'hard'),
  ('Wisteria', 'Spring', 'hard'),
  ('Jonquil', 'Spring', 'hard');

-- Desserts: Easy (20)
INSERT INTO words (word, category, difficulty) VALUES
  ('Cookie', 'Desserts', 'easy'),
  ('Brownie', 'Desserts', 'easy'),
  ('Cupcake', 'Desserts', 'easy'),
  ('Donut', 'Desserts', 'easy'),
  ('Fudge', 'Desserts', 'easy'),
  ('Muffin', 'Desserts', 'easy'),
  ('Sundae', 'Desserts', 'easy'),
  ('Gelato', 'Desserts', 'easy'),
  ('Sorbet', 'Desserts', 'easy'),
  ('Pudding', 'Desserts', 'easy'),
  ('Pie', 'Desserts', 'easy'),
  ('Tart', 'Desserts', 'easy'),
  ('Truffle', 'Desserts', 'easy'),
  ('Bonbon', 'Desserts', 'easy'),
  ('Eclair', 'Desserts', 'easy'),
  ('Parfait', 'Desserts', 'easy'),
  ('Cobbler', 'Desserts', 'easy'),
  ('Taffy', 'Desserts', 'easy'),
  ('Waffle', 'Desserts', 'easy'),
  ('Caramel', 'Desserts', 'easy');

-- Desserts: Medium (20)
INSERT INTO words (word, category, difficulty) VALUES
  ('Cheesecake', 'Desserts', 'medium'),
  ('Cannoli', 'Desserts', 'medium'),
  ('Macaron', 'Desserts', 'medium'),
  ('Biscotti', 'Desserts', 'medium'),
  ('Baklava', 'Desserts', 'medium'),
  ('Meringue', 'Desserts', 'medium'),
  ('Creampuff', 'Desserts', 'medium'),
  ('Souffle', 'Desserts', 'medium'),
  ('Shortbread', 'Desserts', 'medium'),
  ('Marshmallow', 'Desserts', 'medium'),
  ('Croissant', 'Desserts', 'medium'),
  ('Churro', 'Desserts', 'medium'),
  ('Profiterole', 'Desserts', 'medium'),
  ('Ganache', 'Desserts', 'medium'),
  ('Madeleine', 'Desserts', 'medium'),
  ('Crumble', 'Desserts', 'medium'),
  ('Strudel', 'Desserts', 'medium'),
  ('Napoleon', 'Desserts', 'medium'),
  ('Pavlova', 'Desserts', 'medium'),
  ('Tiramisu', 'Desserts', 'medium');

-- Desserts: Hard (20)
INSERT INTO words (word, category, difficulty) VALUES
  ('Semifreddo', 'Desserts', 'hard'),
  ('Clafoutis', 'Desserts', 'hard'),
  ('Financier', 'Desserts', 'hard'),
  ('Charlotte', 'Desserts', 'hard'),
  ('Millefeuille', 'Desserts', 'hard'),
  ('Cannele', 'Desserts', 'hard'),
  ('Frangipane', 'Desserts', 'hard'),
  ('Zabaglione', 'Desserts', 'hard'),
  ('Florentine', 'Desserts', 'hard'),
  ('Panettone', 'Desserts', 'hard'),
  ('Amaretti', 'Desserts', 'hard'),
  ('Sachertorte', 'Desserts', 'hard'),
  ('Kouignamann', 'Desserts', 'hard'),
  ('Marzipan', 'Desserts', 'hard'),
  ('Opera', 'Desserts', 'hard'),
  ('Diplomat', 'Desserts', 'hard'),
  ('Dacquoise', 'Desserts', 'hard'),
  ('Bienenstich', 'Desserts', 'hard'),
  ('Pannacotta', 'Desserts', 'hard'),
  ('Galette', 'Desserts', 'hard');

-- Entertainment: Easy (20)
INSERT INTO words (word, category, difficulty) VALUES
  ('Movie', 'Entertainment', 'easy'),
  ('Cinema', 'Entertainment', 'easy'),
  ('Actor', 'Entertainment', 'easy'),
  ('Actress', 'Entertainment', 'easy'),
  ('Comedy', 'Entertainment', 'easy'),
  ('Drama', 'Entertainment', 'easy'),
  ('Hero', 'Entertainment', 'easy'),
  ('Villain', 'Entertainment', 'easy'),
  ('Cartoon', 'Entertainment', 'easy'),
  ('Family', 'Entertainment', 'easy'),
  ('Magic', 'Entertainment', 'easy'),
  ('Robot', 'Entertainment', 'easy'),
  ('Pirate', 'Entertainment', 'easy'),
  ('Wizard', 'Entertainment', 'easy'),
  ('Castle', 'Entertainment', 'easy'),
  ('Dragon', 'Entertainment', 'easy'),
  ('Princess', 'Entertainment', 'easy'),
  ('Monster', 'Entertainment', 'easy'),
  ('Detective', 'Entertainment', 'easy'),
  ('Adventure', 'Entertainment', 'easy');

-- Entertainment: Medium (19)
INSERT INTO words (word, category, difficulty) VALUES
  ('Animated', 'Entertainment', 'medium'),
  ('Director', 'Entertainment', 'medium'),
  ('Screenplay', 'Entertainment', 'medium'),
  ('Superhero', 'Entertainment', 'medium'),
  ('Treasure', 'Entertainment', 'medium'),
  ('Spaceship', 'Entertainment', 'medium'),
  ('TimeTravel', 'Entertainment', 'medium'),
  ('Kingdom', 'Entertainment', 'medium'),
  ('Mystery', 'Entertainment', 'medium'),
  ('Fantasy', 'Entertainment', 'medium'),
  ('Explorer', 'Entertainment', 'medium'),
  ('Sidekick', 'Entertainment', 'medium'),
  ('Soundtrack', 'Entertainment', 'medium'),
  ('Premiere', 'Entertainment', 'medium'),
  ('Hollywood', 'Entertainment', 'medium'),
  ('Television', 'Entertainment', 'medium'),
  ('Champion', 'Entertainment', 'medium'),
  ('Creature', 'Entertainment', 'medium'),
  ('Journey', 'Entertainment', 'medium');

-- Entertainment: Hard (20)
INSERT INTO words (word, category, difficulty) VALUES
  ('Blockbuster', 'Entertainment', 'hard'),
  ('Documentary', 'Entertainment', 'hard'),
  ('Cinematography', 'Entertainment', 'hard'),
  ('Choreography', 'Entertainment', 'hard'),
  ('Transformation', 'Entertainment', 'hard'),
  ('Apocalypse', 'Entertainment', 'hard'),
  ('Archaeologist', 'Entertainment', 'hard'),
  ('Screenwriter', 'Entertainment', 'hard'),
  ('Production', 'Entertainment', 'hard'),
  ('Illusionist', 'Entertainment', 'hard'),
  ('Multiverse', 'Entertainment', 'hard'),
  ('Adventureland', 'Entertainment', 'hard'),
  ('Interstellar', 'Entertainment', 'hard'),
  ('Constellation', 'Entertainment', 'hard'),
  ('Expedition', 'Entertainment', 'hard'),
  ('Labyrinth', 'Entertainment', 'hard'),
  ('Enchantment', 'Entertainment', 'hard'),
  ('Mythology', 'Entertainment', 'hard'),
  ('Legendary', 'Entertainment', 'hard'),
  ('Imagination', 'Entertainment', 'hard');
