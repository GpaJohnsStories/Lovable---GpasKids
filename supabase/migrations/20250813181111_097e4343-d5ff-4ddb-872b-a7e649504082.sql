-- Rename priority icons from ICO to CO format in storage
UPDATE storage.objects 
SET name = REPLACE(name, 'ICO-', 'CO-')
WHERE bucket_id = 'icons' 
AND name IN (
  'ICO-HOX.jpg',
  'ICO-LB1.gif',
  'ICO-LB2.gif', 
  'ICO-LB3.gif',
  'ICO-CO1.gif',
  'ICO-CO2.gif',
  'ICO-CO3.gif',
  'ICO-WR3.jpg',
  'ICO-WR2.gif',
  'ICO-AV1.jpg',
  'ICO-AV2.jpg',
  'ICO-AB1.jpg',
  'ICO-AB3.jpg',
  'ICO-AB5.jpg',
  'ICO-SA1.jpg',
  'ICO-MU2.gif',
  'ICO-HL2.gif',
  'ICO-HO1.jpg',
  'ICO-CDY.png',
  'ICO-CSZ.jpg',
  'ICO-CCP.png',
  'ICO-CCM.png',
  'ICA-PL1.jpg',
  'ICO-AV8.jpg'
);

-- Add "!" prefix to the renamed priority icons
UPDATE storage.objects 
SET name = '!' || name
WHERE bucket_id = 'icons' 
AND name IN (
  'CO-HOX.jpg',
  'CO-LB1.gif',
  'CO-LB2.gif', 
  'CO-LB3.gif',
  'CO-CO1.gif',
  'CO-CO2.gif',
  'CO-CO3.gif',
  'CO-WR3.jpg',
  'CO-WR2.gif',
  'CO-AV1.jpg',
  'CO-AV2.jpg',
  'CO-AB1.jpg',
  'CO-AB3.jpg',
  'CO-AB5.jpg',
  'CO-SA1.jpg',
  'CO-MU2.gif',
  'CO-HL2.gif',
  'CO-HO1.jpg',
  'CO-CDY.png',
  'CO-CSZ.jpg',
  'CO-CCP.png',
  'CO-CCM.png',
  'CA-PL1.jpg',
  'CO-AV8.jpg'
);

-- Update icon_library table to match the new storage paths
UPDATE icon_library 
SET file_path = REPLACE(file_path, 'ICO-', 'CO-')
WHERE file_path IN (
  'ICO-HOX.jpg',
  'ICO-LB1.gif',
  'ICO-LB2.gif', 
  'ICO-LB3.gif',
  'ICO-CO1.gif',
  'ICO-CO2.gif',
  'ICO-CO3.gif',
  'ICO-WR3.jpg',
  'ICO-WR2.gif',
  'ICO-AV1.jpg',
  'ICO-AV2.jpg',
  'ICO-AB1.jpg',
  'ICO-AB3.jpg',
  'ICO-AB5.jpg',
  'ICO-SA1.jpg',
  'ICO-MU2.gif',
  'ICO-HL2.gif',
  'ICO-HO1.jpg',
  'ICO-CDY.png',
  'ICO-CSZ.jpg',
  'ICO-CCP.png',
  'ICO-CCM.png',
  'ICA-PL1.jpg',
  'ICO-AV8.jpg'
);

-- Add "!" prefix to the database file paths for priority icons
UPDATE icon_library 
SET file_path = '!' || file_path
WHERE file_path IN (
  'CO-HOX.jpg',
  'CO-LB1.gif',
  'CO-LB2.gif', 
  'CO-LB3.gif',
  'CO-CO1.gif',
  'CO-CO2.gif',
  'CO-CO3.gif',
  'CO-WR3.jpg',
  'CO-WR2.gif',
  'CO-AV1.jpg',
  'CO-AV2.jpg',
  'CO-AB1.jpg',
  'CO-AB3.jpg',
  'CO-AB5.jpg',
  'CO-SA1.jpg',
  'CO-MU2.gif',
  'CO-HL2.gif',
  'CO-HO1.jpg',
  'CO-CDY.png',
  'CO-CSZ.jpg',
  'CO-CCP.png',
  'CO-CCM.png',
  'CA-PL1.jpg',
  'CO-AV8.jpg'
);