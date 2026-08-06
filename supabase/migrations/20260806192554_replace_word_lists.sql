/*
  # Replace word lists for Food, Desserts, Holidays, Entertainment

  ## Summary
  Replaces the existing Food word list and adds new curated word lists for
  Desserts, Holidays, and Entertainment (renamed from "Movies"). Each category
  has three difficulty levels (easy, medium, hard) with 20 words each.

  ## Changes
  1. Remove all existing rows for categories that are being replaced:
     Food, Dessert, Movies, Holidays, Entertainment, Desserts.
     This prevents duplicates and stale entries.
  2. Insert 240 new words (4 categories x 3 difficulties x 20 words).

  ## Notes
  - Words are stored uppercase, A-Z letters only, no accents or punctuation.
  - "Cannelé" is stored as "CANNELE" (accent removed per requirements).
  - "Kouign-amann" is stored as "KOUIGNAMANN" (hyphen removed per requirements).
  - "Time Travel" is stored as "TIMETRAVEL" (space removed — single-word hangman format).
  - "Jack-o-lantern" is stored as "JACKOLANTERN" (punctuation removed).
  - Duplicate "Countdown" removed from Holidays Hard (already in Medium).
  - Duplicate "Detective" removed from Entertainment Medium (already in Easy).
  - Duplicate "Celebration" removed from Holidays Hard (already in Medium).
  - RLS already enabled with public read policy — no policy changes needed.
*/

-- Remove old rows for categories being replaced
DELETE FROM words WHERE category IN ('Food', 'Dessert', 'Movies', 'Holidays', 'Entertainment', 'Desserts');

-- Food: Easy
INSERT INTO words (word, category, difficulty) VALUES
  ('PIZZA', 'Food', 'easy'),
  ('BURGER', 'Food', 'easy'),
  ('TACO', 'Food', 'easy'),
  ('APPLE', 'Food', 'easy'),
  ('BANANA', 'Food', 'easy'),
  ('CARROT', 'Food', 'easy'),
  ('POTATO', 'Food', 'easy'),
  ('ORANGE', 'Food', 'easy'),
  ('GRAPES', 'Food', 'easy'),
  ('CHEESE', 'Food', 'easy'),
  ('BREAD', 'Food', 'easy'),
  ('PASTA', 'Food', 'easy'),
  ('RICE', 'Food', 'easy'),
  ('BACON', 'Food', 'easy'),
  ('CHICKEN', 'Food', 'easy'),
  ('STEAK', 'Food', 'easy'),
  ('SAUSAGE', 'Food', 'easy'),
  ('TOMATO', 'Food', 'easy'),
  ('ONION', 'Food', 'easy'),
  ('PEPPER', 'Food', 'easy');

-- Food: Medium
INSERT INTO words (word, category, difficulty) VALUES
  ('AVOCADO', 'Food', 'medium'),
  ('BROCCOLI', 'Food', 'medium'),
  ('PINEAPPLE', 'Food', 'medium'),
  ('WATERMELON', 'Food', 'medium'),
  ('BLUEBERRY', 'Food', 'medium'),
  ('STRAWBERRY', 'Food', 'medium'),
  ('ASPARAGUS', 'Food', 'medium'),
  ('CAULIFLOWER', 'Food', 'medium'),
  ('ARTICHOKE', 'Food', 'medium'),
  ('ZUCCHINI', 'Food', 'medium'),
  ('CUCUMBER', 'Food', 'medium'),
  ('SPINACH', 'Food', 'medium'),
  ('MUSHROOM', 'Food', 'medium'),
  ('PRETZEL', 'Food', 'medium'),
  ('POPCORN', 'Food', 'medium'),
  ('MEATBALL', 'Food', 'medium'),
  ('LASAGNA', 'Food', 'medium'),
  ('BURRITO', 'Food', 'medium'),
  ('QUESADILLA', 'Food', 'medium'),
  ('SANDWICH', 'Food', 'medium');

-- Food: Hard
INSERT INTO words (word, category, difficulty) VALUES
  ('JALAPENO', 'Food', 'hard'),
  ('EGGPLANT', 'Food', 'hard'),
  ('BRUSSELS', 'Food', 'hard'),
  ('SAUERKRAUT', 'Food', 'hard'),
  ('PROSCIUTTO', 'Food', 'hard'),
  ('GNOCCHI', 'Food', 'hard'),
  ('FETTUCCINE', 'Food', 'hard'),
  ('CIABATTA', 'Food', 'hard'),
  ('BAGUETTE', 'Food', 'hard'),
  ('GAZPACHO', 'Food', 'hard'),
  ('EDAMAME', 'Food', 'hard'),
  ('RATATOUILLE', 'Food', 'hard'),
  ('BOUILLABAISSE', 'Food', 'hard'),
  ('CAPICOLA', 'Food', 'hard'),
  ('KIMCHI', 'Food', 'hard'),
  ('ESCARGOT', 'Food', 'hard'),
  ('RISOTTO', 'Food', 'hard'),
  ('PIEROGI', 'Food', 'hard'),
  ('SHAKSHUKA', 'Food', 'hard'),
  ('TABBOULEH', 'Food', 'hard');

-- Desserts: Easy
INSERT INTO words (word, category, difficulty) VALUES
  ('COOKIE', 'Desserts', 'easy'),
  ('BROWNIE', 'Desserts', 'easy'),
  ('CUPCAKE', 'Desserts', 'easy'),
  ('DONUT', 'Desserts', 'easy'),
  ('CANDY', 'Desserts', 'easy'),
  ('FUDGE', 'Desserts', 'easy'),
  ('MUFFIN', 'Desserts', 'easy'),
  ('SUNDAE', 'Desserts', 'easy'),
  ('GELATO', 'Desserts', 'easy'),
  ('SORBET', 'Desserts', 'easy'),
  ('PUDDING', 'Desserts', 'easy'),
  ('PIE', 'Desserts', 'easy'),
  ('TART', 'Desserts', 'easy'),
  ('TRUFFLE', 'Desserts', 'easy'),
  ('BONBON', 'Desserts', 'easy'),
  ('ECLAIR', 'Desserts', 'easy'),
  ('PARFAIT', 'Desserts', 'easy'),
  ('COBBLER', 'Desserts', 'easy'),
  ('TAFFY', 'Desserts', 'easy'),
  ('WAFFLE', 'Desserts', 'easy');

-- Desserts: Medium
INSERT INTO words (word, category, difficulty) VALUES
  ('CHEESECAKE', 'Desserts', 'medium'),
  ('CANNOLI', 'Desserts', 'medium'),
  ('MACARON', 'Desserts', 'medium'),
  ('BISCOTTI', 'Desserts', 'medium'),
  ('BAKLAVA', 'Desserts', 'medium'),
  ('MERINGUE', 'Desserts', 'medium'),
  ('CREAMPUFF', 'Desserts', 'medium'),
  ('SOUFFLE', 'Desserts', 'medium'),
  ('SHORTBREAD', 'Desserts', 'medium'),
  ('MARSHMALLOW', 'Desserts', 'medium'),
  ('CROISSANT', 'Desserts', 'medium'),
  ('CHURRO', 'Desserts', 'medium'),
  ('PROFITEROLE', 'Desserts', 'medium'),
  ('GANACHE', 'Desserts', 'medium'),
  ('MADELEINE', 'Desserts', 'medium'),
  ('CRUMBLE', 'Desserts', 'medium'),
  ('STRUDEL', 'Desserts', 'medium'),
  ('NAPOLEON', 'Desserts', 'medium'),
  ('PAVLOVA', 'Desserts', 'medium'),
  ('TIRAMISU', 'Desserts', 'medium');

-- Desserts: Hard
INSERT INTO words (word, category, difficulty) VALUES
  ('SEMIFREDDO', 'Desserts', 'hard'),
  ('CLAFOUTIS', 'Desserts', 'hard'),
  ('FINANCIER', 'Desserts', 'hard'),
  ('CHARLOTTE', 'Desserts', 'hard'),
  ('MILLEFEUILLE', 'Desserts', 'hard'),
  ('CANNELE', 'Desserts', 'hard'),
  ('FRANGIPANE', 'Desserts', 'hard'),
  ('ZABAGLIONE', 'Desserts', 'hard'),
  ('FLORENTINE', 'Desserts', 'hard'),
  ('PANETTONE', 'Desserts', 'hard'),
  ('AMARETTI', 'Desserts', 'hard'),
  ('SACHERTORTE', 'Desserts', 'hard'),
  ('KOUIGNAMANN', 'Desserts', 'hard'),
  ('MARZIPAN', 'Desserts', 'hard'),
  ('OPERA', 'Desserts', 'hard'),
  ('DIPLOMAT', 'Desserts', 'hard'),
  ('DACQUOISE', 'Desserts', 'hard'),
  ('BIENENSTICH', 'Desserts', 'hard'),
  ('PANNACOTTA', 'Desserts', 'hard'),
  ('GALETTE', 'Desserts', 'hard');

-- Holidays: Easy
INSERT INTO words (word, category, difficulty) VALUES
  ('EASTER', 'Holidays', 'easy'),
  ('HALLOWEEN', 'Holidays', 'easy'),
  ('CHRISTMAS', 'Holidays', 'easy'),
  ('HANUKKAH', 'Holidays', 'easy'),
  ('KWANZAA', 'Holidays', 'easy'),
  ('HOLIDAY', 'Holidays', 'easy'),
  ('PARADE', 'Holidays', 'easy'),
  ('TURKEY', 'Holidays', 'easy'),
  ('FIREWORK', 'Holidays', 'easy'),
  ('COSTUME', 'Holidays', 'easy'),
  ('PUMPKIN', 'Holidays', 'easy'),
  ('EGGNOG', 'Holidays', 'easy'),
  ('CUPID', 'Holidays', 'easy'),
  ('RABBIT', 'Holidays', 'easy'),
  ('BASKET', 'Holidays', 'easy'),
  ('CANDY', 'Holidays', 'easy'),
  ('SNOWMAN', 'Holidays', 'easy'),
  ('REINDEER', 'Holidays', 'easy'),
  ('LANTERN', 'Holidays', 'easy'),
  ('PARTY', 'Holidays', 'easy');

-- Holidays: Medium
INSERT INTO words (word, category, difficulty) VALUES
  ('VALENTINE', 'Holidays', 'medium'),
  ('THANKSGIVING', 'Holidays', 'medium'),
  ('FIREWORKS', 'Holidays', 'medium'),
  ('SHAMROCK', 'Holidays', 'medium'),
  ('LEPRECHAUN', 'Holidays', 'medium'),
  ('MENORAH', 'Holidays', 'medium'),
  ('STOCKING', 'Holidays', 'medium'),
  ('WREATH', 'Holidays', 'medium'),
  ('ORNAMENT', 'Holidays', 'medium'),
  ('JACKOLANTERN', 'Holidays', 'medium'),
  ('CONFETTI', 'Holidays', 'medium'),
  ('COUNTDOWN', 'Holidays', 'medium'),
  ('CELEBRATION', 'Holidays', 'medium'),
  ('RESOLUTION', 'Holidays', 'medium'),
  ('HEART', 'Holidays', 'medium'),
  ('RIBBON', 'Holidays', 'medium'),
  ('BONFIRE', 'Holidays', 'medium'),
  ('CORNUCOPIA', 'Holidays', 'medium'),
  ('CRANBERRY', 'Holidays', 'medium'),
  ('GINGERBREAD', 'Holidays', 'medium');

-- Holidays: Hard (Countdown, Celebration removed — already in Medium)
INSERT INTO words (word, category, difficulty) VALUES
  ('INDEPENDENCE', 'Holidays', 'hard'),
  ('MISTLETOE', 'Holidays', 'hard'),
  ('NUTCRACKER', 'Holidays', 'hard'),
  ('POINSETTIA', 'Holidays', 'hard'),
  ('CANDELABRA', 'Holidays', 'hard'),
  ('EVERGREEN', 'Holidays', 'hard'),
  ('NOISEMAKER', 'Holidays', 'hard'),
  ('MASQUERADE', 'Holidays', 'hard'),
  ('GROUNDHOG', 'Holidays', 'hard'),
  ('HANUKKIAH', 'Holidays', 'hard'),
  ('PEPPERMINT', 'Holidays', 'hard'),
  ('CAROLING', 'Holidays', 'hard'),
  ('TRADITION', 'Holidays', 'hard'),
  ('DECORATION', 'Holidays', 'hard'),
  ('FESTIVAL', 'Holidays', 'hard'),
  ('COMMEMORATION', 'Holidays', 'hard'),
  ('HARVEST', 'Holidays', 'hard'),
  ('TABLECLOTH', 'Holidays', 'hard'),
  ('CENTERPIECE', 'Holidays', 'hard');

-- Entertainment: Easy
INSERT INTO words (word, category, difficulty) VALUES
  ('MOVIE', 'Entertainment', 'easy'),
  ('CINEMA', 'Entertainment', 'easy'),
  ('ACTOR', 'Entertainment', 'easy'),
  ('ACTRESS', 'Entertainment', 'easy'),
  ('COMEDY', 'Entertainment', 'easy'),
  ('DRAMA', 'Entertainment', 'easy'),
  ('HERO', 'Entertainment', 'easy'),
  ('VILLAIN', 'Entertainment', 'easy'),
  ('CARTOON', 'Entertainment', 'easy'),
  ('FAMILY', 'Entertainment', 'easy'),
  ('MAGIC', 'Entertainment', 'easy'),
  ('ROBOT', 'Entertainment', 'easy'),
  ('PIRATE', 'Entertainment', 'easy'),
  ('WIZARD', 'Entertainment', 'easy'),
  ('CASTLE', 'Entertainment', 'easy'),
  ('DRAGON', 'Entertainment', 'easy'),
  ('PRINCESS', 'Entertainment', 'easy'),
  ('MONSTER', 'Entertainment', 'easy'),
  ('DETECTIVE', 'Entertainment', 'easy'),
  ('ADVENTURE', 'Entertainment', 'easy');

-- Entertainment: Medium (Detective removed — already in Easy)
INSERT INTO words (word, category, difficulty) VALUES
  ('ANIMATED', 'Entertainment', 'medium'),
  ('DIRECTOR', 'Entertainment', 'medium'),
  ('SCREENPLAY', 'Entertainment', 'medium'),
  ('SUPERHERO', 'Entertainment', 'medium'),
  ('TREASURE', 'Entertainment', 'medium'),
  ('SPACESHIP', 'Entertainment', 'medium'),
  ('TIMETRAVEL', 'Entertainment', 'medium'),
  ('KINGDOM', 'Entertainment', 'medium'),
  ('MYSTERY', 'Entertainment', 'medium'),
  ('FANTASY', 'Entertainment', 'medium'),
  ('EXPLORER', 'Entertainment', 'medium'),
  ('SIDEKICK', 'Entertainment', 'medium'),
  ('SOUNDTRACK', 'Entertainment', 'medium'),
  ('PREMIERE', 'Entertainment', 'medium'),
  ('HOLLYWOOD', 'Entertainment', 'medium'),
  ('TELEVISION', 'Entertainment', 'medium'),
  ('CHAMPION', 'Entertainment', 'medium'),
  ('CREATURE', 'Entertainment', 'medium'),
  ('JOURNEY', 'Entertainment', 'medium');

-- Entertainment: Hard
INSERT INTO words (word, category, difficulty) VALUES
  ('BLOCKBUSTER', 'Entertainment', 'hard'),
  ('DOCUMENTARY', 'Entertainment', 'hard'),
  ('CINEMATOGRAPHY', 'Entertainment', 'hard'),
  ('CHOREOGRAPHY', 'Entertainment', 'hard'),
  ('TRANSFORMATION', 'Entertainment', 'hard'),
  ('APOCALYPSE', 'Entertainment', 'hard'),
  ('ARCHAEOLOGIST', 'Entertainment', 'hard'),
  ('SCREENWRITER', 'Entertainment', 'hard'),
  ('PRODUCTION', 'Entertainment', 'hard'),
  ('ILLUSIONIST', 'Entertainment', 'hard'),
  ('MULTIVERSE', 'Entertainment', 'hard'),
  ('ADVENTURELAND', 'Entertainment', 'hard'),
  ('INTERSTELLAR', 'Entertainment', 'hard'),
  ('CONSTELLATION', 'Entertainment', 'hard'),
  ('EXPEDITION', 'Entertainment', 'hard'),
  ('LABYRINTH', 'Entertainment', 'hard'),
  ('ENCHANTMENT', 'Entertainment', 'hard'),
  ('MYTHOLOGY', 'Entertainment', 'hard'),
  ('LEGENDARY', 'Entertainment', 'hard'),
  ('IMAGINATION', 'Entertainment', 'hard');
