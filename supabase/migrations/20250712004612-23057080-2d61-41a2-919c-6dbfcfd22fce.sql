-- Insert the SYS-CC1 story for comments page welcome section
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
  'SYS-CC1',
  'Comments Welcome Section',
  'Grandpa John',
  'System',
  'Y',
  '<h1 class="text-3xl font-bold text-center text-orange-800 mb-4 font-fun">
    Comments, Questions & Feedback
  </h1>
  
  <p class="text-center text-orange-800 font-fun text-xl mb-8">
    Hi Kids! We want to hear what you think about our website! Do you have a question? Do you have an idea? Or just want to tell us what you like? Please share your thoughts below!
    <br /><br />
    Before you write, please read these simple rules with a grown-up to help keep our website a happy and safe place for everyone.
  </p>

  <div class="font-fun text-orange-800 bg-amber-100/60 p-6 rounded-lg border-2 border-orange-200 text-xl mb-8">
    <p class="text-center mb-6">
      Please follow these simple rules to make this a fun and safe place for everyone.
    </p>

    <div class="space-y-4 text-left">
      <div>
        <h3 class="text-xl font-bold">1. Be Kind! 👍</h3>
        <ul class="list-disc list-inside mt-1 space-y-1 pl-4">
          <li>Always use kind words. No yelling (ALL CAPS) or mean comments.</li>
          <li>Be nice to everyone, even if you don't agree with them.</li>
          <li>No bad words or scary stuff.</li>
        </ul>
      </div>

      <div>
        <h3 class="text-xl font-bold">2. Stick to the Topic! 🎯</h3>
        <ul class="list-disc list-inside mt-1 space-y-1 pl-4">
          <li>Only talk about our website. What do you like? What are you wondering? Any ideas to make it better?</li>
          <li>Don't talk about other things.</li>
        </ul>
      </div>

      <div>
        <h3 class="text-xl font-bold">3. Keep Your Info Secret! 🤫</h3>
        <ul class="list-disc list-inside mt-1 space-y-1 pl-4">
          <li>Never share your full name, address, phone number, or email. That''s your secret!</li>
          <li>Don''t ask others for their secret information either.</li>
        </ul>
      </div>

      <div>
        <h3 class="text-xl font-bold">4. No Ads! 🚫</h3>
        <ul class="list-disc list-inside mt-1 space-y-1 pl-4">
          <li>This space is just for Grandpa John''s Stories. No trying to sell things or posting links to other websites.</li>
        </ul>
      </div>

      <div>
        <h3 class="text-xl font-bold">5. Be Clear! ✍️</h3>
        <ul class="list-disc list-inside mt-1 space-y-1 pl-4">
          <li>Try to write clearly so everyone can understand you.</li>
          <li>If you have a question, make it easy to understand.</li>
        </ul>
      </div>

      <div>
        <h3 class="text-xl font-bold">6. Tell a Grown-Up if Something is Wrong! 🙋</h3>
        <ul class="list-disc list-inside mt-1 space-y-1 pl-4">
          <li>If you see a comment that isn''t kind or breaks a rule, tell a grown-up right away! You or a grown-up can send a comment explaining your concern.</li>
        </ul>
      </div>

      <div>
        <h3 class="text-xl font-bold">7. We Check All Comments! 👀</h3>
        <ul class="list-disc list-inside mt-1 space-y-1 pl-4">
          <li>Grandpa John or his helper read all comments before they show up here. This keeps things safe and fun!</li>
          <li>If a comment doesn''t follow the rules, it might not be posted.</li>
        </ul>
      </div>
    </div>
  </div>',
  'Welcome section and rules for the comments page',
  'Instructions and guidelines for making comments on the website'
);