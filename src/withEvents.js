const EVENT_TYPES = {
  click: { type: 'click', init: { bubbles: true, cancelable: true, button: 0 } },
  submit: { type: 'submit', init: { bubbles: true, cancelable: true } },
  change: { type: 'change', init: { bubbles: true } },
  mouseEnter: { type: 'mouseenter', init: { bubbles: true, cancelable: true } },
  mouseLeave: { type: 'mouseleave', init: { bubbles: true, cancelable: true } },
  focus: { type: 'focus', init: { bubbles: true } },
  blur: { type: 'blur' },
  wheel: { type: 'wheel', init: { bubbles: true, cancelable: true } },
  scroll: { type: 'scroll' },
}

function withEvents(node) {
  return Object.keys(EVENT_TYPES).reduce(getEventNormalizer(node), {})
}

const getEventNormalizer = node => (dispatchableEvents, eventName) => {
  const event = EVENT_TYPES[eventName]

  return {
    ...dispatchableEvents,
    [eventName]: init => {
      const eventInit = { ...event.init, ...init }
      const { target: { value } = {} } = eventInit

      if (!!value) {
        setNativeValue(node, value)
      }

      return dispatchEvent(node, event.type, eventInit)
    },
  }
}

function dispatchEvent(node, type, init = {}) {
  const WindowEvent = document.defaultView.Event
  const event = new WindowEvent(type, init)
  node.dispatchEvent(event)
}

function setNativeValue(node, value) {
  const prototype = Object.getPrototypeOf(node)
  const { set: prototypeValueSetter } = Object.getOwnPropertyDescriptor(prototype, 'value') || {}
  const { set: valueSetter } = Object.getOwnPropertyDescriptor(node, 'value') || {}

  if (!prototypeValueSetter && !valueSetter) {
    throw new Error('Element cannot have value property')
  }

  if (prototypeValueSetter) {
    return prototypeValueSetter.call(node, value)
  }

  valueSetter.call(node, value)
}

export { withEvents }