const unit = (val: string | number) => {
  if (typeof val === 'string') {
    return val
  } else {
    return val + 'px'
  }
}

export default {
  // Width
  w: {
    mounted(el: HTMLElement, binding: any) {
      if (binding.value) {
        el.style.width = unit(binding.value)
      }
    },
    updated(el: HTMLElement, binding: any) {
      if (binding.value) {
        el.style.width = unit(binding.value)
      }
    },
    unmounted(el: HTMLElement) {
      el.style.width = ''
    }
  },
  // Height
  h: {
    mounted(el: HTMLElement, binding: any) {
      if (binding.value) {
        el.style.height = unit(binding.value)
      }
    },
    updated(el: HTMLElement, binding: any) {
      if (binding.value) {
        el.style.height = unit(binding.value)
      }
    },
    unmounted(el: HTMLElement) {
      el.style.height = ''
    }
  },
  // Font size
  size: {
    mounted(el: HTMLElement, binding: any) {
      if (binding.value) {
        el.style.fontSize = unit(binding.value)
      }
    },
    updated(el: HTMLElement, binding: any) {
      if (binding.value) {
        el.style.fontSize = unit(binding.value)
      }
    },
    unmounted(el: HTMLElement) {
      el.style.fontSize = ''
    }
  },
  // Padding
  padding: {
    mounted(el: HTMLElement, binding: any) {
      if (binding.value) {
        el.style.padding = unit(binding.value)
      }
    },
    updated(el: HTMLElement, binding: any) {
      if (binding.value) {
        el.style.padding = unit(binding.value)
      }
    },
    unmounted(el: HTMLElement) {
      el.style.padding = ''
    }
  },
  // Color
  color: {
    mounted(el: HTMLElement, binding: any) {
      if (binding.value) {
        el.style.color = binding.value
      }
    },
    updated(el: HTMLElement, binding: any) {
      if (binding.value) {
        el.style.color = binding.value
      }
    },
    unmounted(el: HTMLElement) {
      el.style.color = ''
    }
  },
  // Background Color
  bgColor: {
    mounted(el: HTMLElement, binding: any) {
      if (binding.value) {
        el.style.backgroundColor = binding.value
      }
    },
    updated(el: HTMLElement, binding: any) {
      if (binding.value) {
        el.style.backgroundColor = binding.value
      }
    },
    unmounted(el: HTMLElement) {
      el.style.backgroundColor = ''
    }
  }
}
