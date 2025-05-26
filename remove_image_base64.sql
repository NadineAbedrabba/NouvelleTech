-- Script pour supprimer la colonne image_base64 de la table client
ALTER TABLE client DROP COLUMN IF EXISTS image_base64;
