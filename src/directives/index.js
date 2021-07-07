// 负责管理所有的自定义指令

export const imgerror = {
  // el 指令所在的元素
  inserted(el, binding) {
    // console.log(el, binding)
    el.onerror = function() {
      // console.log('图片加载失败了')
      el.src = binding.value
    }
  }
}
export const color = {
  inserted(el, binding) {
    el.style.color = binding.value
  }
}
