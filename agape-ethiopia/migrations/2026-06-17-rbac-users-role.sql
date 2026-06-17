-- Migration: Add RBAC support with application user profiles and role-based permission tracking.

BEGIN;

-- Create app-level user profile table for roles and disable state.
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY,
  email text NOT NULL UNIQUE,
  role text NOT NULL DEFAULT 'Staff',
  is_disabled boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Add a timestamp trigger to keep the profile updated_at column current.
CREATE OR REPLACE FUNCTION update_users_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_users_updated_at ON users;
CREATE TRIGGER trg_update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_users_updated_at();

-- Add an audit log for role changes and user profile management.
CREATE TABLE IF NOT EXISTS user_audit_logs (
  id bigserial PRIMARY KEY,
  user_id uuid,
  action text NOT NULL,
  actor_id uuid,
  details jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION log_user_profile_changes()
RETURNS trigger AS $$
DECLARE
  payload jsonb;
BEGIN
  IF (TG_OP = 'UPDATE') THEN
    payload := jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW));
    INSERT INTO user_audit_logs(user_id, action, actor_id, details)
    VALUES(NEW.id, 'UPDATE_PROFILE', NULL, payload);
    RETURN NEW;
  ELSIF (TG_OP = 'INSERT') THEN
    payload := to_jsonb(NEW);
    INSERT INTO user_audit_logs(user_id, action, actor_id, details)
    VALUES(NEW.id, 'CREATE_PROFILE', NULL, payload);
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    payload := to_jsonb(OLD);
    INSERT INTO user_audit_logs(user_id, action, actor_id, details)
    VALUES(OLD.id, 'DELETE_PROFILE', NULL, payload);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_log_user_profile_changes ON users;
CREATE TRIGGER trg_log_user_profile_changes
AFTER INSERT OR UPDATE OR DELETE ON users
FOR EACH ROW
EXECUTE FUNCTION log_user_profile_changes();

COMMIT;
