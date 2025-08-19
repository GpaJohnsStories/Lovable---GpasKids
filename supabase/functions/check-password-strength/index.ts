const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔒 Password strength validation requested');
    
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 405
        }
      );
    }

    // Parse request body
    const body = await req.json();
    const { password } = body;
    
    if (!password || typeof password !== 'string') {
      return new Response(
        JSON.stringify({ 
          error: 'Password is required and must be a string',
          isValid: false,
          strengthScore: 0,
          errors: ['Password is required']
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }
    
    console.log('🔍 Validating password of length:', password.length);
    
    // Password validation rules for children's safety site
    const minLength = 8;
    const maxLength = 128; // Prevent extremely long passwords
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/~`]/.test(password);
    
    // Enhanced common password list for better security
    const commonPasswords = [
      'password', '123456', 'qwerty', 'admin', 'welcome', 'login',
      'password123', 'admin123', 'qwerty123', '12345678', 'letmein',
      'iloveyou', 'princess', 'monkey', 'dragon', 'sunshine',
      'football', 'baseball', 'freedom', 'whatever', 'trustno1'
    ];
    
    const isCommonPassword = commonPasswords.includes(password.toLowerCase());
    
    // Check for sequential characters (123, abc, etc.)
    const hasSequentialChars = /(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(password);
    
    // Check for repeated characters (aaa, 111, etc.)
    const hasRepeatedChars = /(.)\1{2,}/.test(password);
    
    // Collect validation errors
    const validationErrors: string[] = [];
    
    if (password.length < minLength) {
      validationErrors.push(`Password must be at least ${minLength} characters long`);
    }
    
    if (password.length > maxLength) {
      validationErrors.push(`Password must be no longer than ${maxLength} characters`);
    }
    
    if (!hasUpperCase) {
      validationErrors.push('Password must contain at least one uppercase letter (A-Z)');
    }
    
    if (!hasLowerCase) {
      validationErrors.push('Password must contain at least one lowercase letter (a-z)');
    }
    
    if (!hasNumbers) {
      validationErrors.push('Password must contain at least one number (0-9)');
    }
    
    if (!hasSpecialChar) {
      validationErrors.push('Password must contain at least one special character (!@#$%^&*(),.?":{}|<>_-+=[]\\\/~`)');
    }
    
    if (isCommonPassword) {
      validationErrors.push('Password is too common and easily guessed. Please choose a more unique password');
    }
    
    if (hasSequentialChars) {
      validationErrors.push('Password should not contain sequential characters (e.g., "123", "abc")');
    }
    
    if (hasRepeatedChars) {
      validationErrors.push('Password should not contain repeated characters (e.g., "aaa", "111")');
    }
    
    // Calculate password strength score (0-100)
    let strengthScore = 0;
    
    // Length scoring (progressive)
    if (password.length >= 8) strengthScore += 15;
    if (password.length >= 12) strengthScore += 10;
    if (password.length >= 16) strengthScore += 5;
    
    // Character variety scoring
    if (hasUpperCase) strengthScore += 15;
    if (hasLowerCase) strengthScore += 15;
    if (hasNumbers) strengthScore += 15;
    if (hasSpecialChar) strengthScore += 15;
    
    // Bonus points for complexity
    if (hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar) {
      strengthScore += 10; // Bonus for using all character types
    }
    
    // Deduct points for common patterns
    if (isCommonPassword) strengthScore -= 30;
    if (hasSequentialChars) strengthScore -= 15;
    if (hasRepeatedChars) strengthScore -= 10;
    
    // Ensure score is within bounds
    strengthScore = Math.max(0, Math.min(100, strengthScore));
    
    // Determine strength level
    let strengthLevel = 'Very Weak';
    if (strengthScore >= 80) strengthLevel = 'Very Strong';
    else if (strengthScore >= 60) strengthLevel = 'Strong';
    else if (strengthScore >= 40) strengthLevel = 'Moderate';
    else if (strengthScore >= 20) strengthLevel = 'Weak';
    
    // Return validation result
    const isValid = validationErrors.length === 0;
    
    console.log('✅ Password validation completed:', { 
      isValid, 
      strengthScore, 
      strengthLevel,
      errorCount: validationErrors.length 
    });
    
    const response = {
      isValid,
      strengthScore,
      strengthLevel,
      errors: validationErrors,
      requirements: {
        minLength: `At least ${minLength} characters`,
        maxLength: `No more than ${maxLength} characters`,
        hasUpperCase: 'At least one uppercase letter (A-Z)',
        hasLowerCase: 'At least one lowercase letter (a-z)', 
        hasNumbers: 'At least one number (0-9)',
        hasSpecialChar: 'At least one special character',
        notCommon: 'Not a commonly used password',
        noSequential: 'No sequential characters (123, abc)',
        noRepeated: 'No repeated characters (aaa, 111)'
      },
      passed: {
        minLength: password.length >= minLength,
        maxLength: password.length <= maxLength,
        hasUpperCase,
        hasLowerCase,
        hasNumbers,
        hasSpecialChar,
        notCommon: !isCommonPassword,
        noSequential: !hasSequentialChars,
        noRepeated: !hasRepeatedChars
      }
    };

    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
    
  } catch (error) {
    console.error('💥 Error validating password:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to validate password',
        message: error.message,
        isValid: false,
        strengthScore: 0,
        errors: ['Internal validation error']
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});