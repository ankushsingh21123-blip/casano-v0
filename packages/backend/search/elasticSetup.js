const { Client } = require('@elastic/elasticsearch');
require('dotenv').config();
const es = new Client({ node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200' });

async function createProductIndex() {
    const exists = await es.indices.exists({ index: 'products' });
    if (exists) return; // Index already exists

    await es.indices.create({
        index: 'products',
        body: {
            mappings: {
                properties: {
                    name: { type: 'text', analyzer: 'standard' },
                    brand: { type: 'text', analyzer: 'standard' },
                    category: { type: 'keyword' },
                    tags: { type: 'text', analyzer: 'standard' },
                    barcode: { type: 'keyword' }
                }
            }
        }
    });
    console.log('✅ Elasticsearch index "products" created.');
}

async function searchProducts(query) {
    const result = await es.search({
        index: 'products',
        body: {
            query: {
                multi_match: {
                    query,
                    fields: ['name^4', 'brand^3', 'tags^2', 'category^1'],
                    fuzziness: 'AUTO',
                    prefix_length: 2,
                    type: 'best_fields',
                }
            }
        }
    });

    return result.hits.hits.map(h => ({ id: h._id, ...h._source, score: h._score }));
}

module.exports = { es, createProductIndex, searchProducts };
