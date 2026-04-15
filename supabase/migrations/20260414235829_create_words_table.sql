/*
  # Create words table for Bunny Hangman game

  1. New Tables
    - `words`
      - `id` (uuid, primary key)
      - `word` (text) - the word to guess, stored uppercase
      - `category` (text) - category hint shown to the player
      - `difficulty` (text) - easy/medium/hard based on word length
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `words` table
    - Add policy for public read access (word list is non-sensitive game data)

  3. Data
    - Seeds 60 words across 6 categories: Animals, Food, Space, Nature, Sports, Colors
*/

CREATE TABLE IF NOT EXISTS words (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  word text NOT NULL,
  category text NOT NULL,
  difficulty text NOT NULL DEFAULT 'medium',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE words ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Words are publicly readable for the game"
  ON words FOR SELECT
  TO anon, authenticated
  USING (true);

INSERT INTO words (word, category, difficulty) VALUES
  ('RABBIT', 'Animals', 'medium'),
  ('PANDA', 'Animals', 'easy'),
  ('TIGER', 'Animals', 'easy'),
  ('ELEPHANT', 'Animals', 'hard'),
  ('DOLPHIN', 'Animals', 'medium'),
  ('PENGUIN', 'Animals', 'medium'),
  ('GIRAFFE', 'Animals', 'medium'),
  ('HAMSTER', 'Animals', 'medium'),
  ('PARROT', 'Animals', 'medium'),
  ('CHEETAH', 'Animals', 'medium'),
  ('PIZZA', 'Food', 'easy'),
  ('SUSHI', 'Food', 'easy'),
  ('WAFFLE', 'Food', 'medium'),
  ('BURGER', 'Food', 'medium'),
  ('MANGO', 'Food', 'easy'),
  ('PRETZEL', 'Food', 'medium'),
  ('COOKIE', 'Food', 'medium'),
  ('NOODLE', 'Food', 'medium'),
  ('TACO', 'Food', 'easy'),
  ('CHOCOLATE', 'Food', 'hard'),
  ('GALAXY', 'Space', 'medium'),
  ('NEBULA', 'Space', 'medium'),
  ('COMET', 'Space', 'easy'),
  ('PLANET', 'Space', 'medium'),
  ('METEOR', 'Space', 'medium'),
  ('SATURN', 'Space', 'medium'),
  ('JUPITER', 'Space', 'medium'),
  ('ECLIPSE', 'Space', 'medium'),
  ('COSMOS', 'Space', 'medium'),
  ('ROCKET', 'Space', 'medium'),
  ('VOLCANO', 'Nature', 'medium'),
  ('CANYON', 'Nature', 'medium'),
  ('OCEAN', 'Nature', 'easy'),
  ('FOREST', 'Nature', 'medium'),
  ('DESERT', 'Nature', 'medium'),
  ('GLACIER', 'Nature', 'medium'),
  ('PRAIRIE', 'Nature', 'medium'),
  ('WATERFALL', 'Nature', 'hard'),
  ('MEADOW', 'Nature', 'medium'),
  ('THUNDER', 'Nature', 'medium'),
  ('TENNIS', 'Sports', 'medium'),
  ('HOCKEY', 'Sports', 'medium'),
  ('SOCCER', 'Sports', 'medium'),
  ('BOXING', 'Sports', 'medium'),
  ('SURFING', 'Sports', 'medium'),
  ('CYCLING', 'Sports', 'medium'),
  ('ARCHERY', 'Sports', 'medium'),
  ('SKATING', 'Sports', 'medium'),
  ('ROWING', 'Sports', 'medium'),
  ('RUGBY', 'Sports', 'easy'),
  ('CRIMSON', 'Colors', 'medium'),
  ('VIOLET', 'Colors', 'medium'),
  ('AMBER', 'Colors', 'easy'),
  ('SCARLET', 'Colors', 'medium'),
  ('TEAL', 'Colors', 'easy'),
  ('CORAL', 'Colors', 'easy'),
  ('IVORY', 'Colors', 'easy'),
  ('AZURE', 'Colors', 'easy'),
  ('COBALT', 'Colors', 'medium'),
  ('MAROON', 'Colors', 'medium')
ON CONFLICT DO NOTHING;
