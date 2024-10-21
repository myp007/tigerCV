/**
 * @author:cloud.lg
 * @date:2022.3.22
 * @description: 注册全局自定义指令
 */
import Vue from 'vue'
export default {
    'inputclass': {
        bind:function(el,bindings,vnode){
            el.querySelector('input').className = bindings.value
        }
    },
    "hideinput": {
        bind:function(el,bindings,vnode){
            el.querySelector('input').style.opacity = 0
        }
    },
    "drag": {
        inserted: function (el, binding) {
            let dragable = false
            el.onmousedown = function (e) {
                dragable = true
                const dx = e.clientX - el.offsetLeft
                const dy = e.clientY - el.offsetTop
            el.onmousemove = function (e) {
                if (dragable) {
                    e.stopPropagation()
                    const left = e.clientX - dx
                    const top = e.clientY - dy
                    el.style.left = left + 'px'
                    el.style.top = top + 'px'
                }
            }
            document.onmouseup = function (e) {
                dragable = false
                e.onmousemove = null
                document.mouseup = null
            }
            return false
            }
        },
    }
}