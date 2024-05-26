"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prompt = exports.createEmbedding = void 0;
const index_1 = __importDefault(require("../env/index"));
const openai_1 = __importDefault(require("openai"));
const openai = new openai_1.default({ apiKey: (0, index_1.default)("OPENAI_API_KEY") });
const createEmbedding = async (text) => {
    return await openai.embeddings.create({
        input: text,
        model: "text-embedding-ada-002",
    });
};
exports.createEmbedding = createEmbedding;
const prompt = async (context, query) => {
    return openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: `This is the relevant data you have about a slack workspace so far:
      ${context.toString()}
      Act as if you are the product manager and answer the queries asked by the user.`,
            },
            {
                role: "user",
                content: query,
            },
        ],
    });
};
exports.prompt = prompt;
