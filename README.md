# 3D Logo Price Calculator

An interactive web application where customers can upload their logo designs, view real-time 3D previews, and get instant price estimates.

## Features

- 🖼️ Logo file upload and preview
- 🎨 Real-time 3D preview
- 📏 Customizable dimensions (in cm)
- 💰 Automatic price calculation
- 🔄 Interactive 3D view control
- 📊 Logo complexity analysis

## Technologies

- Next.js 15.2.0
- React 19
- Three.js
- TypeScript
- Tailwind CSS

## Installation

1. Clone the project:
```bash
git clone [repo-url]
cd 3d-website
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open in your browser:
```
http://localhost:3000
```

## Usage

1. Click "Upload Your Logo" button to select your logo file
2. View the 3D preview of the uploaded logo
3. Adjust dimensions (in cm)
4. View automatically calculated price
5. Rotate and zoom the 3D view using your mouse

## Pricing Logic

Price calculation is based on these factors:
- Base price: ₺100
- Size factor: Varies based on logo dimensions (maximum 1000 cm²)
- Complexity multiplier: Value between 1-5 based on logo color variety

## Development

### Project Structure

```
src/
├── app/
│   ├── layout.tsx    # Main page layout
│   ├── page.tsx      # Main page component
│   └── globals.css   # Global styles
├── components/
│   └── LogoPreview3D.tsx  # 3D preview component
```

### Key Components

- **LogoPreview3D**: Creates 3D logo preview using Three.js
- **Page**: Main application logic and user interface

## License

This project is licensed under the MIT License.

## Contact

For questions or feedback:
- Email: scngnr@gmail.com
- Website: [website]

---

# 3D Logo Fiyat Hesaplayıcı

3D Logo Fiyat Hesaplayıcı, müşterilerin logo tasarımlarını yükleyip gerçek zamanlı olarak 3D önizleme yapabilecekleri ve fiyat tahminini görebilecekleri interaktif bir web uygulamasıdır.

## Özellikler

- 🖼️ Logo dosyası yükleme ve önizleme
- 🎨 Gerçek zamanlı 3D önizleme
- 📏 Özelleştirilebilir boyutlar (cm cinsinden)
- 💰 Otomatik fiyat hesaplama
- 🔄 İnteraktif 3D görünüm kontrolü
- 📊 Logo karmaşıklık analizi

## Teknolojiler

- Next.js 15.2.0
- React 19
- Three.js
- TypeScript
- Tailwind CSS

## Kurulum

1. Projeyi klonlayın:
```bash
git clone [repo-url]
cd 3d-website
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

4. Tarayıcınızda açın:
```
http://localhost:3000
```

## Kullanım

1. "Logonuzu Yükleyin" butonuna tıklayarak logo dosyanızı seçin
2. Yüklenen logonun 3D önizlemesini görüntüleyin
3. Boyutları (cm) ayarlayın
4. Otomatik hesaplanan fiyatı görüntüleyin
5. 3D görünümü fare ile döndürüp yakınlaştırabilirsiniz

## Fiyatlandırma Mantığı

Fiyat hesaplaması şu faktörlere dayanır:
- Temel fiyat: ₺100
- Boyut faktörü: Logo boyutuna göre değişir (maksimum 1000 cm²)
- Karmaşıklık çarpanı: Logodaki renk çeşitliliğine göre 1-5 arası değer

## Geliştirme

### Proje Yapısı

```
src/
├── app/
│   ├── layout.tsx    # Ana sayfa düzeni
│   ├── page.tsx      # Ana sayfa bileşeni
│   └── globals.css   # Global stiller
├── components/
│   └── LogoPreview3D.tsx  # 3D önizleme bileşeni
```

### Önemli Bileşenler

- **LogoPreview3D**: Three.js kullanarak 3D logo önizlemesi oluşturur
- **Page**: Ana uygulama mantığı ve kullanıcı arayüzü

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## İletişim

Sorularınız veya geri bildirimleriniz için:
- Email: scngnr@gmail.com
- Website: [website]
