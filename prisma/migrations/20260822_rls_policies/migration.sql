-- RLS Policies Migration for PENA AMEEN
-- Enables Row-Level Security on customer-owned tables
-- Creates staff bypass role for admin operations

-- 1. Create session context function. The context is the immutable Clerk
-- subject, not the internal cuid, so it can be established before querying
-- the User row.
CREATE OR REPLACE FUNCTION current_app_clerk_id() RETURNS text
LANGUAGE sql STABLE AS $$
  SELECT nullif(current_setting('app.current_clerk_id', true), '');
$$;

CREATE OR REPLACE FUNCTION current_app_is_system() RETURNS boolean
LANGUAGE sql STABLE AS $$
  SELECT current_setting('app.actor_kind', true) = 'system';
$$;

CREATE OR REPLACE FUNCTION current_app_user_id() RETURNS text
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public AS $$
  SELECT id FROM "User"
  WHERE "clerkId" = current_app_clerk_id()
  LIMIT 1;
$$;

-- 2. Create staff bypass role
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'penaameen_staff') THEN
    CREATE ROLE penaameen_staff NOLOGIN;
  END IF;
END
$$;

-- 3. Enable RLS and create policies for User table
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User" FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS user_select_own ON "User";
CREATE POLICY user_select_own ON "User"
  FOR SELECT USING (current_app_is_system() OR "clerkId" = current_app_clerk_id());

DROP POLICY IF EXISTS user_insert_own ON "User";
CREATE POLICY user_insert_own ON "User"
  FOR INSERT WITH CHECK (current_app_is_system() OR "clerkId" = current_app_clerk_id());

DROP POLICY IF EXISTS user_update_own ON "User";
CREATE POLICY user_update_own ON "User"
  FOR UPDATE USING (current_app_is_system() OR "clerkId" = current_app_clerk_id());

-- 4. Enable RLS and create policies for Address table
ALTER TABLE "Address" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Address" FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS address_select_own ON "Address";
CREATE POLICY address_select_own ON "Address"
  FOR SELECT USING (current_app_is_system() OR "userId" = current_app_user_id());

DROP POLICY IF EXISTS address_insert_own ON "Address";
CREATE POLICY address_insert_own ON "Address"
  FOR INSERT WITH CHECK (current_app_is_system() OR "userId" = current_app_user_id());

DROP POLICY IF EXISTS address_update_own ON "Address";
CREATE POLICY address_update_own ON "Address"
  FOR UPDATE USING (current_app_is_system() OR "userId" = current_app_user_id());

DROP POLICY IF EXISTS address_delete_own ON "Address";
CREATE POLICY address_delete_own ON "Address"
  FOR DELETE USING (current_app_is_system() OR "userId" = current_app_user_id());

-- 5. Enable RLS and create policies for Cart table
ALTER TABLE "Cart" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Cart" FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS cart_select_own ON "Cart";
CREATE POLICY cart_select_own ON "Cart"
  FOR SELECT USING (current_app_is_system() OR "userId" = current_app_user_id());

DROP POLICY IF EXISTS cart_insert_own ON "Cart";
CREATE POLICY cart_insert_own ON "Cart"
  FOR INSERT WITH CHECK (current_app_is_system() OR "userId" = current_app_user_id());

DROP POLICY IF EXISTS cart_update_own ON "Cart";
CREATE POLICY cart_update_own ON "Cart"
  FOR UPDATE USING (current_app_is_system() OR "userId" = current_app_user_id());

DROP POLICY IF EXISTS cart_delete_own ON "Cart";
CREATE POLICY cart_delete_own ON "Cart"
  FOR DELETE USING (current_app_is_system() OR "userId" = current_app_user_id());

-- 6. Enable RLS and create policies for Order table
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Order" FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS order_select_own ON "Order";
CREATE POLICY order_select_own ON "Order"
  FOR SELECT USING (current_app_is_system() OR "userId" = current_app_user_id());

DROP POLICY IF EXISTS order_insert_own ON "Order";
CREATE POLICY order_insert_own ON "Order"
  FOR INSERT WITH CHECK (current_app_is_system() OR "userId" = current_app_user_id());

DROP POLICY IF EXISTS order_update_own ON "Order";
CREATE POLICY order_update_own ON "Order"
  FOR UPDATE USING (current_app_is_system() OR "userId" = current_app_user_id());

-- 7. Enable RLS and create policies for OrderItem table
-- OrderItem is accessed via Order join
ALTER TABLE "OrderItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderItem" FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS orderitem_select_own ON "OrderItem";
CREATE POLICY orderitem_select_own ON "OrderItem"
  FOR SELECT USING (
    current_app_is_system() OR "orderId" IN (SELECT id FROM "Order" WHERE "userId" = current_app_user_id())
  );

DROP POLICY IF EXISTS orderitem_insert_own ON "OrderItem";
CREATE POLICY orderitem_insert_own ON "OrderItem"
  FOR INSERT WITH CHECK (
    current_app_is_system() OR "orderId" IN (SELECT id FROM "Order" WHERE "userId" = current_app_user_id())
  );

-- 8. Enable RLS and create policies for ChatSession table
ALTER TABLE "ChatSession" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ChatSession" FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS chatsession_select_own ON "ChatSession";
CREATE POLICY chatsession_select_own ON "ChatSession"
  FOR SELECT USING (current_app_is_system() OR "userId" = current_app_user_id());

DROP POLICY IF EXISTS chatsession_insert_own ON "ChatSession";
CREATE POLICY chatsession_insert_own ON "ChatSession"
  FOR INSERT WITH CHECK (current_app_is_system() OR "userId" = current_app_user_id());

DROP POLICY IF EXISTS chatsession_update_own ON "ChatSession";
CREATE POLICY chatsession_update_own ON "ChatSession"
  FOR UPDATE USING (current_app_is_system() OR "userId" = current_app_user_id());

DROP POLICY IF EXISTS chatsession_delete_own ON "ChatSession";
CREATE POLICY chatsession_delete_own ON "ChatSession"
  FOR DELETE USING (current_app_is_system() OR "userId" = current_app_user_id());

-- 9. Grant staff role permissions on all RLS-protected tables
GRANT SELECT, INSERT, UPDATE, DELETE ON "User" TO penaameen_staff;
GRANT SELECT, INSERT, UPDATE, DELETE ON "Address" TO penaameen_staff;
GRANT SELECT, INSERT, UPDATE, DELETE ON "Cart" TO penaameen_staff;
GRANT SELECT, INSERT, UPDATE, DELETE ON "Order" TO penaameen_staff;
GRANT SELECT, INSERT, UPDATE, DELETE ON "OrderItem" TO penaameen_staff;
GRANT SELECT, INSERT, UPDATE, DELETE ON "ChatSession" TO penaameen_staff;

-- 10. Grant usage on sequences (for auto-generated IDs)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO penaameen_staff;

-- 11. Create index for OrderItem RLS policy performance
CREATE INDEX IF NOT EXISTS idx_orderitem_orderid_userid 
ON "OrderItem" ("orderId")
INCLUDE ("productId", "quantity", "price", "subtotal");

-- 12. Partial index for common Order queries
CREATE INDEX IF NOT EXISTS idx_order_userid_status 
ON "Order" ("userId", status) 
WHERE "userId" IS NOT NULL;

-- 13. Partial index for Address queries
CREATE INDEX IF NOT EXISTS idx_address_userid 
ON "Address" ("userId") 
WHERE "userId" IS NOT NULL;

-- 14. Partial index for Cart queries
CREATE INDEX IF NOT EXISTS idx_cart_userid 
ON "Cart" ("userId") 
WHERE "userId" IS NOT NULL;

-- Child rows must also be protected when queried directly.
ALTER TABLE "CartItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CartItem" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cartitem_select_own ON "CartItem";
CREATE POLICY cartitem_select_own ON "CartItem" FOR SELECT USING (
  current_app_is_system() OR "cartId" IN (SELECT id FROM "Cart" WHERE "userId" = current_app_user_id())
);
DROP POLICY IF EXISTS cartitem_insert_own ON "CartItem";
CREATE POLICY cartitem_insert_own ON "CartItem" FOR INSERT WITH CHECK (
  current_app_is_system() OR "cartId" IN (SELECT id FROM "Cart" WHERE "userId" = current_app_user_id())
);
DROP POLICY IF EXISTS cartitem_update_own ON "CartItem";
CREATE POLICY cartitem_update_own ON "CartItem" FOR UPDATE USING (
  current_app_is_system() OR "cartId" IN (SELECT id FROM "Cart" WHERE "userId" = current_app_user_id())
);
DROP POLICY IF EXISTS cartitem_delete_own ON "CartItem";
CREATE POLICY cartitem_delete_own ON "CartItem" FOR DELETE USING (
  current_app_is_system() OR "cartId" IN (SELECT id FROM "Cart" WHERE "userId" = current_app_user_id())
);

ALTER TABLE "ChatMessage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ChatMessage" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS chatmessage_select_own ON "ChatMessage";
CREATE POLICY chatmessage_select_own ON "ChatMessage" FOR SELECT USING (
  current_app_is_system() OR "sessionId" IN (SELECT id FROM "ChatSession" WHERE "userId" = current_app_user_id())
);
DROP POLICY IF EXISTS chatmessage_insert_own ON "ChatMessage";
CREATE POLICY chatmessage_insert_own ON "ChatMessage" FOR INSERT WITH CHECK (
  current_app_is_system() OR "sessionId" IN (SELECT id FROM "ChatSession" WHERE "userId" = current_app_user_id())
);
DROP POLICY IF EXISTS chatmessage_update_own ON "ChatMessage";
CREATE POLICY chatmessage_update_own ON "ChatMessage" FOR UPDATE USING (
  current_app_is_system() OR "sessionId" IN (SELECT id FROM "ChatSession" WHERE "userId" = current_app_user_id())
);
DROP POLICY IF EXISTS chatmessage_delete_own ON "ChatMessage";
CREATE POLICY chatmessage_delete_own ON "ChatMessage" FOR DELETE USING (
  current_app_is_system() OR "sessionId" IN (SELECT id FROM "ChatSession" WHERE "userId" = current_app_user_id())
);

GRANT SELECT, INSERT, UPDATE, DELETE ON "CartItem" TO penaameen_staff;
GRANT SELECT, INSERT, UPDATE, DELETE ON "ChatMessage" TO penaameen_staff;

ALTER TABLE "OrderStatusHistory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderStatusHistory" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS orderstatushistory_select_own ON "OrderStatusHistory";
CREATE POLICY orderstatushistory_select_own ON "OrderStatusHistory" FOR SELECT USING (
  "orderId" IN (
    SELECT o.id FROM "Order" o
    JOIN "User" u ON u.id = o."userId"
    WHERE current_app_is_system() OR u."clerkId" = current_app_clerk_id()
  )
);
DROP POLICY IF EXISTS orderstatushistory_insert_own ON "OrderStatusHistory";
CREATE POLICY orderstatushistory_insert_own ON "OrderStatusHistory" FOR INSERT WITH CHECK (
  "orderId" IN (
    SELECT o.id FROM "Order" o
    JOIN "User" u ON u.id = o."userId"
    WHERE current_app_is_system() OR u."clerkId" = current_app_clerk_id()
  )
);
GRANT SELECT, INSERT, UPDATE, DELETE ON "OrderStatusHistory" TO penaameen_staff;
