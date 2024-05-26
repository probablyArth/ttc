"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pinecone_1 = require("@pinecone-database/pinecone");
const index_1 = __importDefault(require("../env/index"));
const newPineconeClient = async () => {
    const client = new pinecone_1.Pinecone({
        apiKey: (0, index_1.default)("PINECONE_API_KEY"),
    });
    const indexes = await client.listIndexes();
    if (!indexes.indexes?.find((index) => index.name == "slack")) {
        await client.createIndex({
            name: "slack",
            dimension: 1536,
            spec: {
                serverless: {
                    cloud: "aws",
                    region: "us-east-1",
                },
            },
            waitUntilReady: true,
        });
        console.log("Index not found, created slack index");
    }
    return client.Index("slack");
};
exports.default = newPineconeClient;
