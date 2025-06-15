-- Função para calcular os pontos de um palpite
CREATE OR REPLACE FUNCTION calculate_prediction_points(
  p_home_score integer,
  p_away_score integer,
  p_predicted_home_score integer,
  p_predicted_away_score integer
) RETURNS integer AS $$
BEGIN
  -- 5 pontos para placar exato
  IF p_home_score = p_predicted_home_score AND p_away_score = p_predicted_away_score THEN
    RETURN 5;
  END IF;

  -- 3 pontos para acertar o vencedor e pelo menos 1 placar
  IF (p_home_score > p_away_score AND p_predicted_home_score > p_predicted_away_score AND 
      (p_home_score = p_predicted_home_score OR p_away_score = p_predicted_away_score)) OR
     (p_home_score < p_away_score AND p_predicted_away_score < p_predicted_away_score AND 
      (p_home_score = p_predicted_home_score OR p_away_score = p_predicted_away_score)) THEN
    RETURN 3;
  END IF;

  -- 2 pontos para acertar apenas o resultado (vitória/empate/derrota)
  IF (p_home_score > p_away_score AND p_predicted_home_score > p_predicted_away_score) OR
     (p_home_score < p_away_score AND p_predicted_home_score < p_predicted_away_score) OR
     (p_home_score = p_away_score AND p_predicted_home_score = p_predicted_away_score) THEN
    RETURN 2;
  END IF;

  -- 0 pontos para palpite incorreto
  RETURN 0;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar os pontos quando um jogo é finalizado
CREATE OR REPLACE FUNCTION update_prediction_points()
RETURNS TRIGGER AS $$
BEGIN
  -- Só atualiza os pontos se o jogo foi finalizado e tem placar
  IF NEW.status = 'finished' AND NEW.home_score IS NOT NULL AND NEW.away_score IS NOT NULL THEN
    -- Atualiza os pontos de todos os palpites para este jogo
    UPDATE predictions
    SET points = calculate_prediction_points(
      NEW.home_score,
      NEW.away_score,
      home_score,
      away_score
    )
    WHERE match_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Cria o trigger
DROP TRIGGER IF EXISTS update_prediction_points_trigger ON matches;
CREATE TRIGGER update_prediction_points_trigger
  AFTER UPDATE ON matches
  FOR EACH ROW
  EXECUTE FUNCTION update_prediction_points(); 