<template>
  <div class="comments">
    <div class="mb-3 font-weight-500 text-muted">
      Bình luận
    </div>

    <div v-show="checkLoginStatus == 2">
      <a :href="loginLink">
        <div
          class="rounded bg-light p-2 d-flex align-items-center justify-content-center"
          style="height: 100px"
        >
          Đăng nhập để thêm bình luận
        </div>
      </a>
    </div>

    <!-- Nếu dùng v-show thì bị lỗi "t.attr(...).tooltip is not a function", phải sử dụng v-if -->
    <div v-show="checkLoginStatus == 1">
      <div class="mb-3 d-flex align-items-center">
        <img
          :src="avatar"
          class="avatar me-2 rounded-circle"
          onerror="this.src = '/images/user-avatar.png'"
        />

        <span class="font-weight-500">
          {{userFullName}}
        </span>
      </div>

      <div class="mb-3">
        <html-editor
          ref="commentEditor"
          placeholder="Nội dung bình luận"
        />
      </div>

      <div>
        <button
          type="button"
          class="btn btn-primary btn-sm"
          @click="addComment()"
        >
          Thêm bình luận
          <span
            class="la la-spinner la-spin"
            v-show="isSaving"
          ></span>
        </button>

        <button
          type="button"
          class="btn btn-outline-secondary btn-sm ms-3"
          @click="cancelCommentForm()"
        >
          Hủy bỏ
        </button>
      </div>
    </div>

    <!-- Danh sách comment (cấp 1) -->
    <div
      v-for="comment in commentList"
      :key="comment.id"
      class="mt-5"
    >
      <!-- Tên, thời gian, nội dung -->
      <div class="mb-3 d-flex align-items-center">
        <img
          :src="comment.user.avatar"
          class="avatar me-2 rounded-circle"
          onerror="this.src = '/images/user-avatar.png'"
        />

        <span class="font-weight-500">
          {{comment.user.full_name}}
        </span>

        <i
          class="fa fa-circle ms-3"
          style="font-size: 0.25rem; color: #bdbdbd;"
        ></i>

        <span class="text-muted font-italic font-size-0.875 ms-3">
          {{relativeTime(comment.created_at)}}
        </span>
      </div>

      <div v-html="comment.content"></div>

      <div
        v-show="checkLoginStatus == 1 && !comment.showReply"
        class="mt-3"
      >
        <a
          href="#"
          class="text-decoration-none"
          @click.prevent="openReplyForm(comment)"
        >
          <i class="la la-reply"></i>
          Trả lời
        </a>
      </div>

      <div class="border-start ps-5">
        <div
          v-show="comment.showReply"
          class="mt-5"
        >
          <div class="mb-3 d-flex align-items-center">
            <img
              :src="avatar"
              class="avatar me-2 rounded-circle"
              onerror="this.src = '/images/user-avatar.png'"
            />

            <span class="font-weight-500">
              {{userFullName}}
            </span>
          </div>

          <div class="mb-3">
            <html-editor
              :ref="'replyEditor' + comment.id"
              placeholder="Nội dung trả lời"
            />
          </div>

          <div>
            <button
              type="button"
              class="btn btn-primary btn-sm"
              @click="addReply(comment)"
            >
              <i class="la la-reply"></i>
              Trả lời
            </button>

            <button
              type="button"
              class="btn btn-outline-secondary btn-sm ms-3"
              @click="cancelReplyForm(comment)"
            >
              Hủy bỏ
            </button>
          </div>
        </div>

        <!-- Danh sách trả lời (cấp 2) -->
        <div
          v-for="reply in comment.replies"
          :key="reply.id"
          class="mt-5"
        >
          <!-- Tên, thời gian, nội dung -->
          <!-- Tương tự phần cấp 1 -->
          <div class="mb-3 d-flex align-items-center">
            <img
              :src="reply.user.avatar"
              class="avatar me-2 rounded-circle"
              onerror="this.src = '/images/user-avatar.png'"
            />

            <span class="font-weight-500">
              {{reply.user.full_name}}
            </span>

            <i
              class="fa fa-circle ms-3"
              style="font-size: 0.25rem; color: #bdbdbd;"
            ></i>

            <span class="text-muted font-italic font-size-0.875 ms-3">
              {{relativeTime(reply.created_at)}}
            </span>
          </div>

          <div v-html="reply.content"></div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import HtmlEditor from '~/components/HtmlEditor.vue'
import { getToken, deleteToken } from '~/helpers/sso.js'

// Vue ESLint is not applied
export default {
  components: {
    HtmlEditor,
  },

  props: {
    // ID tin tức
    newsId: Number,
  },

  data() {
    return {
      // Danh sách bình luận
      commentList: null,

      // Đang thêm mới bình luận
      isSaving: false,

      // Kiểm tra trạng thái đăng nhập (0: chưa kiểm tra, 1: đã đăng nhập, 2: chưa đăng nhập)
      checkLoginStatus: 0,

      // Tên và ảnh đại diện của người dùng đang đăng nhập
      userFullName: '',
      avatar: '',

      // Link đăng nhập
      loginLink: SSO_PASSPORT_URL + '/login?app=' + SSO_CONSUMER_DOMAIN + '&returnLink=' + encodeURIComponent(window.location.href),
    }
  },

  mounted() {
    // Nếu chưa load xong Bootstrap thì ra undefined
    // console.log($(document).tooltip);

    this.getCommentList()

    // TODO: Đã có trường isLogin rồi
    this.checkLogin()
  },

  methods: {
    /**
     * Kiểm tra người dùng đã đăng nhập hay chưa.
     */
    async checkLogin() {
      const token = getToken()

      let userFullName = ''
      let avatar = ''
      if (token) {
        const { data } = await axios.get('/me') // có thể gọi GET /me ở sso-passport
        if (data.code == 0) {
          const user = data.user
          userFullName = user.full_name
          avatar = user.avatar
        } else {
          // Xóa token đã hết hạn
          // deleteToken();
        }
      }

      this.userFullName = userFullName
      this.avatar = avatar

      this.checkLoginStatus = userFullName ? 1 : 2
    },

    /**
     * Hủy form thêm bình luận.
     */
    cancelCommentForm() {
      this.$refs.commentEditor.setCode('<p><br></p>')
      CV.clearErrorMessages(this.$el)
    },

    /**
     * Lấy danh sách comment.
     */
    async getCommentList() {
      const params = {
        newsId: this.newsId,
      }
      const { data } = await axios.get('/api/news/comment', { params })
      const list = data ?? []

      // Sắp xếp danh sách bình luận cấp 1 theo thời gian giảm dần (mới nhất ở đầu)
      // Sắp xếp danh sách bình luận cấp 2 theo thời gian tăng dần (để nắm được luồng thảo luận)
      const level1List = list
        .filter(level1 => !level1.parent_id)
        .map(level1 => {
          const level2List = list.filter(level2 => level2.parent_id == level1.id).reverse()
          return {
            ...level1,
            showReply: false,
            replies: level2List,
          }
        })

      this.commentList = level1List
    },

    /**
     * Thêm comment.
     */
    async addComment() {
      if (this.isSaving) {
        return
      }

      const contentHtml = this.$refs.commentEditor.getCode().trim()
      const contentText = $('<div>' + contentHtml + '</div>')[0].textContent.trim()
      if (!contentText) {
        noti.error('Vui lòng nhập nội dung bình luận')
        return
      }
      if (contentHtml.length > 2000) {
        noti.error('Nội dung bình luận quá dài')
        return
      }

      this.isSaving = true
      const params = {
        newsId: this.newsId,
        content: contentHtml,
        parentId: null,
      }
      const { data } = await axios.post('/api/news/comment', params)
      this.isSaving = false

      if (data.code == 0) {
        noti.success('Thêm bình luận thành công')
        this.cancelCommentForm()
        this.getCommentList()
      } else if (data.code == 1) {
        noti.error(data.message)
      }
    },

    /**
     * Trả lời.
     */
    async addReply(comment) {
      const contentHtml = this.$refs['replyEditor' + comment.id].getCode().trim()
      const contentText = $('<div>' + contentHtml + '</div>')[0].textContent.trim()
      if (!contentText) {
        noti.error('Vui lòng nhập nội dung trả lời')
        return
      }
      if (contentHtml.length > 2000) {
        noti.error('Nội dung trả lời quá dài')
        return
      }

      const params = {
        newsId: this.newsId,
        content: contentHtml,
        parentId: comment.id,
      }
      const { data } = await axios.post('/api/news/comment', params)
      if (data.code == 0) {
        this.cancelReplyForm(comment)
        this.getCommentList()
      }
    },

    /**
     * Hiển thị trả lời.
     */
    openReplyForm(comment) {
      comment.showReply = true
      this.$nextTick(() => {
        this.$refs['replyEditor' + comment.id].focus()
      })
    },

    /**
     * Hủy bỏ trả lời.
     */
    cancelReplyForm(comment) {
      comment.showReply = false
      this.$refs['replyEditor' + comment.id].setCode('<p><br></p>')
    },

    /**
     * Thời gian tương đối.
     */
    relativeTime(datetime) {
      const relativeTime = moment(datetime)

      const now = moment()
      if (now.diff(relativeTime, 'days', true) >= 1) {
        return relativeTime.format('DD/MM/YYYY') + ' lúc ' + relativeTime.format('HH:mm')
      } else {
        return relativeTime.fromNow()
      }
    },
  },
}
</script>
