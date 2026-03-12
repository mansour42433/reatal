-- جدول الطلبات
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  notes TEXT,
  items JSONB NOT NULL DEFAULT '[]',
  subtotal DECIMAL(10,2) NOT NULL,
  discount DECIMAL(10,2) DEFAULT 0,
  discount_code TEXT,
  total DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- تفعيل RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- سياسة السماح للجميع بإنشاء طلب جديد
CREATE POLICY "allow_insert_orders" ON orders
  FOR INSERT
  WITH CHECK (true);

-- سياسة السماح للجميع بقراءة الطلبات
CREATE POLICY "allow_select_orders" ON orders
  FOR SELECT
  USING (true);

-- سياسة السماح بتحديث الطلبات
CREATE POLICY "allow_update_orders" ON orders
  FOR UPDATE
  USING (true);

-- سياسة السماح بحذف الطلبات
CREATE POLICY "allow_delete_orders" ON orders
  FOR DELETE
  USING (true);
