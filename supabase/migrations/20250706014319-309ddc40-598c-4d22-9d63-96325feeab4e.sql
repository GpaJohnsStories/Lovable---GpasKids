-- Fix remaining search_path security warnings for database functions

-- Fix admin_login function
CREATE OR REPLACE FUNCTION public.admin_login(email_input text, password_input text, device_info text DEFAULT NULL::text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  admin_record public.admin_users%ROWTYPE;
BEGIN
  -- Get admin record
  SELECT * INTO admin_record 
  FROM public.admin_users 
  WHERE email = email_input;

  -- Check if admin exists
  IF admin_record.id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Invalid credentials');
  END IF;

  -- Check if account is locked
  IF admin_record.locked_until IS NOT NULL AND admin_record.locked_until > now() THEN
    RETURN json_build_object('success', false, 'error', 'Account temporarily locked');
  END IF;

  -- Verify password
  IF NOT verify_password(password_input, admin_record.password_hash) THEN
    -- Increment failed attempts
    UPDATE public.admin_users 
    SET failed_login_attempts = failed_login_attempts + 1,
        locked_until = CASE 
          WHEN failed_login_attempts >= 4 THEN now() + interval '15 minutes'
          ELSE NULL 
        END
    WHERE id = admin_record.id;
    
    RETURN json_build_object('success', false, 'error', 'Invalid credentials');
  END IF;

  -- Successful login - reset failed attempts and update last login
  UPDATE public.admin_users 
  SET failed_login_attempts = 0,
      locked_until = NULL,
      last_login = now(),
      device_fingerprint = COALESCE(device_info, device_fingerprint)
  WHERE id = admin_record.id;

  -- Log successful admin login
  INSERT INTO public.admin_audit (action, admin_id, ip_address, user_agent)
  VALUES ('admin_login', admin_record.id, inet_client_addr(), device_info);

  RETURN json_build_object(
    'success', true, 
    'admin_id', admin_record.id,
    'email', admin_record.email,
    'role', admin_record.role
  );
END;
$function$;

-- Fix change_admin_password function
CREATE OR REPLACE FUNCTION public.change_admin_password(admin_email text, new_password text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  UPDATE public.admin_users 
  SET password_hash = hash_password(new_password),
      updated_at = now()
  WHERE email = admin_email;
  
  IF FOUND THEN
    RETURN 'Password updated successfully';
  ELSE
    RETURN 'Admin not found';
  END IF;
END;
$function$;

-- Fix log_database_operation function
CREATE OR REPLACE FUNCTION public.log_database_operation(p_operation_type text, p_table_name text, p_record_id text DEFAULT NULL::text, p_client_type text DEFAULT 'unknown'::text, p_operation_details jsonb DEFAULT NULL::jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.database_operations_audit (
    operation_type,
    table_name,
    record_id,
    client_type,
    user_id,
    ip_address,
    operation_details
  ) VALUES (
    p_operation_type,
    p_table_name,
    p_record_id,
    p_client_type,
    auth.uid(),
    inet_client_addr(),
    p_operation_details
  );
END;
$function$;

-- Fix audit_table_changes function
CREATE OR REPLACE FUNCTION public.audit_table_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Log the operation with old and new values
  IF TG_OP = 'INSERT' THEN
    PERFORM public.log_database_operation(
      'INSERT',
      TG_TABLE_NAME,
      NEW.id::TEXT,
      current_setting('app.client_type', true),
      jsonb_build_object('new_values', to_jsonb(NEW))
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM public.log_database_operation(
      'UPDATE',
      TG_TABLE_NAME,
      NEW.id::TEXT,
      current_setting('app.client_type', true),
      jsonb_build_object('old_values', to_jsonb(OLD), 'new_values', to_jsonb(NEW))
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM public.log_database_operation(
      'DELETE',
      TG_TABLE_NAME,
      OLD.id::TEXT,
      current_setting('app.client_type', true),
      jsonb_build_object('old_values', to_jsonb(OLD))
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$function$;

-- Fix is_trusted_client function
CREATE OR REPLACE FUNCTION public.is_trusted_client()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Check if the client has set a trusted client identifier
  RETURN current_setting('app.client_type', true) IN ('admin', 'service');
EXCEPTION WHEN OTHERS THEN
  RETURN FALSE;
END;
$function$;