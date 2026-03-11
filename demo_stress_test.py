import asyncio
import httpx
import random
import time
from urllib.parse import urljoin

BASE_URL = "http://localhost:3000"
ONDC_WEBHOOK_URL = urljoin(BASE_URL, "/api/ondc/webhook")
WALKIN_WEBHOOK_URL = urljoin(BASE_URL, "/api/webhooks/walk-in")
PRODUCTS_API = urljoin(BASE_URL, "/api/merchants/2/products") # Hitting Merchant 2 for the demo (or whichever is easiest)

# Fallback IDs just in case the API fetch fails or is slow
FALLBACK_PRODUCT_IDS = ["cm19xyh3t0002xy7g1234abcd", "cm19xyh3t0003xy7g5678efgh"]

async def fetch_live_products(client):
    try:
        response = await client.get(PRODUCTS_API)
        if response.status_code == 200:
            products = response.json()
            # Filter for products that are currently live and have some stock
            live_products = [p['id'] for p in products if p['is_live']]
            print(f"📦 Found {len(live_products)} Live Products on the Node.")
            return live_products
        else:
            print(f"⚠️ Failed to fetch products. Status: {response.status_code}. Using fallbacks.")
            return FALLBACK_PRODUCT_IDS
    except Exception as e:
         print(f"⚠️ Error fetching products: {e}. Using fallbacks.")
         return FALLBACK_PRODUCT_IDS


async def simulate_ondc_order(client, product_id, order_num):
    """Simulates an order arriving from an external network (e.g., Magicpin via ONDC)."""
    payload = {
        "network": "ONDC_Magicpin",
        "order_id": f"ORD-SPK-900{order_num}",
        "items": [
            {
                "product_id": product_id,
                "quantity": random.randint(1, 2)
            }
        ]
    }
    
    start_time = time.time()
    try:
        response = await client.post(ONDC_WEBHOOK_URL, json=payload, timeout=10.0)
        latency = (time.time() - start_time) * 1000
        
        if response.status_code == 200:
            print(f"✅ [ONDC] Order {order_num:02d} | Latency: {latency:.0f}ms | Status: Accepted")
        else:
            print(f"❌ [ONDC] Order {order_num:02d} | Status: {response.status_code} | Msg: {response.text}")
            
    except Exception as e:
        print(f"⚠️ [ONDC] Order {order_num:02d} | Error: {e}")

async def simulate_walkin_sale(client, product_id, sale_num):
    """Simulates a physical POS scan in the Kirana store."""
    payload = {
        "productId": product_id,
        "quantity": random.randint(1, 3)
    }
    
    start_time = time.time()
    try:
        response = await client.post(WALKIN_WEBHOOK_URL, json=payload, timeout=10.0)
        latency = (time.time() - start_time) * 1000
        
        if response.status_code == 200:
            print(f"🛒 [WALK-IN] POS Scan {sale_num:02d} | Latency: {latency:.0f}ms | Status: Processed")
        else:
             print(f"❌ [WALK-IN] POS Scan {sale_num:02d} | Status: {response.status_code} | Msg: {response.text}")
             
    except Exception as e:
        print(f"⚠️ [WALK-IN] POS Scan {sale_num:02d} | Error: {e}")

async def main():
    print("==================================================")
    print("🚀 HYPERLOCAL OS : INVESTOR PEAK HOUR STRESS TEST")
    print("==================================================")
    print("Initiating simulated high-density traffic on Node 01...")
    print("Ensure the Next.js server is running on http://localhost:3000\n")
    
    time.sleep(2)
    
    async with httpx.AsyncClient() as client:
        # 1. Get real product IDs from the DB if possible to ensure the test impacts the UI
        product_ids = await fetch_live_products(client)
        if not product_ids:
             print("❌ No products available to stress test. Exiting.")
             return
             
        time.sleep(1)
        print("\n🔥 COMMENCING STRESS TEST BARRAGE 🔥\n")

        # 2. Prepare the tasks
        tasks = []
        
        # 25 Concurrent ONDC Orders
        for i in range(1, 26):
            pid = random.choice(product_ids)
            tasks.append(simulate_ondc_order(client, pid, i))
            
        # 10 Concurrent Walk-in Scans (To trigger Ghost Inventory reconciliation faster)
        for i in range(1, 11):
            pid = random.choice(product_ids)
            tasks.append(simulate_walkin_sale(client, pid, i))

        # 3. Fire them all concurrently
        start_time = time.time()
        await asyncio.gather(*tasks)
        total_time = time.time() - start_time
        
        print("\n==================================================")
        print(f"🏁 STRESS TEST COMPLETE in {total_time:.2f} seconds.")
        print("Check the Merchant OS and Admin Control Room to see the impact.")
        print("Note: If 'Ghost Inventory' triggered, check the Merchant Dashboard modal.")
        print("==================================================")

if __name__ == "__main__":
    asyncio.run(main())
