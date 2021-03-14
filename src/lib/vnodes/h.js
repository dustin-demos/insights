
import { renderNode, renderTextNode } from '../static/render'

const EMPTY_ARR = []
const EMPTY_OBJ = {}

const virtualNode = (tag, props, children) => ({
  tag,
  props,
  key: props.key,
  children: children == null ? EMPTY_ARR : children
})

const virtualTextNode = value => ({
  tag: value,
  props: EMPTY_OBJ,
  children: EMPTY_ARR,
  type: 3
})

const node = STATIC ? renderNode : virtualNode
const text = STATIC ? renderTextNode : virtualTextNode

const h = type => (props, children) => {
  const staticProps = STATIC && typeof props === 'string'

  return Array.isArray(props) || props == null || staticProps
    ? node(type, EMPTY_OBJ, props)
    : node(type, props, children)
}

export { h, text }
