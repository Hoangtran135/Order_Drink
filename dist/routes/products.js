"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoutes = void 0;
const express_1 = __importDefault(require("express"));
const mockData_1 = require("../data/mockData");
const router = express_1.default.Router();
exports.productRoutes = router;
// Get all products
router.get('/', (req, res) => {
    res.json(mockData_1.products);
});
// Get product by ID
router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const product = mockData_1.products.find(p => p.id === id);
    if (!product) {
        return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }
    res.json(product);
});
// Get products by category
router.get('/category/:category', (req, res) => {
    const category = req.params.category;
    const filteredProducts = mockData_1.products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    res.json(filteredProducts);
});
//# sourceMappingURL=products.js.map