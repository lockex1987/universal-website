import NewsComment from '~/components/NewsComment.vue'


const NewsDetailApp = {
  components: {
    NewsComment,
  },

  data() {
    // Các biến isLogin, userLiked, likesCount được định nghĩa ở resources/views/pages/newsDetail/newsDetail.blade.php
    return {
      // Người dùng đã login chưa
      isLogin: isLogin,

      // Người dùng đã like tin tức chưa
      userLiked: userLiked,

      // Số like của tin tức
      likesCount: likesCount,
    }
  },

  methods: {
    /**
     * Like tin tức.
     */
    async likeNews(newsId) {
      const params = {
        newsId,
      }
      const { data } = await axios.post('/like-news', params)
      this.likesCount = data.likes_count
      this.userLiked = true
    },

    /**
     * Bỏ like tin tức.
     */
    async unlikeNews(newsId) {
      const params = {
        newsId,
      }
      const { data } = await axios.post('/unlike-news', params)
      this.likesCount = data.likes_count
      this.userLiked = false
    },
  },
}


// Chờ cho Bootstrap load xong, không thì bị lỗi "t.attr(...).tooltip is not a function"
window.addEventListener('load', () => {
  Vue.createApp(NewsDetailApp).mount('#app')
})


/**
 * Lấy danh sách tin tức liên quan.
 */
async function getRelatedNewsList() {
  const url = '/tin-tuc/relate/' + currentNewsId
  const data = await fetch(url).then(resp => resp.text())
  document.querySelector('#relatedList').innerHTML = data
}

getRelatedNewsList()
