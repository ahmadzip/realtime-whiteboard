# Realtime Whiteboard

Realtime whiteboard adalah aplikasi yang memungkinkan pengguna untuk menggambar bersama secara real time. Aplikasi ini menggunakan Node.js dan Socket.io untuk komunikasi antara server dan klien.

## Frontend

Frontend aplikasi ini ditulis menggunakan HTML, CSS, dan JavaScript. Untuk menggambar, aplikasi ini menggunakan elemen canvas.

[frontend by codingnepalweb](https://www.codingnepalweb.com/build-drawing-app-html-canvas-javascript/)

## Backend

Backend aplikasi ini ditulis menggunakan Node.js dan Socket.io. Socket.io digunakan untuk komunikasi antara server dan klien.

## Cara kerja

Saat pengguna mulai menggambar, server akan menerima informasi tentang gambar yang sedang digambar. Server kemudian akan mengirimkan informasi tersebut ke semua klien yang terhubung. Setiap klien akan menggambar informasi yang diterima dari server.

## Instalasi

Untuk menginstal aplikasi ini, Anda perlu menginstal [Node.js](https://nodejs.org/en) dan NPM. Setelah itu, Anda dapat menjalankan perintah berikut untuk menginstal aplikasi:
```bash
npm install
```

## Menjalankan aplikasi

Untuk menjalankan aplikasi, Anda dapat menjalankan perintah berikut:

```bash
npm start
```
Aplikasi akan berjalan di port 3000. Anda dapat membuka browser dan mengakses alamat http://localhost:3000 untuk menggunakan aplikasi.

[MIT](https://github.com/ahmadzip/realtime-whiteboard/blob/main/LICENSE)
