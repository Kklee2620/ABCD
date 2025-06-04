import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Box, Sphere, Cylinder, Text, Environment } from "@react-three/drei";
import * as THREE from "three";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// 3D Product Component with interactivity
const Product3D = ({ productType, color, rotation, scale }) => {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    if (meshRef.current && rotation) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  const material = new THREE.MeshStandardMaterial({ 
    color: color,
    metalness: 0.6,
    roughness: 0.4
  });

  const getGeometry = () => {
    switch (productType) {
      case 'laptop':
        return <Box ref={meshRef} args={[4, 0.3, 3]} material={material} scale={scale} />;
      case 'phone':
        return <Box ref={meshRef} args={[1.5, 0.2, 3]} material={material} scale={scale} />;
      case 'headphones':
        return <Sphere ref={meshRef} args={[1.5]} material={material} scale={scale} />;
      case 'watch':
        return <Cylinder ref={meshRef} args={[1, 1, 0.5]} material={material} scale={scale} />;
      default:
        return <Box ref={meshRef} args={[2, 2, 2]} material={material} scale={scale} />;
    }
  };

  return getGeometry();
};

// Product Showcase Component
const ProductShowcase = () => {
  const [selectedProduct, setSelectedProduct] = useState('laptop');
  const [selectedColor, setSelectedColor] = useState('#FF4500');
  const [isRotating, setIsRotating] = useState(true);
  const [productScale, setProductScale] = useState(1);

  const products = [
    { id: 'laptop', name: 'MacBook Pro', price: '29.999.000₫' },
    { id: 'phone', name: 'iPhone 15 Pro', price: '26.999.000₫' },
    { id: 'headphones', name: 'AirPods Pro', price: '5.999.000₫' },
    { id: 'watch', name: 'Apple Watch', price: '8.999.000₫' }
  ];

  const colors = [
    { name: 'Orange', value: '#FF4500' },
    { name: 'Silver', value: '#C0C0C0' },
    { name: 'Gold', value: '#FFD700' },
    { name: 'Black', value: '#222222' },
    { name: 'Blue', value: '#0066CC' },
    { name: 'Red', value: '#CC0000' }
  ];

  const currentProduct = products.find(p => p.id === selectedProduct);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-orange-500">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              <span className="text-orange-500">3D</span> Tech Store
            </h1>
            <div className="flex space-x-4">
              <button className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition">
                Đăng nhập
              </button>
              <button className="border-2 border-orange-500 text-orange-500 px-6 py-2 rounded-lg hover:bg-orange-500 hover:text-white transition">
                Giỏ hàng (0)
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* 3D Viewer Section */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-orange-100">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Trải nghiệm 3D
              </h2>
              <p className="text-gray-600">
                Xoay, phóng to và khám phá sản phẩm 360°
              </p>
            </div>
            
            {/* 3D Canvas */}
            <div className="h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden border-2 border-orange-200">
              <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <pointLight position={[-10, -10, -5]} intensity={0.5} />
                
                <Product3D 
                  productType={selectedProduct}
                  color={selectedColor}
                  rotation={isRotating}
                  scale={productScale}
                />
                
                <OrbitControls 
                  enablePan={true}
                  enableZoom={true}
                  enableRotate={true}
                  minDistance={3}
                  maxDistance={15}
                />
                
                <Environment preset="studio" />
              </Canvas>
            </div>

            {/* 3D Controls */}
            <div className="mt-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Điều khiển 3D:</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsRotating(!isRotating)}
                    className={`px-4 py-2 rounded-lg text-sm transition ${
                      isRotating 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {isRotating ? 'Dừng xoay' : 'Tự động xoay'}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kích thước: {productScale.toFixed(1)}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={productScale}
                  onChange={(e) => setProductScale(parseFloat(e.target.value))}
                  className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="space-y-8">
            {/* Product Selection */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-orange-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Chọn sản phẩm</h3>
              <div className="grid grid-cols-2 gap-4">
                {products.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => setSelectedProduct(product.id)}
                    className={`p-4 rounded-xl border-2 transition text-left ${
                      selectedProduct === product.id
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 hover:border-orange-300 hover:bg-orange-25'
                    }`}
                  >
                    <div className="font-semibold">{product.name}</div>
                    <div className="text-sm text-gray-600">{product.price}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-orange-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Chọn màu sắc</h3>
              <div className="grid grid-cols-3 gap-3">
                {colors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setSelectedColor(color.value)}
                    className={`p-3 rounded-lg border-2 transition flex items-center space-x-3 ${
                      selectedColor === color.value
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                      style={{ backgroundColor: color.value }}
                    ></div>
                    <span className="text-sm font-medium">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-orange-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {currentProduct?.name}
              </h2>
              <p className="text-3xl font-bold text-orange-500 mb-4">
                {currentProduct?.price}
              </p>
              
              <div className="space-y-4 text-gray-600 mb-6">
                <p>✨ Trải nghiệm 3D tương tác hoàn toàn mới</p>
                <p>🎨 Tùy chọn màu sắc đa dạng</p>
                <p>🔄 Xem 360° mọi góc độ</p>
                <p>📱 Tương thích mọi thiết bị</p>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-orange-500 text-white py-4 rounded-xl font-semibold text-lg hover:bg-orange-600 transition shadow-lg">
                  Thêm vào giỏ hàng
                </button>
                <button className="w-full border-2 border-orange-500 text-orange-500 py-3 rounded-xl font-semibold hover:bg-orange-500 hover:text-white transition">
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 border-2 border-orange-100">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tại sao chọn <span className="text-orange-500">3D Tech Store</span>?
            </h2>
            <p className="text-gray-600 text-lg">
              Trải nghiệm mua sắm công nghệ đỉnh cao với 3D tương tác
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-orange-50 border border-orange-200">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Xoay 360°</h3>
              <p className="text-gray-600">Khám phá sản phẩm từ mọi góc độ với công nghệ 3D tiên tiến</p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-orange-50 border border-orange-200">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Thay đổi màu sắc</h3>
              <p className="text-gray-600">Xem trước sản phẩm với nhiều màu sắc khác nhau trong thời gian thực</p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-orange-50 border border-orange-200">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Tương tác mượt mà</h3>
              <p className="text-gray-600">Phóng to, thu nhỏ và di chuyển sản phẩm một cách tự nhiên</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const helloWorldApi = async () => {
    try {
      const response = await axios.get(`${API}/`);
      console.log(response.data.message);
    } catch (e) {
      console.error(e, `errored out requesting / api`);
    }
  };

  useEffect(() => {
    helloWorldApi();
  }, []);

  return <ProductShowcase />;
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;