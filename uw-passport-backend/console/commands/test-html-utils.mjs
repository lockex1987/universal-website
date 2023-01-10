import { sanitizeHtml } from '#app/helpers/html-utils.mjs'

const testSanitizeHtml = () => {
  const a = [
    {
      input: "<div><script>alert('xss!');</sc" + 'ript></div>',
      expected: '<div></div>',
    },
    {
      input: "<a onclick=\"alert('xss')\"></a>",
      expected: '<a></a>',
    },
    {
      input: "<a href=\"javascript:alert('xss')\"></a>",
      expected: '<a></a>',
    },
    {
      // Xâu rỗng
      input: '',
      expected: '',
    },
    {
      // Có thẻ script
      input: 'a <script>alert(1)</script> b',
      expected: 'a  b',
    },
    {
      // Có thẻ iframe
      input: '<iframe src="abc.html"/>',
      expected: '',
    },
    {
      // Có thẻ iframe
      input: '<p>abc<iframe//src=jAva&Tab;script:alert(3)>def</p>',
      expected: '<p>abc</p>',
    },
    {
      // Có thuộc tính onload
      input: '<svg onload="alert(document.cookie)"></svg>',
      expected: '', // <svg />
    },
    {
      // Thuộc tính src, style bình thường
      input: '<img src="abc.jpg" style="width: 100px"/>',
      expected: '<img src="abc.jpg" style="width: 100px;" />', // thêm dấu chấm phảy
    },
    {
      // Có thuộc tính onerror
      // Giá trị thuộc tính không trong dấu nhấy kép
      input: '<img src=x onerror=alert(1)//>',
      expected: '<img src="x" />',
    },
    {
      // Có thuộc tính onload
      // Thẻ g của SVG cũng k được
      input: '<svg><g/onload=alert(2)//<p>',
      expected: '', // <svg />
    },
    {
      // Sai cấu trúc
      input: '<TABLE><tr><td>HELLO</tr></TABL>',
      expected: '<table><tbody><tr><td>HELLO</td></tr></tbody></table>', // thêm tbody
    },
    {
      // Sai cấu trúc
      input: '<UL><li><A HREF=//google.com>click</UL>',
      expected: '<ul><li><a href="//google.com">click</a></li></ul>',
    },
    {
      // Nội dung có tiếng Việt
      input: 'Tiếng Việt, Nguyễn Văn Huyên, Cao Thị Thùy Dương, Nguyễn Anh Tuấn',
      expected: 'Tiếng Việt, Nguyễn Văn Huyên, Cao Thị Thùy Dương, Nguyễn Anh Tuấn',
    },
    {
      // XHTML
      input: `<select name="pet" size="3" multiple>
                <option selected>mouse</option>
                <option>bird</option>
                <option>cat</option>
              </select>`,
      expected: '',
    },
    {
      // XHTML
      input: '<p></p><p><br /></p>',
      expected: '<p></p><p><br /></p>',
    },
    {
      // Thực hiện JS bằng thuộc tính href của thẻ a
      input: '<a href="javascript:alert(1);">Link 1</a><a href="http://vnexpress.net">Link 2</a>',
      expected: '<a>Link 1</a><a href="http://vnexpress.net">Link 2</a>',
    },
    {
      // Thẻ form
      input: '<form><math><mtext><form><mglyph><style></math><img src onerror=alert(1)></style></mglyph></form></mtext></math></form>',
      expected: '',
    },
  ]

  a.forEach(({ input, expected }) => {
    const actual = sanitizeHtml(input)
    if (actual != expected) {
      console.log(input, actual, expected)
    }
  })
}

testSanitizeHtml()
