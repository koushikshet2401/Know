CREATE TABLE IF NOT EXISTS clients (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR(255) NOT NULL,
  email           VARCHAR(255) UNIQUE NOT NULL,
  phone           VARCHAR(50),
  company_name    VARCHAR(255),
  website         VARCHAR(500),
  industry        VARCHAR(100),
  company_size    VARCHAR(50),
  status          VARCHAR(30) DEFAULT 'lead'
                    CHECK (status IN ('lead','active','suspended','cancelled')),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
