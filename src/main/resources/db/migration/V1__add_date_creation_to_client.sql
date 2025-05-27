-- Ajouter la colonne date_creation à la table client
ALTER TABLE client ADD COLUMN date_creation datetime NULL;

-- Mettre à jour les enregistrements existants avec la date actuelle
UPDATE client SET date_creation = NOW() WHERE date_creation IS NULL;
