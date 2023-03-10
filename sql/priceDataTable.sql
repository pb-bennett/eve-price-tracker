DROP TABLE IF EXISTS priceData;

CREATE TABLE priceData (
  entryID INT AUTO_INCREMENT PRIMARY KEY,
  location VARCHAR(30) NOT NULL,
  id INT NOT NULL,
  sell DOUBLE NOT NULL,
  sellVolume BIGINT NOT NULL,
  buy DOUBLE NOT NULL,
  buyVolume BIGINT NOT NULL,
  date TIMESTAMP NOT NULL DEFAULT NOW(),
  updatedAtSource VARCHAR(30)
);