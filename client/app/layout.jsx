import './globals.css';

export const metadata = {
  title: 'GreenTrans DSS',
  description: 'Hệ thống hỗ trợ lựa chọn phương án vận chuyển xanh cho container xuất khẩu'
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
