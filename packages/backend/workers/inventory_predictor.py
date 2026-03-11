import pandas as pd
from sklearn.linear_model import LinearRegression
import psycopg2
import requests
import datetime
import os

# 1. Connect to your PostgreSQL Database (Use Env Vars in Production)
DB_URL = os.environ.get("DATABASE_URL", "dbname=antigravity user=postgres password=secret host=localhost")
try:
    conn = psycopg2.connect(DB_URL)
except Exception as e:
    print(f"Database connection failed: {e}")
    exit(1)

def predict_stockouts():
    """
    Runs nightly or every few hours. Analyzes the last 14 days of sales 
    to predict when the "Platform Reserved Stock" hits zero.
    """
    
    # Fetch unified inventory and recent sales velocity per SKU per Shop
    query = """
        SELECT 
            i.shop_id, 
            i.sku_master_link, 
            i.platform_reserved_stock,
            i.live_physical_stock,
            AVG(s.daily_sales_qty) as avg_daily_velocity
        FROM unified_inventory i
        LEFT JOIN (
            -- Subquery to get daily sales velocity over the last 14 days
            SELECT shop_id, sku, COUNT(id) as daily_sales_qty, DATE(logged_at) 
            FROM dynamic_pricing_log 
            WHERE logged_at > NOW() - INTERVAL '14 days'
            GROUP BY shop_id, sku, DATE(logged_at)
        ) s ON i.shop_id = s.shop_id AND i.sku_master_link = s.sku
        GROUP BY i.shop_id, i.sku_master_link, i.platform_reserved_stock, i.live_physical_stock;
    """
    
    try:
        df = pd.read_sql(query, conn)
    except Exception as e:
         print(f"Error executing query: {e}")
         return

    alerts_to_send = []

    for index, row in df.iterrows():
        velocity = row['avg_daily_velocity']
        
        # If the item doesn't sell, ignore it
        if pd.isna(velocity) or velocity < 0.5:
            continue
            
        platform_stock = row['platform_reserved_stock']
        total_physical_stock = row['live_physical_stock']
        
        # Calculate "Days Until Empty" on the Platform Shelf
        days_until_empty = platform_stock / velocity if velocity > 0 else 999
        
        # --- THE PREDICTIVE TRIGGER ---
        # If the Platform Shelf will be empty in less than 1.5 days AND 
        # the shopkeeper actually has more physical stock in the back room...
        if days_until_empty < 1.5 and total_physical_stock > platform_stock:
            
            recommended_move_qty = int(velocity * 3) # Recommend moving 3 days worth of stock
            
            alerts_to_send.append({
                "shopId": str(row['shop_id']),
                "sku": str(row['sku_master_link']),
                "message": f"Hot Item! You have {total_physical_stock} in the store, but only {platform_stock} on the App. Move {recommended_move_qty} to the Platform Shelf now for the weekend rush."
            })

    # Send alerts to the Node.js/Spring Boot Notification Service (or Firebase directly)
    if alerts_to_send:
        try:
             # Example POST back to backend API to trigger WebSocket/Push Notifications
             API_URL = os.environ.get("ALERT_API_URL", "http://localhost:3000/api/internal/ai-restock-alerts")
             response = requests.post(API_URL, json=alerts_to_send)
             response.raise_for_status() 
             print(f"Successfully dispatched {len(alerts_to_send)} Predictive Restock Alerts to Shopkeepers.")
        except Exception as e:
             print(f"Failed to dispatch alerts: {e}")

if __name__ == "__main__":
    predict_stockouts()
