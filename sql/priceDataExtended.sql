USE eve_price_tracker_beta;
DROP TABLE IF EXISTS priceDataExtended;

CREATE TABLE priceDataExtended (
  entryID INT AUTO_INCREMENT PRIMARY KEY,
  typeID INT NOT NULL,
  dq1aSell DOUBLE NOT NULL,
  dq1aBuy DOUBLE NOT NULL,
  jitaSell DOUBLE NOT NULL,
  jitaBuy DOUBLE NOT NULL,
  amarrSell DOUBLE NOT NULL,
  amarrBuy DOUBLE NOT NULL,
  dq1aSellVolume BIGINT NOT NULL,
  dq1aBuyVolume BIGINT NOT NULL,
  jitaSellVolume BIGINT NOT NULL,
  jitaBuyVolume BIGINT NOT NULL,
  amarrSellVolume BIGINT NOT NULL,
  amarrBuyVolume BIGINT NOT NULL,
  date TIMESTAMP NOT NULL DEFAULT NOW(),
  updatedAtSource VARCHAR(30),
  FOREIGN KEY(typeID) REFERENCES itemLookup(typeID)
);