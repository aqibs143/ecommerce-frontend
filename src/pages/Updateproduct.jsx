import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Updateproduct() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const prod = state?.product || {};

  const [name, setName]         = useState(prod.name || '');
  const [description, setDescription] = useState(prod.description || '');
  const [price, setPrice]       = useState(prod.price?.toString() || '');
  const [image, setImage]       = useState(prod.image || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8080/updateProduct', {
        id: prod.id, name, description, price: parseInt(price,10), image
      })
      .then(() => { alert('Product updated!'); navigate('/admin_page'); })
      .catch(() => alert('Error updating product'));
  };

  return (
    <div className="container">
      <form className="form-container" onSubmit={handleSubmit}>
        <h2>Update Product</h2>
        <div className="form-group">
          <label>Product Name:</label>
          <input type="text" value={name} onChange={e=>setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <input type="text" value={description} onChange={e=>setDescription(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Price:</label>
          <input type="number" value={price} onChange={e=>setPrice(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Image URL:</label>
          <input type="text" value={image} onChange={e=>setImage(e.target.value)} required />
        </div>
        <button className="btn btn-primary" type="submit">Update Product</button>
      </form>
    </div>
  );
}
