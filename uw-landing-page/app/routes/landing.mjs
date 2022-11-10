// Sử dụng ở services.edge
const services = [
  {
    icon: '<span class="la la-heart"></span>',
    name: 'Phát triển Web',
    description: 'Các ứng dụng cross-platform trên cả mobile và desktop',
  },
  {
    icon: '<span class="la la-apple-alt"></span>',
    name: 'Thiết kế UI/UX',
    description: 'Giao diện nhẹ, trang nhã, hiện đại, thuận tiện cho người dùng',
  },
  {
    icon: '<span class="la la-lemon"></span>',
    name: 'Tăng hiệu năng',
    description: 'Giúp ứng dụng của bạn nhanh hơn, load trang nhanh hơn',
  },
  {
    icon: '<span class="la la-shield-alt"></span>',
    name: 'Kiểm tra ATTT',
    description: 'Kiểm tra các lỗi ATTT thông dụng theo checklist',
  },
]

// Sử dụng ở porfolio.edge
const products = [
  {
    name: 'Rename',
    description: 'Chuẩn hóa, đổi tên file hàng loạt. Nén và giải nén các file truyện tranh.',
    technologies: [
      'Bash',
      'PHP Phar',
      'Deno',
    ],
    demoLink: 'https://lockex1987.com/posts/php%20-%20rename/',
    screenshot: '/static/images/portfolio/rename.png',
  },
  {
    name: 'Gia đình tôi',
    description: 'Cây phả hệ',
    technologies: [
      'JS',
    ],
    demoLink: 'https://lockex1987.com/posts/project%20-%20my%20family/',
    screenshot: '/static/images/portfolio/my_family.png',
  },
  {
    name: 'Three.js',
    description: 'Tự tạo ebook',
    technologies: [
      'Three.js',
    ],
    demoLink: 'https://github.com/lockex1987/learn-threejs',
    screenshot: '/static/images/portfolio/learn_three.js.png',
  },
  {
    name: 'Lịch của tôi',
    description: 'Âm lịch, thông báo ngày lễ / ngày sinh nhật.',
    technologies: [
      'Progressive Web App',
      'PWA',
      'Push notification',
    ],
    demoLink: 'https://lockex1987.com/posts/project%20-%20lich%20cua%20toi/',
    screenshot: '/static/images/portfolio/lich_cua_toi.png',
  },
  {
    name: 'Batch downloader',
    description: 'Tiện ích download file hàng loạt, php, curl',
    technologies: [
      'Web extension',
    ],
    demoLink: 'https://lockex1987.com/posts/webext%20-%20batch%20downloader/',
    screenshot: '/static/images/portfolio/batch_downloader.png',
  },
  {
    name: 'Cloud downloader',
    description: 'usercloud, zippyshare, fshare, mega, tự động điều chỉnh độ cao của textarea cho khớp với nội dung, auto grow, scrollHeight',
    technologies: [
      'Web extension',
    ],
    demoLink: 'https://lockex1987.com/posts/webext%20-%20cloud%20downloader/',
    screenshot: '/static/images/portfolio/cloud_downloader.png',
  },
  {
    name: 'Media player',
    description: 'audio, video, subtitle, srt, lyric, lrc, karaoke, svg, fullscreen, vue, lock screen orientation',
    technologies: [
      'JS',
      'Vue',
    ],
    demoLink: 'https://lockex1987.com/posts/project%20-%20media%20player/',
    screenshot: '/static/images/portfolio/media_player.png',
  },
  {
    name: 'Tiện ích download subtitle từ YouTube',
    description: 'download youtube subtitle, closed caption, xml parser, import es6 module, web_accessible_resources',
    technologies: [
      'Web extension',
    ],
    demoLink: 'https://lockex1987.com/posts/webext%20-%20youtube%20subtitle%20downloader/',
    screenshot: '/static/images/portfolio/youtube_subtitle_downloader.png',
  },
  {
    name: 'SSO Passport',
    description: 'Đăng nhập tập trung',
    technologies: [
      'Laravel',
      'Redis',
    ],
    demoLink: 'https://github.com/lockex1987/sso-passport',
    screenshot: '/static/images/portfolio/sso_passport.png',
  },
  {
    name: 'SSO Admin',
    description: 'Các chức năng thường gặp',
    technologies: [
      'Laravel',
      'Vue',
    ],
    demoLink: 'https://github.com/lockex1987/sso-admin',
    screenshot: '/static/images/portfolio/sso_admin.png',
  },
  {
    name: 'Landing Page',
    description: 'Trang landing page, tin tức, sản phẩm',
    technologies: [
      'AdonisJS',
      'Node.js',
      'TypeScript',
    ],
    demoLink: 'https://github.com/lockex1987/landing-page',
    screenshot: '/static/images/portfolio/landing_page.png',
  },
  {
    name: 'Websocket server',
    description: 'Chat, truyền file',
    technologies: [
      'WebSocket',
      'WebRTC',
      'Deno',
      'TypeScript',
    ],
    demoLink: 'https://github.com/lockex1987/websocket-server',
    screenshot: '/static/images/portfolio/websocket_server.png',
  },
]

// Sử dụng ở clients.edge
const clients = [
  '/static/images/clients/bkav.png',
  '/static/images/clients/nongnghiep.png',
  '/static/images/clients/phapluat.png',
  '/static/images/clients/quandoinhandan.png',
  '/static/images/clients/sacombank.png',
  '/static/images/clients/vtv.png',
]

// Sử dụng ở testimonials.edge
const testimonials = [
  {
    text: 'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean.',
    author: 'Jean Smith',
    avatar: '/static/images/testimonials/facebook-avatar.jpg',
  },
  {
    text: 'A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth.',
    author: 'Carl Spencer',
    avatar: '/static/images/testimonials/user-avatar.png',
  },
  {
    text: 'Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life One day however a small line of blind text by the name of Lorem Ipsum decided to leave for the far World of Grammar.',
    author: 'Ryan Peters',
    avatar: '/static/images/testimonials/user-avatar.png',
  },
]

// Sử dụng ở about.edge
const employees = [
  {
    avatar: '/static/images/employees/nvh.jpg',
    name: 'Nguyễn Văn Huyên',
    position: 'Developer',
  },
  {
    avatar: '/static/images/employees/nat.jpg',
    name: 'Nguyễn Anh Tuấn',
    position: 'CEO',
  },
  {
    avatar: '/static/images/employees/cttd.jpg',
    name: 'Cao Thị Thùy Dương',
    position: 'Tester',
  },
]

export default (request, response) => {
  response.render('pages/landing/landing', {
    request,
    services,
    products,
    clients,
    testimonials,
    employees,
  })
}
