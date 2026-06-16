import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div>
              <span className="badge">Logistics xanh • DSS • TP.HCM – ĐBSCL</span>
              <h1>Chọn phương án vận chuyển container xanh hơn.</h1>
              <p className="lead">
                GreenTrans DSS giúp so sánh đường bộ trực tiếp và phương án kết hợp đường bộ – đường thủy theo chi phí, thời gian, phát thải CO₂, khả năng gom hàng, độ linh hoạt và kết nối hạ tầng.
              </p>
              <div className="actions">
                <Link className="btn" href="/register">Bắt đầu tạo kịch bản</Link>
                <Link className="btn secondary" href="/login">Đăng nhập</Link>
              </div>
            </div>
            <div className="card soft">
              <h3>Mô hình khuyến nghị</h3>
              <div className="table-wrap" style={{ marginTop: 12 }}>
                <table style={{ minWidth: 0 }}>
                  <tbody>
                    <tr><td>Chi phí</td><td>30%</td></tr>
                    <tr><td>Thời gian</td><td>25%</td></tr>
                    <tr><td>CO₂</td><td>25%</td></tr>
                    <tr><td>Gom container</td><td>10%</td></tr>
                    <tr><td>Linh hoạt</td><td>5%</td></tr>
                    <tr><td>Hạ tầng</td><td>5%</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="muted" style={{ marginTop: 14 }}>
                Hệ thống kiểm tra thêm ràng buộc thời gian để tránh chọn phương án xanh nhưng không kịp lịch hạ container hoặc lịch tàu.
              </p>
            </div>
          </div>
        </section>

        <section className="section" id="features">
          <div className="container">
            <h2>Chức năng chính</h2>
            <div className="grid-3">
              <div className="card"><h3>Tạo kịch bản</h3><p className="muted">Nhập tuyến, TEU, deadline, phương án đường bộ và đường thủy.</p></div>
              <div className="card"><h3>Tính CO₂</h3><p className="muted">Ước tính phát thải theo TEU, cự ly và hệ số phát thải từng chặng.</p></div>
              <div className="card"><h3>Khuyến nghị</h3><p className="muted">Tính điểm đa tiêu chí và chọn phương án đáp ứng ràng buộc thời gian.</p></div>
            </div>
          </div>
        </section>

        <section className="section" id="model">
          <div className="container grid-2">
            <div>
              <h2>Luồng xử lý</h2>
              <p className="lead">Đầu vào → tính toán → chuẩn hóa điểm → tính điểm tổng hợp → kiểm tra deadline → khuyến nghị.</p>
            </div>
            <div className="card">
              <ol className="muted" style={{ lineHeight: 2 }}>
                <li>Nhập dữ liệu tuyến vận chuyển</li>
                <li>Nhập phương án đường bộ và đường thủy</li>
                <li>Điều chỉnh trọng số 6 tiêu chí</li>
                <li>Hệ thống tính chi phí, thời gian, CO₂</li>
                <li>Hiển thị bảng so sánh và khuyến nghị</li>
              </ol>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
