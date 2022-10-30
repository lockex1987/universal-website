<template>
  <textarea></textarea>
</template>


<script>
// Remove "parser": "@typescript-eslint/parser" in .eslintrc.json

export default {
  props: {
    placeholder: {
      type: String,
      default: 'Nhập nội dung',
    },
  },

  mounted() {
    this.initEditor()
  },

  methods: {
    setCode(code) {
      $(this.$el).summernote('code', code)
    },

    getCode() {
      return $(this.$el).summernote('code')
    },

    focus() {
      $(this.$el).summernote('focus')
    },

    /**
     * Khởi tạo HTML editor.
     */
    initEditor() {
      const vm = this

      $(this.$el).summernote({
        // Nếu editor ở trên Bootstrap modal thì phải thêm tùy chọn này
        dialogsInBody: true,
        dialogsFade: true,

        // Không kéo thả ảnh
        disableDragAndDrop: true,

        minHeight: 200,
        maxHeight: null, // tự động điều chỉnh độ dài theo nội dung
        placeholder: this.placeholder,
        lang: 'vi-VN', // tiếng Việt

        // Không check chính tả
        spellCheck: false,

        toolbar: [
          // ['style', ['style']],
          ['font', ['bold', 'italic', 'underline']], // , 'clear'
          // ['color', ['color']],
          // ['para', ['ul', 'ol', 'paragraph']],
          // ['table', ['table']],
          // ['insert', ['link', 'picture']],
          ['insert', ['link']],
          // ['view', ['fullscreen', 'codeview']]
        ],

        callbacks: {
          /**
           * Paste text bình thường (không ảnh, không định dạng).
           */
          onPaste: function (evt) {
            evt.preventDefault()
            const bufferText = ((evt.originalEvent || evt).clipboardData || window.clipboardData).getData('text')
            document.execCommand('insertText', false, bufferText)
            // $(vm.$el).summernote('insertText', bufferText);
          },
        },
      })
    },
  },
}
</script>
