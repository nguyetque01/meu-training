USE master
DROP DATABASE MeuTraining;
GO

CREATE DATABASE MeuTraining;
GO

USE MeuTraining;
GO

CREATE TABLE Brand (
  id INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
  name VARCHAR(28) NOT NULL UNIQUE
);
GO

CREATE TABLE Type (
  id INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
  name VARCHAR(21) NOT NULL UNIQUE
);
GO

CREATE TABLE Product (
  id INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
  code VARCHAR(9) UNIQUE NOT NULL,
  name VARCHAR(90) NOT NULL,
  category VARCHAR(28) NOT NULL,
  brand_id INT NULL,
  type_id INT NULL,
  description VARCHAR(180) NULL,
  FOREIGN KEY (brand_id) REFERENCES Brand(id),
  FOREIGN KEY (type_id) REFERENCES Type(id)
);
GO

INSERT INTO Brand (name) VALUES
('Medicos'), ('No Brand'), ('Xiaomi'), ('Naelofar'), ('Philips'), 
('Gemei'), ('Oreo'), ('Samsung'), ('Realme'), ('Nokia'), ('Akemi'), ('OEM');
GO

INSERT INTO Type (name) VALUES
('Hygiene'), ('Mobile Phones'), ('Multi Colour Floral'), ('Mixers & Blenders'), 
('Trimmer'), ('Biscuits & Cookies'), ('Bedding Sheets'), ('Tablets'), ('Plain Shawl'), ('No Type');
GO

INSERT INTO Product (code, name, category, brand_id, type_id, description) VALUES
('P001', 'MASK ADULT Surgical 3 ply 50''S MEDICOS with box', 'Health Accessories', 1, 1, 'Colour: Blue (ear loop outside, ear loop inside- random assigned), Green, Purple, White, Lime Green, Yellow, Pink'),
('P002', 'Party Cosplay Player Unknown Battlegrounds Clothes Hallowmas PUBG', 'Men''s Clothing', 2, 10, 'Suitable for adults and children.'),
('P003', 'Xiaomi REDMI 8A Official Global Version 5000 mAh battery champion 31 days 2GB+32GB', 'Mobile & Gadgets', 3, 2, 'Xiaomi Redmi 8A'),
('P004', 'Naelofar Sofis - Printed Square', 'Hijab', 4, 3, 'Ornate Iris flower composition with intricate growing foliage'),
('P005', 'Philips HR2051 / HR2056 / HR2059 Ice Crushing Blender Jar Mill', 'Small Kitchen Appliances', 5, 4, 'Philips HR2051 Blender (350W, 1.25L Plastic Jar, 4 stars stainless steel blade)'),
('P006', 'Gemei GM-6005 Rechargeable Trimmer Hair Cutter Machine', 'Hair Styling Tools', 6, 5, 'The GEMEI hair clipper is intended for professional use.'),
('P007', 'Oreo Crumb Small Crushed Cookie Pieces 454g', 'Snacks', 7, 6, 'Oreo Crumb Small Crushed Cookie Pieces 454g - Retail & Wholesale New Stock Long Expiry!!!'),
('P008', 'Non-contact Infrared Forehead Thermometer ABS', 'Kids Health & Skincare', 2, 10, 'Non-contact Infrared Forehead Thermometer ABS for Adults and Children with LCD Display Digital'),
('P009', 'Nordic Marble Starry Sky Bedding Sets', 'Bedding', 2, 7, 'Printing process: reactive printing. Package: quilt cover, bed sheet, pillow case. Not include comforter or quilt.'),
('P010', 'Samsung Galaxy Tab A 10.1"', 'Mobile & Gadgets', 8, 8, '4GB RAM. - 64GB ROM. - 1.5 ghz Processor. - 10.1 inches LCD Display'),
('P011', 'REALME 5 PRO 6+128GB', 'Mobile & Gadgets', 9, 2, 'REALME 5 PRO 6+128GB'),
('P012', 'Nokia 2.3 - Cyan Green', 'Mobile & Gadgets', 10, 2, 'Nokia smartphones get 2 years of software upgrades and 3 years of monthly security updates.'),
('P013', 'AKEMI Cotton Select Fitted Bedsheet Set - Adore 730TC', 'Bedding', 11, 7, '100% Cotton Twill. Super Single.'),
('P014', 'Samsung Note10+ Phone', 'Mobile & Gadgets', 12, 2, 'OEM Phone Models'),
('P015', 'Keknis Basic Wide Long Shawl', 'Hijab', 2, 9, '1.8m X 0.7m (+/-). Heavy chiffon (120 gsm).');
GO

SELECT 
  p.id, p.code, p.name, p.category, 
  b.name AS brand, 
  t.name AS type, 
  p.description
FROM product p
LEFT JOIN Brand b ON p.brand_id = b.id
LEFT JOIN Type t ON p.type_id = t.id;
GO
