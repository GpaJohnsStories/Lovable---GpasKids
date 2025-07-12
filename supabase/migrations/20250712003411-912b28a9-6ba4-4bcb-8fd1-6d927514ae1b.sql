-- Insert the SYS-LIB story for library instructions
INSERT INTO public.stories (
  story_code,
  title,
  author,
  category,
  published,
  content,
  tagline,
  excerpt
) VALUES (
  'SYS-LIB',
  'Library Instructions',
  'Grandpa John',
  'System',
  'Y',
  '<div style="margin-bottom: 16px; text-align: center;">
    Hover over a story title and it will turn red.<br />Click on a story title and it will take you to the story page where you may enjoy it.
  </div>
  <div style="margin-bottom: 16px; text-align: center;">
    Click on any column heading to sort the library by that column.<br />The first click will always sort down and the next click will sort up.
  </div>
  <div style="text-align: center;">
    As more stories are loaded, you may want to keep a note on your device or even use<br />pencil and paper to record the Story Code so you can find it easily in the future.
  </div>',
  'Instructions for using the Library page',
  'How to navigate and use the stories library effectively'
);