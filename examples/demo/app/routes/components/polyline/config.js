import {Md} from 'app/components';

export const config = {
    pipeInstance: {
        type: 'string|function',
        description: <cx><Md>
            If set, this method will be invoked when the instance of a React `Polyline` component is created.
            Typically, it is in this method you will save the instance of the polyline, so that you can
            call its methods later. The method has signature `pipeInstance(instance)`.
        </Md></cx>
    },
    draggable: 'bool',
    editable: 'bool',
    options: 'object',
    path: 'any',
    visible: 'bool'
};

export const events = {
  onClick: `click`,

  onDblClick: `dblclick`,

  onDrag: `drag`,

  onDragEnd: `dragend`,

  onDragStart: `dragstart`,

  onMouseDown: `mousedown`,

  onMouseMove: `mousemove`,

  onMouseOut: `mouseout`,

  onMouseOver: `mouseover`,

  onMouseUp: `mouseup`,

  onRightClick: `rightclick`
}