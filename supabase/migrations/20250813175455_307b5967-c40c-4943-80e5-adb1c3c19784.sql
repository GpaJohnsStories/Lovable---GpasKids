-- Rename priority icons in storage to add "!" prefix
UPDATE storage.objects 
SET name = '!' || name
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