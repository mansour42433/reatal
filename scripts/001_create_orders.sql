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
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء index للبحث السريع
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);

-- دالة لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger لتحديث updated_at
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- تفعيل RLS (سنسمح للجميع بإنشاء طلبات ولكن القراءة للأدمن فقط)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- سياسة السماح للجميع بإنشاء طلب جديد (بدون تسجيل دخول)
CREATE POLICY "allow_insert_orders" ON orders
  FOR INSERT
  WITH CHECK (true);

-- سياسة السماح للجميع بقراءة الطلبات (مؤقتاً - يمكن تقييدها للأدمن لاحقاً)
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
