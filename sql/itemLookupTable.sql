DROP TABLE itemLookup;

CREATE TABLE itemLookup (
  typeID INT PRIMARY KEY,
  groupID INT NOT NULL,
  typeName VARCHAR(100) NOT NULL UNIQUE,
  volume DOUBLE NOT NULL,
  marketGroupID INT NOT NULL,
  iconID INT,
  FOREIGN KEY(groupID) REFERENCES invGroups(groupID)
);
