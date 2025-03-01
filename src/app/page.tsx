

'use client';

import { useState } from 'react';
import Image from 'next/image';
import LogoPreview3D from '../components/LogoPreview3D';
import Link from 'next/link';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [cmDimensions, setCmDimensions] = useState({ width: 250, height: 50 });
  const [price, setPrice] = useState<number>(0);
  const [complexity, setComplexity] = useState<number>(1);
  const [glowColor, setGlowColor] = useState<string>('#00ffff');
  const [glowIntensity, setGlowIntensity] = useState<number>(1.5);

  const calculateComplexity = (imageData: ImageData) => {
    let uniqueColors = new Set();
    for (let i = 0; i < imageData.data.length; i += 4) {
      const rgba = `${imageData.data[i]},${imageData.data[i + 1]},${imageData.data[i + 2]},${imageData.data[i + 3]}`;
      uniqueColors.add(rgba);
    }
    return Math.min(uniqueColors.size / 100, 5); // Normalize complexity between 1-5
  };

  const handleDimensionChange = (dimension: 'width' | 'height', value: string) => {
    const numValue = parseFloat(value) || 0;
    setCmDimensions(prev => ({
      ...prev,
      [dimension]: numValue
    }));

    // Update price calculation with new dimensions
    const areaCm = cmDimensions.width * cmDimensions.height;
    const basePrice = 100;
    const maxAreaCm = 1000; // 1000 cm² (e.g., 25cm x 40cm)
    const sizeFactor = Math.min(areaCm / maxAreaCm, 2);
    const finalPrice = basePrice * (1 + sizeFactor) * complexity;
    setPrice(Math.round(finalPrice));
  };

  const handleGlowColorChange = (value: string) => {
    setGlowColor(value);
  };

  const handleGlowIntensityChange = (value: string) => {
    setGlowIntensity(parseFloat(value));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setPreview(dataUrl);
        
        const img = document.createElement('img');
        img.onerror = () => {
          console.error('Error loading image');
        };
        img.onload = () => {
          setDimensions({
            width: img.width,
            height: img.height
          });
          
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, img.width, img.height);
            const complexityFactor = calculateComplexity(imageData);
            setComplexity(complexityFactor);
          }
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image src="/logo.png" alt="3D Logo Master" width={80} height={80} className="object-contain" />
              <div>
                <h1 className="text-lg font-bold text-gray-900">3D Logo Master</h1>
                <p className="text-sm text-gray-600">Profesyonel 3D Logo Çözümleri</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-sm text-gray-700 hover:text-blue-600 transition-colors">Ana Sayfa</Link>
              <Link href="/hizmetler" className="text-sm text-gray-700 hover:text-blue-600 transition-colors">Hizmetler</Link>
              <Link href="/portfolyo" className="text-sm text-gray-700 hover:text-blue-600 transition-colors">Portfolyo</Link>
              <Link href="/iletisim" className="text-sm text-gray-700 hover:text-blue-600 transition-colors">İletişim</Link>
              <select className="text-sm border rounded px-2 py-1 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="tr">Türkçe</option>
                <option value="en">English</option>
              </select>
              <button className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Teklif Al
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-24 p-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto mt-10">
          
          {!preview ? (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 transition-all duration-300 hover:shadow-xl">
              <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                Logonuzu Yükleyin
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors cursor-pointer focus:outline-none focus:border-blue-500"
              />
            </div>
          ) : null}
          
          {preview && (
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                      3D Önizleme
                    </h2>
                  </div>
                  <LogoPreview3D 
                    imageUrl={preview} 
                    width={cmDimensions.width} 
                    height={cmDimensions.height}
                    glowColor={glowColor}
                    glowIntensity={glowIntensity}
                  />
                </div>
              </div>
              <div className="w-96 bg-white rounded-xl shadow-lg p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Görünüm Ayarları</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Işıltı Rengi</label>
                      <input
                        type="color"
                        value={glowColor}
                        onChange={(e) => handleGlowColorChange(e.target.value)}
                        className="w-full h-10 p-1 rounded border border-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Işıltı Yoğunluğu</label>
                      <input
                        type="range"
                        min="0"
                        max="3"
                        step="0.1"
                        value={glowIntensity}
                        onChange={(e) => handleGlowIntensityChange(e.target.value)}
                        className="w-full"
                      />
                      <div className="text-sm text-gray-500 mt-1">{glowIntensity.toFixed(1)}</div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Boyut ve Fiyat</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Genişlik (cm)</label>
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          value={cmDimensions.width}
                          onChange={(e) => handleDimensionChange('width', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Yükseklik (cm)</label>
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          value={cmDimensions.height}
                          onChange={(e) => handleDimensionChange('height', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Hesaplanan Fiyat:</span>
                        <span className="text-2xl font-bold text-blue-600">{price} ₺</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">*Fiyat, boyut ve karmaşıklığa göre hesaplanır</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6 flex gap-4">
                  <button
                    onClick={() => {
                      setPreview('');
                      setFile(null);
                      setCmDimensions({ width: 0, height: 0 });
                      setPrice(0);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Yeni Logo
                  </button>
                  <button
                    onClick={() => {
                      // Implement order logic here
                      alert('Sipariş talebi alındı!');
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Sipariş Ver
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">3D Logo Master</h3>
              <p className="text-gray-400 text-sm">
                2003 yılından beri, yenilikçi 3D logo tasarım çözümleri sunuyoruz.
                ISO 9001:2015 sertifikalı üretim süreçlerimiz ile kaliteli hizmet garantisi veriyoruz.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">İletişim</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>Merkez: İstanbul, Türkiye</li>
                <li>Tel: +90 (212) 555 0123</li>
                <li>E-posta: info@3dlogomaster.com</li>
                <li>Çalışma Saatleri: Pzt-Cuma 09:00-18:00</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Hızlı Bağlantılar</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li><Link href="/hakkimizda" className="hover:text-white">Hakkımızda</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link href="/kariyer" className="hover:text-white">Kariyer</Link></li>
                <li><Link href="/gizlilik" className="hover:text-white">Gizlilik Politikası</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Takip Edin</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-facebook"></i></a>
                <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-twitter"></i></a>
                <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-instagram"></i></a>
                <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-linkedin"></i></a>
              </div>
              <div className="mt-4">
                <p className="text-gray-400 text-sm">ISO 9001:2015 Sertifikalı</p>
                <Image src="/iso-certified.svg" alt="ISO 9001:2015" width={60} height={60} />
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            © 2024 3D Logo Master. Tüm hakları saklıdır.
          </div>
        </div>
      </footer>
    </div>
  );
}