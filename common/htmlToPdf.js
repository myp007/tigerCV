// 导出页面为PDF格式
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'

//导入/components/Message/index.js

export default {
  install (Vue, options) {
    Vue.prototype.getPdf = function (htmlTitle, isDownload = true) {
      return new Promise((resolve, reject) => {
        var title = htmlTitle //DPF标题
        console.log(document.querySelector('#pdfDom'))

        html2Canvas(document.querySelector('#pdfDom'), {
          allowTaint: false,
          taintTest: false,
          useCORS: true,
          logging: true,
          // scrollY: 0,
          // scrollX: 0,
          //foreignObjectRendering: true, // 是否在浏览器支持的情况下使用ForeignObject渲染
          //width:960,
          //height:5072,
          dpi: window.devicePixelRatio * 2, //将分辨率提高到特定的DPI 提高四倍
          scale: 4 //按比例增加分辨率
          // ignoreElements: (element) => {  // 忽略渲染元素（通过查询dom元素，不局限于类名查询）
          //     console.log(element.className)
          //   if (typeof(element.className) == "string" && element.className.indexOf('box') !== -1) {
          //       element.className = element.className.replace('box', '')
          //   }
          // }
        }).then(function (canvas) {
          let contentWidth = canvas.width
          let contentHeight = canvas.height
          let pageHeight = (contentWidth / 592.28) * 841.89
          let leftHeight = contentHeight
          let position = 0
          let imgWidth = 595.28
          let imgHeight = (592.28 / contentWidth) * contentHeight
          console.log('canvas.height', canvas.height)
          let pageData = canvas.toDataURL('image/jpeg', 1.0)
          let PDF = new JsPDF('', 'pt', 'a4')
          let imgData = ''
          if (leftHeight < pageHeight) {
            imgData = pageData
            PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
          } else {
            while (leftHeight > 0) {
              imgData = pageData
              PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
              leftHeight -= pageHeight
              position -= 841.89
              if (leftHeight > 0) {
                PDF.addPage()
              }
            }
          }
          //PDF.save(title + '.pdf')
          if (isDownload) {
            PDF.save(title + '.pdf')
          }
          var pdfData = PDF.output('datauristring') //获取base64Pdf
          resolve({ pdfData, imgData })
        })
      })
    }
  }
}
