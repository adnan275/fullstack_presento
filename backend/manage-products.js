#!/usr/bin/env node

import { ProductService } from './products/products.service.js';
import { productsData } from './products/products.data.js';

const service = new ProductService();

async function main() {
    const command = process.argv[2];
    const args = process.argv.slice(3);

    try {
        switch (command) {
            case 'add-all':
                await addAllProducts();
                break;

            case 'add':
                await addSpecificProducts(args);
                break;

            case 'verify':
                await verifyProducts(args);
                break;

            case 'list':
                await listProducts();
                break;

            case 'update':
                await updateProduct(args);
                break;

            case 'delete':
                await deleteProduct(args);
                break;

            case 'help':
            default:
                showHelp();
                break;
        }
    } catch (error) {
        console.error('\n💥 Error:', error.message);
        process.exit(1);
    } finally {
        await service.disconnect();
    }
}

async function addAllProducts() {
    console.log('🌱 Adding all products from products.data.js...\n');
    console.log(`📦 Total products to add: ${productsData.length}\n`);

    const products = await service.addProducts(productsData);

    console.log('\n🎉 All products added successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   Products added: ${products.length}`);
    console.log(`   Total stock: ${products.reduce((sum, p) => sum + p.stock, 0)} units`);
    console.log(`   Total value: ₹${products.reduce((sum, p) => sum + p.price, 0)}`);
}

async function addSpecificProducts(indices) {
    if (indices.length === 0) {
        console.log('❌ Please specify product indices (e.g., node manage-products.js add 0 1 2)');
        return;
    }

    const selectedProducts = indices
        .map(i => parseInt(i))
        .filter(i => i >= 0 && i < productsData.length)
        .map(i => productsData[i]);

    if (selectedProducts.length === 0) {
        console.log('❌ No valid product indices provided');
        return;
    }

    console.log(`🌱 Adding ${selectedProducts.length} products...\n`);

    const products = await service.addProducts(selectedProducts);

    console.log(`\n✅ Added ${products.length} products successfully!`);
}

async function verifyProducts(ids) {
    if (ids.length === 0) {
        console.log('❌ Please specify product IDs (e.g., node manage-products.js verify 17 18 19)');
        return;
    }

    const productIds = ids.map(id => parseInt(id));

    console.log(`🔍 Verifying ${productIds.length} products...\n`);

    const products = await service.verifyProducts(productIds);

    console.log(`\n✅ Found ${products.length}/${productIds.length} products`);
}

async function listProducts() {
    console.log('📋 Listing all products in database...\n');

    const products = await service.listAllProducts();

    if (products.length === 0) {
        console.log('No products found in database');
        return;
    }

    console.log(`Found ${products.length} products:\n`);

    products.forEach(product => {
        console.log(`📦 ID ${product.id}: ${product.name}`);
        console.log(`   💰 ₹${product.price} | Stock: ${product.stock} | ${product.category}`);
        console.log(`   ⭐ Badge: ${product.badge || 'None'} | Featured: ${product.isFeatured}`);
        console.log('');
    });

    console.log(`📊 Total: ${products.length} products`);
    console.log(`📊 Total stock: ${products.reduce((sum, p) => sum + p.stock, 0)} units`);
    console.log(`📊 Total value: ₹${products.reduce((sum, p) => sum + p.price, 0)}`);
}

async function updateProduct(args) {
    if (args.length < 3) {
        console.log('❌ Usage: node manage-products.js update [id] [field] [value]');
        console.log('   Example: node manage-products.js update 17 stock 25');
        return;
    }

    const [id, field, value] = args;
    const productId = parseInt(id);

    let parsedValue = value;
    if (['price', 'stock', 'discount'].includes(field)) {
        parsedValue = parseInt(value);
    } else if (field === 'isFeatured') {
        parsedValue = value === 'true';
    }

    console.log(`🔄 Updating product ${productId}...`);

    const product = await service.updateProduct(productId, {
        [field]: parsedValue
    });

    console.log(`✅ Updated ${field} to ${parsedValue}`);
}

async function deleteProduct(args) {
    if (args.length === 0) {
        console.log('❌ Usage: node manage-products.js delete [id]');
        return;
    }

    const id = parseInt(args[0]);

    console.log(`🗑️  Deleting product ${id}...`);

    await service.deleteProduct(id);

    console.log(`✅ Product ${id} deleted`);
}

function showHelp() {
    console.log(`
📦 Product Management CLI

Usage: node manage-products.js [command] [args]

Commands:
  add-all              Add all products from products.data.js
  add [indices...]     Add specific products by index (e.g., add 0 1 2)
  verify [ids...]      Verify products by ID (e.g., verify 17 18 19)
  list                 List all products in database
  update [id] [field] [value]  Update a product field
  delete [id]          Delete a product
  help                 Show this help message

Examples:
  node manage-products.js add-all
  node manage-products.js add 0 1 2
  node manage-products.js verify 17 18 19 20
  node manage-products.js list
  node manage-products.js update 17 stock 25
  node manage-products.js delete 99

Product Data:
  Edit products/products.data.js to add or modify products
  Current products: ${productsData.length}
    `);
}

main();
