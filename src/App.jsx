import React, { useState } from 'react';
import './App.css';

// Direct online image links para sa school supplies
const initialProducts = [
  {
    id: 1,
    name: "Ballpoint Pen (Blue)",
    category: "Writing Tools",
    image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=500&auto=format&fit=crop&q=60",
    description: "Smooth writing blue ballpoint pen with 0.7mm tip.",
    specification: "0.7mm medium point, oil-based ink",
    rating: 4.5,
    price: 15,
    quantity: 20
  },
  {
    id: 2,
    name: "Spiral Notebook (80 leaves)",
    category: "Paper & Notebooks",
    image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=500&auto=format&fit=crop&q=60",
    description: "High-quality ruled spiral notebook for school notes.",
    specification: "80 leaves, 80 gsm paper",
    rating: 5.0,
    price: 45,
    quantity: 3
  },
  {
    id: 3,
    name: "Scientific Calculator",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1611125832047-1d7ad1e8e48b?w=500&auto=format&fit=crop&q=60",
    description: "Multi-function calculator for math and science subjects.",
    specification: "240 functions, 2-line display",
    rating: 4.8,
    price: 350,
    quantity: 10
  }
];

function App() {
  const [products, setProducts] = useState(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Writing Tools',
    image: '',
    description: '',
    specification: '',
    rating: '',
    price: '',
    quantity: ''
  });

  const handleAddProduct = (e) => {
    e.preventDefault();
    const { name, category, description, specification, rating, price, quantity } = formData;
    
    if (!name || !category || !description || !specification || !rating || !price || !quantity) {
      alert("Pakiusap, punan ang LAHAT ng fields bago mag-submit!");
      return;
    }

    const newProductItem = {
      ...formData,
      id: Date.now(),
      image: formData.image || "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=500&auto=format&fit=crop&q=60",
      price: parseFloat(price),
      quantity: parseInt(quantity),
      rating: parseFloat(rating)
    };

    setProducts([...products, newProductItem]);

    setFormData({
      name: '',
      category: 'Writing Tools',
      image: '',
      description: '',
      specification: '',
      rating: '',
      price: '',
      quantity: ''
    });
  };

  const handleQuantityChange = (id, delta) => {
    setProducts(products.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return { ...item, quantity: newQty < 0 ? 0 : newQty };
      }
      return item;
    }));
  };

  const filteredProducts = selectedCategory === "All"
    ? products
    : products.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());

  const overallTotal = products.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="app-container">
      <h1>School Supplies Product Management App</h1>
      
      <div className="main-content-grid">
        <form onSubmit={handleAddProduct} className="product-form">
          <h2>Add New School Supply</h2>
          <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          
          <select name="category" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
            <option value="Writing Tools">Writing Tools</option>
            <option value="Paper & Notebooks">Paper & Notebooks</option>
            <option value="Electronics">Electronics</option>
            <option value="Art Supplies">Art Supplies</option>
          </select>

          <input type="text" name="image" placeholder="Image URL (Optional)" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} />
          <textarea name="description" placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          <input type="text" name="specification" placeholder="Specification" value={formData.specification} onChange={(e) => setFormData({...formData, specification: e.target.value})} />
          <input type="number" step="0.1" name="rating" placeholder="Rating (1-5)" value={formData.rating} onChange={(e) => setFormData({...formData, rating: e.target.value})} />
          <input type="number" name="price" placeholder="Price (₱)" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
          <input type="number" name="quantity" placeholder="Quantity" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} />

          <button type="submit" className="btn-primary">Add Product</button>
        </form>

        <div className="product-section">
          <div className="filter-container">
            <label><b>Filter by Category: </b></label>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="All">All Categories</option>
              <option value="Writing Tools">Writing Tools</option>
              <option value="Paper & Notebooks">Paper & Notebooks</option>
              <option value="Electronics">Electronics</option>
              <option value="Art Supplies">Art Supplies</option>
            </select>
          </div>

          <h2>Product List</h2>
          
          <div className="product-grid">
            {filteredProducts.map((product) => {
              const subtotal = product.price * product.quantity;
              const isLowStock = product.quantity < 5;

              return (
                <div key={product.id} className={`product-card ${isLowStock ? 'low-stock-card' : ''}`}>
                  <img src={product.image} alt={product.name} />
                  <h3>{product.name}</h3>
                  <p className="category-tag">{product.category}</p>
                  <p><b>Price:</b> ₱{product.price}</p>
                  
                  <p>
                    <b>Quantity:</b> {product.quantity} 
                    {isLowStock && <span className="low-stock-text"> (Low Stock!)</span>}
                  </p>

                  <p><b>Subtotal:</b> ₱{subtotal}</p>

                  <div className="qty-buttons">
                    <button onClick={() => handleQuantityChange(product.id, 1)}>+</button>
                    <button onClick={() => handleQuantityChange(product.id, -1)} disabled={product.quantity <= 0}>-</button>
                  </div>

                  <button onClick={() => setSelectedProduct(product)} className="btn-details">
                    View Details
                  </button>

                  <button 
                    disabled={product.quantity === 0}
                    onClick={() => alert(`Added ${product.name} to Cart!`)}
                    className="btn-cart"
                  >
                    {product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="overall-total">
            Overall Total Value: ₱{overallTotal.toLocaleString()}
          </div>
        </div>
      </div>

      {selectedProduct && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2>{selectedProduct.name}</h2>
            <img src={selectedProduct.image} alt={selectedProduct.name} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
            <p><b>Category:</b> {selectedProduct.category}</p>
            <p><b>Description:</b> {selectedProduct.description}</p>
            <p><b>Specification:</b> {selectedProduct.specification}</p>
            <p><b>Rating:</b> ⭐ {selectedProduct.rating}</p>
            <p><b>Price:</b> ₱{selectedProduct.price}</p>
            <p><b>Available Quantity:</b> {selectedProduct.quantity}</p>
            <button onClick={() => setSelectedProduct(null)} className="btn-primary">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;