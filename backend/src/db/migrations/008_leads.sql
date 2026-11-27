CREATE TABLE IF NOT EXISTS leads (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enquiry_type  VARCHAR(20) NOT NULL CHECK (enquiry_type IN ('demo', 'contact')),
  name          VARCHAR(255) NOT NULL,
  email         VARCHAR(255) NOT NULL,
  phone         VARCHAR(50),
  company_name  VARCHAR(255),
  website       VARCHAR(500),
  industry      VARCHAR(100),
  company_size  VARCHAR(50),
  use_case      TEXT,
  preferred_date DATE,
  subject       VARCHAR(255),
  message       TEXT,
  lead_status   VARCHAR(30) NOT NULL DEFAULT 'new'
                  CHECK (lead_status IN ('new', 'contacted', 'qualified', 'demo_scheduled', 'closed_won', 'closed_lost')),
  ip_address    INET,
  user_agent    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(lead_status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
