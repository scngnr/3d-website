

'use client';

import { useState } from 'react';
import Image from 'next/image';
import LogoPreview3D from '../components/LogoPreview3D';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [cmDimensions, setCmDimensions] = useState({ width: 0, height: 0 });
  const [price, setPrice] = useState<number>(0);
  const [complexity, setComplexity] = useState<number>(1);

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
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">3D Logo Fiyat Hesaplayıcı</h1>
        
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
                />
              </div>
            </div>

            <div className="w-96 sticky top-8">
              <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Özellikler</h2>
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
        )}
      </div>
    </main>
  );
}
