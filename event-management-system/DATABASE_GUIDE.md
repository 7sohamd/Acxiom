# Database Viewing Guide

## How to View MongoDB Data

### Method 1: MongoDB Compass (Easiest - GUI)

1. **Download MongoDB Compass** (if not installed):
   - Visit: https://www.mongodb.com/try/download/compass
   - Download and install for Windows

2. **Connect to your database**:
   - Open MongoDB Compass
   - Connection string: `mongodb://localhost:27017`
   - Click "Connect"

3. **Browse your data**:
   - Database name: `event-management`
   - Collections:
     - `users` - All registered users (admin, vendor, user)
     - `vendors` - Vendor profile information
     - `products` - All vendor products with images
     - `carts` - User shopping carts
     - `orders` - All orders with status
     - `memberships` - Vendor memberships

4. **View collection data**:
   - Click on any collection to see all documents
   - Use filters to search specific data
   - Edit/delete documents directly

---

### Method 2: MongoDB Shell (Command Line)

```bash


mongosh


use event-management


show collections



db.users.find().pretty()

db.vendors.find().pretty()

db.products.find().pretty()

db. orders.find().pretty()

db.products.countDocuments()


db.vendors.findOne({ name: "Your Vendor Name" })

db.products.find({ vendorId: "VENDOR_ID_HERE" }).pretty()


db.orders.find().sort({ createdAt: -1 }).limit(5).pretty()
```

---

### Method 3: VS Code Extension

1. **Install extension**:
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X)
   - Search "MongoDB for VS Code"
   - Install it

2. **Connect**:
   - Click MongoDB icon in sidebar
   - Add Connection: `mongodb://localhost:27017`

3. **Browse**:
   - Expand connection > event-management
   - Click collections to view data

---

## Common Database Queries

### Check if vendor profile exists
```javascript
db.vendors.findOne({ userId: ObjectId("USER_ID_HERE") })
```

// First find your vendor
db.vendors.findOne({ name: "Your Vendor Name" })

db.products.find({ vendorId: ObjectId("VENDOR_ID_HERE") })
```

### Check user orders
db.orders.find({ userId: ObjectId("USER_ID_HERE") }).pretty()
```

### Update order status
```javascript
db.orders.updateOne(
  { _id: ObjectId("ORDER_ID") },
  { $set: { status: "Out For Delivery" } }
)
```

---

## Troubleshooting

### "Vendor not found" error
Run this to check if vendor profile was created:
```javascript
db.vendors.find().pretty()
```

If no vendors, create one manually:
```javascript
db.vendors.insertOne({
  userId: ObjectId("YOUR_USER_ID"),
  name: "Test Vendor",
  category: "Catering",
  email: "vendor@test.com",
  contactDetails: "+123456789"
})
```

### Products not showing
1. Check products exist:
   ```javascript
   db.products.find().pretty()
   ```

2. Verify vendorId matches:
   ```javascript
   db.vendors.findOne({ name: "Your Name" })
   
   db.products.find({ vendorId: ObjectId("PASTE_ID_HERE") })
   ```

---

## Quick Test Commands

```bash

db.users.countDocuments()
db.vendors.countDocuments()
db.products.countDocuments()
db.orders.countDocuments()
db.carts.countDocuments()


db.products.drop()  


db.dropDatabase() 
```

---

## API Testing with Thunder Client / Postman

Instead of direct database access, you can use your API:

### Get all products for vendor
```http
GET http://localhost:5000/api/products/vendor/VENDOR_ID
Authorization: Bearer YOUR_JWT_TOKEN
```

### Get vendor dashboard
```http
GET http://localhost:5000/api/vendors/dashboard
Authorization: Bearer YOUR_VENDOR_JWT_TOKEN
```

---

## Current Issue Fix

If "Your Items" button shows no products:

1. **Check browser console** (F12):
   - Look for error messages
   - Check if API calls are successful

2. **Verify product was added**:
   ```bash
   mongosh
   use event-management
   db.products.find().pretty()
   ```

3. **Check vendor ID**:
   ```bash
   db.vendors.find().pretty()
   ```
   Copy the vendor `_id`

4. **Check if products have correct vendorId**:
   ```bash
   db.products.find({ vendorId: ObjectId("PASTE_VENDOR_ID") })
   ```

The updated VendorProducts page now includes console logging to help debug this issue!
