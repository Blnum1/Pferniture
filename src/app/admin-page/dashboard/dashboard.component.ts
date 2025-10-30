import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  summaryCards = [
    { title: 'ยอดขายวันนี้', value: '12,540฿', bg: 'bg-primary', icon: 'bi bi-cash-stack' },
    { title: 'คำสั่งซื้อใหม่', value: '27', bg: 'bg-success', icon: 'bi bi-cart-check' },
    { title: 'ลูกค้าใหม่', value: '5', bg: 'bg-warning', icon: 'bi bi-people' },
    { title: 'สินค้าคงเหลือน้อย', value: '12', bg: 'bg-danger', icon: 'bi bi-exclamation-circle' },
  ];

  bestSellers = [
    { name: 'โต๊ะไม้โอ๊ค', sold: 48, price: 3500, image: 'assets/image/oakTable.jpg' },
    { name: 'เก้าอี้วินเทจ', sold: 32, price: 2200, image: 'assets/image/winTable.jpg' },
    { name: 'โซฟาผ้าเทา', sold: 29, price: 7200, image: 'assets/image/sofaFabic.jpg' },
    { name: 'ชั้นวางของไม้', sold: 21, price: 1900, image: 'assets/image/shelfwood.jpg' },
    { name: 'โคมไฟโมเดิร์น', sold: 17, price: 1400, image: 'assets/image/lamp.jpg' }
  ];

  recentOrders = [
    { id: 101, customer: 'สมชาย ใจดี', total: 7200, status: 'ชำระแล้ว' },
    { id: 102, customer: 'ศิริพร พันดี', total: 1900, status: 'รอดำเนินการ' },
    { id: 103, customer: 'วรัญญา จิตสดใส', total: 5800, status: 'ชำระแล้ว' }
  ];

  recentReviews = [
    { name: 'นันทภพ', stars: 5, comment: 'สินค้าดีมาก จัดส่งไว', avatar: 'assets/image/githubprofile.png' },
    { name: 'จิรยุทธ์', stars: 4, comment: 'เก้าอี้สวย แข็งแรง', avatar: 'assets/image/githubprofile.png' },
    { name: 'พิมพ์ชนก', stars: 5, comment: 'บริการดีสุดๆ 👍', avatar: 'assets/image/githubprofile.png' }
  ];

  ngOnInit(): void {
    this.renderSalesChart();
  }

  renderSalesChart() {
    const ctx = document.getElementById('salesChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.'],
        datasets: [{
          label: 'ยอดขาย (บาท)',
          data: [15000, 20000, 18000, 25000, 32000, 29000],
          borderColor: '#007bff',
          backgroundColor: 'rgba(0,123,255,0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }
}
