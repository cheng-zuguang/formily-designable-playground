import React from 'react'
import { observer } from '@formily/reactive-react'
import { DroppableWidget } from '@designable/react'
import './styles.less'

export const Container: React.FC = observer((props) => {
  // @ts-ignore
  return <DroppableWidget>{props.children}</DroppableWidget>
})

export const withContainer = (Target: React.JSXElementConstructor<any>) => {
  return (props: any) => {
    return (
      // @ts-ignore
      <DroppableWidget>
        <Target {...props} />
      </DroppableWidget>
    )
  }
}
