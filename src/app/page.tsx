

'use client';

import { useState } from 'react';
import Image from 'next/image';
import LogoPreview3D from '../components/LogoPreview3D';
import Link from 'next/link';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [cmDimensions, setCmDimensions] = useState({ width: 0, height: 0 });
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
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image src="/logo.png" alt="3D Logo Master" width={100} height={100} />
              <div>
                <h1 className="text-xl font-bold text-gray-900">3D Logo Master</h1>
                <p className="text-sm text-gray-600">Profesyonel 3D Logo Çözümleri</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600">Ana Sayfa</Link>
              <Link href="/hizmetler" className="text-gray-700 hover:text-blue-600">Hizmetler</Link>
              <Link href="/portfolyo" className="text-gray-700 hover:text-blue-600">Portfolyo</Link>
              <Link href="/iletisim" className="text-gray-700 hover:text-blue-600">İletişim</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <select className="text-sm border rounded px-2 py-1">
                <option value="tr">Türkçe</option>
                <option value="en">English</option>
              </select>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Teklif Al
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">3D Logo Fiyat Hesaplayıcı</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              20 yıllık tecrübemiz ve son teknoloji ekipmanlarımızla, markanızı üç boyutlu dünyaya taşıyoruz.
              Özel tasarım 3D logolarımız ile işletmenize profesyonel bir görünüm kazandırın.
            </p>
          </div>
          
          {/* Existing calculator content */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Logonuzu Yükleyin
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border rounded"
            />
          </div>

        {preview && (
          <div className="flex gap-8">
            <div className="flex-1">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">3D Önizleme</h2>
                <LogoPreview3D 
                  imageUrl={preview} 
                  width={cmDimensions.width} 
                  height={cmDimensions.height}
                  glowColor={glowColor}
                  glowIntensity={glowIntensity}
                />
              </div>
            </div>

            <div className="w-96 sticky top-8">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="space-y-6">
                  <div className="pb-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold mb-4">Görünüm Ayarları</h2>
                    <div className="space-y-4">
                      <div>
                        <p className="font-medium mb-2">Yazı Rengi:</p>
                        <input 
                          type="color" 
                          value={glowColor}
                          onChange={(e) => handleGlowColorChange(e.target.value)}
                          className="w-full h-8"
                        />
                      </div>
                      
                      <div>
                        <p className="font-medium mb-2">Parlaklık:</p>
                        <input 
                          type="range" 
                          min="0.5" 
                          max="3" 
                          step="0.1"
                          value={glowIntensity}
                          onChange={(e) => handleGlowIntensityChange(e.target.value)}
                          className="w-full"
                        />
                        <p className="text-sm text-gray-600 mt-1">{glowIntensity.toFixed(1)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pb-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold mb-4">Boyut ve Karmaşıklık</h2>
                    <div className="space-y-4">
                      <div>
                        <p className="font-medium mb-2">Boyutlar (cm):</p>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Genişlik</label>
                            <input
                              type="number"
                              min="0"
                              step="0.1"
                              value={cmDimensions.width}
                              onChange={(e) => handleDimensionChange('width', e.target.value)}
                              className="w-full p-2 border rounded"
                              placeholder="Genişlik (cm)"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Yükseklik</label>
                            <input
                              type="number"
                              min="0"
                              step="0.1"
                              value={cmDimensions.height}
                              onChange={(e) => handleDimensionChange('height', e.target.value)}
                              className="w-full p-2 border rounded"
                              placeholder="Yükseklik (cm)"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="font-medium">Karmaşıklık Puanı:</p>
                        <p>{complexity.toFixed(2)} / 5</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold mb-4">Tahmini Fiyat</h2>
                    <p className="text-3xl font-bold text-green-600">
                      ₺{price.toFixed(2)}
                    </p>
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <p>* Temel fiyat: ₺100</p>
                      <p>* Boyut faktörü: Boyutlara göre (cm²)</p>
                      <p>* Karmaşıklık çarpanı: {complexity.toFixed(2)}x</p>
                    </div>
                  </div>
                </div>
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